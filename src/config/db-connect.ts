import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from '../schema/schema';

const connectionString = "postgres://postgres:postgres@localhost:5432/care-of-cars-fastify";


export async function initDrizzle() {

    const sql = postgres(connectionString, { max: 1 })
    const db = drizzle(sql);

    await migrate(db, { migrationsFolder: "drizzle" });

    await sql.end();
}

const sql = postgres(connectionString, { max: 1 })
export const db = drizzle(sql, {schema});