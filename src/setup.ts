import dotenv from 'dotenv';

dotenv.config();

global.__DEV__ = process.env.NODE_ENV === 'development';
global.__STAGING__ = process.env.NODE_ENV === 'staging';
global.__PROD__ = process.env.NODE_ENV === 'production';
