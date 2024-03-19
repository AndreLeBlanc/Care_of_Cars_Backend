//import { drizzle } from 'drizzle-orm/postgres-js'
//import { migrate } from 'drizzle-orm/postgres-js/migrator'
//import postgres from 'postgres'
import { Pool } from 'pg'
import * as schema from '../schema/schema'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { drizzle } from 'drizzle-orm/node-postgres'
import { newConnectionString } from './connection-string'
//const connectionString = `postgres://${process.env.DB_USERNAME}:${process.env.DB_USERNAME}@localhost:5432/${process.env.DB_NAME}`
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
