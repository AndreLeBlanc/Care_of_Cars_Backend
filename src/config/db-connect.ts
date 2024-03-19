import pkg from 'pg'
const { Pool } = pkg
import * as schema from '../schema/schema.js'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { drizzle } from 'drizzle-orm/node-postgres'
import { newConnectionString } from './connection-string.js'
let connectionString: any = newConnectionString()

const pool = new Pool({
  connectionString: connectionString,
})

export async function initDrizzle() {
  //const sql = postgres(connectionString, { max: 1 })
  const db = drizzle(pool)

  await migrate(db, { migrationsFolder: 'drizzle' })

  // await sql.end()
}

export const db = drizzle(pool, { schema })
