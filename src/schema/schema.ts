import { serial, text, timestamp, pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id"),
  firstName: text("firstName"),
  lastName: text("lastName"),
  email: text("email").unique(),
  password: text("password"),
  // role: text("role").$type<"admin" | "customer">(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});