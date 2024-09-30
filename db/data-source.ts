import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export const AppDataSource = new DataSource({
  url: process.env.DATABASE_URI,
  type: 'mysql',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: ['migration/**/*.{js,ts}'],
  subscribers: ['subscriber/**/*.ts'], // Path to subscriber files
  logging: true,
});
