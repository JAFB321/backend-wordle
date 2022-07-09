import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const JWT_SECRET = process.env.JWT_SECRET || '12345';
export const PGHOST = process.env.PGHOST || 'localhost';
export const PGPORT = Number.parseInt(process.env.PGPORT || '') || 5432;
export const PGUSER = process.env.PGUSER || 'postgres';
export const PGDATABASE = process.env.PGDATABASE || 'wordle';
export const PGPASSWORD = process.env.PGPASSWORD || '12345';