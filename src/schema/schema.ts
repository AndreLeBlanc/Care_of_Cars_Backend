import {
  serial,
  text,
  timestamp,
  pgTable,
  varchar,
  integer,
  primaryKey,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core'
export const users = pgTable('users', {
  id: serial('id').primaryKey().unique(),
  firstName: varchar('firstName').notNull(),
  lastName: varchar('lastName'),
  email: varchar('email').unique(),
  password: text('password').notNull(),
  isSuperAdmin: boolean('isSuperAdmin').default(false),
  roleId: integer('roleId')
    .references(() => roles.id)
    .notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const roles = pgTable('roles', {
  id: serial('id').primaryKey().unique(),
  roleName: varchar('roleName', { length: 256 }).unique().notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const permissions = pgTable('permissions', {
  id: serial('id').primaryKey().unique(),
  permissionName: varchar('permissionName', { length: 256 }).unique().notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const roleToPermissions = pgTable(
  'roleToPermissions',
  {
    roleId: integer('roleId'),
    permissionId: integer('permissionId'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.roleId, table.permissionId],
      }),
      pkWithCustomName: primaryKey({
        name: 'roleToPermissionId',
        columns: [table.roleId, table.permissionId],
      }),
    }
  },
)

export const colorOnDutyEnum = pgEnum('colorOnDuty', [
  'LightBlue',
  'Blue',
  'DarkBlue',
  'LightGreen',
  'Green',
  'DarkGreen',
  'LightYellow',
  'Yellow',
  'DarkYellow',
  'LightPurple',
  'Purple',
  'DarkPurple',
  'LightPink',
  'Pink',
  'DarkPink',
  'LightTurquoise',
  'Turquoise',
  'DarkTurquoise',
  'Orange',
  'Red',
])
export const serviceCategories = pgTable('serviceCategories', {
  id: serial('id').primaryKey().unique(),
  name: varchar('name', { length: 256 }).unique().notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const services = pgTable('services', {
  id: serial('id').primaryKey().unique(),
  serviceCategoryId: integer('serviceCategoryId')
    .references(() => serviceCategories.id)
    .notNull(),
  description: varchar('description', { length: 256 }).unique().notNull(),
  includeInAutomaticSms: boolean('includeInAutomaticSms'),
  hidden: boolean('hidden'),
  callInterval: integer('callInterval'),
  colorOnDuty: colorOnDutyEnum('colorOnDuty'),
  warantyCard: boolean('warantyCard'),
  itermNumber: varchar('itermNumber', { length: 256 }),
  suppliersArticleNumber: varchar('suppliersArticleNumber', { length: 256 }),
  externalArticleNumber: varchar('externalArticleNumber', { length: 256 }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
