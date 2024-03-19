import type { Config } from 'drizzle-kit'
import { newConnectionString } from './connection-string'

let connectionString: any = newConnectionString()
export default {
  schema: './src/schema/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: connectionString,
  },
} satisfies Config
