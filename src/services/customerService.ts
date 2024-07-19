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
  DriverID,
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

import { Either, errorHandling, isEmail, left, match, right } from '../utils/helper.js'

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
  driverID: DriverID
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
  driverID: DriverID
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
  Either<
    string,
    {
      company: Company
      driver: Driver
    }
  >
> {
  try {
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
      customerOrgNumber: existingCompany.customerOrgNumber,
      customerCompanyName: existingCompany.customerComapanyName,
      companyAddress: existingCompany.companyAddress ?? undefined,
      companyAddressCity: existingCompany.companyAddressCity ?? undefined,
      companyCountry: existingCompany.companyCountry ?? undefined,
      companyZipCode: existingCompany.companyZipCode ?? undefined,
      createdAt: existingCompany.createdAt,
      updatedAt: existingCompany.updatedAt,
    }
    const createdDriver: Either<string, Driver> = await createNewDriver(driver)
    return match(
      createdDriver,
      (driver: Driver) => {
        return right({ company: existingCompanyBranded, driver: driver })
      },
      (err) => {
        return left(err)
      },
    )
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function createNewDriver(driver: DriverCreate): Promise<Either<string, Driver>> {
  try {
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
      ? right({
          driverID: newDriver.driverID,
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
        })
      : left('no driver inserted')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function editCompanyDetails(
  company: CustomerCompanyCreate,
): Promise<Either<string, Company>> {
  try {
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
      ? right({
          customerOrgNumber: updatedCompany.customerOrgNumber,
          customerCompanyName: updatedCompany.customerComapanyName,
          companyAddress: updatedCompany.companyAddress ?? undefined,
          companyZipCode: updatedCompany.companyZipCode ?? undefined,
          companyAddressCity: updatedCompany.companyAddressCity ?? undefined,
          companyCountry: updatedCompany.companyCountry ?? undefined,
          createdAt: updatedCompany.createdAt,
          updatedAt: updatedCompany.updatedAt,
        })
      : left("couldn't edit company, maybe it doesn't exist")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteCompany(
  orgNumber: CustomerOrgNumber,
): Promise<Either<string, CustomerOrgNumber>> {
  try {
    const [deletedData] = await db
      .delete(companycustomers)
      .where(eq(companycustomers.customerOrgNumber, orgNumber))
      .returning({ deletedOrgNumber: companycustomers.customerOrgNumber })
    return deletedData
      ? right(CustomerOrgNumber(deletedData.deletedOrgNumber))
      : left("couldn't find company")
  } catch (e) {
    return left(errorHandling(e))
  }
}

//drivers
export async function editDriverDetails(driver: DriverCreate): Promise<Either<string, Driver>> {
  try {
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
      .returning()

    return updatedDriver
      ? right({
          driverID: updatedDriver.driverID,
          driverExternalNumber: updatedDriver.driverExternalNumber ?? undefined,
          driverGDPRAccept: updatedDriver.driverGDPRAccept,
          driverISWarrantyDriver: updatedDriver.driverISWarrantyDriver,
          driverAcceptsMarketing: updatedDriver.driverAcceptsMarketing,
          driverFirstName: updatedDriver.driverFirstName,
          driverLastName: updatedDriver.driverLastName,
          driverEmail: updatedDriver.driverEmail,
          driverPhoneNumber: updatedDriver.driverPhoneNumber,
          driverAddress: updatedDriver.driverAddress,
          driverZipCode: updatedDriver.driverZipCode,
          driverAddressCity: updatedDriver.driverAddressCity,
          driverHasCard: updatedDriver.driverHasCard ?? undefined,
          driverCardValidTo: updatedDriver.driverCardValidTo ?? undefined,
          driverCardNumber: updatedDriver.driverCardNumber ?? undefined,
          driverKeyNumber: updatedDriver.driverKeyNumber ?? undefined,
          driverNotesShared: updatedDriver.driverNotesShared ?? undefined,
          driverNotes: updatedDriver.driverNotes ?? undefined,
          driverCountry: updatedDriver.driverCountry,
          createdAt: updatedDriver.createdAt,
          updatedAt: updatedDriver.updatedAt,
        })
      : left('no driver found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteDriver(driverID: DriverID): Promise<Either<string, DriverID>> {
  try {
    const [deletedDriver] = await db
      .delete(drivers)
      .where(eq(drivers.driverID, driverID))
      .returning({ driverID: drivers.driverID })
    return deletedDriver ? right(deletedDriver.driverID) : left('driver not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

//Customer Paginate
export async function getCustomersPaginate(
  search: string,
  limit = 10,
  page = 1,
  offset = Offset(0),
): Promise<Either<string, CustomersPaginate>> {
  try {
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

    return right({
      totalItems: returnData.totalItems.count,
      totalPage,
      perPage: page,
      data: customersBrandedList,
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}

//Drivers Paginate
export async function getDriversPaginate(
  search: Search,
  limit = 10,
  page = 1,
  offset = Offset(0),
  isCompany?: CustomerOrgNumber,
): Promise<Either<string, DriversPaginate>> {
  try {
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
          driverID: drivers.driverID,
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

    const totalPage = Math.ceil(returnData.totalItems.count / limit)

    return right({
      totalItems: returnData.totalItems.count,
      totalPage,
      perPage: page,
      data: returnData.driverList,
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}

//Get company by Id
export async function getCompanyById(
  orgNumber: CustomerOrgNumber,
): Promise<Either<string, Company>> {
  try {
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
      ? right({
          customerOrgNumber: companyDetails.customerOrgNumber,
          customerCompanyName: companyDetails.customerComapanyName,
          companyAddress: companyDetails.customerAddress ?? undefined,
          companyAddressCity: companyDetails.customerAddressCity ?? undefined,
          companyCountry: companyDetails.customerCountry ?? undefined,
          companyZipCode: companyDetails.customerZipCode ?? undefined,
          createdAt: companyDetails.createdAt,
          updatedAt: companyDetails.updatedAt,
        })
      : left("Can't find company")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getDriverById(driverID: DriverID): Promise<Either<string, Driver>> {
  try {
    const [driverDetails] = await db
      .select({
        driverID: drivers.driverID,
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
      .where(eq(drivers.driverID, driverID))
    return driverDetails
      ? right({
          driverID: driverDetails.driverID,
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
        })
      : left("can't find driver")
  } catch (e) {
    return left(errorHandling(e))
  }
}
