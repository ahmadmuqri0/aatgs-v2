import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { DATABASE_URL } from '$app/env/private';
import { relations } from './relations';

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = new Database(DATABASE_URL);

export const db = drizzle({ client, relations });
