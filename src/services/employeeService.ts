import {
  EmployeeComment,
  EmployeeHourlyRate,
  EmployeeHourlyRateCurrency,
  EmployeeHourlyRateDinero,
  EmployeeID,
  EmployeePersonalNumber,
  EmployeePin,
  EmploymentNumber,
  ShortUserName,
  Signature,
  StoreID,
  employeeStore,
  employees,
} from '../schema/schema.js'

import Dinero from 'dinero.js'

import { db } from '../config/db-connect.js'

import { Limit, Offset, Page, ResultCount, Search } from '../plugins/pagination.js'

import { and, eq, ilike, or, sql } from 'drizzle-orm'

type EmployeeNoRate = {
  employeeID?: EmployeeID
  shortUserName: ShortUserName
  employmentNumber: EmploymentNumber
  employeePersonalNumber: EmployeePersonalNumber
  signature: Signature
  employeePin?: EmployeePin
  employeeComment?: EmployeeComment
}

export type CreateEmployee = EmployeeNoRate & {
  employeeHourlyRateCurrency?: EmployeeHourlyRateCurrency
  employeeHourlyRate?: EmployeeHourlyRate
}

export type Employee = EmployeeNoRate & {
  employeeHourlyRateDinero?: EmployeeHourlyRateDinero
  storeIDs: StoreID[]
  employeeID: EmployeeID
  createdAt: Date
  updatedAt: Date
}

export type EmployeePaginated = {
  totalEmployees: ResultCount
  totalPage: Page
  perPage: Limit
  employees: (EmployeeNoRate & {
    employeeHourlyRateDinero?: EmployeeHourlyRateDinero
  })[]
}

function dineroDBReturn(
  amount: EmployeeHourlyRate | null,
  currency: EmployeeHourlyRateCurrency | null,
): EmployeeHourlyRateDinero | undefined {
  if (currency != null && amount != null) {
    return EmployeeHourlyRateDinero(
      Dinero({
        amount: amount,
        currency: currency,
      }),
    )
  }
  return undefined
}

export async function putEmployee(
  stores: StoreID[],
  employee: CreateEmployee,
  employeeID?: EmployeeID,
): Promise<Employee | undefined> {
  if (stores.length < 1) {
    return undefined
  }
  const createdEmployeeWithStores = await db.transaction(async (tx) => {
    const [createdEmployee] = employeeID
      ? await tx
          .update(employees)
          .set(employee)
          .where(eq(employees.employeeID, employeeID))
          .returning()
      : await db.insert(employees).values(employee).returning()

    const employeeIDStoreID = stores.map((store) => {
      return { storeID: store, employeeID: createdEmployee.employeeID }
    })

    const employeeStores = await tx
      .insert(employeeStore)
      .values(employeeIDStoreID)
      .onConflictDoNothing()
      .returning({ storeID: employeeStore.storeID })

    const createdEmployeeWithNull = {
      employeeID: createdEmployee.employeeID,
      shortUserName: createdEmployee.shortUserName,
      employmentNumber: createdEmployee.employmentNumber,
      employeePersonalNumber: createdEmployee.employeePersonalNumber,
      signature: createdEmployee.signature,
      employeeHourlyRateDinero: dineroDBReturn(
        createdEmployee.employeeHourlyRate,
        createdEmployee.employeeHourlyRateCurrency,
      ),
      employeePin: createdEmployee.employeePin ?? undefined,
      employeeComment: createdEmployee.employeeComment ?? undefined,
      createdAt: createdEmployee.createdAt,
      updatedAt: createdEmployee.updatedAt,
    }
    return { ...createdEmployeeWithNull, storeIDs: employeeStores.map((row) => row.storeID) }
  })
  return createdEmployeeWithStores
}

export async function getEmployee(employeeID: EmployeeID): Promise<Employee | undefined> {
  const fetchedEmployeeWithStores = await db.transaction(async (tx) => {
    const [fetchedEmployee] = await tx
      .select()
      .from(employees)
      .where(eq(employees.employeeID, employeeID))

    const employeeStores = await tx
      .select()
      .from(employeeStore)
      .where(eq(employeeStore.employeeID, employeeID))

    const fetchedEmployeeWithNull = {
      employeeID: fetchedEmployee.employeeID,
      shortUserName: fetchedEmployee.shortUserName,
      employmentNumber: fetchedEmployee.employmentNumber,
      employeePersonalNumber: fetchedEmployee.employeePersonalNumber,
      signature: fetchedEmployee.signature,
      employeeHourlyRate: fetchedEmployee.employeeHourlyRate ?? undefined,
      employeePin: fetchedEmployee.employeePin ?? undefined,
      employeeComment: fetchedEmployee.employeeComment ?? undefined,
      createdAt: fetchedEmployee.createdAt,
      updatedAt: fetchedEmployee.updatedAt,
    }
    return { ...fetchedEmployeeWithNull, storeIDs: employeeStores.map((row) => row.storeID) }
  })
  return fetchedEmployeeWithStores
}

export async function deleteEmployee(employeeID: EmployeeID): Promise<Employee | undefined> {
  const deletedEmployeeWithStores = await db.transaction(async (tx) => {
    const employeeStores = await tx
      .delete(employeeStore)
      .where(eq(employeeStore.employeeID, employeeID))
      .returning()

    const [deletedEmployee] = await tx
      .delete(employees)
      .where(eq(employees.employeeID, employeeID))
      .returning()

    const deletedEmployeeWithNull = {
      employeeID: deletedEmployee.employeeID,
      shortUserName: deletedEmployee.shortUserName,
      employmentNumber: deletedEmployee.employmentNumber,
      employeePersonalNumber: deletedEmployee.employeePersonalNumber,
      signature: deletedEmployee.signature,
      employeeHourlyRate: deletedEmployee.employeeHourlyRate ?? undefined,
      employeePin: deletedEmployee.employeePin ?? undefined,
      employeeComment: deletedEmployee.employeeComment ?? undefined,
      createdAt: deletedEmployee.createdAt,
      updatedAt: deletedEmployee.updatedAt,
    }
    return { ...deletedEmployeeWithNull, storeIDs: employeeStores.map((row) => row.storeID) }
  })
  return deletedEmployeeWithStores
}

export async function getEmployeesPaginate(
  store: StoreID,
  search: Search,
  limit = Limit(10),
  page = Page(1),
  offset = Offset(0),
): Promise<EmployeePaginated | undefined> {
  const { totalEmployees, listedEmployeeWithNull } = await db.transaction(async (tx) => {
    const condition = and(
      or(
        ilike(employees.shortUserName, '%' + search + '%'),
        ilike(employees.employeePersonalNumber, '%' + search + '%'),
        ilike(employees.signature, '%' + search + '%'),
      ),
      eq(employeeStore.storeID, store),
    )
    const [totalEmployees] = await tx
      .select({
        count: sql`count(*)`.mapWith(Number).as('count'),
      })
      .from(employees)
      .innerJoin(employeeStore, eq(employeeStore.employeeID, employees.employeeID))
      .where(condition)
    const employeesList = await tx
      .select()
      .from(employees)
      .innerJoin(employeeStore, eq(employeeStore.employeeID, employees.employeeID))
      .where(condition)
      .limit(limit || 10)
      .offset(offset || 0)
    const listedEmployeeWithNull = employeesList.map((employee) => {
      return {
        employeeID: employee.employees.employeeID,
        shortUserName: employee.employees.shortUserName,
        employmentNumber: employee.employees.employmentNumber,
        employeePersonalNumber: employee.employees.employeePersonalNumber,
        signature: employee.employees.signature,
        employeeHourlyRateDinero: dineroDBReturn(
          employee.employees.employeeHourlyRate,
          employee.employees.employeeHourlyRateCurrency,
        ),
        employeePin: employee.employees.employeePin ?? undefined,
        employeeComment: employee.employees.employeeComment ?? undefined,
        createdAt: employee.employees.createdAt,
        updatedAt: employee.employees.updatedAt,
      }
    })

    return { totalEmployees, listedEmployeeWithNull }
  })
  const totalPage = Math.ceil(totalEmployees.count / limit)

  return {
    totalEmployees: ResultCount(totalEmployees.count),
    totalPage: Page(totalPage),
    perPage: Limit(page),
    employees: listedEmployeeWithNull,
  }
}