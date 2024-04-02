import { relations } from 'drizzle-orm'
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
  real,
  time,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  userID: serial('userID').primaryKey().unique(),
  firstName: varchar('firstName').notNull(),
  lastName: varchar('lastName').notNull(),
  email: varchar('email').notNull().unique(),
  password: text('password').notNull(),
  isSuperAdmin: boolean('isSuperAdmin').default(false),
  roleID: integer('roleID')
    .references(() => roles.roleID)
    .notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const roles = pgTable('roles', {
  roleID: serial('roleID').primaryKey().unique(),
  roleName: varchar('roleName', { length: 256 }).unique().notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const permissions = pgTable('permissions', {
  permissionID: serial('permissionID').primaryKey().unique(),
  permissionName: varchar('permissionName', { length: 256 }).unique().notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const roleToPermissions = pgTable(
  'roleToPermissions',
  {
    roleID: integer('roleID'),
    permissionID: integer('permissionID'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.roleID, table.permissionID],
      }),
      pkWithCustomName: primaryKey({
        name: 'roleToPermissionID',
        columns: [table.roleID, table.permissionID],
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
  serviceCategoryID: serial('serviceCategoryID').primaryKey().unique(),
  name: varchar('name', { length: 256 }).unique().notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const services = pgTable('services', {
  serviceID: serial('serviceID').primaryKey().unique(),
  serviceCategoryID: integer('serviceCategoryID')
    .references(() => serviceCategories.serviceCategoryID)
    .notNull(),
  name: varchar('name', { length: 256 }).unique().notNull(),
  includeInAutomaticSms: boolean('includeInAutomaticSms'),
  hidden: boolean('hidden'),
  callInterval: integer('callInterval'),
  colorOnDuty: colorOnDutyEnum('colorOnDuty'),
  warrantyCard: boolean('warrantyCard'),
  itemNumber: varchar('itemNumber', { length: 256 }),
  suppliersArticleNumber: varchar('suppliersArticleNumber', { length: 256 }),
  externalArticleNumber: varchar('externalArticleNumber', { length: 256 }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const servicesCategoryToServiceRelations = relations(serviceCategories, ({ many }) => ({
  services: many(services),
}))

export const serviceToServiceCategoryRelations = relations(services, ({ one }) => ({
  serviceCategories: one(serviceCategories, {
    fields: [services.serviceCategoryID],
    references: [serviceCategories.serviceCategoryID],
  }),
}))

export const serviceVariants = pgTable('serviceVariants', {
  serviceVariantID: serial('serviceVariantID').primaryKey().unique(),
  name: varchar('name', { length: 256 }),
  award: real('award').notNull(),
  cost: real('cost').notNull(),
  day1: time('day1'),
  day2: time('day2'),
  day3: time('day3'),
  day4: time('day4'),
  day5: time('day5'),
  serviceID: integer('serviceID')
    .references(() => services.serviceID)
    .notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const servicesRelations = relations(services, ({ many }) => ({
  serviceVariants: many(serviceVariants),
}))

export const serviceVariantsRelations = relations(serviceVariants, ({ one }) => ({
  service: one(services, { fields: [serviceVariants.serviceID], references: [services.serviceID] }),
}))
