import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as path from "node:path";
import * as fs from "node:fs";

console.log(path.resolve('./config/'))
if (!fs.existsSync(path.resolve('./config/'))) {
    fs.mkdirSync(path.resolve('./config/'), { recursive: true });
}

const sqlite =
    new Database(path.resolve('./config/dev.sqlite'))

const db = drizzle(sqlite);

export default db;
