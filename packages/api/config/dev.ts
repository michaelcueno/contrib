import { Schema } from './schema';

export const Config: Schema = {
  app: {
    port: Number(process.env.PORT ?? 3000),
    url: new URL('http://localhost:3001'),
    defaultCurrency: 'USD',
    contactEmail: '@contrib.org',
    defaultAvatar: '/content/img/users/person-circle.svg',
  },
  environment: {
    name: 'dev',
    isDev: true,
    serveClient: true,
  },
  newRelic: {
    appName: '',
    licenseKey: '',
    enabled: false,
  },
  mongodb: {
    uri: 'mongodb://localhost:27017',
  },
  auth: {
    apiUrl: 'todo',
    google: {
      clientId: 'todo',
      clientSecret: 'todo',
    },
    facebook: {
      clientId: 'todo',
      clientSecret: 'todo',
    },
    twitter: {
      consumerKey: 'todo',
      consumerSecret: 'todo',
    },
    cookies: {
      cookiesSecret: 'secret-sauce',
      cookiesLiveTime: 1440, // 24 hours in minutes
    },
  },
  twilio: {
    accountSid: 'todo',
    authToken: 'todo',
    senderNumber: 'todo',
    verificationService: {
      sid: 'todo',
    },
  },
  googleCloud: {
    bucketName: 'todo',
    keyDump: '{"status": "todo"}',
    schedulerSecretKey: 'todo',
    task: {
      googleProjectId: 'todo',
      location: 'todo',
      queue: 'todo',
      googleTaskApiToken: 'todo',
      notificationTaskTargetURL: 'todo',
    },
    auctionEndsTime: {
      firstNotification: 61, // 1 min takes to generate it and send from the task
      lastNotification: 6, // 1 min takes to generate it and send from the task
      notificationForAuctionOrganizer: 1441, // 24hours + 1 min takes to generate it and send from the task
    },
  },
  cloudflare: {
    token: 'todo',
    user: 'todo',
    maxSizeGB: '1',
  },
  stripe: {
    stripeFee: {
      fixedFee: 0.3,
      percentFee: 2.9 / 100,
    }, // constants for calculation stripe fee and including it to charge, relevant information on stripe fee constants can be found here: https://stripe.com/pricing#pricing-details
    secretKey: 'secret-sauce',
    webhookSecretKey: 'todo',
    contribSharePercentage: '0.05',
  },
  facebook: {
    appId: 'todo',
  },
  terms: {
    version: '1.0',
  },
  bid: {
    minBidValue: 10,
    maxPriceValue: 999999,
  },
  delivery: {
    UPSSimpleRateType: 'M', // Delivery type, Valid Values: XS = 1-100 in3 S = 101-250 in3 M = 251-650 in3 L = 651-1,050 in3 XL = 1,051-1,728 in3
    UPSContribDeliveryData: 'todo',
    UPSRequestHeader: 'todo',
    UPSTestEnviroment: true,
    UPSSMSWithDeliveryLink: false,
  },
};
