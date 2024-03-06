import { serial, text, timestamp, pgTable, varchar, integer, primaryKey } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("firstName"),
  lastName: text("lastName"),
  email: text("email").unique(),
  password: text("password"),
  roleId: integer("roleId").references(() => roles.id).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const roles = pgTable("roles", {
  id: serial("id").primaryKey().unique(),
  roleName: varchar("roleName", { length: 256 }).unique().notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey().unique(),
  permissionName: varchar("permissionName", { length: 256 }).unique().notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const roleToPermissions = pgTable("roleToPermissions", {
    roleId: integer("roleId"),
    permissionId: integer("permissionId"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  }, (table) => {
    return {
      pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
      pkWithCustomName: primaryKey({ name: 'roleToPermissionId', columns: [table.roleId, table.permissionId] }),
    };
});