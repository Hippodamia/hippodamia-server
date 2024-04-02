import {drizzle} from 'drizzle-orm/bun-sqlite';
import {Database} from 'bun:sqlite';
import * as path from "node:path";


const sqlite =
    new Database(path.resolve('./config/dev.sqlite'))
const db = drizzle(sqlite);

export default db;
