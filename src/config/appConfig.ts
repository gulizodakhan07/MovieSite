export const appConfig = () => ({
  port: parseInt(process.env.APP_PORT) || 4070,
  host: process.env.APP_HOST,
});
