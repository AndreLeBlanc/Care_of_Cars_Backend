import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import * as postgres from 'postgres'
import * as schema from '../schema/schema'

const connectionString = `postgres://${process.env.DB_USERNAME}:${process.env.DB_USERNAME}@localhost:5432/${process.env.DB_NAME}`

export async function initDrizzle() {
  const sql = postgres(connectionString, { max: 1 })
  const db = drizzle(sql)

  await migrate(db, { migrationsFolder: 'drizzle' })

  await sql.end()
}

const sql = postgres(connectionString, { max: 1 })
export const db = drizzle(sql, { schema })

