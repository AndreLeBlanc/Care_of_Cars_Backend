import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
const { default: postgres } = await import('postgres')
import * as schema from '../schema/schema.js'
import * as dotenv from 'dotenv'
dotenv.config()

const connectionString = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.POSTGRES_HOST}:5432/${process.env.DB_NAME}`

export async function initDrizzle() {
  const sql = postgres(connectionString, { max: 1 })
  const db = drizzle(sql)

  await migrate(db, { migrationsFolder: 'drizzle' })

  await sql.end()
}

const sql = postgres(connectionString, { max: 1 })
export const db = drizzle(sql, { schema: { schema } })
