import { Config as DevConfig } from './dev';
import { Schema } from './schema';

export const Config: Schema = {
  ...DevConfig,
  app: {
    ...DevConfig.app,
    port: 80,
    // Yea.. i know
    url: new URL('http://mikematch.com'),
  },
};
