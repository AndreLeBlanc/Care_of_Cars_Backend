import { PositiveInteger } from '../utils/helper.js'

import { Brand, make } from 'ts-brand'

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

import { Currency, Dinero } from 'dinero.js'

export type UserID = Brand<number, 'userID'>
export const UserID = make<UserID>()
export type UserPassword = Brand<string, ' userPassword'>
export const UserPassword = make<UserPassword>()
export type UserFirstName = Brand<string, ' userFirstName'>
export const UserFirstName = make<UserFirstName>()
export type UserLastName = Brand<string, ' userLastName'>
export const UserLastName = make<UserLastName>()
export type UserEmail = Brand<string, ' userEmail'>
export const UserEmail = make<UserEmail>()
export type Signature = Brand<string, ' signature'>
export const Signature = make<Signature>()
export type IsSuperAdmin = Brand<boolean | null, 'isSuperAdmin'>
export const IsSuperAdmin = make<IsSuperAdmin>()

export type ServiceCategoryID = Brand<number, 'serviceCategoryID'>
export const ServiceCategoryID = make<ServiceCategoryID>()
export type ServiceCategoryName = Brand<string, 'serviceCategoryName'>
export const ServiceCategoryName = make<ServiceCategoryName>()
export type ServiceCategoryDescription = Brand<string, 'ServiceCategoryDescription'>
export const ServiceCategoryDescription = make<ServiceCategoryDescription>()

export type ProductCategoryID = Brand<number, 'productCategoryID'>
export const ProductCategoryID = make<ProductCategoryID>()
export type ProductCategoryName = Brand<string, 'productCategoryName'>
export const ProductCategoryName = make<ProductCategoryName>()
export type ProductCategoryDescription = Brand<string, 'productCategoryDescription'>
export const ProductCategoryDescription = make<ProductCategoryDescription>()

export type StoreName = Brand<string, 'storeName'>
export const StoreName = make<StoreName>()
export type StoreOrgNumber = Brand<string, 'storeOrgNumber'>
export const StoreOrgNumber = make<StoreOrgNumber>()
export type StoreID = Brand<number, 'storeID'>
export const StoreID = make<StoreID>()
export type StoreStatus = Brand<boolean, 'storeStatus'>
export const StoreStatus = make<StoreStatus>()
export type StoreEmail = Brand<string, 'storeEmail'>
export const StoreEmail = make<StoreEmail>()
export type StorePhone = Brand<string, 'storePhone'>
export const StorePhone = make<StorePhone>()
export type StoreAddress = Brand<string, 'storeAddress'>
export const StoreAddress = make<StoreAddress>()
export type StoreZipCode = Brand<string, 'storeZipCode'>
export const StoreZipCode = make<StoreZipCode>()
export type StoreCity = Brand<string, 'storeCity'>
export const StoreCity = make<StoreCity>()
export type StoreCountry = Brand<string, 'storeCountry'>
export const StoreCountry = make<StoreCountry>()
export type StoreDescription = Brand<string, 'storeDescription'>
export const StoreDescription = make<StoreDescription>()
export type StoreContactPerson = Brand<string, 'storeContactPerson'>
export const StoreContactPerson = make<StoreContactPerson>()
export type StoreMaxUsers = Brand<PositiveInteger<number>, 'storeMaxUsers'>
export const StoreMaxUsers = make<StoreMaxUsers>()
export type StoreAllowCarAPI = Brand<boolean, 'storeAllowCarAPI'>
export const StoreAllowCarAPI = make<StoreAllowCarAPI>()
export type StoreAllowSendSMS = Brand<boolean, 'storeAllowSendSMS'>
export const StoreAllowSendSMS = make<StoreAllowSendSMS>()
export type StoreSendSMS = Brand<boolean, 'storeSendSMS'>
export const StoreSendSMS = make<StoreSendSMS>()
export type StoreUsesCheckin = Brand<boolean, 'storeUsesCheckin'>
export const StoreUsesCheckin = make<StoreUsesCheckin>()
export type StoreUsesPIN = Brand<boolean, 'storeUsesPIN'>
export const StoreUsesPIN = make<StoreUsesPIN>()
export type StoreBankgiro = Brand<string, 'storeBankgiro'>
export const StoreBankgiro = make<StoreBankgiro>()
export type StorePlusgiro = Brand<string, 'storePlusgiro'>
export const StorePlusgiro = make<StorePlusgiro>()
export type StorePaymentdays = Brand<PositiveInteger<number>, 'storePaymentdays'>
export const StorePaymentdays = make<StorePaymentdays>()

export type MondayOpen = Brand<string, 'mondayOpen'>
export const MondayOpen = make<MondayOpen>()
export type MondayClose = Brand<string, 'mondayClose'>
export const MondayClose = make<MondayClose>()
export type TuesdayOpen = Brand<string, 'tuesdayOpen'>
export const TuesdayOpen = make<TuesdayOpen>()
export type TuesdayClose = Brand<string, 'tuesdayClose'>
export const TuesdayClose = make<TuesdayClose>()
export type WednesdayOpen = Brand<string, 'wednesdayOpen'>
export const WednesdayOpen = make<WednesdayOpen>()
export type WednesdayClose = Brand<string, 'wednesdayClose'>
export const WednesdayClose = make<WednesdayClose>()
export type ThursdayOpen = Brand<string, 'thursdayOpen'>
export const ThursdayOpen = make<ThursdayOpen>()
export type ThursdayClose = Brand<string, 'thursdayClose'>
export const ThursdayClose = make<ThursdayClose>()
export type FridayOpen = Brand<string, 'fridayOpen'>
export const FridayOpen = make<FridayOpen>()
export type FridayClose = Brand<string, 'fridayClose'>
export const FridayClose = make<FridayClose>()
export type SaturdayOpen = Brand<string, 'saturdayOpen'>
export const SaturdayOpen = make<SaturdayOpen>()
export type SaturdayClose = Brand<string, 'saturdayClose'>
export const SaturdayClose = make<SaturdayClose>()
export type SundayOpen = Brand<string, 'sundayOpen'>
export const SundayOpen = make<SundayOpen>()
export type SundayClose = Brand<string, 'sundayClose'>
export const SundayClose = make<SundayClose>()

export type WeekNote = Brand<string, 'weekNote'>
export const WeekNote = make<WeekNote>()
export type MondayNote = Brand<string, 'mondayNote'>
export const MondayNote = make<MondayNote>()
export type TuesdayNote = Brand<string, 'tuesdayNote'>
export const TuesdayNote = make<TuesdayNote>()
export type WednesdayNote = Brand<string, 'wednesdayNote'>
export const WednesdayNote = make<WednesdayNote>()
export type ThursdayNote = Brand<string, 'thursdayNote'>
export const ThursdayNote = make<ThursdayNote>()
export type FridayNote = Brand<string, 'fridayNote'>
export const FridayNote = make<FridayNote>()
export type SaturdayNote = Brand<string, 'saturdayNote'>
export const SaturdayNote = make<SaturdayNote>()
export type SundayNote = Brand<string, 'sundayNote'>
export const SundayNote = make<SundayNote>()
export type Week = Brand<Date, 'week'>
export const Week = make<Week>()

export type Day = Brand<Date, 'day'>
export const Day = make<Day>()
export type DayOpen = Brand<string, 'dayOpen'>
export const DayOpen = make<DayOpen>()
export type DayClose = Brand<string, 'dayClose'>
export const DayClose = make<DayClose>()
export type FromDate = Brand<Date, 'fromDate'>
export const FromDate = make<FromDate>()
export type ToDate = Brand<Date, 'toDate'>
export const ToDate = make<ToDate>()

export type DriverExternalNumber = Brand<string, 'driverExternalNumber'>
export const DriverExternalNumber = make<DriverExternalNumber>()
export type DriverGDPRAccept = Brand<boolean, 'driverGDPRAccept'>
export const DriverGDPRAccept = make<DriverGDPRAccept>()
export type DriverISWarrantyCustomer = Brand<boolean, 'customerISWarrantyCustomer'>
export const DriverISWarrantyCustomer = make<DriverISWarrantyCustomer>()
export type DriverAcceptsMarketing = Brand<boolean, 'driverAcceptsMarketing'>
export const DriverAcceptsMarketing = make<DriverAcceptsMarketing>()
export type CustomerCompanyName = Brand<string, 'customerCompanyName'>
export const CustomerCompanyName = make<CustomerCompanyName>()
export type CustomerOrgNumber = Brand<string, 'customerOrgNumber'>
export const CustomerOrgNumber = make<CustomerOrgNumber>()
export type DriverFirstName = Brand<string, 'driverFirstName'>
export const DriverFirstName = make<DriverFirstName>()
export type DriverLastName = Brand<string, 'driverLastName'>
export const DriverLastName = make<DriverLastName>()
export type CompanyReference = Brand<string, 'companyReference'>
export const CompanyReference = make<CompanyReference>()
export type CompanyEmail = Brand<string, 'companyEmail'>
export const CompanyEmail = make<CompanyEmail>()
export type DriverEmail = Brand<string, 'driverEmail'>
export const DriverEmail = make<DriverEmail>()
export type DriverPhoneNumber = Brand<string, 'DriverPhoneNumber'>
export const DriverPhoneNumber = make<DriverPhoneNumber>()
export type CompanyAddress = Brand<string, 'companyAddress'>
export const CompanyAddress = make<CompanyAddress>()
export type DriverAddress = Brand<string, 'driverAddress'>
export const DriverAddress = make<DriverAddress>()
export type CompanyZipCode = Brand<string, 'companyZipCode'>
export const CompanyZipCode = make<CompanyZipCode>()
export type DriverZipCode = Brand<string, 'driverZipCode'>
export const DriverZipCode = make<DriverZipCode>()
export type CompanyAddressCity = Brand<string, 'companyAddressCity'>
export const CompanyAddressCity = make<CompanyAddressCity>()
export type DriverAddressCity = Brand<string, 'driverAddressCity'>
export const DriverAddressCity = make<DriverAddressCity>()
export type CompanyCountry = Brand<string, 'companyCountry'>
export const CompanyCountry = make<CompanyCountry>()
export type DriverCountry = Brand<string, 'driverCountry'>
export const DriverCountry = make<DriverCountry>()
export type DriverHasCard = Brand<boolean, 'driverHasCard'>
export const DriverHasCard = make<DriverHasCard>()
export type CustomerCardNumber = Brand<string | null, 'customerCardNumber'>
export const CustomerCardNumber = make<CustomerCardNumber>()
export type DriverCardValidTo = Brand<Date | null, 'driverCardValidTo'>
export const DriverCardValidTo = make<DriverCardValidTo>()
export type DriverKeyNumber = Brand<string | null, 'driverKeyNumber'>
export const DriverKeyNumber = make<DriverKeyNumber>()
export type DriverNotesShared = Brand<string | null, 'driverNotesShared'>
export const DriverNotesShared = make<DriverNotesShared>()
export type DriverNotes = Brand<string | null, 'driverNotes'>
export const DriverNotes = make<DriverNotes>()

export type PermissionID = Brand<number, 'permissionID'>
export const PermissionID = make<PermissionID>()
export type PermissionTitle = Brand<string, 'permissionName'>
export const PermissionTitle = make<PermissionTitle>()
export type PermissionDescription = Brand<string, ' permissionDescription'>
export const PermissionDescription = make<PermissionDescription>()

export type ProductItemNumber = Brand<string, 'productItemNumber'>
export const ProductItemNumber = make<ProductItemNumber>()
export type ProductDescription = Brand<string, 'productDescription'>
export const ProductDescription = make<ProductDescription>()
export type ProductSupplierArticleNumber = Brand<string, 'productSupplierArticleNumber'>
export const ProductSupplierArticleNumber = make<ProductSupplierArticleNumber>()
export type ProductExternalArticleNumber = Brand<string, 'productExternalArticleNumber'>
export const ProductExternalArticleNumber = make<ProductExternalArticleNumber>()
export type ProductUpdateRelatedData = Brand<boolean, 'productUpdateRelatedData'>
export const ProductUpdateRelatedData = make<ProductUpdateRelatedData>()
export type ProductInventoryBalance = Brand<number, 'productInventoryBalance'>
export const ProductInventoryBalance = make<ProductInventoryBalance>()
export type ProductAward = Brand<number, 'productAward'>
export const ProductAward = make<ProductAward>()
export type ProductCost = Brand<number, 'productCost'>
export const ProductCost = make<ProductCost>()
export type ProductID = Brand<number, 'productID'>
export const ProductID = make<ProductID>()

export type LocalQualID = Brand<PositiveInteger<number>, 'localQualID'>
export const LocalQualID = make<LocalQualID>()
export type LocalQualName = Brand<string, 'localQualName'>
export const LocalQualName = make<LocalQualName>()
export type CreatedAt = Brand<Date, 'createdAt'>
export const CreatedAt = make<CreatedAt>()
export type UpdatedAt = Brand<Date, 'updatedAt'>
export const UpdatedAt = make<UpdatedAt>()
export type GlobalQualID = Brand<PositiveInteger<number>, 'globalQualID'>
export const GlobalQualID = make<GlobalQualID>()
export type GlobalQualName = Brand<string, 'globalQualName'>
export const GlobalQualName = make<GlobalQualName>()

export type RentCarRegistrationNumber = Brand<string, 'rentCarRegistrationNumber'>
export const RentCarRegistrationNumber = make<RentCarRegistrationNumber>()
export type RentCarModel = Brand<string, 'rentCarModel'>
export const RentCarModel = make<RentCarModel>()
export type RentCarColor = Brand<string, 'rentCarColor'>
export const RentCarColor = make<RentCarColor>()
export type RentCarYear = Brand<number, 'rentCarYear'>
export const RentCarYear = make<RentCarYear>()
export type RentCarNotes = Brand<string, 'rentCarNotes'>
export const RentCarNotes = make<RentCarNotes>()
export type RentCarNumber = Brand<number, 'rentCarNumber'>
export const RentCarNumber = make<RentCarNumber>()

export type ServiceIncludeInAutomaticSms = Brand<boolean, 'ServiceIncludeInAutomaticSms'>
export const ServiceIncludeInAutomaticSms = make<ServiceIncludeInAutomaticSms>()
export type ServiceHidden = Brand<boolean, 'ServiceHidden'>
export const ServiceHidden = make<ServiceHidden>()
export type ServiceCallInterval = Brand<number, 'ServiceCallInterval'>
export const ServiceCallInterval = make<ServiceCallInterval>()
export type ServiceWarrantyCard = Brand<boolean, 'ServiceWarrantyCard'>
export const ServiceWarrantyCard = make<ServiceWarrantyCard>()
export type ServiceItemNumber = Brand<string, 'ServiceItemNumber'>
export const ServiceItemNumber = make<ServiceItemNumber>()
export type ServiceSuppliersArticleNumber = Brand<string, 'ServiceSuppliersArticleNumber'>
export const ServiceSuppliersArticleNumber = make<ServiceSuppliersArticleNumber>()
export type ServiceExternalArticleNumber = Brand<string, 'ServiceExternalArticleNumber'>
export const ServiceExternalArticleNumber = make<ServiceExternalArticleNumber>()
export type ServiceID = Brand<number, ' serviceID'>
export const ServiceID = make<ServiceID>()
export type ServiceName = Brand<string, ' serviceName'>
export const ServiceName = make<ServiceName>()
export type ServiceAward = Brand<number, ' serviceAward'>
export const ServiceAward = make<ServiceAward>()
export type ServiceCost = Brand<number, ' serviceCost'>
export const ServiceCost = make<ServiceCost>()
export type ServiceDay1 = Brand<string, ' serviceDay1'>
export const ServiceDay1 = make<ServiceDay1>()
export type ServiceDay2 = Brand<string, ' serviceDay2'>
export const ServiceDay2 = make<ServiceDay2>()
export type ServiceDay3 = Brand<string, ' serviceDay3'>
export const ServiceDay3 = make<ServiceDay3>()
export type ServiceDay4 = Brand<string, ' serviceDay4'>
export const ServiceDay4 = make<ServiceDay4>()
export type ServiceDay5 = Brand<string, ' serviceDay5'>
export const ServiceDay5 = make<ServiceDay5>()

export type RoleName = Brand<string, 'roleName'>
export const RoleName = make<RoleName>()
export type RoleID = Brand<number, 'roleID'>
export const RoleID = make<RoleID>()
export type RoleDescription = Brand<string, 'roleDescription'>
export const RoleDescription = make<RoleDescription>()

export type EmployeeID = Brand<number, 'employeeID'>
export const EmployeeID = make<EmployeeID>()
export type ShortUserName = Brand<string, 'ShortUserName'>
export const ShortUserName = make<ShortUserName>()
export type EmploymentNumber = Brand<string, 'employmentNumber'>
export const EmploymentNumber = make<EmploymentNumber>()
export type EmployeePersonalNumber = Brand<string, 'employeePersonalNumber'>
export const EmployeePersonalNumber = make<EmployeePersonalNumber>()
export type EmployeeHourlyRate = Brand<number, 'employeeHourlyRate'>
export const EmployeeHourlyRate = make<EmployeeHourlyRate>()
export type EmployeeHourlyRateDinero = Brand<Dinero, 'employeeHourlyRateDinero'>
export const EmployeeHourlyRateDinero = make<EmployeeHourlyRateDinero>()
export type EmployeeHourlyRateCurrency = Brand<Currency, 'employeeHourlyRateCurrency'>
export const EmployeeHourlyRateCurrency = make<EmployeeHourlyRateCurrency>()
export type EmployeePin = Brand<string, 'employeePin'>
export const EmployeePin = make<EmployeePin>()
export type EmployeeComment = Brand<string, 'employeeComment'>
export const EmployeeComment = make<EmployeeComment>()

export type TotalEmployees = Brand<number, 'totalEmployees'>
export const TotalEmployees = make<TotalEmployees>()
export type TotalPage = Brand<number, 'totalPage'>
export const TotalPage = make<TotalPage>()

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

export type ColorForService = (typeof colorForService)[number]

export type DbDateType = {
  createdAt: Date
  updatedAt: Date
}

const dbDates = {
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}

export const employees = pgTable('employees', {
  employeeID: serial('employeeID').$type<EmployeeID>().primaryKey(),
  shortUserName: varchar('shortUserName', { length: 16 }).$type<ShortUserName>().notNull(),
  employmentNumber: varchar('employmentNumber', { length: 128 })
    .$type<EmploymentNumber>()
    .unique()
    .notNull(),
  employeePersonalNumber: varchar('employeePersonalNumber', { length: 16 })
    .$type<EmployeePersonalNumber>()
    .notNull()
    .unique(),
  signature: varchar('signature', { length: 4 }).$type<Signature>().notNull().unique(),
  employeeHourlyRate: numeric('employeeHourlyRate').$type<EmployeeHourlyRate>(),
  employeeHourlyRateCurrency: varchar(
    'employeeHourlyRateCurrency',
  ).$type<EmployeeHourlyRateCurrency>(),
  employeePin: varchar('employeePin', { length: 4 }).$type<EmployeePin>(),
  employeeComment: varchar('employeeComment').$type<EmployeeComment>(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

export const employeeStore = pgTable(
  'employeeStore',
  {
    storeID: integer('storeID')
      .$type<StoreID>()
      .references(() => stores.storeID, {
        onDelete: 'cascade',
      })
      .notNull(),
    employeeID: integer('employeeID')
      .$type<EmployeeID>()
      .references(() => employees.employeeID, {
        onDelete: 'cascade',
      })
      .notNull(),
  },
  (employeeStore) => {
    return {
      pk: primaryKey({ columns: [employeeStore.storeID, employeeStore.employeeID] }),
    }
  },
)

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

export const colorForServicepgEnum = pgEnum('colorForService', colorForService)

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
  colorForService: varchar('colorForService').notNull(),
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
  currency: varchar('currency').default('SEK'),
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
  storeID: integer('storeID')
    .$type<StoreID>()
    .references(() => stores.storeID, { onDelete: 'cascade' })
    .primaryKey(),
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
