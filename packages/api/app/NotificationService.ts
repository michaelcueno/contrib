import fs from 'fs-extra';
import Handlebars from 'handlebars';
import path from 'path';
import { Airhorn, ProviderType } from 'airhorn';

import { AppLogger } from '../logger';
import { AppConfig } from '../config';
import { CloudTaskService } from './CloudTaskService';

export enum MessageTemplate {
  AUCTION_DELIVERY_DETAILS_FOR_WINNER = 'auction-delivery-details-for-winner',
  AUCTION_DELIVERY_DETAILS_FOR_ORGANIZER = 'auction-delivery-details-for-organizer',
  AUCTION_BID_OVERLAP = 'auction-bid-overlap',
  AUCTION_WON_MESSAGE = 'auction-won',
  AUCTION_WON_MESSAGE_WITH_DELIVERY_LINK = 'auction-won-with-delivery-link',
  AUCTION_BOUGHT_MESSAGE = 'auction-bought',
  AUCTION_BOUGHT_MESSAGE_WITH_DELIVERY_LINK = 'auction-bought-with-delivery-link',
  AUCTION_ENDS_MESSAGE_FOR_USERS = 'auction-ends-for-users',
  AUCTION_ENDS_MESSAGE_FOR_AUCTIONORGANIZER = 'auction-ends-for-auction-organizer',
  AUCTION_IS_CREATED_MESSAGE = 'new-auction-created',
  AUCTION_IS_CREATED_MESSAGE_FOR_CHARITY_FOLLOWERS = 'new-auction-created-for-charity-followers',
  AUCTION_IS_CREATED_MESSAGE_FOR_INFLUENCER_FOLLOWERS = 'new-auction-created-for-influencer-followers',
  PHONE_NUMBER_CHANGED = 'phone-number-changed',
  INVITED = 'invited',
}

export interface NotificationService {
  sendMessageNow(phoneNumber: string, template: string, context: object): Promise<void>;
  sendMessageLater(
    phoneNumber: string,
    template: MessageTemplate,
    context?: { [key: string]: any },
  ): Promise<void>;
}

export class NotificationsImpl implements NotificationService {
  constructor(private readonly cloudTaskService: CloudTaskService) {
    this.airhornClient = new Airhorn({
      TEMPLATE_PATH: `${__dirname}/../templates`,
      TWILIO_SMS_ACCOUNT_SID: AppConfig.twilio.accountSid,
      TWILIO_SMS_AUTH_TOKEN: AppConfig.twilio.authToken,
    });
  }

  private airhornClient: Airhorn;

  async sendMessageNow(phoneNumber: string, template: string, context: object): Promise<void> {
    try {
      const result = await this.airhornClient.send(
        phoneNumber,
        AppConfig.twilio.senderNumber,
        template,
        ProviderType.SMS,
        context,
      );

      let message: string;

      try {
        message = await this.renderMessage(template, context);
        AppLogger.debug(`sent notification to ${phoneNumber}:\n${message}`);
      } catch (error) {}

      if (!result) {
        AppLogger.error(`Cannot send the notification to ${phoneNumber}: ${message}`);
      }
    } catch (error) {
      AppLogger.error(`Cannot send the notification to ${phoneNumber}: ${error.message}`);
    }
  }

  async sendMessageLater(
    phoneNumber: string,
    template: MessageTemplate,
    context?: { [key: string]: any },
  ): Promise<void> {
    if (AppConfig.environment.isDev) return this.sendMessageNow(phoneNumber, template, context);

    await this.cloudTaskService.createTask(this.cloudTaskService.target('notificationTaskTargetURL'), {
      phoneNumber,
      template,
      context,
    });
  }

  private async renderMessage(template: string, context: { [key: string]: any }): Promise<string> {
    const file = await fs.readFile(path.resolve(__dirname, `../templates/${template}/sms.hbs`), { encoding: 'utf-8' });
    return Handlebars.compile(file)(context);
  }
}

export class DevNotificationService implements NotificationService {
  sendMessageNow(phoneNumber: string, template: string, _context: object): Promise<void> {
    console.log(`dev - would have sent ${template} to ${phoneNumber}`);
    return undefined;
  }
  sendMessageLater(phoneNumber: string, template: string, context?: object): Promise<void> {
    return this.sendMessageNow(phoneNumber, template, context);
  }
}

