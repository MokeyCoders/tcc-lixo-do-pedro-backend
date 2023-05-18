const {
  PORT,
  NODE_ENV,

  WEBSITE_URL,
} = process.env;

const appConfig = {
  port: PORT,
  environment: NODE_ENV,

  pagination: {
    limit: 100,
  },

  website: {
    baseUrl: WEBSITE_URL!,
  },
};

export default appConfig;
