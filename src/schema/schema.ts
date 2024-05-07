import { relations } from 'drizzle-orm'
import {
  serial,
  text,
  smallint,
  timestamp,
  pgTable,
  date,
  varchar,
  integer,
  primaryKey,
  boolean,
  index,
  pgEnum,
  real,
  time,
} from 'drizzle-orm/pg-core'

const dbDates = {
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}

export const users = pgTable('users', {
  userID: serial('userID').primaryKey(),
  firstName: varchar('firstName', { length: 128 }).notNull(),
  lastName: varchar('lastName', { length: 128 }).notNull(),
  email: varchar('email').notNull().unique(),
  password: text('password').notNull(),
  isSuperAdmin: boolean('isSuperAdmin').default(false),
  roleID: integer('roleID')
    .references(() => roles.roleID)
    .notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

export const roles = pgTable('roles', {
  roleID: serial('roleID').primaryKey(),
  roleName: varchar('roleName', { length: 256 }).unique().notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

export const permissions = pgTable('permissions', {
  permissionID: serial('permissionID').primaryKey(),
  permissionName: varchar('permissionName', { length: 256 }).unique().notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

export const roleToPermissions = pgTable(
  'roleToPermissions',
  {
    roleID: integer('roleID').notNull(),
    permissionID: integer('permissionID').notNull(),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (roleToPermissions) => {
    return {
      pk: primaryKey({
        columns: [roleToPermissions.roleID, roleToPermissions.permissionID],
      }),
      pkWithCustomName: primaryKey({
        name: 'roleToPermissionID',
        columns: [roleToPermissions.roleID, roleToPermissions.permissionID],
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
  serviceCategoryID: serial('serviceCategoryID').primaryKey(),
  name: varchar('name', { length: 256 }).unique().notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

export const services = pgTable('services', {
  serviceID: serial('serviceID').primaryKey(),
  serviceCategoryID: integer('serviceCategoryID')
    .references(() => serviceCategories.serviceCategoryID)
    .notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  includeInAutomaticSms: boolean('includeInAutomaticSms'),
  hidden: boolean('hidden'),
  callInterval: integer('callInterval'),
  colorForService: colorForServicepgEnum('colorForService').notNull().default('None'),
  warrantyCard: boolean('warrantyCard'),
  itemNumber: varchar('itemNumber', { length: 256 }),
  suppliersArticleNumber: varchar('suppliersArticleNumber', { length: 256 }),
  externalArticleNumber: varchar('externalArticleNumber', { length: 256 }),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
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
  serviceVariantID: serial('serviceVariantID').primaryKey(),
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
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

export const servicesRelations = relations(services, ({ many }) => ({
  serviceVariants: many(serviceVariants),
}))

export const serviceVariantsRelations = relations(serviceVariants, ({ one }) => ({
  service: one(services, { fields: [serviceVariants.serviceID], references: [services.serviceID] }),
}))

export const companycustomers = pgTable('companycustomers', {
  customerOrgNumber: varchar('customerOrgNumber', { length: 11 }).primaryKey(),
  customerComapanyName: varchar('customerComapanyName', { length: 255 }).notNull(),
  companyAddress: varchar('companyAddress', { length: 256 }),
  companyZipCode: varchar('companyZipCode', { length: 16 }),
  companyAddressCity: varchar('companyAddressCity', { length: 256 }),
  companyCountry: varchar('companyCountry', { length: 256 }),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
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
  driverEmail: varchar('driverEmail', { length: 256 }).primaryKey(),
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
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
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
  storeID: serial('storeID').primaryKey(),
  storeOrgNumber: varchar('storeOrgNumber', { length: 11 }).unique().notNull(),
  storeName: varchar('storeName').notNull().unique(),
  storeStatus: boolean('storeStatus').notNull(),
  storeEmail: varchar('storeEmail').notNull(),
  storePhone: varchar('storePhone').notNull(),
  storeAddress: varchar('storeAddress').unique().notNull(),
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
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

export const rentcars = pgTable('rentcars', {
  rentCarRegistrationNumber: varchar('rentCarRegistrationNumber').primaryKey().unique(),
  rentCarModel: varchar('rentCarModel').notNull(),
  rentCarColor: varchar('rentCarColor').notNull(),
  rentCarYear: integer('rentCarYear').notNull(),
  rentCarNotes: varchar('rentCarNotes'),
  rentCarNumber: integer('rentCarNumber'),
  ...dbDates,
})

export const storepaymentinfo = pgTable('storepaymentinfo', {
  storePaymentOption: serial('storePaymentOption').primaryKey(),
  storeID: integer('storeID')
    .references(() => stores.storeID, { onDelete: 'cascade' })
    .unique(),
  bankgiro: varchar('bankgiro', { length: 16 }),
  plusgiro: varchar('plusgiro', { length: 16 }),
  paymentdays: smallint('paymentdays').default(30).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

export const storepaymentinfoRelations = relations(storepaymentinfo, ({ one }) => ({
  stores: one(stores, {
    fields: [storepaymentinfo.storeID],
    references: [stores.storeID],
  }),
}))

export const storeopeninghours = pgTable('storeopeninghours', {
  storeID: integer('storeID')
    .references(() => stores.storeID, { onDelete: 'cascade' })
    .primaryKey(),
  mondayOpen: time('mondayOpen'),
  mondayClose: time('mondayClose'),
  tuesdayOpen: time('tuesdayOpen'),
  tuesdayClose: time('tuesdayClose'),
  wednesdayOpen: time('wednesdayOpen'),
  wednesdayClose: time('wednesdayClose'),
  thursdayOpen: time('thursdayOpen'),
  thursdayClose: time('thursdayClose'),
  fridayOpen: time('fridayOpen'),
  fridayClose: time('fridayClose'),
  saturdayOpen: time('saturdayOpen'),
  saturdayClose: time('saturdayClose'),
  sundayOpen: time('sundayOpen'),
  sundayClose: time('sundayClose'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

export const storeopeninghouRselations = relations(storeopeninghours, ({ one }) => ({
  stores: one(stores, {
    fields: [storeopeninghours.storeID],
    references: [stores.storeID],
  }),
}))

export const storespecialhours = pgTable(
  'storespecialhours',
  {
    storeID: integer('storeID')
      .references(() => stores.storeID, { onDelete: 'cascade' })
      .notNull(),
    day: date('day', { mode: 'date' }).notNull(),
    dayOpen: time('dayOpen').notNull(),
    dayClose: time('dayClose').notNull(),
  },
  (storespecialhours) => {
    return {
      pk: primaryKey({ columns: [storespecialhours.storeID, storespecialhours.day] }),
      storeid_idx: index('storeid_idx').on(storespecialhours.storeID),
      day_idx: index('day_idx').on(storespecialhours.day),
    }
  },
)

export const storespecialhoursRelations = relations(storespecialhours, ({ one }) => ({
  stores: one(stores, {
    fields: [storespecialhours.storeID],
    references: [stores.storeID],
  }),
}))
