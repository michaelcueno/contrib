import * as twilio from 'twilio';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/environment-variables';
import { AppLogger } from 'src/logging/app-logger.service';
import { BaseError } from 'src/errors/base-error';

@Injectable()
export class PhoneVerificationService {
  private twilio: twilio.Twilio;

  constructor(private logger: AppLogger, private configService: ConfigService<EnvironmentVariables>) {
    this.logger.setContext('PhoneVerificationService');
    this.twilio = twilio(
      configService.get<string>('TWILIO_ACCOUNT_SID'),
      configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
  }

  async createVerification(phone: string): Promise<void> {
    this.logger.log(`generating sms verification for ${phone}`);
    const verificationRequest = await this.twilio.verify
      .services(this.configService.get<string>('VERIFICATION_SID'))
      .verifications.create({ to: phone, channel: 'sms' });
    this.logger.debug(JSON.stringify(verificationRequest));
  }

  async confirmVerification(phone: string, otp: string): Promise<void> {
    this.logger.log(`confirming sms verification for ${phone}`);
    const verificationResult = await this.twilio.verify
      .services(this.configService.get<string>('VERIFICATION_SID'))
      .verificationChecks.create({ to: phone, code: otp });
    this.logger.debug(JSON.stringify(verificationResult));

    if (verificationResult.status !== 'approved') {
      throw new BaseError(`wrong confirmation code for: ${phone}`, 'phone_confirmation_exception');
    }
  }
}