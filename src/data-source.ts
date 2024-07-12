import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { Logger } from '@nestjs/common';

dotenv.config();
const logger = new Logger('DataSource');

export const dataSourceOptions: DataSourceOptions = {
  url: process.env.POSTGRES_URL,
  type: 'postgres',
  entities: [join(__dirname, '/entities/**/*.entity.{ts,js}')],
  migrations: [join(__dirname, '/migrations/**/*.{ts,js}')],
  synchronize: false,
  logging: false,
};

const AppDataSource = new DataSource(dataSourceOptions);
AppDataSource.initialize()
  .then(() => {
    logger.log('Data Source has been initialized');
  })
  .catch((err) => {
    logger.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
