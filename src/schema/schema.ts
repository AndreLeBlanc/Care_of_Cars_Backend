//import Dinero from 'dinero.js'
//import { SEK } from '@dinero.js/currencies'

import { RoleDescription, RoleID, RoleName } from '../services/roleService.js'

//import { Brand, make } from 'ts-brand'

//export type UserID = Brand<number, 'userID'>
//export const UserID = make<UserID>()
//export type UserPassword = Brand<string, ' userPassword'>
//export const UserPassword = make<UserPassword>()
//export type UserFirstName = Brand<string, ' userFirstName'>
//export const UserFirstName = make<UserFirstName>()
//export type UserLastName = Brand<string, ' userLastName'>
//export const UserLastName = make<UserLastName>()
//export type UserEmail = Brand<string, ' userEmail'>
//export const UserEmail = make<UserEmail>()
//export type Signature = Brand<string, ' signature'>
//export const Signature = make<Signature>()
//export type IsSuperAdmin = Brand<boolean | null, 'isSuperAdmin'>
//export const IsSuperAdmin = make<IsSuperAdmin>()

import {
  IsSuperAdmin,
  Signature,
  UserEmail,
  UserFirstName,
  UserID,
  UserLastName,
  UserPassword,
} from '../services/userService.js'

import {
  PermissionDescription,
  PermissionID,
  PermissionTitle,
} from '../services/permissionService.js'

import {
  ProductCategoryDescription,
  ProductCategoryID,
  ProductCategoryName,
  ServiceCategoryDescription,
  ServiceCategoryID,
  ServiceCategoryName,
} from '../services/CategoryService.js'

import {
  ProductDescription,
  ProductExternalArticleNumber,
  ProductID,
  ProductInventoryBalance,
  ProductItemNumber,
  ProductSupplierArticleNumber,
  ProductUpdateRelatedData,
} from '../services/productService.js'

import {
  ServiceAward,
  ServiceCallInterval,
  ServiceCost,
  ServiceDay1,
  ServiceDay2,
  ServiceDay3,
  ServiceDay4,
  ServiceDay5,
  ServiceExternalArticleNumber,
  ServiceHidden,
  ServiceID,
  ServiceIncludeInAutomaticSms,
  ServiceItemNumber,
  ServiceName,
  ServiceSuppliersArticleNumber,
  ServiceWarrantyCard,
} from '../services/serviceService.js'

import {
  CompanyAddress,
  CompanyAddressCity,
  CompanyCountry,
  CompanyReference,
  CompanyZipCode,
  CustomerCardNumber,
  CustomerCompanyName,
  CustomerOrgNumber,
  DriverAcceptsMarketing,
  DriverAddress,
  DriverAddressCity,
  DriverCardValidTo,
  DriverCountry,
  DriverEmail,
  DriverExternalNumber,
  DriverFirstName,
  DriverGDPRAccept,
  DriverHasCard,
  DriverISWarrantyCustomer,
  DriverKeyNumber,
  DriverLastName,
  DriverNotes,
  DriverNotesShared,
  DriverPhoneNumber,
  DriverZipCode,
} from '../services/customerService.js'

import {
  Day,
  DayClose,
  DayOpen,
  FridayClose,
  FridayNote,
  FridayOpen,
  MondayClose,
  MondayNote,
  MondayOpen,
  SaturdayClose,
  SaturdayNote,
  SaturdayOpen,
  StoreAddress,
  StoreAllowCarAPI,
  StoreAllowSendSMS,
  StoreBankgiro,
  StoreCity,
  StoreContactPerson,
  StoreCountry,
  StoreDescription,
  StoreEmail,
  StoreID,
  StoreMaxUsers,
  StoreName,
  StoreOrgNumber,
  StorePaymentOptions,
  StorePaymentdays,
  StorePhone,
  StorePlusgiro,
  StoreSendSMS,
  StoreStatus,
  StoreUsesCheckin,
  StoreUsesPIN,
  SundayClose,
  SundayNote,
  SundayOpen,
  ThursdayClose,
  ThursdayNote,
  ThursdayOpen,
  TuesdayClose,
  TuesdayNote,
  TuesdayOpen,
  WednesdayClose,
  WednesdayNote,
  WednesdayOpen,
  Week,
  WeekNote,
} from '../services/storeService.js'

import {
  RentCarColor,
  RentCarModel,
  RentCarNotes,
  RentCarNumber,
  RentCarRegistrationNumber,
  RentCarYear,
} from '../services/rentCarService.js'
import { relations } from 'drizzle-orm'

import {
  boolean,
  date,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  serial,
  smallint,
  text,
  time,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core'
import { StoreZipCode } from '../services/storeService.js'

import {
  GlobalQualID,
  GlobalQualName,
  LocalQualID,
  LocalQualName,
} from '../services/qualificationsService.js'

export type DbDateType = {
  createdAt: Date
  updatedAt: Date
}

const dbDates = {
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}

export const employees = pgTable('employees', {
  shortUserName: varchar('firstName', { length: 16 }).notNull(),
  employmentNumber: varchar('firstName', { length: 128 }).primaryKey(),
  personalNumber: varchar('personalNumber', { length: 16 }).notNull().unique(),
  signature: varchar('signature', { length: 4 }).$type<Signature>().notNull().unique(),
  hourlyRate: numeric('hourlyRate'),
  pin: varchar('pin', { length: 4 }),
  comment: varchar('comment'),
})

export const users = pgTable('users', {
  userID: serial('userID').$type<UserID>().primaryKey(),
  firstName: varchar('firstName', { length: 128 }).$type<UserFirstName>().notNull(),
  lastName: varchar('lastName', { length: 128 }).$type<UserLastName>().notNull(),
  email: varchar('email').notNull().$type<UserEmail>().unique(),
  password: text('password').$type<UserPassword>().notNull(),
  isSuperAdmin: boolean('isSuperAdmin')
    .$type<IsSuperAdmin>()
    .notNull()
    .default(IsSuperAdmin(false)),
  roleID: integer('roleID')
    .$type<RoleID>()
    .references(() => roles.roleID)
    .notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

export const roles = pgTable('roles', {
  roleID: serial('roleID').$type<RoleID>().primaryKey(),
  roleName: varchar('roleName', { length: 256 }).unique().notNull().$type<RoleName>(),
  description: text('description').$type<RoleDescription>(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

export const permissions = pgTable('permissions', {
  permissionID: serial('permissionID').$type<PermissionID>().primaryKey(),
  permissionTitle: varchar('permissionName', { length: 256 })
    .$type<PermissionTitle>()
    .unique()
    .notNull(),
  description: text('description').$type<PermissionDescription>(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

export const roleToPermissions = pgTable(
  'roleToPermissions',
  {
    roleID: integer('roleID').$type<RoleID>().notNull(),
    permissionID: integer('permissionID')
      .$type<PermissionID>()
      .references(() => permissions.permissionID)
      .notNull(),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (roleToPermissions) => {
    return {
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
  serviceCategoryID: serial('serviceCategoryID').$type<ServiceCategoryID>().primaryKey(),
  serviceCategoryName: varchar('serviceCategoryName', { length: 256 })
    .$type<ServiceCategoryName>()
    .unique()
    .notNull(),
  description: text('description').$type<ServiceCategoryDescription>(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

export const services = pgTable('services', {
  serviceID: serial('serviceID').$type<ServiceID>().primaryKey(),
  serviceCategoryID: integer('serviceCategoryID')
    .$type<ServiceCategoryID>()
    .references(() => serviceCategories.serviceCategoryID)
    .notNull(),
  name: varchar('name', { length: 256 }).$type<ServiceName>().notNull(),
  includeInAutomaticSms: boolean('includeInAutomaticSms')
    .$type<ServiceIncludeInAutomaticSms>()
    .notNull(),
  hidden: boolean('hidden').$type<ServiceHidden>(),
  callInterval: integer('callInterval').$type<ServiceCallInterval>(),
  colorForService: colorForServicepgEnum('colorForService').notNull().default('None'),
  warrantyCard: boolean('warrantyCard').$type<ServiceWarrantyCard>(),
  itemNumber: varchar('itemNumber', { length: 256 }).$type<ServiceItemNumber>(),
  suppliersArticleNumber: varchar('suppliersArticleNumber', {
    length: 256,
  }).$type<ServiceSuppliersArticleNumber>(),
  externalArticleNumber: varchar('externalArticleNumber', {
    length: 256,
  }).$type<ServiceExternalArticleNumber>(),
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
  serviceVariantID: serial('serviceVariantID').$type<ServiceID>().primaryKey(),
  name: varchar('name', { length: 256 }).$type<ServiceName>(),
  award: real('award').$type<ServiceAward>().notNull(),
  cost: real('cost').$type<ServiceCost>().notNull(),
  day1: time('day1').$type<ServiceDay1>(),
  day2: time('day2').$type<ServiceDay2>(),
  day3: time('day3').$type<ServiceDay3>(),
  day4: time('day4').$type<ServiceDay4>(),
  day5: time('day5').$type<ServiceDay5>(),
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
  customerOrgNumber: varchar('customerOrgNumber', { length: 11 })
    .$type<CustomerOrgNumber>()
    .primaryKey(),
  customerComapanyName: varchar('customerComapanyName', { length: 255 })
    .$type<CustomerCompanyName>()
    .notNull(),
  companyAddress: varchar('companyAddress', { length: 256 }).$type<CompanyAddress>(),
  companyZipCode: varchar('companyZipCode', { length: 16 }).$type<CompanyZipCode>(),
  companyAddressCity: varchar('companyAddressCity', { length: 256 }).$type<CompanyAddressCity>(),
  companyCountry: varchar('companyCountry', { length: 256 }).$type<CompanyCountry>(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

export const drivers = pgTable('drivers', {
  customerOrgNumber: varchar('customerOrgNumber', { length: 11 })
    .$type<CustomerOrgNumber>()
    .references(() => companycustomers.customerOrgNumber, { onDelete: 'cascade' }),
  driverExternalNumber: varchar('driverExternalNumber', {
    length: 256,
  }).$type<DriverExternalNumber>(),
  companyReference: varchar('companyReference', { length: 256 }).$type<CompanyReference>(),
  driverGDPRAccept: boolean('driverGDPRAccept')
    .$type<DriverGDPRAccept>()
    .default(DriverGDPRAccept(false))
    .notNull(),
  driverISWarrantyDriver: boolean('driverISWarrantyDriver')
    .$type<DriverISWarrantyCustomer>()
    .default(DriverISWarrantyCustomer(false))
    .notNull(),
  driverAcceptsMarketing: boolean('driverAcceptsMarketing')
    .$type<DriverAcceptsMarketing>()
    .default(DriverAcceptsMarketing(false))
    .notNull(),
  driverFirstName: varchar('driverFirstName', { length: 128 }).$type<DriverFirstName>().notNull(),
  driverLastName: varchar('driverLastName', { length: 128 }).$type<DriverLastName>().notNull(),
  driverEmail: varchar('driverEmail', { length: 256 }).$type<DriverEmail>().primaryKey(),
  driverPhoneNumber: varchar('driverPhoneNumber', { length: 32 })
    .$type<DriverPhoneNumber>()
    .notNull(),
  driverAddress: varchar('driverAddress', { length: 256 }).$type<DriverAddress>().notNull(),
  driverZipCode: varchar('driverZipCode', { length: 16 }).$type<DriverZipCode>().notNull(),
  driverAddressCity: varchar('driverAddressCity', { length: 256 })
    .$type<DriverAddressCity>()
    .notNull(),
  driverCountry: varchar('driverCountry', { length: 256 }).$type<DriverCountry>().notNull(),
  driverHasCard: boolean('driverHasCard').$type<DriverHasCard>().default(DriverHasCard(false)),
  driverCardValidTo: date('driverCardValidTo', { mode: 'date' }).$type<DriverCardValidTo>(),
  driverCardNumber: varchar('driverCardNumber', { length: 256 }).$type<CustomerCardNumber>(),
  driverKeyNumber: varchar('driverKeyNumber', { length: 256 }).$type<DriverKeyNumber>(),
  driverNotesShared: varchar('driverNotesShared').$type<DriverNotesShared>(),
  driverNotes: varchar('driverNotes').$type<DriverNotes>(),
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
  storeID: serial('storeID').$type<StoreID>().primaryKey(),
  storeOrgNumber: varchar('storeOrgNumber', { length: 11 })
    .$type<StoreOrgNumber>()
    .unique()
    .notNull(),
  storeName: varchar('storeName').$type<StoreName>().notNull().unique(),
  storeStatus: boolean('storeStatus').$type<StoreStatus>().notNull(),
  storeEmail: varchar('storeEmail').$type<StoreEmail>().notNull(),
  storePhone: varchar('storePhone').$type<StorePhone>().notNull(),
  storeAddress: varchar('storeAddress').$type<StoreAddress>().unique().notNull(),
  storeZipCode: varchar('storeZipCode', { length: 16 }).$type<StoreZipCode>().notNull(),
  storeCity: varchar('storeCity').$type<StoreCity>().notNull(),
  storeCountry: varchar('storeCountry').$type<StoreCountry>().notNull(),
  storeDescription: varchar('storeDescription').$type<StoreDescription>(),
  storeContactPerson: varchar('storeContactPerson', { length: 64 }).$type<StoreContactPerson>(),
  storeMaxUsers: integer('storeMaxUsers').$type<StoreMaxUsers>(),
  storeAllowCarAPI: boolean('storeAllowCarAPI')
    .$type<StoreAllowCarAPI>()
    .default(StoreAllowCarAPI(true)),
  storeAllowSendSMS: boolean('storeAllowSendSMS')
    .$type<StoreAllowSendSMS>()
    .default(StoreAllowSendSMS(true)),
  storeSendSMS: boolean('storeSendSMS').$type<StoreSendSMS>().default(StoreSendSMS(true)),
  storeUsesCheckin: boolean('storeUsesCheckin')
    .$type<StoreUsesCheckin>()
    .default(StoreUsesCheckin(true)),
  storeUsesPIN: boolean('storeUsesPIN').$type<StoreUsesPIN>().default(StoreUsesPIN(true)),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

export const rentcars = pgTable('rentcars', {
  storeID: integer('storeID')
    .$type<StoreID>()
    .references(() => stores.storeID, { onDelete: 'cascade' })
    .notNull(),
  rentCarRegistrationNumber: varchar('rentCarRegistrationNumber')
    .$type<RentCarRegistrationNumber>()
    .primaryKey()
    .unique(),
  rentCarModel: varchar('rentCarModel').$type<RentCarModel>().notNull(),
  rentCarColor: varchar('rentCarColor').$type<RentCarColor>().notNull(),
  rentCarYear: integer('rentCarYear').$type<RentCarYear>().notNull(),
  rentCarNotes: varchar('rentCarNotes').$type<RentCarNotes>(),
  rentCarNumber: integer('rentCarNumber').$type<RentCarNumber>(),
  ...dbDates,
})

export const storepaymentinfo = pgTable('storepaymentinfo', {
  storePaymentOption: serial('storePaymentOption').$type<StorePaymentOptions>().primaryKey(),
  storeID: integer('storeID')
    .$type<StoreID>()
    .references(() => stores.storeID, { onDelete: 'cascade' })
    .unique(),
  bankgiro: varchar('bankgiro', { length: 16 }).$type<StoreBankgiro>(),
  plusgiro: varchar('plusgiro', { length: 16 }).$type<StorePlusgiro>(),
  paymentdays: smallint('paymentdays')
    .$type<StorePaymentdays>()
    .default(StorePaymentdays(30))
    .notNull(),
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
    .$type<StoreID>()
    .references(() => stores.storeID, { onDelete: 'cascade' })
    .primaryKey(),
  mondayOpen: time('mondayOpen').$type<MondayOpen>(),
  mondayClose: time('mondayClose').$type<MondayClose>(),
  tuesdayOpen: time('tuesdayOpen').$type<TuesdayOpen>(),
  tuesdayClose: time('tuesdayClose').$type<TuesdayClose>(),
  wednesdayOpen: time('wednesdayOpen').$type<WednesdayOpen>(),
  wednesdayClose: time('wednesdayClose').$type<WednesdayClose>(),
  thursdayOpen: time('thursdayOpen').$type<ThursdayOpen>(),
  thursdayClose: time('thursdayClose').$type<ThursdayClose>(),
  fridayOpen: time('fridayOpen').$type<FridayOpen>(),
  fridayClose: time('fridayClose').$type<FridayClose>(),
  saturdayOpen: time('saturdayOpen').$type<SaturdayOpen>(),
  saturdayClose: time('saturdayClose').$type<SaturdayClose>(),
  sundayOpen: time('sundayOpen').$type<SundayOpen>(),
  sundayClose: time('sundayClose').$type<SundayClose>(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

export const storeopeninghoursRelations = relations(storeopeninghours, ({ one }) => ({
  stores: one(stores, {
    fields: [storeopeninghours.storeID],
    references: [stores.storeID],
  }),
}))

export const storespecialhours = pgTable(
  'storespecialhours',
  {
    storeID: integer('storeID')
      .$type<StoreID>()
      .references(() => stores.storeID, { onDelete: 'cascade' })
      .notNull(),
    day: date('day', { mode: 'date' }).$type<Day>().notNull(),
    dayOpen: time('dayOpen').$type<DayOpen>().notNull(),
    dayClose: time('dayClose').$type<DayClose>().notNull(),
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

export const productCategories = pgTable('productCategories', {
  productCategoryID: serial('productCategoryID').$type<ProductCategoryID>().primaryKey(),
  productCategoryName: varchar('name', { length: 256 })
    .$type<ProductCategoryName>()
    .unique()
    .notNull(),
  description: text('description').$type<ProductCategoryDescription>(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

export const products = pgTable('products', {
  productId: serial('productId').$type<ProductID>().primaryKey(),
  productItemNumber: varchar('productItemNumber').$type<ProductItemNumber>().notNull(),
  productCategoryID: integer('productCategoryID')
    .$type<ProductCategoryID>()
    .references(() => productCategories.productCategoryID)
    .notNull(),
  productDescription: varchar('productDescription', { length: 512 }).$type<ProductDescription>(),
  productSupplierArticleNumber: varchar(
    'productSupplierArticleNumber',
  ).$type<ProductSupplierArticleNumber>(),
  productExternalArticleNumber: varchar(
    'productExternalArticleNumber',
  ).$type<ProductExternalArticleNumber>(),
  productUpdateRelatedData: boolean('productUpdateRelatedData')
    .$type<ProductUpdateRelatedData>()
    .default(ProductUpdateRelatedData(false)),
  productInventoryBalance: integer('productInventoryBalance').$type<ProductInventoryBalance>(),
  productAward: integer('productAward').notNull(),
  productCost: integer('productCost').notNull(),
  ...dbDates,
})

export const productCategoryToProductRelations = relations(productCategories, ({ many }) => ({
  services: many(products),
}))

export const productToCategoryRelations = relations(products, ({ one }) => ({
  productCategories: one(productCategories, {
    fields: [products.productCategoryID],
    references: [productCategories.productCategoryID],
  }),
}))

export const storeweeklynotes = pgTable(
  'storeweeklynotes',
  {
    storeID: integer('storeID')
      .$type<StoreID>()
      .references(() => stores.storeID, { onDelete: 'cascade' })
      .notNull(),
    week: date('week', { mode: 'date' }).$type<Week>().notNull(),
    weekNote: varchar('weekNote').$type<WeekNote>(),
    mondayNote: varchar('mondayNote').$type<MondayNote>(),
    tuesdayNote: varchar('tuesdayNote').$type<TuesdayNote>(),
    wednesdayNote: varchar('wednesdayNote').$type<WednesdayNote>(),
    thursdayNote: varchar('thursdayNote').$type<ThursdayNote>(),
    fridayNote: varchar('fridayNote').$type<FridayNote>(),
    saturdayNote: varchar('saturdayNote').$type<SaturdayNote>(),
    sundayNote: varchar('sundayNote').$type<SundayNote>(),
  },
  (storeweeklynotes) => {
    return {
      pk: primaryKey({ columns: [storeweeklynotes.storeID, storeweeklynotes.week] }),
      unq: unique().on(storeweeklynotes.storeID, storeweeklynotes.week),
    }
  },
)

export const storeweeklynotesRelations = relations(storeweeklynotes, ({ one }) => ({
  stores: one(stores, {
    fields: [storeweeklynotes.storeID],
    references: [stores.storeID],
  }),
}))

export const qualificationsLocal = pgTable(
  'qualificationsLocal',
  {
    storeID: integer('storeID')
      .$type<StoreID>()
      .references(() => stores.storeID, { onDelete: 'cascade' })
      .notNull(),
    localQualID: serial('localQualID').$type<LocalQualID>().primaryKey(),
    localQualName: varchar('localQualName', { length: 64 }).$type<LocalQualName>().notNull(),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (qualificationsLocal) => {
    return {
      unq: unique().on(qualificationsLocal.localQualName, qualificationsLocal.storeID),
    }
  },
)

export const qualificationsLocalRelations = relations(qualificationsLocal, ({ one }) => ({
  stores: one(stores, {
    fields: [qualificationsLocal.storeID],
    references: [stores.storeID],
  }),
}))

export const qualificationsGlobal = pgTable('qualificationsGlobal', {
  globalQualID: serial('globalQualID').$type<GlobalQualID>().primaryKey(),
  globalQualName: varchar('localQualName', { length: 64 })
    .unique()
    .$type<GlobalQualName>()
    .notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

export const userLocalQualifications = pgTable(
  'userLocalQualifications',
  {
    userID: integer('userID')
      .$type<UserID>()
      .references(() => users.userID, { onDelete: 'cascade' })
      .notNull(),
    localQualID: integer('localQualID')
      .$type<LocalQualID>()
      .references(() => qualificationsLocal.localQualID, {
        onDelete: 'cascade',
      })
      .notNull(),
  },
  (userLocalQualifications) => {
    return {
      pk: primaryKey({
        columns: [userLocalQualifications.localQualID, userLocalQualifications.userID],
      }),
    }
  },
)

export const userGlobalQualifications = pgTable(
  'userGlobalQualifications',
  {
    userID: integer('userID')
      .$type<UserID>()
      .references(() => users.userID, { onDelete: 'cascade' })
      .notNull(),
    globalQualID: integer('globalQualID')
      .$type<GlobalQualID>()
      .references(() => qualificationsGlobal.globalQualID, {
        onDelete: 'cascade',
      })
      .notNull(),
  },
  (userGlobalQualifications) => {
    return {
      pk: primaryKey({
        columns: [userGlobalQualifications.globalQualID, userGlobalQualifications.userID],
      }),
    }
  },
)

export const userBelongsToStore = pgTable(
  'userBelongsToStore',
  {
    userID: integer('userID')
      .$type<UserID>()
      .references(() => users.userID, { onDelete: 'cascade' })
      .notNull(),
    storeID: integer('storeID')
      .$type<StoreID>()
      .references(() => stores.storeID, {
        onDelete: 'cascade',
      })
      .notNull(),
  },
  (userBelongsToStore) => {
    return {
      pk: primaryKey({
        columns: [userBelongsToStore.storeID, userBelongsToStore.userID],
      }),
    }
  },
)
