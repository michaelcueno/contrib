export interface Schema {
  app: {
    port: number,
    url: URL,
    defaultCurrency: string,
    contactEmail: string,
    defaultAvatar: string,
  },
  environment: {
    name: 'dev' | 'demo' | 'prod',
    isDev: boolean;
    serveClient: boolean,
  },
  newRelic: {
    appName: string,
    licenseKey: string,
    enabled: boolean,
  },
  mongodb: {
    uri: string,
  },
  auth: {
    apiUrl: string,
    google: {
      clientId: string,
      clientSecret: string,
    },
    facebook: {
      clientId: string,
      clientSecret: string,
    },
    twitter: {
      consumerKey: string,
      consumerSecret: string,
    },
    cookies: {
      cookiesSecret: string,
      cookiesLiveTime: number,
    },
  },
  twilio: {
    accountSid: string,
    authToken: string,
    senderNumber: string,
    verificationService: {
      sid: string,
    },
  },
  googleCloud: {
    bucketName: string,
    keyDump: string,
    schedulerSecretKey: string,
    task: {
      googleProjectId: string,
      location: string,
      queue: string,
      googleTaskApiToken: string,
      notificationTaskTargetURL: string,
    },
    auctionEndsTime: {
      firstNotification: number,
      lastNotification: number,
      notificationForAuctionOrganizer: number,
    },
  },
  cloudflare: {
    token: string,
    user: string,
    maxSizeGB: string,
  },
  stripe: {
    stripeFee: {
      // constants for calculation stripe fee and including it to charge, relevant information 
      // on stripe fee constants can be found here: https://stripe.com/pricing#pricing-details
      fixedFee: number,
      percentFee: number,
    }, 
    secretKey: string,
    webhookSecretKey: string,
    contribSharePercentage: string,
  },
  facebook: {
    appId: string,
  },
  terms: {
    version: string,
  },
  bid: {
    minBidValue: number,
    maxPriceValue: number,
  },
  delivery: {
    UPSSimpleRateType: string,
    UPSContribDeliveryData: any,
    UPSRequestHeader: any,
    UPSTestEnviroment: boolean,
    UPSSMSWithDeliveryLink: boolean,
  },
};

