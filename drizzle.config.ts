import type { Config } from 'drizzle-kit';

export default {
    schema: './src/data/db/schema.ts',
    out: './config/db/migrations',
    driver: 'better-sqlite',
    dbCredentials: {
        url: './config/dev.sqlite',
    },
} satisfies Config;
