import { PositiveInteger } from '../utils/helper.js'

import { Brand, make } from 'ts-brand'

import { relations } from 'drizzle-orm'

import {
  boolean,
  date,
  foreignKey,
  index,
  integer,
  interval,
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
export type StoreCurrency = Brand<string, 'storeCurrency'>
export const StoreCurrency = make<StoreCurrency>()
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
export type StoreWebSite = Brand<string, 'storeWebSite'>
export const StoreWebSite = make<StoreWebSite>()
export type StoreVatNumber = Brand<string, 'storeVatNumber'>
export const StoreVatNumber = make<StoreVatNumber>()
export type StoreFSkatt = Brand<boolean, 'storeFSkatt'>
export const StoreFSkatt = make<StoreFSkatt>()

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
export type CompanyPhone = Brand<string, 'companyPhone'>
export const CompanyPhone = make<CompanyPhone>()
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
export type ProductCostDinero = Brand<Dinero, 'productCostDinero'>
export const ProductCostDinero = make<ProductCostDinero>()
export type ProductCostNumber = Brand<number, 'productCostNumber'>
export const ProductCostNumber = make<ProductCostNumber>()
export type ProductCostCurrency = Brand<string, 'productCostCurrency'>
export const ProductCostCurrency = make<ProductCostCurrency>()

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
export type RentCarBookingID = Brand<number, 'rentCarBookingID'>
export const RentCarBookingID = make<RentCarBookingID>()
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
export type BookingStart = Brand<Date, 'bookingStart'>
export const BookingStart = make<BookingStart>()
export type BookingEnd = Brand<Date, 'bookingEnd'>
export const BookingEnd = make<BookingEnd>()

export type ServiceIncludeInAutomaticSms = Brand<boolean, 'ServiceIncludeInAutomaticSms'>
export const ServiceIncludeInAutomaticSms = make<ServiceIncludeInAutomaticSms>()
export type ServiceHidden = Brand<boolean, 'hidden'>
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
export type ServiceName = Brand<string, 'serviceName'>
export const ServiceName = make<ServiceName>()
export type ServiceCost = Brand<number, 'serviceCost'>
export const ServiceCost = make<ServiceCost>()
export type ServiceDay1 = Brand<string, 'serviceDay1'>
export const ServiceDay1 = make<ServiceDay1>()
export type ServiceDay2 = Brand<string, 'serviceDay2'>
export const ServiceDay2 = make<ServiceDay2>()
export type ServiceDay3 = Brand<string, 'serviceDay3'>
export const ServiceDay3 = make<ServiceDay3>()
export type ServiceDay4 = Brand<string, 'serviceDay4'>
export const ServiceDay4 = make<ServiceDay4>()
export type ServiceDay5 = Brand<string, 'serviceDay5'>
export const ServiceDay5 = make<ServiceDay5>()
export type Award = Brand<number, 'award'>
export const Award = make<Award>()
export type ServiceCostDinero = Brand<Dinero, 'costDinero'>
export const ServiceCostDinero = make<ServiceCostDinero>()
export type ServiceCostNumber = Brand<number, 'serviceCostNumber'>
export const ServiceCostNumber = make<ServiceCostNumber>()
export type ServiceCostCurrency = Brand<Currency, 'serviceCostCurrency'>
export const ServiceCostCurrency = make<ServiceCostCurrency>()

export type RoleName = Brand<string, 'roleName'>
export const RoleName = make<RoleName>()
export type RoleID = Brand<number, 'roleID'>
export const RoleID = make<RoleID>()
export type RoleDescription = Brand<string, 'roleDescription'>
export const RoleDescription = make<RoleDescription>()

export type EmployeeID = Brand<number, 'employeeID'>
export const EmployeeID = make<EmployeeID>()
export type EmployeeSpceialHoursID = Brand<number, 'employeeSpecialHoursID'>
export const EmployeeSpceialHoursID = make<EmployeeSpceialHoursID>()
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
export type EmployeeCheckIn = Brand<string, 'EmployeeCheckIn'>
export const EmployeeCheckIn = make<EmployeeCheckIn>()
export type EmployeeCheckOut = Brand<string, 'employeeCheckOut'>
export const EmployeeCheckOut = make<EmployeeCheckOut>()
export type EmployeeCheckinStatus = Brand<boolean, 'employeeCheckinStatus'>
export const EmployeeCheckinStatus = make<EmployeeCheckinStatus>()
export type EmployeeActive = Brand<boolean, 'employeeActive'>
export const EmployeeActive = make<EmployeeActive>()

export type MondayStart = Brand<string, 'mondayStart'>
export const MondayStart = make<MondayStart>()
export type MondayStop = Brand<string, 'mondayStop'>
export const MondayStop = make<MondayStop>()
export type MondayBreak = Brand<string, 'mondayBreak'>
export const MondayBreak = make<MondayBreak>()
export type TuesdayStart = Brand<string, 'tuesdayStart'>
export const TuesdayStart = make<TuesdayStart>()
export type TuesdayStop = Brand<string, 'tuesdayStop'>
export const TuesdayStop = make<TuesdayStop>()
export type TuesdayBreak = Brand<string, 'tuesdayBreak'>
export const TuesdayBreak = make<TuesdayBreak>()
export type WednesdayStart = Brand<string, 'wednesdayStart'>
export const WednesdayStart = make<WednesdayStart>()
export type WednesdayStop = Brand<string, 'wednesdayStop'>
export const WednesdayStop = make<WednesdayStop>()
export type WednesdayBreak = Brand<string, 'wednesdayBreak'>
export const WednesdayBreak = make<WednesdayBreak>()
export type ThursdayStart = Brand<string, 'thursdayStart'>
export const ThursdayStart = make<ThursdayStart>()
export type ThursdayStop = Brand<string, 'thursdayStop'>
export const ThursdayStop = make<ThursdayStop>()
export type ThursdayBreak = Brand<string, 'thursdayBreak'>
export const ThursdayBreak = make<ThursdayBreak>()
export type FridayStart = Brand<string, 'fridayStart'>
export const FridayStart = make<FridayStart>()
export type FridayStop = Brand<string, 'fridayStop'>
export const FridayStop = make<FridayStop>()
export type FridayBreak = Brand<string, 'fridayBreak'>
export const FridayBreak = make<FridayBreak>()
export type SaturdayStart = Brand<string, 'saturdayStart'>
export const SaturdayStart = make<SaturdayStart>()
export type SaturdayStop = Brand<string, 'saturdayStop'>
export const SaturdayStop = make<SaturdayStop>()
export type SaturdayBreak = Brand<string, 'saturdayBreak'>
export const SaturdayBreak = make<SaturdayBreak>()
export type SundayStart = Brand<string, 'sundayStart'>
export const SundayStart = make<SundayStart>()
export type SundayStop = Brand<string, 'sundayStop'>
export const SundayStop = make<SundayStop>()
export type SundayBreak = Brand<string, 'sundayBreak'>
export const SundayBreak = make<SundayBreak>()

export type WorkTime = Brand<Date, 'workTime'>
export const WorkTime = make<WorkTime>()
export type WorkDuration = Brand<number, 'workDuration'>
export const WorkDuration = make<WorkDuration>()
export type WorkTimeDescription = Brand<string, 'workTimeDescription'>
export const WorkTimeDescription = make<WorkTimeDescription>()
export type Absence = Brand<boolean, 'absence'>
export const Absence = make<Absence>()

export type TotalEmployees = Brand<number, 'totalEmployees'>
export const TotalEmployees = make<TotalEmployees>()
export type TotalPage = Brand<number, 'totalPage'>
export const TotalPage = make<TotalPage>()

export type DriverCarID = Brand<PositiveInteger<number>, 'driverID'>
export const DriverCarID = make<DriverCarID>()
export type DriverID = Brand<PositiveInteger<number>, 'driverID'>
export const DriverID = make<DriverID>()
export type DriverCarRegistrationNumber = Brand<string, 'driverCarRegistrationNumber'>
export const DriverCarRegistrationNumber = make<DriverCarRegistrationNumber>()
export type DriverCarBrand = Brand<string, 'driverCarBrand'>
export const DriverCarBrand = make<DriverCarBrand>()
export type DriverCarModel = Brand<string, 'driverCarModel'>
export const DriverCarModel = make<DriverCarModel>()
export type DriverCarColor = Brand<string, 'driverCarColor'>
export const DriverCarColor = make<DriverCarColor>()
export type DriverCarYear = Brand<PositiveInteger<number>, 'driverCarYear'>
export const DriverCarYear = make<DriverCarYear>()
export type DriverCarChassiNumber = Brand<string, 'driverCarChassiNumber'>
export const DriverCarChassiNumber = make<DriverCarChassiNumber>()
export type DriverCarNotes = Brand<string, 'driverCarNotes'>
export const DriverCarNotes = make<DriverCarNotes>()

export type OrderID = Brand<number, 'orderID'>
export const OrderID = make<OrderID>()
export type Billed = Brand<boolean, 'orderID'>
export const Billed = make<Billed>()
export type Amount = Brand<number, 'amount'>
export const Amount = make<Amount>()
export type Cost = Brand<number, 'cost'>
export const Cost = make<Cost>()
export type OrderNotes = Brand<string, 'orderNotes'>
export const OrderNotes = make<OrderNotes>()
export type OrderProductNotes = Brand<string, 'orderProductNotes'>
export const OrderProductNotes = make<OrderProductNotes>()
export type SubmissionTime = Brand<Date, 'submissionTime'>
export const SubmissionTime = make<SubmissionTime>()
export type SubmissionTimeOrder = Brand<string, 'submissionTimeOrder'>
export const SubmissionTimeOrder = make<SubmissionTimeOrder>()
export type PickupTime = Brand<Date, 'pickupTime'>
export const PickupTime = make<PickupTime>()
export type VatFree = Brand<boolean, 'vatFree'>
export const VatFree = make<VatFree>()
export type Discount = Brand<number, 'discount'>
export const Discount = make<Discount>()
export type WorkDay1 = Brand<Date, 'serviceDay1'>
export const WorkDay1 = make<WorkDay1>()
export type WorkDay2 = Brand<Date, 'serviceDay2'>
export const WorkDay2 = make<WorkDay2>()
export type WorkDay3 = Brand<Date, 'serviceDay3'>
export const WorkDay3 = make<WorkDay3>()
export type WorkDay4 = Brand<Date, 'serviceDay4'>
export const WorkDay4 = make<WorkDay4>()
export type WorkDay5 = Brand<Date, 'serviceDay5'>
export const WorkDay5 = make<WorkDay5>()

export type BillID = Brand<number, 'billID'>
export const BillID = make<BillID>()
export type BillingDate = Brand<string, 'billingDate'>
export const BillingDate = make<BillingDate>()
export type PaymentDate = Brand<string, 'paymentDate'>
export const PaymentDate = make<PaymentDate>()
export type IsBilled = Brand<boolean, 'isBilleded'>
export const IsBilled = make<IsBilled>()
export type PaymentDays = Brand<number, 'paymentDays'>
export const PaymentDays = make<PaymentDays>()
export type BilledAmount = Brand<number, 'billedAmount'>
export const BilledAmount = make<BilledAmount>()
export type BillAmount = Brand<Dinero, 'billAmount'>
export const BillAmount = make<BillAmount>()

export type CheckedInStatus = 'CheckedIn' | 'CheckedOut'

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

export const orderStatus = [
  'preliminär',
  'skapad',
  'påbörjad',
  'färdig för upphämtning',
  'avslutad',
] as const

export const bookingStatus = ['preliminär', 'skapad', 'upphämtad', 'återlämnad'] as const

export type OrderStatus = (typeof orderStatus)[number]

export type DbDateType = {
  createdAt: Date
  updatedAt: Date
}

const dbDates = {
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}

export const employees = pgTable('employees', {
  userID: integer('userID')
    .$type<UserID>()
    .references(() => users.userID, {
      onDelete: 'cascade',
    })
    .notNull()
    .unique(),
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
  employeeHourlyRate: real('employeeHourlyRate').$type<number>(),
  employeeHourlyRateCurrency: varchar(
    'employeeHourlyRateCurrency',
  ).$type<EmployeeHourlyRateCurrency>(),
  employeePin: varchar('employeePin', { length: 4 }).$type<EmployeePin>().notNull(),
  employeeComment: varchar('employeeComment').$type<EmployeeComment>(),
  employeeActive: boolean('employeeActive').$type<EmployeeActive>().notNull(),
  ...dbDates,
})

export const employeesRelations = relations(employees, ({ many, one }) => ({
  employeeSpecialHours: many(employeeSpecialHours),
  employeeWorkingHours: many(employeeWorkingHours),
  employeeStore: many(employeeStore),
  users: one(users),
  bills: many(bills),
  orders: many(orders),
}))

export const employeeWorkingHours = pgTable(
  'employeeWorkingHours',
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
    mondayStart: time('mondayStart').$type<MondayStart>(),
    mondayStop: time('mondayStop').$type<MondayStop>(),
    mondayBreak: interval('mondayBreak').$type<MondayBreak>(),
    tuesdayStart: time('tuesdayStart').$type<TuesdayStart>(),
    tuesdayStop: time('tuesdayStop').$type<TuesdayStop>(),
    tuesdayBreak: interval('tuesdayBreak').$type<TuesdayBreak>(),
    wednesdayStart: time('wednesdayStart').$type<WednesdayStart>(),
    wednesdayStop: time('wednesdayStop').$type<WednesdayStop>(),
    wednesdayBreak: interval('wednesdayBreak').$type<WednesdayBreak>(),
    thursdayStart: time('thursdayStart').$type<ThursdayStart>(),
    thursdayStop: time('thursdayStop').$type<ThursdayStop>(),
    thursdayBreak: interval('thursdayBreak').$type<ThursdayBreak>(),
    fridayStart: time('fridayStart').$type<FridayStart>(),
    fridayStop: time('fridayStop').$type<FridayStop>(),
    fridayBreak: interval('fridayBreak').$type<FridayBreak>(),
    saturdayStart: time('saturdayStart').$type<SaturdayStart>(),
    saturdayStop: time('saturdayStop').$type<SaturdayStop>(),
    saturdayBreak: interval('saturdayBreak').$type<SaturdayBreak>(),
    sundayStart: time('sundayStart').$type<SundayStart>(),
    sundayStop: time('sundayStop').$type<SundayStop>(),
    sundayBreak: interval('sundayBreak').$type<SundayBreak>(),
    ...dbDates,
  },
  (employeeWorkingHours) => {
    return {
      pk: primaryKey({ columns: [employeeWorkingHours.storeID, employeeWorkingHours.employeeID] }),
      unq: unique('unique_employeeWorkingHours').on(
        employeeWorkingHours.storeID,
        employeeWorkingHours.employeeID,
      ),
    }
  },
)

export const employeeWorkingHoursRelations = relations(employeeWorkingHours, ({ one }) => ({
  employees: one(employees, {
    fields: [employeeWorkingHours.employeeID],
    references: [employees.employeeID],
  }),
}))

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
    employeeCheckedIn: timestamp('checkedIn'),
    employeeCheckedOut: timestamp('checkedOut'),
  },
  (employeeStore) => {
    return {
      pk: primaryKey({ columns: [employeeStore.storeID, employeeStore.employeeID] }),
    }
  },
)

export const employeeStoreRelations = relations(employeeStore, ({ one }) => ({
  employees: one(employees),
  stores: one(stores),
}))

export const employeeSpecialHours = pgTable(
  'employeeSpecialHours',
  {
    employeeSpecialHoursID: serial('employeeSpecialHoursID')
      .$type<EmployeeSpceialHoursID>()
      .primaryKey(),
    employeeID: integer('employeeID')
      .$type<EmployeeID>()
      .references(() => employees.employeeID, {
        onDelete: 'cascade',
      })
      .notNull(),
    storeID: integer('storeID')
      .$type<StoreID>()
      .references(() => stores.storeID, {
        onDelete: 'cascade',
      })
      .notNull(),
    start: date('start').$type<WorkTime>().notNull(),
    end: date('end').$type<WorkTime>().notNull(),
    description: varchar('description').$type<WorkTimeDescription>(),
    absence: boolean('absence').$type<Absence>().notNull(),
  },
  (employeeSpecialHours) => {
    return {
      unqStart: unique().on(employeeSpecialHours.start, employeeSpecialHours.employeeID),
      unqEnd: unique().on(employeeSpecialHours.end, employeeSpecialHours.employeeID),
    }
  },
)

export const employeeSpecialHoursRelations = relations(employeeSpecialHours, ({ one }) => ({
  employees: one(employees, {
    fields: [employeeSpecialHours.employeeID],
    references: [employees.employeeID],
  }),
}))

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
  ...dbDates,
})

export const usersRelations = relations(users, ({ one }) => ({
  employees: one(employees),
  roles: one(roles),
}))

export const roles = pgTable('roles', {
  roleID: serial('roleID').$type<RoleID>().primaryKey(),
  roleName: varchar('roleName', { length: 256 }).unique().notNull().$type<RoleName>(),
  description: text('description').$type<RoleDescription>(),
  ...dbDates,
})

export const rolessRelations = relations(roles, ({ many }) => ({
  roleToPermissions: many(roleToPermissions),
}))

export const permissions = pgTable('permissions', {
  permissionID: serial('permissionID').$type<PermissionID>().primaryKey(),
  permissionTitle: varchar('permissionTitle', { length: 256 })
    .$type<PermissionTitle>()
    .unique()
    .notNull(),
  description: text('description').$type<PermissionDescription>(),
  ...dbDates,
})

export const permissionsRelations = relations(permissions, ({ many }) => ({
  roleToPermissions: many(roleToPermissions),
}))

export const roleToPermissions = pgTable(
  'roleToPermissions',
  {
    roleID: integer('roleID')
      .$type<RoleID>()
      .references(() => roles.roleID)
      .notNull(),
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

export const roleToPermissionsRelations = relations(roleToPermissions, ({ one }) => ({
  roles: one(roles, {
    fields: [roleToPermissions.roleID],
    references: [roles.roleID],
  }),
  permissions: one(permissions, {
    fields: [roleToPermissions.permissionID],
    references: [permissions.permissionID],
  }),
}))

export const serviceCategories = pgTable('serviceCategories', {
  serviceCategoryID: serial('serviceCategoryID').$type<ServiceCategoryID>().primaryKey(),
  serviceCategoryName: varchar('serviceCategoryName', { length: 256 })
    .$type<ServiceCategoryName>()
    .unique()
    .notNull(),
  serviceCategoryDescription: varchar(
    'serviceCategoryDescription',
  ).$type<ServiceCategoryDescription>(),
  ...dbDates,
})

export const serviceCategoriesRelations = relations(serviceCategories, ({ many }) => ({
  services: many(services),
}))

export const colorForServicepgEnum = pgEnum('colorForService', colorForService)

export const serviceLocalQualifications = pgTable(
  'serviceLocalQualifications',
  {
    serviceID: integer('serviceID')
      .$type<ServiceID>()
      .references(() => services.serviceID)
      .notNull(),
    localQualID: integer('localQualID')
      .$type<LocalQualID>()
      .references(() => qualificationsLocal.localQualID)
      .notNull(),
  },
  (serviceLocalQualifications) => {
    return {
      pk: primaryKey({
        columns: [serviceLocalQualifications.localQualID, serviceLocalQualifications.serviceID],
      }),
    }
  },
)

export const serviceQualifications = pgTable('serviceQualifications', {
  serviceID: integer('serviceID')
    .$type<ServiceID>()
    .references(() => services.serviceID)
    .notNull(),
  globalQualID: integer('globalQualID')
    .$type<GlobalQualID>()
    .references(() => qualificationsGlobal.globalQualID)
    .notNull(),
})

export const services = pgTable('services', {
  serviceID: serial('serviceID').$type<ServiceID>().primaryKey(),
  serviceCategoryID: integer('serviceCategoryID')
    .$type<ServiceCategoryID>()
    .references(() => serviceCategories.serviceCategoryID, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 256 }).$type<ServiceName>().notNull().unique(),
  storeID: integer('storeID')
    .$type<StoreID>()
    .references(() => stores.storeID, { onDelete: 'cascade' }),
  currency: varchar('currency', { length: 5 }).notNull(),
  cost: real('cost').$type<ServiceCostNumber>().notNull(),
  includeInAutomaticSms: boolean('includeInAutomaticSms')
    .$type<ServiceIncludeInAutomaticSms>()
    .notNull(),
  hidden: boolean('hidden').$type<ServiceHidden>().notNull(),
  callInterval: integer('callInterval').$type<ServiceCallInterval>(),
  colorForService: varchar('colorForService').notNull(),
  warrantyCard: boolean('warrantyCard').$type<ServiceWarrantyCard>(),
  itemNumber: varchar('itemNumber', { length: 256 }).$type<ServiceItemNumber>(),
  award: real('award').$type<Award>().notNull(),
  suppliersArticleNumber: varchar('suppliersArticleNumber', {
    length: 256,
  }).$type<ServiceSuppliersArticleNumber>(),
  externalArticleNumber: varchar('externalArticleNumber', {
    length: 256,
  }).$type<ServiceExternalArticleNumber>(),
  day1: interval('day1').$type<ServiceDay1>(),
  day2: interval('day2').$type<ServiceDay2>(),
  day3: interval('day3').$type<ServiceDay3>(),
  day4: interval('day4').$type<ServiceDay4>(),
  day5: interval('day5').$type<ServiceDay5>(),
  ...dbDates,
})

export const servicesRelations = relations(services, ({ many, one }) => ({
  serviceVariants: many(serviceVariants),
  serviceCategories: one(serviceCategories, {
    fields: [services.serviceCategoryID],
    references: [serviceCategories.serviceCategoryID],
  }),
}))

export const serviceVariants = pgTable('serviceVariants', {
  serviceVariantID: serial('serviceVariantID').$type<ServiceID>().primaryKey(),
  name: varchar('name', { length: 256 }).$type<ServiceName>().notNull(),
  cost: real('cost').$type<ServiceCostNumber>().notNull(),
  currency: varchar('currency', { length: 5 }).notNull(),
  award: real('award').$type<Award>().notNull(),
  day1: interval('day1').$type<ServiceDay1>(),
  day2: interval('day2').$type<ServiceDay2>(),
  day3: interval('day3').$type<ServiceDay3>(),
  day4: interval('day4').$type<ServiceDay4>(),
  day5: interval('day5').$type<ServiceDay5>(),
  serviceID: integer('serviceID')
    .$type<ServiceID>()
    .references(() => services.serviceID)
    .notNull(),
  ...dbDates,
})

export const serviceVariantsRelations = relations(serviceVariants, ({ one }) => ({
  service: one(services, { fields: [serviceVariants.serviceID], references: [services.serviceID] }),
}))

export const companycustomers = pgTable('companycustomers', {
  customerOrgNumber: varchar('customerOrgNumber', { length: 11 })
    .$type<CustomerOrgNumber>()
    .primaryKey(),
  customerCompanyName: varchar('customerCompanyName', { length: 255 })
    .$type<CustomerCompanyName>()
    .notNull(),
  companyAddress: varchar('companyAddress', { length: 256 }).$type<CompanyAddress>().notNull(),
  companyZipCode: varchar('companyZipCode', { length: 16 }).$type<CompanyZipCode>().notNull(),
  companyEmail: varchar('companyEmail', { length: 256 }).$type<CompanyEmail>().notNull(),
  companyPhone: varchar('companyPhone', { length: 16 }).$type<CompanyPhone>().notNull(),
  companyAddressCity: varchar('companyAddressCity', { length: 256 })
    .$type<CompanyAddressCity>()
    .notNull(),
  companyCountry: varchar('companyCountry', { length: 256 }).$type<CompanyCountry>().notNull(),
  ...dbDates,
})

export const drivers = pgTable('drivers', {
  driverID: serial('driverID').$type<DriverID>().primaryKey(),
  customerOrgNumber: varchar('customerOrgNumber', { length: 11 })
    .$type<CustomerOrgNumber>()
    .references(() => companycustomers.customerOrgNumber, { onDelete: 'cascade' }),
  driverExternalNumber: varchar('driverExternalNumber', {
    length: 256,
  }).$type<DriverExternalNumber>(),
  companyReference: varchar('companyReference', { length: 255 }).$type<CompanyReference>(),
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
  driverEmail: varchar('driverEmail', { length: 256 }).$type<DriverEmail>().notNull().unique(),
  driverPhoneNumber: varchar('driverPhoneNumber', { length: 32 })
    .$type<DriverPhoneNumber>()
    .notNull()
    .unique(),
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
  ...dbDates,
})

export const driverRelations = relations(drivers, ({ one, many }) => ({
  companycustomers: one(companycustomers, {
    fields: [drivers.customerOrgNumber],
    references: [companycustomers.customerOrgNumber],
  }),
  orders: many(orders),
  bills: many(bills),
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
  storeName: varchar('storeName', { length: 128 }).$type<StoreName>().notNull().unique(),
  storeWebSite: varchar('storeWebSite').$type<StoreWebSite>(),
  storeVatNumber: varchar('storeVatNumber', { length: 32 }).$type<StoreVatNumber>(),
  storeFSkatt: boolean('storeFSkatt').$type<StoreFSkatt>().notNull(),
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
  currency: varchar('currency').default('SEK').$type<StoreCurrency>(),
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
  ...dbDates,
})

export const storesRelations = relations(stores, ({ many }) => ({
  rentcars: many(rentcars),
  storespecialhours: many(storespecialhours),
  storeweeklynotes: many(storeweeklynotes),
}))

export const driverCars = pgTable(
  'driverCars',
  {
    driverCarID: serial('driverCarID').$type<DriverCarID>().primaryKey(),
    driverID: integer('driverID')
      .$type<DriverID>()
      .references(() => drivers.driverID, { onDelete: 'cascade' }),
    driverCarRegistrationNumber: varchar('driverCarRegistrationNumber', { length: 11 })
      .$type<DriverCarRegistrationNumber>()
      .unique()
      .notNull(),
    driverCarBrand: varchar('driverCarBrand', { length: 128 }).$type<DriverCarBrand>(),
    driverCarModel: varchar('driverCarModel', { length: 128 }).$type<DriverCarModel>(),
    driverCarColor: varchar('driverCarColor', { length: 64 }).$type<DriverCarColor>(),
    driverCarYear: integer('driverCarYear').$type<DriverCarYear>(),
    driverCarChassiNumber: varchar('driverCarChassiNumber', { length: 24 })
      .$type<DriverCarChassiNumber>()
      .unique(),
    driverCarNotes: varchar('driverCarNotes').$type<DriverCarNotes>(),
    ...dbDates,
  },
  (driverCars) => {
    return {
      unq: unique().on(driverCars.driverCarID, driverCars.driverID),
    }
  },
)

export const rentcars = pgTable('rentCars', {
  storeID: integer('storeID')
    .$type<StoreID>()
    .references(() => stores.storeID, { onDelete: 'cascade' })
    .notNull(),
  rentCarRegistrationNumber: varchar('rentCarRegistrationNumber')
    .$type<RentCarRegistrationNumber>()
    .primaryKey(),
  rentCarModel: varchar('rentCarModel').$type<RentCarModel>().notNull(),
  rentCarColor: varchar('rentCarColor').$type<RentCarColor>().notNull(),
  rentCarYear: integer('rentCarYear').$type<RentCarYear>().notNull(),
  rentCarNotes: varchar('rentCarNotes').$type<RentCarNotes>(),
  rentCarNumber: integer('rentCarNumber').$type<RentCarNumber>(),
  ...dbDates,
})

export const rentcarsRelations = relations(rentcars, ({ one, many }) => ({
  stores: one(stores, {
    fields: [rentcars.storeID],
    references: [stores.storeID],
  }),
  rentCarBookings: many(rentCarBookings),
}))

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
  ...dbDates,
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
  ...dbDates,
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
  productCategoryDescription: text('description').$type<ProductCategoryDescription>(),
  ...dbDates,
})

export const products = pgTable('products', {
  productID: serial('productID').$type<ProductID>().primaryKey(),
  storeID: integer('storeID')
    .$type<StoreID>()
    .references(() => stores.storeID, { onDelete: 'cascade' }),
  productItemNumber: varchar('productItemNumber').$type<ProductItemNumber>().notNull(),
  currency: varchar('currency', { length: 5 }).notNull(),
  cost: real('cost').$type<ProductCostNumber>().notNull(),
  productCategoryID: integer('productCategoryID')
    .$type<ProductCategoryID>()
    .references(() => productCategories.productCategoryID)
    .notNull(),
  productDescription: varchar('productDescription', { length: 512 })
    .$type<ProductDescription>()
    .notNull()
    .unique(),
  productSupplierArticleNumber: varchar(
    'productSupplierArticleNumber',
  ).$type<ProductSupplierArticleNumber>(),
  productExternalArticleNumber: varchar(
    'productExternalArticleNumber',
  ).$type<ProductExternalArticleNumber>(),
  productUpdateRelatedData: boolean('productUpdateRelatedData')
    .$type<ProductUpdateRelatedData>()
    .default(ProductUpdateRelatedData(false)),
  award: real('award').$type<Award>().notNull(),
  productInventoryBalance: integer('productInventoryBalance').$type<ProductInventoryBalance>(),
  ...dbDates,
})

export const productCategoryToProductRelations = relations(productCategories, ({ many }) => ({
  products: many(products),
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

export const qualificationsLocalRelations = relations(qualificationsLocal, ({ one, many }) => ({
  stores: one(stores, {
    fields: [qualificationsLocal.storeID],
    references: [stores.storeID],
  }),
  employeeLocalQualifications: many(employeeLocalQualifications),
}))

export const qualificationsGlobal = pgTable('qualificationsGlobal', {
  globalQualID: serial('globalQualID').$type<GlobalQualID>().primaryKey(),
  globalQualName: varchar('globalQualName', { length: 64 })
    .unique()
    .$type<GlobalQualName>()
    .notNull(),
  ...dbDates,
})

export const qualificationsGlobalRelations = relations(qualificationsGlobal, ({ many }) => ({
  employeeGlobalQualifications: many(employeeGlobalQualifications),
}))

export const employeeLocalQualifications = pgTable(
  'employeeLocalQualifications',
  {
    employeeID: integer('employeeID')
      .$type<EmployeeID>()
      .references(() => employees.employeeID, { onDelete: 'cascade' })
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
        columns: [userLocalQualifications.localQualID, userLocalQualifications.employeeID],
      }),
    }
  },
)

export const employeeLocalQualificationsRelations = relations(
  employeeLocalQualifications,
  ({ one }) => ({
    employees: one(employees),
    employeeLocalQualifications: one(employeeLocalQualifications),
  }),
)

export const employeeGlobalQualifications = pgTable(
  'employeeGlobalQualifications',
  {
    employeeID: integer('employeeID')
      .$type<EmployeeID>()
      .references(() => employees.employeeID, { onDelete: 'cascade' })
      .notNull(),
    globalQualID: integer('globalQualID')
      .$type<GlobalQualID>()
      .references(() => qualificationsGlobal.globalQualID, {
        onDelete: 'cascade',
      })
      .notNull(),
  },
  (employeeGlobalQualifications) => {
    return {
      pk: primaryKey({
        columns: [
          employeeGlobalQualifications.globalQualID,
          employeeGlobalQualifications.employeeID,
        ],
      }),
    }
  },
)

export const employeeGlobalQualificationsRelations = relations(
  employeeGlobalQualifications,
  ({ one }) => ({
    employees: one(employees),
    qualificationsGlobal: one(qualificationsGlobal),
  }),
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

export const orderStatuspgEnum = pgEnum('orderStatus', orderStatus)

export const orders = pgTable(
  'orders',
  {
    orderID: serial('orderID').$type<OrderID>().primaryKey(),
    driverCarID: integer('driverCarID')
      .$type<DriverCarID>()
      .references(() => driverCars.driverCarID, { onDelete: 'cascade' })
      .notNull(),
    driverID: integer('driverID')
      .$type<DriverID>()
      .references(() => drivers.driverID, { onDelete: 'cascade' })
      .notNull(),
    storeID: integer('storeID')
      .$type<StoreID>()
      .references(() => stores.storeID, {
        onDelete: 'cascade',
      })
      .notNull(),
    orderNotes: varchar('orderNotes').$type<OrderNotes>(),
    bookedBy: integer('employeeID')
      .$type<EmployeeID>()
      .references(() => employees.employeeID, { onDelete: 'set null' }),
    submissionTime: timestamp('submissionTime', { mode: 'string' })
      .$type<SubmissionTimeOrder>()
      .notNull(),
    pickupTime: timestamp('pickupTime').$type<PickupTime>().notNull(),
    vatFree: boolean('vatFree').$type<VatFree>().notNull(),
    orderStatus: orderStatuspgEnum('orderStatus').notNull(),
    currency: varchar('currency').notNull(),
    discount: real('discount').$type<Discount>().notNull(),
    createdAt: timestamp('createdAt', { mode: 'string' }).notNull(),
    updatedAt: timestamp('updatedAt', { mode: 'string' }).notNull(),
  },
  (orders) => {
    return {
      userReference: foreignKey({
        columns: [orders.driverID, orders.driverCarID],
        foreignColumns: [driverCars.driverID, driverCars.driverCarID],
        name: 'driver_must_have_car',
      }),
    }
  },
)

export const ordersRelations = relations(orders, ({ one, many }) => ({
  drivers: one(drivers, {
    fields: [orders.driverID],
    references: [drivers.driverID],
  }),
  orderListing: many(orderListing),
  bills: one(billOrders),
  rentCarBookings: one(rentCarBookings),
}))

export const orderListing = pgTable(
  'orderListing',
  {
    orderID: integer('orderID')
      .$type<OrderID>()
      .references(() => orders.orderID, { onDelete: 'cascade' })
      .notNull(),
    serviceID: integer('serviceID')
      .$type<ServiceID>()
      .references(() => services.serviceID, { onDelete: 'cascade' })
      .notNull(),
    name: varchar('name', { length: 256 }).$type<ServiceName>().notNull(),
    amount: integer('amount').$type<Amount>().notNull(),
    serviceVariantID: integer('serviceVariantID')
      .$type<ServiceID>()
      .references(() => serviceVariants.serviceVariantID, { onDelete: 'cascade' }),
    day1: timestamp('day1').$type<WorkDay1>(),
    day1Work: interval('day1Work'),
    day1Employee: integer('day1Employee')
      .$type<EmployeeID>()
      .references(() => employees.employeeID, { onDelete: 'set null' }),
    day2: timestamp('day2').$type<WorkDay2>(),
    day2Work: interval('day2Work'),
    day2Employee: integer('day2Employee')
      .$type<EmployeeID>()
      .references(() => employees.employeeID, { onDelete: 'set null' }),
    day3: timestamp('day3').$type<WorkDay3>(),
    day3Work: interval('day3Work'),
    day3Employee: integer('day3Employee')
      .$type<EmployeeID>()
      .references(() => employees.employeeID, { onDelete: 'set null' }),
    day4: timestamp('day4').$type<WorkDay4>(),
    day4Work: interval('day4Work'),
    day4Employee: integer('day4Employee')
      .$type<EmployeeID>()
      .references(() => employees.employeeID, { onDelete: 'set null' }),
    day5: timestamp('day5').$type<WorkDay5>(),
    day5Work: interval('day5Work'),
    day5Employee: integer('day5Employee')
      .$type<EmployeeID>()
      .references(() => employees.employeeID, { onDelete: 'set null' }),
    cost: real('cost').$type<ServiceCostNumber>().notNull(),
    currency: varchar('currency').notNull(),
    vatFree: boolean('vatFree').$type<VatFree>().notNull(),
    orderNotes: varchar('orderNotes').$type<OrderNotes>(),
  },
  (orderListing) => {
    return {
      pk: primaryKey({
        columns: [orderListing.orderID, orderListing.serviceID],
      }),
    }
  },
)

export const orderListingRelations = relations(orderListing, ({ one }) => ({
  orders: one(orders, {
    fields: [orderListing.orderID],
    references: [orders.orderID],
  }),
  services: one(services, {
    fields: [orderListing.serviceID],
    references: [services.serviceID],
  }),
  day1Employee: one(employees, {
    fields: [orderListing.day1Employee],
    references: [employees.employeeID],
  }),
}))

export const orderProducts = pgTable(
  'orderProducts',
  {
    orderID: integer('orderID')
      .$type<OrderID>()
      .references(() => orders.orderID, { onDelete: 'cascade' })
      .notNull(),
    productID: integer('productID')
      .$type<ProductID>()
      .references(() => products.productID, { onDelete: 'cascade' })
      .notNull(),
    productDescription: varchar('productDescription', { length: 256 })
      .$type<ProductDescription>()
      .notNull(),
    amount: integer('amount').$type<Amount>().notNull(),
    cost: real('cost').$type<ProductCostNumber>().notNull(),
    currency: varchar('currency').notNull(),
    orderProductNotes: varchar('orderProductNotes').$type<OrderProductNotes>(),
  },
  (orderProduct) => {
    return {
      pk: primaryKey({
        columns: [orderProduct.orderID, orderProduct.productID],
      }),
    }
  },
)

export const orderProductRelations = relations(orderProducts, ({ one }) => ({
  orders: one(orders, {
    fields: [orderProducts.orderID],
    references: [orders.orderID],
  }),
  services: one(products, {
    fields: [orderProducts.productID],
    references: [products.productID],
  }),
}))

export const bookingStatuspgEnum = pgEnum('orderStatus', bookingStatus)

export const rentCarBookings = pgTable('rentCarBookings', {
  rentCarBookingID: serial('rentCarBookingID').$type<RentCarBookingID>().primaryKey(),
  orderID: integer('orderID')
    .$type<OrderID>()
    .references(() => orders.orderID, { onDelete: 'cascade' })
    .unique(),
  rentCarRegistrationNumber: varchar('rentCarRegistrationNumber')
    .$type<RentCarRegistrationNumber>()
    .references(() => rentcars.rentCarRegistrationNumber, { onDelete: 'cascade' })
    .notNull(),
  bookingStart: date('bookingStart').$type<BookingStart>().notNull(),
  bookingEnd: date('bookingEnd').$type<BookingEnd>().notNull(),
  bookedBy: integer('employeeID')
    .$type<EmployeeID>()
    .references(() => employees.employeeID, { onDelete: 'set null' }),
  bookingStatus: orderStatuspgEnum('bookingStatus').notNull(),
  submissionTime: timestamp('submissionTime').$type<SubmissionTime>().notNull(),
  ...dbDates,
})

export const rentCarBookingsRelations = relations(rentCarBookings, ({ one }) => ({
  rentcars: one(rentcars),
  orders: one(orders),
}))

export const billStatus = ['bill', 'creditBill', 'cashBill'] as const

export const billStatuspgEnum = pgEnum('billStatus', billStatus)

export type BillStatus = (typeof billStatus)[number]

// Samlingsfaktura/collective invoice is not a type. We have to check if a bill has more than one order to determine if it is one.

export const bills = pgTable('bills', {
  billID: serial('orderID').$type<BillID>().primaryKey(),
  storeID: integer('storeID')
    .$type<StoreID>()
    .references(() => stores.storeID, {
      onDelete: 'cascade',
    })
    .notNull(),
  billStatus: billStatuspgEnum('billStatus').notNull(),
  billedAmount: real('billedAmount').$type<BilledAmount>().notNull(),
  currency: varchar('currency').notNull(),
  bookedBy: integer('employeeID')
    .$type<EmployeeID>()
    .references(() => employees.employeeID, { onDelete: 'no action' }),
  billingDate: date('billingDate').$type<BillingDate>().notNull(),
  paymentDate: date('paymentDate').$type<PaymentDate>().notNull(),
  paymentDays: integer('paymentDays').$type<PaymentDays>().notNull(),
  driverID: integer('driverID')
    .$type<DriverID>()
    .references(() => drivers.driverID, { onDelete: 'no action' })
    .notNull(),
  customerOrgNumber: varchar('customerOrgNumber', { length: 11 })
    .$type<CustomerOrgNumber>()
    .references(() => companycustomers.customerOrgNumber, { onDelete: 'no action' }),
  driverExternalNumber: varchar('driverExternalNumber', {
    length: 256,
  }).$type<DriverExternalNumber>(),
  companyReference: varchar('companyReference', { length: 255 }).$type<CompanyReference>(),
  driverFirstName: varchar('driverFirstName', { length: 128 }).$type<DriverFirstName>().notNull(),
  driverLastName: varchar('driverLastName', { length: 128 }).$type<DriverLastName>().notNull(),
  driverEmail: varchar('driverEmail', { length: 256 }).$type<DriverEmail>().notNull().unique(),
  driverPhoneNumber: varchar('driverPhoneNumber', { length: 32 })
    .$type<DriverPhoneNumber>()
    .notNull()
    .unique(),
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
  ...dbDates,
})

export const billsRelations = relations(bills, ({ many, one }) => ({
  billOrder: many(billOrders),
  drivers: one(drivers, {
    fields: [bills.driverID],
    references: [drivers.driverID],
  }),
  employees: one(employees, {
    fields: [bills.bookedBy],
    references: [employees.employeeID],
  }),
  companycustomers: one(companycustomers, {
    fields: [bills.customerOrgNumber],
    references: [companycustomers.customerOrgNumber],
  }),
  stores: one(stores),
}))

export const billOrders = pgTable(
  'billOrders',
  {
    billID: integer('billID')
      .$type<BillID>()
      .references(() => bills.billID, { onDelete: 'cascade' })
      .notNull(),
    orderID: integer('orderID')
      .$type<OrderID>()
      .references(() => orders.orderID, { onDelete: 'cascade' })
      .notNull(),
  },
  (billOrder) => {
    return {
      pk: primaryKey({
        columns: [billOrder.billID, billOrder.orderID],
      }),
    }
  },
)

export const billOrdersRelations = relations(billOrders, ({ one }) => ({
  orders: one(orders),
  bills: one(bills),
}))
