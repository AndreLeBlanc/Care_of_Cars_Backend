import pkg from 'pg'
const { Pool } = pkg
import * as schema from '../schema/schema.js'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { drizzle } from 'drizzle-orm/node-postgres'
import { ConnectionString, newConnectionString } from './connection-string.js'
const connectionString: ConnectionString = newConnectionString()

const pool = new Pool({
  connectionString: connectionString,
})

export async function initDrizzle() {
  //const sql = postgres(connectionString, { max: 1 })
  const db = drizzle(pool)
  await migrate(db, { migrationsFolder: 'drizzle' }).then(() => console.log('Migrations complete'))

  // await sql.end()
}

export const db = drizzle(pool, { schema })
