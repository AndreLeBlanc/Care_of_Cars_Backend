import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "../schema/schema";

const connectionString = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@postgres:5432/${process.env.DB_NAME}`;

export async function initDrizzle() {
  try {
    const sql = postgres(connectionString, { max: 1 });
    const db = drizzle(sql);

    await migrate(db, { migrationsFolder: "drizzle" });

    await sql.end();
  } catch (error) {
    console.log(error);
  }
}
const sql = postgres(connectionString, { max: 1 });
export const db = drizzle(sql, { schema });
