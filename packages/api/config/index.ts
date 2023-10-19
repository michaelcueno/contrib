import { Config as DevConfig } from './dev';
import { Config as DemoConfig } from './demo';

const env = process.env['NODE_ENV'];

// TODO - should make a demo and prod config as well.
export const AppConfig = env === 'dev' 
  ? DevConfig 
  : env === 'demo' 
    ? DemoConfig 
    : DevConfig;
