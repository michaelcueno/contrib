import { Config as DevConfig } from './dev';

const env = process.env['NODE_ENV'];

// TODO - should make a demo and prod config as well.
export const AppConfig = env === 'dev' ? DevConfig : DevConfig;
