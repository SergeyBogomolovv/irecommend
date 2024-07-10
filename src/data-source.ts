import { DataSource, DataSourceOptions } from 'typeorm';
import { cwd } from 'process';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [cwd() + 'src/entities/*.entity{.ts,.js}'],
  migrations: [cwd() + 'src/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: false,
};

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
