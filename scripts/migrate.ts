import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { sql } from '../lib/db';

const migration = await readFile(new URL('../drizzle/0000_initial_schema.sql', import.meta.url), 'utf8');

// The `sql` object from neon-http is a function that executes queries directly
for (const statement of migration.split(';').map((value) => value.trim()).filter(Boolean)) {
	await sql(statement);
}
console.log('Database migrations applied.');