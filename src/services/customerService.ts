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
  companycustomers,
  drivers,
} from '../schema/schema.js'
import { db } from '../config/db-connect.js'

import { and, desc, eq, ilike, or, sql } from 'drizzle-orm'

import { Offset, Search } from '../plugins/pagination.js'
import { isEmail } from '../utils/helper.js'

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
  driverHasCard?: DriverHasCard
  driverCardNumber?: CustomerCardNumber
  driverCardValidTo?: DriverCardValidTo
  driverKeyNumber?: DriverKeyNumber
  driverNotesShared?: DriverNotesShared
  driverNotes?: DriverNotes
}

export type Company = CustomerCompanyCreate & {
  createdAt: Date
  updatedAt: Date
}
export type Driver = DriverCreate & {
  createdAt: Date
  updatedAt: Date
}

export type CustomersPaginate = {
  totalItems: number
  totalPage: number
  perPage: number
  data: Company[]
}

export type paginateDriverList = {
  driverFirstName: DriverFirstName
  driverLastName: DriverLastName
  driverEmail: DriverEmail
  driverPhoneNumber: DriverPhoneNumber
  driverAddress: DriverAddress
  createdAt: Date
  updatedAt: Date
}

export type DriversPaginate = {
  totalItems: number
  totalPage: number
  perPage: number
  data: paginateDriverList[]
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
    .returning()
  return newDriver
    ? {
        customerOrgNumber: newDriver.customerOrgNumber ?? undefined,
        driverExternalNumber: newDriver.driverExternalNumber ?? undefined,
        driverGDPRAccept: newDriver.driverGDPRAccept,
        driverISWarrantyDriver: newDriver.driverISWarrantyDriver,
        driverAcceptsMarketing: newDriver.driverAcceptsMarketing,
        driverFirstName: newDriver.driverFirstName,
        driverLastName: newDriver.driverLastName,
        driverEmail: newDriver.driverEmail,
        driverPhoneNumber: newDriver.driverPhoneNumber,
        driverAddress: newDriver.driverAddress,
        driverZipCode: newDriver.driverZipCode,
        driverAddressCity: newDriver.driverAddressCity,
        driverCountry: newDriver.driverCountry,
        driverHasCard: newDriver.driverHasCard ?? undefined,
        driverCardValidTo: newDriver.driverCardValidTo ?? undefined,
        driverCardNumber: newDriver.driverCardNumber ?? undefined,
        driverKeyNumber: newDriver.driverKeyNumber ?? undefined,
        driverNotesShared: newDriver.driverNotesShared ?? undefined,
        driverNotes: newDriver.driverNotes ?? undefined,
        createdAt: newDriver.createdAt,
        updatedAt: newDriver.updatedAt,
      }
    : undefined
}

export async function createNewDriver(driver: DriverCreate): Promise<Driver | undefined> {
  const [newDriver] = await db
    .insert(drivers)
    .values({
      customerOrgNumber: driver.customerOrgNumber,
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
    .returning()

  return newDriver
    ? {
        customerOrgNumber: newDriver.customerOrgNumber ?? undefined,
        driverExternalNumber: newDriver.driverExternalNumber ?? undefined,
        driverGDPRAccept: newDriver.driverGDPRAccept,
        driverISWarrantyDriver: newDriver.driverISWarrantyDriver,
        driverAcceptsMarketing: newDriver.driverAcceptsMarketing,
        driverFirstName: newDriver.driverFirstName,
        driverLastName: newDriver.driverLastName,
        driverEmail: newDriver.driverEmail,
        driverPhoneNumber: newDriver.driverPhoneNumber,
        driverAddress: newDriver.driverAddress,
        driverZipCode: newDriver.driverZipCode,
        driverAddressCity: newDriver.driverAddressCity,
        driverCountry: newDriver.driverCountry,
        driverHasCard: newDriver.driverHasCard ?? undefined,
        driverCardValidTo: newDriver.driverCardValidTo ?? undefined,
        driverCardNumber: newDriver.driverCardNumber ?? undefined,
        driverKeyNumber: newDriver.driverKeyNumber ?? undefined,
        driverNotesShared: newDriver.driverNotesShared ?? undefined,
        driverNotes: newDriver.driverNotes ?? undefined,
        createdAt: newDriver.createdAt,
        updatedAt: newDriver.updatedAt,
      }
    : undefined
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
    .returning()

  return updatedCompany
    ? {
        customerOrgNumber: updatedCompany.customerOrgNumber,
        customerCompanyName: updatedCompany.customerComapanyName,
        companyAddress: updatedCompany.companyAddress ?? undefined,
        companyZipCode: updatedCompany.companyZipCode ?? undefined,
        companyAddressCity: updatedCompany.companyAddressCity ?? undefined,
        companyCountry: updatedCompany.companyCountry ?? undefined,
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

//drivers
export async function editDriverDetails(driver: DriverCreate): Promise<Driver | undefined> {
  const [updatedDriver] = await db
    .update(drivers)
    .set({
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
      driverHasCard: driver.driverHasCard,
      driverCardValidTo: driver.driverCardValidTo,
      driverCardNumber: driver.driverCardNumber,
      driverKeyNumber: driver.driverKeyNumber,
      driverNotesShared: driver.driverNotesShared,
      driverNotes: driver.driverNotes,
      driverCountry: driver.driverCountry,
      updatedAt: new Date(),
    })
    .where(eq(drivers.driverEmail, driver.driverEmail))
    .returning({
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
      driverHasCard: drivers.driverHasCard,
      driverCardValidTo: drivers.driverCardValidTo,
      driverCardNumber: drivers.driverCardNumber,
      driverKeyNumber: drivers.driverKeyNumber,
      driverNotesShared: drivers.driverNotesShared,
      driverNotes: drivers.driverNotes,
      driverCountry: drivers.driverCountry,
      createdAt: drivers.createdAt,
      updatedAt: drivers.updatedAt,
    })

  return updatedDriver
    ? {
        driverExternalNumber: updatedDriver.driverExternalNumber ?? undefined,
        driverGDPRAccept: DriverGDPRAccept(updatedDriver.driverGDPRAccept),
        driverISWarrantyDriver: DriverISWarrantyCustomer(updatedDriver.driverISWarrantyDriver),
        driverAcceptsMarketing: DriverAcceptsMarketing(updatedDriver.driverAcceptsMarketing),
        driverFirstName: DriverFirstName(updatedDriver.driverFirstName),
        driverLastName: DriverLastName(updatedDriver.driverLastName),
        driverEmail: DriverEmail(updatedDriver.driverEmail),
        driverPhoneNumber: DriverPhoneNumber(updatedDriver.driverPhoneNumber),
        driverAddress: DriverAddress(updatedDriver.driverAddress),
        driverZipCode: DriverZipCode(updatedDriver.driverZipCode),
        driverAddressCity: DriverAddressCity(updatedDriver.driverAddressCity),
        driverHasCard: updatedDriver.driverHasCard
          ? DriverHasCard(updatedDriver.driverHasCard)
          : undefined,
        driverCardValidTo: DriverCardValidTo(updatedDriver.driverCardValidTo),
        driverCardNumber: CustomerCardNumber(updatedDriver.driverCardNumber),
        driverKeyNumber: DriverKeyNumber(updatedDriver.driverKeyNumber),
        driverNotesShared: DriverNotesShared(updatedDriver.driverNotesShared),
        driverNotes: DriverNotes(updatedDriver.driverNotes),
        driverCountry: DriverCountry(updatedDriver.driverCountry),
        createdAt: updatedDriver.createdAt,
        updatedAt: updatedDriver.updatedAt,
      }
    : undefined
}

export async function deleteDriver(driverEmail: DriverEmail): Promise<DriverEmail | undefined> {
  const [deletedDriver] = await db
    .delete(drivers)
    .where(eq(drivers.driverEmail, driverEmail))
    .returning({ deletedEmail: drivers.driverEmail })
  return deletedDriver ? DriverEmail(deletedDriver.deletedEmail) : undefined
}

//Customer Paginate
export async function getCustomersPaginate(
  search: string,
  limit = 10,
  page = 1,
  offset = Offset(0),
): Promise<CustomersPaginate> {
  const returnData = await db.transaction(async (tx) => {
    const condition = or(
      ilike(companycustomers.customerComapanyName, '%' + search + '%'),
      ilike(companycustomers.customerOrgNumber, '%' + search + '%'),
    )

    const [totalItems] = await tx
      .select({
        count: sql`count(*)`.mapWith(Number).as('count'),
      })
      .from(companycustomers)
      .where(condition)

    const customersList = await tx
      .select({
        customerOrgNumber: companycustomers.customerOrgNumber,
        customerComapanyName: companycustomers.customerComapanyName,
        customerAddress: companycustomers.companyAddress,
        customerZipCode: companycustomers.companyZipCode,
        customerAddressCity: companycustomers.companyAddressCity,
        customerCountry: companycustomers.companyCountry,
        createdAt: companycustomers.createdAt,
        updatedAt: companycustomers.updatedAt,
      })
      .from(companycustomers)
      .where(condition)
      .orderBy(desc(companycustomers.createdAt))
      .limit(limit || 10)
      .offset(offset || 0)
    return { totalItems, customersList }
  })

  const customersBrandedList = returnData.customersList.map((item) => {
    return {
      customerOrgNumber: CustomerOrgNumber(item.customerOrgNumber),
      customerCompanyName: CustomerCompanyName(item.customerComapanyName),
      companyAddress: item.customerAddress ? CompanyAddress(item.customerAddress) : undefined,
      companyAddressCity: item.customerAddressCity
        ? CompanyAddressCity(item.customerAddressCity)
        : undefined,
      companyCountry: item.customerCountry ? CompanyCountry(item.customerCountry) : undefined,
      companyZipCode: item.customerZipCode ? CompanyZipCode(item.customerZipCode) : undefined,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }
  })

  const totalPage = Math.ceil(returnData.totalItems.count / limit)

  return {
    totalItems: returnData.totalItems.count,
    totalPage,
    perPage: page,
    data: customersBrandedList,
  }
}

//Drivers Paginate
export async function getDriversPaginate(
  search: Search,
  limit = 10,
  page = 1,
  offset = Offset(0),
  isCompany?: CustomerOrgNumber,
): Promise<DriversPaginate> {
  const returnData = await db.transaction(async (tx) => {
    let condition

    if (isCompany) {
      condition = and(
        isCompany ? eq(drivers.customerOrgNumber, isCompany) : undefined,
        or(
          isEmail(search)
            ? ilike(drivers.driverEmail, '%' + search + '%')
            : (ilike(drivers.driverPhoneNumber, '%' + search + '%'),
              ilike(drivers.driverFirstName, '%' + search + '%'),
              ilike(drivers.driverLastName, '%' + search + '%')),
        ),
      )
    } else {
      condition = or(
        isEmail(search)
          ? ilike(drivers.driverEmail, '%' + search + '%')
          : (ilike(drivers.driverPhoneNumber, '%' + search + '%'),
            ilike(drivers.driverFirstName, '%' + search + '%'),
            ilike(drivers.driverLastName, '%' + search + '%'),
            ilike(drivers.customerOrgNumber, '%' + search + '%')),
      )
    }

    const [totalItems] = await tx
      .select({
        count: sql`count(*)`.mapWith(Number).as('count'),
      })
      .from(drivers)
      .where(condition)

    const driverList = await tx
      .select({
        driverFirstName: drivers.driverFirstName,
        driverLastName: drivers.driverLastName,
        driverEmail: drivers.driverEmail,
        driverPhoneNumber: drivers.driverPhoneNumber,
        driverAddress: drivers.driverAddress,
        createdAt: drivers.createdAt,
        updatedAt: drivers.updatedAt,
      })
      .from(drivers)
      .where(condition)
      .orderBy(desc(drivers.createdAt))
      .limit(limit || 10)
      .offset(offset || 0)

    return { driverList, totalItems }
  })

  const driversBrandedList = returnData.driverList.map((item) => {
    return {
      driverFirstName: DriverFirstName(item.driverFirstName),
      driverLastName: DriverLastName(item.driverLastName),
      driverEmail: DriverEmail(item.driverEmail),
      driverPhoneNumber: DriverPhoneNumber(item.driverPhoneNumber),
      driverAddress: DriverAddress(item.driverAddress),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }
  })

  const totalPage = Math.ceil(returnData.totalItems.count / limit)

  return {
    totalItems: returnData.totalItems.count,
    totalPage,
    perPage: page,
    data: driversBrandedList,
  }
}

//Get company by Id
export async function getCompanyById(orgNumber: CustomerOrgNumber): Promise<Company | undefined> {
  const [companyDetails] = await db
    .select({
      customerOrgNumber: companycustomers.customerOrgNumber,
      customerComapanyName: companycustomers.customerComapanyName,
      customerAddress: companycustomers.companyAddress,
      customerZipCode: companycustomers.companyZipCode,
      customerAddressCity: companycustomers.companyAddressCity,
      customerCountry: companycustomers.companyCountry,
      createdAt: companycustomers.createdAt,
      updatedAt: companycustomers.updatedAt,
    })
    .from(companycustomers)
    .where(eq(companycustomers.customerOrgNumber, orgNumber))

  return companyDetails
    ? {
        customerOrgNumber: CustomerOrgNumber(companyDetails.customerOrgNumber),
        customerCompanyName: CustomerCompanyName(companyDetails.customerComapanyName),
        companyAddress: companyDetails.customerAddress
          ? CompanyAddress(companyDetails.customerAddress)
          : undefined,
        companyAddressCity: companyDetails.customerAddressCity
          ? CompanyAddressCity(companyDetails.customerAddressCity)
          : undefined,
        companyCountry: companyDetails.customerCountry
          ? CompanyCountry(companyDetails.customerCountry)
          : undefined,
        companyZipCode: companyDetails.customerZipCode
          ? CompanyZipCode(companyDetails.customerZipCode)
          : undefined,
        createdAt: companyDetails.createdAt,
        updatedAt: companyDetails.updatedAt,
      }
    : undefined
}

export async function getDriverById(driverEmail: DriverEmail): Promise<Driver | undefined> {
  const [driverDetails] = await db
    .select({
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
      driverHasCard: drivers.driverHasCard,
      driverCardValidTo: drivers.driverCardValidTo,
      driverCardNumber: drivers.driverCardNumber,
      driverKeyNumber: drivers.driverKeyNumber,
      driverNotesShared: drivers.driverNotesShared,
      driverNotes: drivers.driverNotes,
      driverCountry: drivers.driverCountry,
      createdAt: drivers.createdAt,
      updatedAt: drivers.updatedAt,
    })
    .from(drivers)
    .where(eq(drivers.driverEmail, driverEmail))
  return driverDetails
    ? {
        driverExternalNumber: driverDetails.driverExternalNumber ?? undefined,
        driverGDPRAccept: driverDetails.driverGDPRAccept,
        driverISWarrantyDriver: driverDetails.driverISWarrantyDriver,
        driverAcceptsMarketing: driverDetails.driverAcceptsMarketing,
        driverFirstName: driverDetails.driverFirstName,
        driverLastName: driverDetails.driverLastName,
        driverEmail: driverDetails.driverEmail,
        driverPhoneNumber: driverDetails.driverPhoneNumber,
        driverAddress: driverDetails.driverAddress,
        driverZipCode: driverDetails.driverZipCode,
        driverAddressCity: driverDetails.driverAddressCity,
        driverHasCard: driverDetails.driverHasCard ?? undefined,
        driverCardValidTo: driverDetails.driverCardValidTo ?? undefined,
        driverCardNumber: driverDetails.driverCardNumber ?? undefined,
        driverKeyNumber: driverDetails.driverKeyNumber ?? undefined,
        driverNotesShared: driverDetails.driverNotesShared ?? undefined,
        driverNotes: driverDetails.driverNotes ?? undefined,
        driverCountry: driverDetails.driverCountry,
        createdAt: driverDetails.createdAt,
        updatedAt: driverDetails.updatedAt,
      }
    : undefined
}
