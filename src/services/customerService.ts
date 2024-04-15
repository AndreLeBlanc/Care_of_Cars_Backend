import { Brand, make } from 'ts-brand'

export type DriverExternalNumber = Brand<string, 'DriverExternalNumber'>
export const DriverExternalNumber = make<DriverExternalNumber>()
export type DriverGDPRAccept = Brand<boolean, 'DriverGDPRAccept'>
export const DriverGDPRAccept = make<DriverGDPRAccept>()
export type DriverISWarrantyCustomer = Brand<boolean, 'CustomerISWarrantyCustomer'>
export const DriverISWarrantyCustomer = make<DriverISWarrantyCustomer>()
export type DriverAcceptsMarketing = Brand<boolean, 'DriverAcceptsMarketing'>
export const DriverAcceptsMarketing = make<DriverAcceptsMarketing>()
export type ComapanyName = Brand<string, 'ComapanyName'>
export const ComapanyName = make<ComapanyName>()
export type CompanyOrgNumber = Brand<string, 'CompanyOrgNumber'>
export const CompanyOrgNumber = make<CompanyOrgNumber>()
export type DriverFirstName = Brand<string, 'DriverFirstName'>
export const DriverFirstName = make<DriverFirstName>()
export type DriverLastName = Brand<string, 'DriverLastName'>
export const DriverLastName = make<DriverLastName>()
export type CompanyReference = Brand<string, 'CompanyReference'>
export const CompanyReference = make<CompanyReference>()
export type CompanyEmail = Brand<string, 'CompanyEmail'>
export const CompanyEmail = make<CompanyEmail>()
export type DriverEmail = Brand<string, 'DriverEmail'>
export const DriverEmail = make<DriverEmail>()
export type CompanyPhoneNumber = Brand<string, 'CompanyPhoneNumber'>
export const CompanyPhoneNumber = make<CompanyPhoneNumber>()
export type CompanyAddress = Brand<string, 'CompanyAddress'>
export const CompanyAddress = make<CompanyAddress>()
export type DriverAddress = Brand<string, 'DriverAddress'>
export const DriverAddress = make<DriverAddress>()
export type CompanyZipCode = Brand<string, 'CompanyZipCode'>
export const CompanyZipCode = make<CompanyZipCode>()
export type DriverZipCode = Brand<string, 'DriverZipCode'>
export const DriverZipCode = make<DriverZipCode>()
export type CompanyAddressCity = Brand<string, 'CompanyAddressCity'>
export const CompanyAddressCity = make<CompanyAddressCity>()
export type DriverAddressCity = Brand<string, 'DriverAddressCity'>
export const DriverAddressCity = make<DriverAddressCity>()
export type CompanyCountry = Brand<string, 'CompanyCountry'>
export const CompanyCountry = make<CompanyCountry>()
export type DriverCountry = Brand<string, 'DriverCountry'>
export const DriverCountry = make<DriverCountry>()
export type DriverHasCard = Brand<boolean, 'DriverHasCard'>
export const DriverHasCard = make<DriverHasCard>()
export type CustomerCardNumber = Brand<string, 'CustomerCardNumber'>
export const CustomerCardNumber = make<CustomerCardNumber>()
export type CustomerCardValid = Brand<string, 'CustomerdCarValid'>
export const CustomerCardValid = make<CustomerCardValid>()
export type DriverKeyNumber = Brand<string, 'DriverKeyNumber'>
export const DriverKeyNumber = make<DriverKeyNumber>()
export type DriverNotesShared = Brand<string, 'DriverNotesShared'>
export const DriverNotesShared = make<DriverNotesShared>()
export type DriverNotes = Brand<string, 'DriverNotes'>
export const DriverNotes = make<DriverNotes>()

export type CompanyCreate = {
  companyOrgNumber: CompanyOrgNumber
  ComapanyName: ComapanyName
  companyReference?: CompanyReference
  companyEmail?: CompanyEmail
  companyPhoneNumber?: CompanyPhoneNumber
  companyAddress?: CompanyAddress
  companyZipCode?: CompanyZipCode
  companyAddressCity?: CompanyAddressCity
  companyCountry?: CompanyCountry
}

export type DriverCreate = {
  driverExternalNumber?: DriverExternalNumber
  driverGDPRAccept: DriverGDPRAccept
  driverISWarrantyDriver: DriverISWarrantyCustomer
  driverAcceptsMarketing: DriverAcceptsMarketing
  driverFirstName: DriverFirstName
  driverLastName: DriverLastName
  driverEmail: DriverEmail
  driverPhoneNumber: CompanyPhoneNumber
  driverAddress: DriverAddress
  driverZipCode?: DriverZipCode
  driverAddressCity: DriverAddressCity
  driverCountry: DriverCountry
  driverHasCard: DriverHasCard
  driverCardNumber?: CustomerCardNumber
  driverCardValidTo?: CustomerCardValid
  driverKeyNumber?: DriverKeyNumber
  driverNotesShared?: DriverNotesShared
  driverNotes?: DriverNotes
}

export type Company = CompanyCreate & {
  createdAt: Date
  updatedAt: Date
}
export type Driver = DriverCreate & {
  createdAt: Date
  updatedAt: Date
}

export function createCompany(company: Company, driver: Driver) {
  //: Promise<{ company: Company; driver: Driver }>
  //  check if company exists, if not create it. Add driver to driver
}

export function createDriver(companyOrgNumber: CompanyOrgNumber, driver: DriverCreate) {
  //: Promise<{  company: Company  driver: Driver}>
}
