import { Brand, make } from 'ts-brand'
import { companycustomers, drivers } from '../schema/schema.js'
import { db } from '../config/db-connect.js'
import { eq } from 'drizzle-orm'

export type DriverExternalNumber = Brand<string | null, 'driverExternalNumber'>
export const DriverExternalNumber = make<DriverExternalNumber>()
export type DriverGDPRAccept = Brand<boolean, 'driverGDPRAccept'>
export const DriverGDPRAccept = make<DriverGDPRAccept>()
export type DriverISWarrantyCustomer = Brand<boolean, 'customerISWarrantyCustomer'>
export const DriverISWarrantyCustomer = make<DriverISWarrantyCustomer>()
export type DriverAcceptsMarketing = Brand<boolean, 'driverAcceptsMarketing'>
export const DriverAcceptsMarketing = make<DriverAcceptsMarketing>()
export type CustomerCompanyName = Brand<string, 'customerCompanyName'>
export const CustomerCompanyName = make<CustomerCompanyName>()
export type CustomerOrgNumber = Brand<string | null, 'customerOrgNumber'>
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
export type CompanyAddress = Brand<string | null, 'companyAddress'>
export const CompanyAddress = make<CompanyAddress>()
export type DriverAddress = Brand<string, 'driverAddress'>
export const DriverAddress = make<DriverAddress>()
export type CompanyZipCode = Brand<string | null, 'companyZipCode'>
export const CompanyZipCode = make<CompanyZipCode>()
export type DriverZipCode = Brand<string, 'driverZipCode'>
export const DriverZipCode = make<DriverZipCode>()
export type CompanyAddressCity = Brand<string | null, 'companyAddressCity'>
export const CompanyAddressCity = make<CompanyAddressCity>()
export type DriverAddressCity = Brand<string, 'driverAddressCity'>
export const DriverAddressCity = make<DriverAddressCity>()
export type CompanyCountry = Brand<string | null, 'companyCountry'>
export const CompanyCountry = make<CompanyCountry>()
export type DriverCountry = Brand<string, 'driverCountry'>
export const DriverCountry = make<DriverCountry>()
export type DriverHasCard = Brand<boolean | null, 'driverHasCard'>
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

export type CustomerCompanyCreate = {
  customerOrgNumber: CustomerOrgNumber
  customerCompanyName: CustomerCompanyName
  companyReference?: CompanyReference
  companyAddress?: CompanyAddress
  companyZipCode?: CompanyZipCode
  companyAddressCity?: CompanyAddressCity
  companyCountry?: CompanyCountry
}

export type DriverCreate = {
  customerOrgNumber?: CustomerOrgNumber
  driverExternalNumber?: DriverExternalNumber
  driverGDPRAccept: DriverGDPRAccept
  driverISWarrantyDriver: DriverISWarrantyCustomer
  driverAcceptsMarketing: DriverAcceptsMarketing
  driverFirstName: DriverFirstName
  driverLastName: DriverLastName
  driverEmail: DriverEmail
  driverPhoneNumber: DriverPhoneNumber
  driverAddress: DriverAddress
  driverZipCode: DriverZipCode
  driverAddressCity: DriverAddressCity
  driverCountry: DriverCountry
  driverHasCard: DriverHasCard
  driverCardNumber?: CustomerCardNumber
  driverCardValidTo?: DriverCardValidTo
  driverKeyNumber?: DriverKeyNumber
  driverNotesShared?: DriverNotesShared
  driverNotes?: DriverNotes
}

export type Company = CustomerCompanyCreate & {
  createdAt?: Date
  updatedAt?: Date
}
export type Driver = DriverCreate & {
  createdAt: Date
  updatedAt: Date
}

//create compnay
export async function createCompany(
  company: CustomerCompanyCreate,
  driver: DriverCreate,
): Promise<
  | {
      company: CustomerCompanyCreate
      driver: DriverCreate
    }
  | undefined
> {
  let [existingCompany] = await db
    .select({
      customerOrgNumber: companycustomers.customerOrgNumber,
      customerComapanyName: companycustomers.customerComapanyName,
      companyAddress: companycustomers.customerAddress,
      companyZipCode: companycustomers.customerZipCode,
      companyAddressCity: companycustomers.customerAddressCity,
      customerCompanyCountry: companycustomers.customerCountry,
      createdAt: companycustomers.createdAt,
      updatedAt: companycustomers.updatedAt,
    })
    .from(companycustomers)
    .where(eq(companycustomers.customerOrgNumber, company.customerOrgNumber))

  if (existingCompany == null) {
    ;[existingCompany] = await db
      .insert(companycustomers)
      .values({
        customerComapanyName: company.customerCompanyName,
        customerOrgNumber: company.customerOrgNumber,
        customerAddress: company.companyAddress,
        customerAddressCity: company.companyAddressCity,
        customerCountry: company.companyCountry,
        customerZipCode: company.companyZipCode,
      })
      .returning({
        customerOrgNumber: companycustomers.customerOrgNumber,
        customerComapanyName: companycustomers.customerComapanyName,
        companyAddress: companycustomers.customerAddress,
        companyZipCode: companycustomers.customerZipCode,
        companyAddressCity: companycustomers.customerAddressCity,
        customerCompanyCountry: companycustomers.customerCountry,
        createdAt: companycustomers.createdAt,
        updatedAt: companycustomers.updatedAt,
      })
  }
  const existingCompanyBranded: Company = {
    customerOrgNumber: CustomerOrgNumber(existingCompany.customerOrgNumber),
    customerCompanyName: CustomerCompanyName(existingCompany.customerComapanyName),
    companyAddress: CompanyAddress(existingCompany.companyAddress),
    companyZipCode: CompanyZipCode(existingCompany.companyZipCode),
    companyAddressCity: CompanyAddressCity(existingCompany.companyAddressCity),
    companyCountry: CompanyCountry(existingCompany.customerCompanyCountry),
    createdAt: existingCompany.createdAt,
    updatedAt: existingCompany.updatedAt,
  }
  const createdDriver: DriverCreate | undefined = await createCompanyDriver(
    company.customerOrgNumber,
    driver,
  )
  if (company == null || createdDriver == null) {
    return undefined
  } else {
    return { company: existingCompanyBranded, driver: createdDriver }
  }
}

export async function createCompanyDriver(
  customerOrgNumber: CustomerOrgNumber,
  driver: DriverCreate,
): Promise<DriverCreate | undefined> {
  const [newDriver] = await db
    .insert(drivers)
    .values({
      customerOrgNumber: customerOrgNumber,
      driverExternalNumber: driver.driverExternalNumber,
      driverGDPRAccept: driver.driverGDPRAccept,
      driverISWarrantyDriver: driver.driverISWarrantyDriver,
      driverAcceptsMarketing: driver.driverAcceptsMarketing,
      driverFirstName: driver.driverFirstName,
      driverLastName: driver.driverLastName,
      driverEmail: driver.driverEmail,
      driverPhoneNumber: driver.driverPhoneNumber,
      driverAddress: driver.driverAddress,
      driverZipCode: driver.driverZipCode,
      driverAddressCity: driver.driverAddressCity,
      driverCountry: driver.driverCountry,
      driverHasCard: driver.driverHasCard,
      driverCardValidTo: driver.driverCardValidTo,
      driverCardNumber: driver.driverCardNumber,
      driverKeyNumber: driver.driverKeyNumber,
      driverNotesShared: driver.driverNotesShared,
      driverNotes: driver.driverNotes,
    })
    .returning({
      customerOrgNumber: drivers.customerOrgNumber,
      driverExternalNumber: drivers.driverExternalNumber,
      driverGDPRAccept: drivers.driverGDPRAccept,
      driverISWarrantyDriver: drivers.driverISWarrantyDriver,
      driverAcceptsMarketing: drivers.driverAcceptsMarketing,
      driverFirstName: drivers.driverFirstName,
      driverLastName: drivers.driverLastName,
      driverEmail: drivers.driverEmail,
      driverPhoneNumber: drivers.driverPhoneNumber,
      driverAddress: drivers.driverAddress,
      driverZipCode: drivers.driverZipCode,
      driverAddressCity: drivers.driverAddressCity,
      driverCountry: drivers.driverCountry,
      driverHasCard: drivers.driverHasCard,
      driverCardValidTo: drivers.driverCardValidTo,
      driverCardNumber: drivers.driverCardNumber,
      driverKeyNumber: drivers.driverKeyNumber,
      driverNotesShared: drivers.driverNotesShared,
      driverNotes: drivers.driverNotes,
    })
  return newDriver
    ? {
        customerOrgNumber: CustomerOrgNumber(newDriver.customerOrgNumber),
        driverExternalNumber: DriverExternalNumber(newDriver.driverExternalNumber),
        driverGDPRAccept: DriverGDPRAccept(newDriver.driverGDPRAccept),
        driverISWarrantyDriver: DriverISWarrantyCustomer(newDriver.driverISWarrantyDriver),
        driverAcceptsMarketing: DriverAcceptsMarketing(newDriver.driverAcceptsMarketing),
        driverFirstName: DriverFirstName(newDriver.driverFirstName),
        driverLastName: DriverLastName(newDriver.driverLastName),
        driverEmail: DriverEmail(newDriver.driverEmail),
        driverPhoneNumber: DriverPhoneNumber(newDriver.driverPhoneNumber),
        driverAddress: DriverAddress(newDriver.driverAddress),
        driverZipCode: DriverZipCode(newDriver.driverZipCode),
        driverAddressCity: DriverAddressCity(newDriver.driverAddressCity),
        driverCountry: DriverCountry(newDriver.driverCountry),
        driverHasCard: DriverHasCard(newDriver.driverHasCard),
        driverCardValidTo: DriverCardValidTo(newDriver.driverCardValidTo),
        driverCardNumber: CustomerCardNumber(newDriver.driverCardNumber),
        driverKeyNumber: DriverKeyNumber(newDriver.driverKeyNumber),
        driverNotesShared: DriverNotesShared(newDriver.driverNotesShared),
        driverNotes: DriverNotes(newDriver.driverNotes),
      }
    : undefined
}

export async function createPrivateDriver(driver: DriverCreate): Promise<DriverCreate> {
  return Promise.resolve(driver)
}

export async function editCompanyDetails(company: Company): Promise<Company | undefined> {
  const [updatedCompany] = await db
    .update(companycustomers)
    .set({
      customerAddress: company.companyAddress,
      customerAddressCity: company.companyAddressCity,
      customerComapanyName: company.customerCompanyName,
      customerCountry: company.companyCountry,
      customerZipCode: company.companyZipCode,
      updatedAt: new Date(),
    })
    .where(eq(companycustomers.customerOrgNumber, company.customerOrgNumber))
    .returning({
      customerAddress: companycustomers.customerAddress,
      customerAddressCity: companycustomers.customerAddressCity,
      customerComapanyName: companycustomers.customerComapanyName,
      customerCountry: companycustomers.customerCountry,
      customerZipCode: companycustomers.customerZipCode,
      customerOrgNumber: companycustomers.customerOrgNumber,
      createdAt: companycustomers.createdAt,
      updatedAt: companycustomers.updatedAt,
    })

  return updatedCompany
    ? {
        companyAddress: CompanyAddress(updatedCompany.customerAddress),
        companyAddressCity: CompanyAddressCity(updatedCompany.customerAddressCity),
        customerCompanyName: CustomerCompanyName(updatedCompany.customerComapanyName),
        companyCountry: CompanyCountry(updatedCompany.customerCountry),
        companyZipCode: CompanyZipCode(updatedCompany.customerZipCode),
        customerOrgNumber: CustomerOrgNumber(updatedCompany.customerOrgNumber),
        createdAt: updatedCompany.createdAt,
        updatedAt: updatedCompany.updatedAt,
      }
    : undefined
}

export async function deleteCompany(
  orgNumber: CustomerOrgNumber,
): Promise<CustomerOrgNumber | undefined> {
  const [deletedData] = await db
    .delete(companycustomers)
    .where(eq(companycustomers.customerOrgNumber, orgNumber))
    .returning({ deletedOrgNumber: companycustomers.customerOrgNumber })
  return deletedData ? CustomerOrgNumber(deletedData.deletedOrgNumber) : undefined
}
