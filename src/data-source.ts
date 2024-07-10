import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [join(__dirname, '/entities/**/*.{ts,js}')],
  migrations: [join(__dirname, '/migrations/**/*.{ts,js}')],
  synchronize: false,
  logging: false,
};

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
