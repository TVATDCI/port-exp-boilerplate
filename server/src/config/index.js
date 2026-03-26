import dotenv from 'dotenv';
dotenv.config();

export const env = {
  mongoUri: process.env.MONGO_URI,
  port: process.env.PORT || 5000,
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
};
