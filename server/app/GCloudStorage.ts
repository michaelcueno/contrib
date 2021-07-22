import Stream from 'stream';
import { Storage } from '@google-cloud/storage';
import { AppConfig } from '../config';
import { AppError, ErrorCode } from '../errors';
import { AppLogger } from '../logger';
import { CloudflareStreaming } from './CloudflareStreaming';
import { IAuctionAssetModel } from '../app/Auction/mongodb/AuctionAssetModel';

export type IFile = {
  createReadStream: () => Stream;
  filename: string;
  mimetype: string;
};
enum FileType {
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  UNKNOWN = 'UNKNOWN',
}

export class GCloudStorage {
  private readonly storage = new Storage({ credentials: JSON.parse(AppConfig.googleCloud.keyDump) });
  private static readonly cloudPath = 'https://storage.googleapis.com';
  private static readonly imageSupportedFormats = /png|jpeg|jpg|webp/i;
  private static readonly videoSupportedFormats = /mp4|webm|opgg|mov/i;

  constructor(private readonly cloudflareStreaming: CloudflareStreaming) {}

  private static getBucketFullPath(bucketName: string = AppConfig.googleCloud.bucketName): string {
    return `${GCloudStorage.cloudPath}/${bucketName}`;
  }

  private static getFileNameFromUrl(url: string) {
    const fullPathToBucket = GCloudStorage.getBucketFullPath();
    if (url.includes(fullPathToBucket)) {
      const [fileName] = url.split(`${fullPathToBucket}/`).filter((item: string) => Boolean(item));
      return fileName;
    }
    return url;
  }

  private static getFileType(extension: string) {
    if (this.imageSupportedFormats.test(extension)) {
      return FileType.IMAGE;
    }
    if (this.videoSupportedFormats.test(extension)) {
      return FileType.VIDEO;
    }
    return FileType.UNKNOWN;
  }

  //TODO: delete after attachments update.
  async updateAttachment(asset: IAuctionAssetModel, bucketName: string = AppConfig.googleCloud.bucketName) {
    try {
      const fileName = GCloudStorage.getFileNameFromUrl(asset.url);
      const fileNameArray = fileName.split('/');
      const extension = fileName.split('.')[1];
      let currentFileName = null;

      if (fileNameArray.length !== 5) {
        const folderPath = fileNameArray[fileNameArray.length - 1].split('.')[0];
        fileNameArray.splice(fileNameArray.length - 1, 0, folderPath);
        currentFileName = fileNameArray.join('/');

        asset.url = `https://storage.googleapis.com/content-dev.contrib.org/${currentFileName}`;
        await asset.save();

        await this.storage.bucket(bucketName).file(fileName).move(currentFileName);
      }

      if (GCloudStorage.imageSupportedFormats.test(extension)) {
        await this.storage
          .bucket(bucketName)
          .file(currentFileName ?? fileName)
          .copy(`pending/${currentFileName ?? fileName}`);
      }
    } catch (error) {
      AppLogger.warn(`Unable to update file ${asset.url}: ${error.message}`);
    }
  }

  async streamToBuffer(stream: Stream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const data = [];

      stream.on('data', (chunk) => {
        data.push(chunk);
      });

      stream.on('end', () => {
        resolve(Buffer.concat(data));
      });

      stream.on('error', (err) => {
        reject(err);
      });
    });
  }

  async removeFile(fileUrl: string, bucketName: string = AppConfig.googleCloud.bucketName): Promise<void> {
    const fileNameArray = GCloudStorage.getFileNameFromUrl(fileUrl).split('/');
    fileNameArray.pop();
    const currentFileName = fileNameArray.join('/');

    try {
      await this.storage.bucket(bucketName).deleteFiles({ prefix: `${currentFileName}/` });
    } catch (error) {
      throw new AppError(`Unable to remove file, threw error ${error.message}`, ErrorCode.INTERNAL_ERROR);
    }
  }

  async uploadFile(
    filePromise: Promise<IFile>,
    {
      bucketName = AppConfig.googleCloud.bucketName,
      fileName,
      shouldResizeImage = true,
    }: { bucketName?: string; fileName: string; shouldResizeImage?: boolean },
  ): Promise<{ fileType: FileType; url: string; uid: string | undefined }> {
    const file = await filePromise;

    const extension = file.filename.split('.').pop();
    const fileType = GCloudStorage.getFileType(extension);

    if (fileType === FileType.UNKNOWN) {
      throw new AppError('Unsupported file format', ErrorCode.BAD_REQUEST);
    }
    const formattedFileName = `${fileName}.${extension}`;
    try {
      const buffer = await this.streamToBuffer(file.createReadStream());
      await this.storage.bucket(bucketName).file(formattedFileName).save(buffer);

      if (fileType === FileType.IMAGE && shouldResizeImage) {
        await this.storage.bucket(bucketName).file(`pending/${formattedFileName}`).save(buffer);
      }

      let uid = undefined;

      if (fileType === FileType.VIDEO) {
        uid = await this.cloudflareStreaming.uploadToCloudflare(
          `${GCloudStorage.getBucketFullPath(bucketName)}/${formattedFileName}`,
          { name: fileName },
        );
      }
      return { fileType, url: `${GCloudStorage.getBucketFullPath(bucketName)}/${formattedFileName}`, uid: uid };
    } catch (error) {
      if (error.name === 'PayloadTooLargeError') {
        throw new AppError(
          `File is too big, max size is ${AppConfig.cloudflare.maxSizeGB} GB`,
          ErrorCode.INTERNAL_ERROR,
        );
      }
      throw new AppError(`We cannot upload one of your selected file. Please, try later`, ErrorCode.INTERNAL_ERROR);
    }
  }
}
