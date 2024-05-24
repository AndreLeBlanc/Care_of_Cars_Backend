import pkg from 'pg'
const { Pool } = pkg
import * as schema from '../schema/schema'
import { migrate } from 'drizzle-orm/node-postgres/migrator'

import { drizzle } from 'drizzle-orm/node-postgres'

import { ConnectionString, newConnectionString } from './connection-string'
const connectionString: ConnectionString = newConnectionString()

const pool = new Pool({
  connectionString: connectionString,
})

export async function initDrizzle() {
  const db = drizzle(pool)
  await migrate(db, { migrationsFolder: './drizzle' }).then(() =>
    console.log('Migrations complete'),
  )
}

export const db = drizzle(pool, { schema })
