import type { Config } from 'drizzle-kit'
export default {
  schema: 'src/schema/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: `postgres://${process.env.DB_USERNAME}:${process.env.DB_USERNAME}@postgres:5432/${process.env.DB_NAME}`,
  },
} satisfies Config
