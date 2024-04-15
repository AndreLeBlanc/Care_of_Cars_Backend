import { Brand, make } from 'ts-brand'
import { companyCustomers } from '../schema/schema.js'
import { db } from '../config/db-connect.js'
import { eq } from 'drizzle-orm'

export type DriverExternalNumber = Brand<string, 'driverExternalNumber'>
export const DriverExternalNumber = make<DriverExternalNumber>()
export type DriverGDPRAccept = Brand<boolean, 'driverGDPRAccept'>
export const DriverGDPRAccept = make<DriverGDPRAccept>()
export type DriverISWarrantyCustomer = Brand<boolean, 'customerISWarrantyCustomer'>
export const DriverISWarrantyCustomer = make<DriverISWarrantyCustomer>()
export type DriverAcceptsMarketing = Brand<boolean, 'driverAcceptsMarketing'>
export const DriverAcceptsMarketing = make<DriverAcceptsMarketing>()
export type CompanyName = Brand<string, 'companyName'>
export const CompanyName = make<CompanyName>()
export type CompanyOrgNumber = Brand<string, 'companyOrgNumber'>
export const CompanyOrgNumber = make<CompanyOrgNumber>()
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
export type CompanyPhoneNumber = Brand<string, 'companyPhoneNumber'>
export const CompanyPhoneNumber = make<CompanyPhoneNumber>()
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
export type CustomerCardNumber = Brand<string, 'customerCardNumber'>
export const CustomerCardNumber = make<CustomerCardNumber>()
export type CustomerCardValid = Brand<string, 'customerdCarValid'>
export const CustomerCardValid = make<CustomerCardValid>()
export type DriverKeyNumber = Brand<string, 'driverKeyNumber'>
export const DriverKeyNumber = make<DriverKeyNumber>()
export type DriverNotesShared = Brand<string, 'driverNotesShared'>
export const DriverNotesShared = make<DriverNotesShared>()
export type DriverNotes = Brand<string, 'driverNotes'>
export const DriverNotes = make<DriverNotes>()

export type CompanyCreate = {
  companyOrgNumber: CompanyOrgNumber
  companyName: CompanyName
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

//create compnay
export async function createCompany(
  company: CompanyCreate,
  driver: DriverCreate,
): Promise<{
  company: CompanyCreate
  driver: DriverCreate
}> {
  const existingCompany = await db
    .select()
    .from(companyCustomers)
    .where(eq(companyCustomers.customerOrgNumber, company.companyOrgNumber))

  if (existingCompany.length === 0) {
    await db.insert(companyCustomers).values({
      customerComapanyName: company.companyName,
      customerOrgNumber: company.companyOrgNumber,
      customerAddress: company.companyAddress,
      customerAddressCity: company.companyAddressCity,
      customerCountry: company.companyCountry,
      customerZipCode: company.companyZipCode,
    })
  }
  const createdDriver = await createCompanyDriver(company.companyOrgNumber, driver)
  return { company, ...createdDriver }
}

export async function createCompanyDriver(
  companyOrgNumber: string,
  driver: DriverCreate,
): Promise<{ companyOrgNumber: string; driver: DriverCreate }> {
  return Promise.resolve({ companyOrgNumber, driver })
}

export async function createPrivateDriver(driver: DriverCreate): Promise<DriverCreate> {
  return Promise.resolve(driver)
}
