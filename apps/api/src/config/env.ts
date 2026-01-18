export const isProd = process.env.NODE_ENV === "production";

export const CLIENT_URL = isProd
  ? process.env.CLIENT_URL_PROD
  : process.env.CLIENT_URL_DEV;