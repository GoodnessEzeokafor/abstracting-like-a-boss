import { DataSource } from 'typeorm';
import { DATABASE_CONFIG } from './config';

export default new DataSource(DATABASE_CONFIG);
