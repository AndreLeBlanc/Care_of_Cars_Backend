import type { Config } from 'drizzle-kit'
import { ConnectionString, newConnectionString } from './connection-string'

const maybeConnectionString: ConnectionString = newConnectionString()
let conString: string = ''

if (typeof maybeConnectionString === 'string') {
  conString = maybeConnectionString
}

export default {
  schema: './src/schema/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: conString,
  },
} satisfies Config
