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
  companyAddress?: CompanyAddress
  companyZipCode?: CompanyZipCode
  companyAddressCity?: CompanyAddressCity
  companyCountry?: CompanyCountry
}

export type DriverCreate = {
  customerOrgNumber?: CustomerOrgNumber
  driverExternalNumber?: DriverExternalNumber
  companyReference?: CompanyReference
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
  createdAt: Date
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
      company: Company
      driver: Driver
    }
  | undefined
> {
  let [existingCompany] = await db
    .select({
      customerOrgNumber: companycustomers.customerOrgNumber,
      customerComapanyName: companycustomers.customerComapanyName,
      companyAddress: companycustomers.companyAddress,
      companyZipCode: companycustomers.companyZipCode,
      companyAddressCity: companycustomers.companyAddressCity,
      companyCountry: companycustomers.companyCountry,
      createdAt: companycustomers.createdAt,
      updatedAt: companycustomers.updatedAt,
    })
    .from(companycustomers)
    .where(eq(companycustomers.customerOrgNumber, company.customerOrgNumber))

  if (existingCompany == null) {
    ;[existingCompany] = await db
      .insert(companycustomers)
      .values({
        customerOrgNumber: company.customerOrgNumber,
        customerComapanyName: company.customerCompanyName,
        companyAddress: company.companyAddress,
        companyAddressCity: company.companyAddressCity,
        companyCountry: company.companyCountry,
        companyZipCode: company.companyZipCode,
      })
      .returning({
        customerOrgNumber: companycustomers.customerOrgNumber,
        customerComapanyName: companycustomers.customerComapanyName,
        companyAddress: companycustomers.companyAddress,
        companyZipCode: companycustomers.companyZipCode,
        companyAddressCity: companycustomers.companyAddressCity,
        companyCountry: companycustomers.companyCountry,
        createdAt: companycustomers.createdAt,
        updatedAt: companycustomers.updatedAt,
      })
  }
  const existingCompanyBranded: Company = {
    customerOrgNumber: CustomerOrgNumber(existingCompany.customerOrgNumber),
    customerCompanyName: CustomerCompanyName(existingCompany.customerComapanyName),
    companyAddress: existingCompany.companyAddress
      ? CompanyAddress(existingCompany.companyAddress)
      : undefined,
    companyAddressCity: existingCompany.companyAddressCity
      ? CompanyAddressCity(existingCompany.companyAddressCity)
      : undefined,
    companyCountry: existingCompany.companyCountry
      ? CompanyCountry(existingCompany.companyCountry)
      : undefined,
    companyZipCode: existingCompany.companyZipCode
      ? CompanyZipCode(existingCompany.companyZipCode)
      : undefined,
    createdAt: existingCompany.createdAt,
    updatedAt: existingCompany.updatedAt,
  }
  const createdDriver: Driver | undefined = await createCompanyDriver(
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
): Promise<Driver | undefined> {
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
      createdAt: drivers.createdAt,
      updatedAt: drivers.updatedAt,
    })
  return newDriver
    ? {
        customerOrgNumber: newDriver.customerOrgNumber
          ? CustomerOrgNumber(newDriver.customerOrgNumber)
          : undefined,
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
        createdAt: newDriver.createdAt,
        updatedAt: newDriver.updatedAt,
      }
    : undefined
}

export async function createPrivateDriver(driver: DriverCreate): Promise<DriverCreate> {
  return Promise.resolve(driver)
}

export async function editCompanyDetails(
  company: CustomerCompanyCreate,
): Promise<Company | undefined> {
  const [updatedCompany] = await db
    .update(companycustomers)
    .set({
      companyAddress: company.companyAddress,
      companyAddressCity: company.companyAddressCity,
      customerComapanyName: company.customerCompanyName,
      companyCountry: company.companyCountry,
      companyZipCode: company.companyZipCode,
      updatedAt: new Date(),
    })
    .where(eq(companycustomers.customerOrgNumber, company.customerOrgNumber))
    .returning({
      customerOrgNumber: companycustomers.customerOrgNumber,
      customerComapanyName: companycustomers.customerComapanyName,
      customerAddress: companycustomers.companyAddress,
      customerZipCode: companycustomers.companyZipCode,
      customerAddressCity: companycustomers.companyAddressCity,
      customerCountry: companycustomers.companyCountry,
      createdAt: companycustomers.createdAt,
      updatedAt: companycustomers.updatedAt,
    })

  return updatedCompany
    ? {
        customerOrgNumber: CustomerOrgNumber(updatedCompany.customerOrgNumber),
        customerCompanyName: CustomerCompanyName(updatedCompany.customerComapanyName),
        companyAddress: updatedCompany.customerAddress
          ? CompanyAddress(updatedCompany.customerAddress)
          : undefined,
        companyAddressCity: updatedCompany.customerAddressCity
          ? CompanyAddressCity(updatedCompany.customerAddressCity)
          : undefined,
        companyCountry: updatedCompany.customerCountry
          ? CompanyCountry(updatedCompany.customerCountry)
          : undefined,
        companyZipCode: updatedCompany.customerZipCode
          ? CompanyZipCode(updatedCompany.customerZipCode)
          : undefined,
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
