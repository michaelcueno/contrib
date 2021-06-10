import { Connection, Types } from 'mongoose';
import dayjs from 'dayjs';
import Dinero, { Currency } from 'dinero.js';

import { AuctionModel, IAuctionBid, IAuctionModel } from '../mongodb/AuctionModel';
import { IAuctionAssetModel } from '../mongodb/AuctionAssetModel';
import { AuctionAttachmentsService } from './AuctionAttachmentsService';
import { UserAccountModel } from '../../UserAccount/mongodb/UserAccountModel';
import { UserAccountStatus } from '../../UserAccount/dto/UserAccountStatus';

import { AuctionStatus } from '../dto/AuctionStatus';
import { AuctionStatusResponse } from '../dto/AuctionStatusResponse';
import { Auction } from '../dto/Auction';
import { AuctionAssets } from '../dto/AuctionAssets';
import { AuctionBid } from '../dto/AuctionBid';
import { UserAccount } from '../../UserAccount/dto/UserAccount';

import { AuctionInput } from '../graphql/model/AuctionInput';
import { GCloudStorage, IFile } from '../../GCloudStorage';
import { ICreateAuctionBidInput } from '../graphql/model/CreateAuctionBidInput';

import { CloudflareStreaming } from '../../CloudflareStreaming';
import { InfluencerService } from '../../Influencer';
import { CharityService } from '../../Charity';

import { AppError, ErrorCode } from '../../../errors';
import { AppLogger } from '../../../logger';

import { AuctionRepository } from '../repository/AuctionRepository';
import { IAuctionFilters, IAuctionRepository } from '../repository/IAuctionRepoository';
import { PaymentService } from '../../Payment';
import { AppConfig } from '../../../config';
import { UrlShortenerService } from '../../Core';
import { CloudTaskService } from '../../CloudTaskService';
import { HandlebarsService, MessageTemplate } from '../../Message/service/HandlebarsService';
import { CharityModel } from '../../Charity/mongodb/CharityModel';

export class AuctionService {
  private readonly AuctionModel = AuctionModel(this.connection);
  private readonly UserAccountModel = UserAccountModel(this.connection);
  private readonly CharityModel = CharityModel(this.connection);
  private readonly attachmentsService = new AuctionAttachmentsService(this.connection, this.cloudStorage);
  private readonly auctionRepository: IAuctionRepository = new AuctionRepository(this.connection);

  constructor(
    private readonly connection: Connection,
    private readonly paymentService: PaymentService,
    private readonly cloudStorage: GCloudStorage,
    private readonly urlShortenerService: UrlShortenerService,
    private readonly cloudTaskService: CloudTaskService,
    private readonly handlebarsService: HandlebarsService,
  ) {}

  public async createAuctionDraft(auctionOrganizerId: string, input: AuctionInput): Promise<Auction> {
    let auction = await this.auctionRepository.createAuction(auctionOrganizerId, input);
    auction = await this.auctionRepository.updateAuctionLink(auction._id, await this.makeShortAuctionLink(auction._id));
    return this.makeAuction(auction);
  }

  public async listAuctions(
    params: IAuctionFilters,
  ): Promise<{ items: Auction[]; totalItems: number; size: number; skip: number }> {
    const items = await this.auctionRepository.getAuctions(params);
    const totalItems = await this.auctionRepository.getAuctionsCount(params);

    return {
      totalItems,
      items: items.map((item) => this.makeAuction(item)),
      size: items.length,
      skip: params.skip || 0,
    };
  }

  public async listSports(): Promise<string[]> {
    return this.auctionRepository.getAuctionSports();
  }

  public async getAuctionPriceLimits(): Promise<{ min: Dinero.Dinero; max: Dinero.Dinero }> {
    const { min, max } = await this.auctionRepository.getAuctionPriceLimits();
    return {
      min: Dinero({ amount: min, currency: 'USD' }),
      max: Dinero({ amount: max, currency: 'USD' }),
    };
  }

  public async getAuction(id: string, organizerId?: string): Promise<Auction> {
    const auction = await this.auctionRepository.getAuction(id, organizerId);
    return this.makeAuction(auction);
  }

  public async maybeActivateAuction(id: string, organizerId: string): Promise<Auction> {
    const auction = await this.auctionRepository.activateAuction(id, organizerId);
    return this.makeAuction(auction);
  }

  public async addAuctionAttachment(
    id: string,
    organizerId: string,
    attachment: Promise<IFile>,
  ): Promise<AuctionAssets> {
    const auction = await this.auctionRepository.getAuction(id, organizerId);
    if (![AuctionStatus.DRAFT, AuctionStatus.PENDING].includes(auction?.status)) {
      throw new AppError('Auction does not exist or cannot be edited', ErrorCode.NOT_FOUND);
    }

    try {
      const asset = await this.attachmentsService.uploadFileAttachment(id, organizerId, attachment);
      const { filename } = await attachment;

      await this.AuctionModel.updateOne({ _id: id }, { $addToSet: { assets: asset } });

      return AuctionService.makeAuctionAttachment(asset, filename);
    } catch (error) {
      throw error;
    }
  }

  public async getTotalRaisedAmount(charityId?: string, influencerId?: string): Promise<Object> {
    if (!charityId && !influencerId) {
      throw new Error('Need to pass charityId or influencerId');
    }

    const filters = { status: AuctionStatus.SETTLED };
    if (charityId) {
      filters['charity'] = charityId;
    }

    if (influencerId) {
      filters['influencerId'] = influencerId;
    }

    const auctions = await this.AuctionModel.find(filters);
    return {
      totalRaisedAmount: AuctionService.makeTotalRaisedAmount(auctions),
    };
  }

  public async removeAuctionAttachment(id: string, userId: string, attachmentUrl: string): Promise<AuctionAssets> {
    const auction = await this.auctionRepository.getAuction(id, userId);
    if (!auction) {
      throw new AppError('Auction not found', ErrorCode.NOT_FOUND);
    }
    try {
      const attachment = await this.attachmentsService.AuctionAsset.findOne({ url: attachmentUrl });
      await auction.updateOne({ $pull: { assets: attachment._id } });
      await attachment.remove();
      await this.attachmentsService.removeFileAttachment(attachmentUrl);

      return AuctionService.makeAuctionAttachment(attachment);
    } catch (error) {
      throw new AppError(error.message, ErrorCode.INTERNAL_ERROR);
    }
  }

  public async updateAuction(id: string, userId: string, input: AuctionInput): Promise<Auction> {
    const {
      title,
      startDate,
      endDate,
      charity,
      startPrice,
      itemPrice,
      description,
      fullPageDescription,
      playedIn,
      sport,
      fairMarketValue,
      timeZone,
      ...rest
    } = input;
    const auction = await this.auctionRepository.updateAuction(id, userId, {
      ...(title ? { title: title.trim() } : {}),
      ...(startDate ? { startsAt: startDate } : {}),
      ...(endDate ? { endsAt: endDate } : {}),
      ...(startPrice
        ? {
            startPrice: startPrice.getAmount(),
            currentPrice: startPrice.getAmount(),
            startPriceCurrency: startPrice.getCurrency(),
            currentPriceCurrency: startPrice.getCurrency(),
          }
        : {}),
      ...(itemPrice
        ? {
            itemPrice: itemPrice.getAmount(),
            itemPriceCurrency: itemPrice.getCurrency(),
          }
        : {}),
      ...(fairMarketValue
        ? {
            fairMarketValue: fairMarketValue.getAmount(),
            fairMarketValueCurrency: fairMarketValue.getCurrency(),
          }
        : {}),
      ...(charity ? { charity: Types.ObjectId(charity) } : {}),
      ...(description ? { description: description.trim() } : {}),
      ...(fullPageDescription ? { fullPageDescription: fullPageDescription.trim() } : {}),
      ...(sport ? { sport: sport.trim() } : {}),
      ...(playedIn ? { playedIn: playedIn.trim() } : {}),
      ...(timeZone ? { timeZone: timeZone } : {}),
      ...rest,
    });

    return this.makeAuction(auction);
  }

  public async addAuctionBid(
    id: string,
    { bid, user }: ICreateAuctionBidInput & { user: UserAccount },
  ): Promise<AuctionBid> {
    const session = await this.connection.startSession();
    session.startTransaction();

    const card = await this.paymentService.getAccountPaymentInformation(user);
    if (!card) {
      throw new AppError('Payment method is not provided');
    }

    const auction = await this.AuctionModel.findById(id, null, { session }).exec();

    if (!auction.charity) {
      throw new AppError('There is no charity attached to given auction');
    }

    if (auction.status !== AuctionStatus.ACTIVE) {
      throw new AppError('Auction is not active', ErrorCode.BAD_REQUEST);
    }

    if (dayjs().utc().isAfter(auction.endsAt)) {
      throw new AppError('Auction has already ended', ErrorCode.BAD_REQUEST);
    }

    const currentPrice = Dinero({
      amount: auction.currentPrice,
      currency: auction.currentPriceCurrency as Currency,
    });

    if (bid.lessThanOrEqual(currentPrice)) {
      throw new AppError(
        'Provided bid is lower, than maximum bid that was encountered on the auction',
        ErrorCode.BAD_REQUEST,
      );
    }

    const lastUserId = auction.bids[auction.bids.length - 1]?.user;

    const createdBid = {
      user: user.mongodbId,
      createdAt: dayjs(),
      paymentSource: card.id,
      bid: bid.getAmount(),
      bidCurrency: bid.getCurrency(),
      chargeId: null,
    };

    Object.assign(auction, {
      bids: [...auction.bids, createdBid],
    });

    auction.currentPrice = bid.getAmount();

    await auction.save({ session });

    await session.commitTransaction();
    session.endSession();

    if (lastUserId) {
      try {
        const userAccount = await this.UserAccountModel.findOne({ _id: lastUserId }).exec();
        if (!userAccount) {
          throw new Error(`Can not find account with id ${lastUserId}`);
        }
        const message = await this.handlebarsService.renderTemplate(MessageTemplate.AUCTION_BID_OVERLAP);
        await this.cloudTaskService.createTask(this.generateGoogleTaskTarget(), {
          message: message,
          phoneNumber: userAccount.phoneNumber,
        });
      } catch (error) {
        AppLogger.warning(`Failed to send notification, error: ${error.message}`);
      }
    }
    return AuctionService.makeAuctionBid(createdBid);
  }

  public async scheduleAuctionJobSettle(): Promise<{ message: string }> {
    const auctions = await this.AuctionModel.find({ status: AuctionStatus.ACTIVE });

    for await (const auction of auctions) {
      if (dayjs().utc().isAfter(auction.endsAt)) {
        const currentAuction = await auction
          .populate({ path: 'bids.user', model: this.UserAccountModel })
          .execPopulate();
        try {
          await this.settleAuctionAndCharge(currentAuction);
        } catch (error) {
          AppLogger.warn(`Could not settle auction ${currentAuction.id.toString()} with error ${error.message}`);
        }
      }
    }
    return { message: 'Scheduled' };
  }

  public async scheduleAuctionJobStart(): Promise<{ message: string }> {
    const auctions = await this.AuctionModel.find({ status: AuctionStatus.PENDING });

    for await (const auction of auctions) {
      if (dayjs().utc().isAfter(auction.startsAt) || dayjs().utc().isSame(auction.startsAt)) {
        try {
          await this.activateAuction(auction);
        } catch (error) {
          AppLogger.warn(
            `Could not start auction with id ${auction.id.toString()} with error ${auction.id.toString()}`,
          );
        }
      }
    }
    return { message: 'Scheduled' };
  }

  public async getInfluencersAuctions(id: string): Promise<Auction[]> {
    const auctions = await this.auctionRepository.getInfluencersAuctions(id);
    return auctions.map((auction) => this.makeAuction(auction));
  }

  public async settleAndChargeCurrentAuction(id: string): Promise<void> {
    const auction = await this.AuctionModel.findOne({ _id: id });
    if (auction.status === AuctionStatus.FAILED) {
      auction.status = AuctionStatus.ACTIVE;
      await auction.save();
    }
    return await this.settleAuctionAndCharge(auction);
  }

  public async chargeCurrendBid(input): Promise<string> {
    const { user, bid, charityId, auctionTitle, paymentSource } = input;
    const charityAccount = await this.CharityModel.findOne({ _id: charityId }).exec();
    if (!charityAccount) {
      throw new Error(`Can not find charity account with id ${charityId.toString()}`);
    }
    const userAccount = await this.UserAccountModel.findOne({ _id: user }).exec();
    if (!userAccount) {
      throw new Error(`Can not find userAccount account with id ${userAccount._id.toString()}`);
    }
    const currentUserAccount = {
      id: userAccount.authzId,
      phoneNumber: userAccount.phoneNumber,
      status: UserAccountStatus.COMPLETED,
      mongodbId: userAccount._id.toString(),
      stripeCustomerId: userAccount.stripeCustomerId,
      createdAt: userAccount.createdAt.toISOString(),
    };
    return await this.paymentService.chargeUser(
      currentUserAccount,
      paymentSource,
      bid,
      `Contrib auction: ${auctionTitle}`,
      charityAccount.stripeAccountId,
      charityId,
    );
  }

  public async settleAuctionAndCharge(auction: IAuctionModel): Promise<void> {
    if (!auction) {
      throw new AppError('Auction not found');
    }

    if (!auction.charity) {
      throw new AppError('There is no charity attached to given auction');
    }

    if (auction.status !== AuctionStatus.ACTIVE) {
      throw new AppError('Auction status is not ACTIVE');
    }

    const lastAuctionBid = auction.bids[auction.bids.length - 1];

    if (!lastAuctionBid) {
      auction.status = AuctionStatus.SETTLED;
      await auction.save();
      return;
    }

    try {
      const charityAccount = await this.CharityModel.findOne({ _id: auction.charity }).exec();
      if (!charityAccount) {
        throw new Error(`Can not find charity account with id ${auction.charity.toString()}`);
      }

      lastAuctionBid.chargeId = await this.chargeUser(
        lastAuctionBid,
        auction.title,
        charityAccount.stripeAccountId,
        auction.charity.toString(),
      );

      try {
        await this.sendAuctionNotification(lastAuctionBid.user.phoneNumber, MessageTemplate.AUCTION_WON_MESSAGE);
      } catch (error) {
        AppLogger.warn(`Can not send the notification`, error.message);
      }
      AppLogger.info(
        `Auction with id ${auction.id} has been settled with charge id ${
          lastAuctionBid.chargeId
        } and user id ${lastAuctionBid.user.toString()}`,
      );

      auction.status = AuctionStatus.SETTLED;
      await auction.save();
    } catch (error) {
      AppLogger.error(`Unable to charge user ${lastAuctionBid.user.id.toString()}, with error: ${error.message}`);
      auction.status = AuctionStatus.FAILED;
      await auction.save();
    }
  }

  async chargeUser(
    lastAuctionBid: IAuctionBid,
    title: string,
    stripeAccountId: string,
    charityId: string,
  ): Promise<string> {
    return await this.paymentService.chargeUser(
      lastAuctionBid.user,
      lastAuctionBid.paymentSource,
      this.makeBidDineroValue(lastAuctionBid.bid, lastAuctionBid.bidCurrency),
      `Contrib auction: ${title}`,
      stripeAccountId,
      charityId,
    );
  }

  async sendAuctionNotification(template: MessageTemplate, phoneNumber: string): Promise<void> {
    const message = await this.handlebarsService.renderTemplate(template);
    await this.cloudTaskService.createTask(this.generateGoogleTaskTarget(), {
      message: message,
      phoneNumber: phoneNumber,
    });
  }

  private makeBidDineroValue(amount: number, currency: Dinero.Currency) {
    return Dinero({ amount: amount, currency: currency });
  }

  public async activateAuction(auction: IAuctionModel): Promise<void> {
    if (!auction) {
      throw new AppError('Auction not found');
    }
    auction.status = AuctionStatus.ACTIVE;
    await auction.save();
    return;
  }

  private generateGoogleTaskTarget(): string {
    const appURL = new URL(AppConfig.app.url);

    if (!AppConfig.environment.serveClient) {
      appURL.port = AppConfig.app.port.toString();
    }
    return `${appURL.toString()}${AppConfig.googleCloud.task.notificationTaskTargetURL}`;
  }

  private static makeAuctionBid(model: IAuctionBid): AuctionBid | null {
    if (!model) {
      return null;
    }
    return {
      paymentSource: model.paymentSource,
      user: model.user?._id?.toString(),
      bid: Dinero({ amount: model.bid, currency: model.bidCurrency }),
      createdAt: model.createdAt,
    };
  }

  private static makeAuctionAttachment(model: IAuctionAssetModel, fileName?: string): AuctionAssets | null {
    if (!model) {
      return null;
    }
    const { url, type, uid } = model;

    return {
      id: model._id.toString(),
      type,
      url,
      cloudflareUrl: model.uid ? CloudflareStreaming.getVideoStreamUrl(model.uid) : null,
      thumbnail: model.uid ? CloudflareStreaming.getVideoPreviewUrl(model.uid) : null,
      uid,
      originalFileName: fileName,
    };
  }

  public static makeTotalRaisedAmount(auctions: IAuctionModel[]): Dinero.Dinero {
    if (!auctions) {
      return Dinero({ amount: 0, currency: 'USD' });
    }
    return auctions
      .map((a) =>
        Dinero({ amount: a.currentPrice ?? 0, currency: (a.currentPriceCurrency as Dinero.Currency) ?? 'USD' }),
      )
      .reduce((total, next) => total.add(next), Dinero({ amount: 0, currency: 'USD' }));
  }

  private makeLongAuctionLink(id: string) {
    const url = new URL(AppConfig.app.url);
    url.pathname = `/auctions/${id}`;
    return url.toString();
  }

  private async makeShortAuctionLink(id: string) {
    return this.urlShortenerService.shortenUrl(this.makeLongAuctionLink(id));
  }

  private makeAssets(assets: IAuctionAssetModel[]): AuctionAssets[] {
    return assets
      .map((asset) => AuctionService.makeAuctionAttachment(asset))
      .sort((a: any, b: any) => {
        if (b.type > a.type) return -1;
      });
  }

  public async buyAuction(id: string, user: UserAccount): Promise<AuctionStatusResponse> {
    const auction = await this.AuctionModel.findOne({ _id: id });

    if (!auction) {
      throw new AppError('Auction not found', ErrorCode.BAD_REQUEST);
    }

    if (!auction.charity) {
      throw new AppError('There is no charity attached to given auction');
    }

    if (auction.status !== AuctionStatus.ACTIVE) {
      throw new AppError('Auction is not active', ErrorCode.BAD_REQUEST);
    }
    if (auction.currentPrice > auction.itemPrice) {
      throw new AppError('Auction has larger current price', ErrorCode.BAD_REQUEST);
    }

    const card = await this.paymentService.getAccountPaymentInformation(user);
    if (!card) {
      throw new AppError('Payment method is not provided');
    }

    try {
      const charityAccount = await this.CharityModel.findOne({ _id: auction.charity }).exec();
      if (!charityAccount) {
        throw new Error(`Can not find charity account with id ${auction.charity.toString()}`);
      }
      const chargeId = await this.paymentService.chargeUser(
        user,
        card.id,
        this.makeBidDineroValue(auction.itemPrice, auction.itemPriceCurrency as Dinero.Currency),
        `Contrib auction: ${auction.title}`,
        charityAccount.stripeAccountId,
        auction.charity.toString(),
      );
      const createdBid = {
        user: user.mongodbId,
        createdAt: dayjs(),
        paymentSource: card.id,
        bid: auction.itemPrice,
        bidCurrency: auction.itemPriceCurrency as Dinero.Currency,
        chargeId: chargeId,
      };
      Object.assign(auction, {
        bids: [...auction.bids, createdBid],
      });
    } catch (error) {
      throw new AppError('Unable to charge');
    }

    AppLogger.info(`Auction with id ${auction.id} has been sold`);

    auction.status = AuctionStatus.SOLD;
    auction.currentPrice = auction.itemPrice;
    auction.currentPriceCurrency = auction.itemPriceCurrency;

    try {
      await auction.save();
    } catch (error) {
      throw new AppError('Something went wrong', ErrorCode.BAD_REQUEST);
    }

    return { status: auction.status };
  }

  public makeAuction(model: IAuctionModel): Auction | null {
    if (!model) {
      return null;
    }

    const {
      _id,
      startsAt,
      timeZone,
      endsAt,
      charity,
      assets,
      status,
      bids,
      itemPrice,
      currentPrice,
      startPrice,
      auctionOrganizer,
      startPriceCurrency,
      currentPriceCurrency,
      itemPriceCurrency,
      fairMarketValue,
      fairMarketValueCurrency,
      link: rawLink,
      ...rest
    } = model.toObject();

    if (!auctionOrganizer) {
      AppLogger.error('auction is missing organizer', {
        auctionData: JSON.stringify(model.toObject()),
      });
      return null;
    }

    // temporal: some older auctions won't have a pre-populated link in dev environment
    // one day we'll clear our dev database, and this line can removed then
    const link = rawLink || this.makeLongAuctionLink(_id.toString());

    return {
      id: _id.toString(),
      attachments: this.makeAssets(assets),
      endDate: endsAt,
      startDate: startsAt,
      timeZone: timeZone,
      charity: charity ? CharityService.makeCharity(charity) : null,
      bids: bids?.map((bid) => AuctionService.makeAuctionBid(bid)) || [],
      totalBids: bids?.length ?? 0,
      currentPrice: Dinero({ currency: currentPriceCurrency as Dinero.Currency, amount: currentPrice }),
      startPrice: Dinero({ currency: startPriceCurrency as Dinero.Currency, amount: startPrice }),
      itemPrice: itemPrice ? Dinero({ currency: itemPriceCurrency as Dinero.Currency, amount: itemPrice }) : null,
      fairMarketValue: fairMarketValue
        ? Dinero({ currency: fairMarketValueCurrency as Dinero.Currency, amount: fairMarketValue })
        : null,
      auctionOrganizer: InfluencerService.makeInfluencerProfile(auctionOrganizer),
      link,
      status,
      isActive: status === AuctionStatus.ACTIVE,
      isDraft: status === AuctionStatus.DRAFT,
      isPending: status === AuctionStatus.PENDING,
      isSettled: status === AuctionStatus.SETTLED,
      isFailed: status === AuctionStatus.FAILED,
      isSold: status === AuctionStatus.SOLD,
      ...rest,
    };
  }
}
