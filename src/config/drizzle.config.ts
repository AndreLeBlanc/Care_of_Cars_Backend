import type { Config } from 'drizzle-kit'
import { connectionString } from './connection-string'

export default {
  schema: './src/schema/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: connectionString,
  },
} satisfies Config
