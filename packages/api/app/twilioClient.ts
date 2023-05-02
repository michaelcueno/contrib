import { Twilio } from 'twilio';
import { AppConfig } from '../config';

const twilio = AppConfig.environment.isDev ? undefined : new Twilio(AppConfig.twilio.accountSid, AppConfig.twilio.authToken);

export const twilioMessageService = twilio?.messages;
export const twilioVerifyService = AppConfig.environment.isDev ? undefined : twilio.verify.services(AppConfig.twilio.verificationService.sid);
