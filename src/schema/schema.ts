import { relations } from 'drizzle-orm'
import {
  serial,
  text,
  timestamp,
  pgTable,
  date,
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

export const colorForService = [
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
  'None',
] as const

export const colorForServicepgEnum = pgEnum('colorForService', colorForService)
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
  colorForService: colorForServicepgEnum('colorForService').notNull().default('None'),
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

export const companycustomers = pgTable('companycustomers', {
  customerOrgNumber: varchar('customerOrgNumber', { length: 11 }).primaryKey().unique(),
  customerComapanyName: varchar('customerComapanyName', { length: 255 }).notNull(),
  companyAddress: varchar('companyAddress', { length: 256 }),
  companyZipCode: varchar('companyZipCode', { length: 16 }),
  companyAddressCity: varchar('companyAddressCity', { length: 256 }),
  companyCountry: varchar('companyCountry', { length: 256 }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const drivers = pgTable('drivers', {
  customerOrgNumber: varchar('customerOrgNumber', { length: 11 }).references(
    () => companycustomers.customerOrgNumber,
    { onDelete: 'cascade' },
  ),
  driverExternalNumber: varchar('driverExternalNumber', { length: 256 }),
  companyReference: varchar('companyReference', { length: 256 }),
  driverGDPRAccept: boolean('driverGDPRAccept').default(false).notNull(),
  driverISWarrantyDriver: boolean('driverISWarrantyDriver').default(false).notNull(),
  driverAcceptsMarketing: boolean('driverAcceptsMarketing').default(false).notNull(),
  driverFirstName: varchar('driverFirstName', { length: 128 }).notNull(),
  driverLastName: varchar('driverLastName', { length: 128 }).notNull(),
  driverEmail: varchar('driverEmail', { length: 256 }).primaryKey().unique(),
  driverPhoneNumber: varchar('driverPhoneNumber', { length: 32 }).notNull(),
  driverAddress: varchar('driverAddress', { length: 256 }).notNull(),
  driverZipCode: varchar('driverZipCode', { length: 16 }).notNull(),
  driverAddressCity: varchar('driverAddressCity', { length: 256 }).notNull(),
  driverCountry: varchar('driverCountry', { length: 256 }).notNull(),
  driverHasCard: boolean('driverHasCard').default(false),
  driverCardValidTo: date('driverCardValidTo', { mode: 'date' }),
  driverCardNumber: varchar('driverCardNumber', { length: 256 }),
  driverKeyNumber: varchar('driverKeyNumber', { length: 256 }),
  driverNotesShared: varchar('driverNotesShared'),
  driverNotes: varchar('driverNotes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const driverRelations = relations(drivers, ({ one }) => ({
  companycustomers: one(companycustomers, {
    fields: [drivers.customerOrgNumber],
    references: [companycustomers.customerOrgNumber],
  }),
}))

export const companycustomersRelations = relations(companycustomers, ({ many }) => ({
  drivers: many(drivers),
}))

export const stores = pgTable('stores', {
  storeOrgNumber: varchar('storeOrgNumber', { length: 11 }).primaryKey().unique(),
  storeName: varchar('storeName').notNull(),
  storeStatus: boolean('storeStatus').notNull(),
  storeEmail: varchar('storeEmail').notNull(),
  storePhone: varchar('storePhone').notNull(),
  storeAddress: varchar('storeAddress').notNull(),
  storeZipCode: varchar('storeZipCode', { length: 16 }).notNull(),
  storeCity: varchar('storeCity').notNull(),
  storeCountry: varchar('storeCountry').notNull(),
  storeDescription: varchar('storeDescription'),
  storeContactPerson: varchar('storeContactPerson', { length: 64 }),
  storeMaxUsers: integer('storeMaxUsers'),
  storeAllowCarAPI: boolean('storeAllowCarAPI').default(true),
  storeAllowSendSMS: boolean('storeAllowSendSMS').default(true),
  storeSendSMS: boolean('storeSendSMS').default(true),
  storeUsesCheckin: boolean('storeUsesCheckin').default(true),
  storeUsesPIN: boolean('storeUsesPIN').default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
