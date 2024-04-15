import type { Config } from 'drizzle-kit'
export default {
  schema: './src/schema/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    host: process.env.DB_HOST as string,
    port: process.env.DB_PORT as any,
    user: process.env.DB_USERNAME,
    database: process.env.DB_NAME as string,
    password: process.env.DB_PASSWORD as string,
  },
} satisfies Config
