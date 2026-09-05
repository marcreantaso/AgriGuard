import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { sql } from '../lib/db';

const migration = await readFile(new URL('../drizzle/0000_initial_schema.sql', import.meta.url), 'utf8');
const query = (sql as unknown as { query: (statement: string) => Promise<unknown> }).query.bind(sql);
for (const statement of migration.split(';').map((value) => value.trim()).filter(Boolean)) {
	await query(statement);
}
console.log('Database migrations applied.');