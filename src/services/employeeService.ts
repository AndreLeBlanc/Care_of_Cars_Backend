import { Either, errorHandling, left, right } from '../utils/helper.js'

import {
  Absence,
  CheckedInStatus,
  EmployeeCheckIn,
  EmployeeCheckOut,
  EmployeeComment,
  EmployeeHourlyRate,
  EmployeeHourlyRateCurrency,
  EmployeeHourlyRateDinero,
  EmployeeID,
  EmployeePersonalNumber,
  EmployeePin,
  EmployeeSpceialHoursID,
  EmploymentNumber,
  FridayBreak,
  FridayStart,
  FridayStop,
  GlobalQualID,
  LocalQualID,
  MondayBreak,
  MondayStart,
  MondayStop,
  SaturdayBreak,
  SaturdayStart,
  SaturdayStop,
  ShortUserName,
  Signature,
  StoreID,
  SundayBreak,
  SundayStart,
  SundayStop,
  ThursdayBreak,
  ThursdayStart,
  ThursdayStop,
  TuesdayBreak,
  TuesdayStart,
  TuesdayStop,
  WednesdayBreak,
  WednesdayStart,
  WednesdayStop,
  WorkTime,
  WorkTimeDescription,
  employeeSpecialHours,
  employeeStore,
  employeeWorkingHours,
  employees,
  userGlobalQualifications,
} from '../schema/schema.js'

import Dinero from 'dinero.js'

import { db } from '../config/db-connect.js'

import { Limit, Offset, Page, ResultCount, Search } from '../plugins/pagination.js'

import { and, eq, gte, ilike, lte, or, sql } from 'drizzle-orm'

export type WorkingHours = {
  mondayStart?: MondayStart
  mondayStop?: MondayStop
  mondayBreak?: MondayBreak
  tuesdayStart?: TuesdayStart
  tuesdayStop?: TuesdayStop
  tuesdayBreak?: TuesdayBreak
  wednesdayStart?: WednesdayStart
  wednesdayStop?: WednesdayStop
  wednesdayBreak?: WednesdayBreak
  thursdayStart?: ThursdayStart
  thursdayStop?: ThursdayStop
  thursdayBreak?: ThursdayBreak
  fridayStart?: FridayStart
  fridayStop?: FridayStop
  fridayBreak?: FridayBreak
  saturdayStart?: SaturdayStart
  saturdayStop?: SaturdayStop
  saturdayBreak?: SaturdayBreak
  sundayStart?: SundayStart
  sundayStop?: SundayStop
  sundayBreak?: SundayBreak
}

export type SpecialWorkingHours = {
  employeeSpceialHoursID: EmployeeSpceialHoursID
  employeeID: EmployeeID
  storeID: StoreID
  start: WorkTime
  end: WorkTime
  description?: WorkTimeDescription
  absence: Absence
}

export type workingHoursCreated = WorkingHours & {
  employeeID: EmployeeID
  storeID: StoreID
  createdAt: Date
  updatedAt: Date
}

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
  employeeCheckIn?: EmployeeCheckIn
  employeeCheckOut?: EmployeeCheckOut
  createdAt: Date
  updatedAt: Date
}

export type EmployeePaginated = {
  totalEmployees: ResultCount
  totalPage: Page
  perPage: Limit
  employees: (EmployeeNoRate & {
    employeeHourlyRateDinero?: EmployeeHourlyRateDinero
    employeeCheckIn?: EmployeeCheckIn
    employeeCheckOut?: EmployeeCheckOut
  })[]
}

export type CheckInTimes = {
  employeeID: EmployeeID
  employeeCheckIn?: EmployeeCheckIn
  employeeCheckOut?: EmployeeCheckOut
}

export type ListCheckInStatus = {
  employeeID: EmployeeID
  time: EmployeeCheckIn | EmployeeCheckOut | undefined
  status: CheckedInStatus
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

export async function setEmployeeWorkingHours(
  employee: EmployeeID,
  storeID: StoreID,
  workingHours: WorkingHours,
): Promise<Either<string, workingHoursCreated>> {
  try {
    const employeeHours = await db.transaction(async (tx) => {
      const [employeeHasStore] = await tx
        .select({ count: sql`count(*)`.mapWith(Number) })
        .from(employeeStore)
        .where(and(eq(employeeStore.storeID, storeID), eq(employeeStore.employeeID, employee)))

      if (employeeHasStore.count === 0) {
        return left('Employee is not associated with the store')
      }

      const [updatedWorkingHours] = await tx
        .insert(employeeWorkingHours)
        .values({
          storeID: storeID,
          employeeID: employee,
          ...workingHours,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [employeeWorkingHours.storeID, employeeWorkingHours.employeeID],
          set: {
            storeID: storeID,
            employeeID: employee,
            ...workingHours,
            updatedAt: new Date(),
          },
        })
        .returning()
      return updatedWorkingHours
        ? right({
            employeeID: updatedWorkingHours.employeeID,
            storeID: updatedWorkingHours.storeID,
            mondayStart: updatedWorkingHours.mondayStart ?? undefined,
            mondayStop: updatedWorkingHours.mondayStop ?? undefined,
            mondayBreak: updatedWorkingHours.mondayBreak ?? undefined,
            tuesdayStart: updatedWorkingHours.tuesdayStart ?? undefined,
            tuesdayStop: updatedWorkingHours.tuesdayStop ?? undefined,
            tuesdayBreak: updatedWorkingHours.tuesdayBreak ?? undefined,
            wednesdayStart: updatedWorkingHours.wednesdayStart ?? undefined,
            wednesdayStop: updatedWorkingHours.wednesdayStop ?? undefined,
            wednesdayBreak: updatedWorkingHours.wednesdayBreak ?? undefined,
            thursdayStart: updatedWorkingHours.thursdayStart ?? undefined,
            thursdayStop: updatedWorkingHours.thursdayStop ?? undefined,
            thursdayBreak: updatedWorkingHours.thursdayBreak ?? undefined,
            fridayStart: updatedWorkingHours.fridayStart ?? undefined,
            fridayStop: updatedWorkingHours.fridayStop ?? undefined,
            fridayBreak: updatedWorkingHours.fridayBreak ?? undefined,
            saturdayStart: updatedWorkingHours.saturdayStart ?? undefined,
            saturdayStop: updatedWorkingHours.saturdayStop ?? undefined,
            saturdayBreak: updatedWorkingHours.saturdayBreak ?? undefined,
            sundayStart: updatedWorkingHours.sundayStart ?? undefined,
            sundayStop: updatedWorkingHours.sundayStop ?? undefined,
            sundayBreak: updatedWorkingHours.sundayBreak ?? undefined,
            createdAt: updatedWorkingHours.createdAt,
            updatedAt: updatedWorkingHours.updatedAt,
          })
        : left("couldn't update or create working hours")
    })
    return employeeHours
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function setEmployeeSpecialWorkingHours(
  workingHours: SpecialWorkingHours,
): Promise<Either<string, SpecialWorkingHours>> {
  try {
    const employeeHours = await db.transaction(async (tx) => {
      const [employeeHasStore] = await tx
        .select({ count: sql`count(*)`.mapWith(Number) })
        .from(employeeStore)
        .where(
          and(
            eq(employeeStore.storeID, workingHours.storeID),
            eq(employeeStore.employeeID, workingHours.employeeID),
          ),
        )

      if (employeeHasStore.count === 0) {
        return left('Employee is not associated with the store')
      }

      const [updatedWorkingHours] = await tx
        .insert(employeeSpecialHours)
        .values(workingHours)
        .onConflictDoUpdate({
          target: [employeeSpecialHours.storeID, employeeSpecialHours.employeeID],
          set: workingHours,
        })
        .returning()
      return updatedWorkingHours
        ? right({
            employeeSpceialHoursID: updatedWorkingHours.employeeSpceialHoursID,
            employeeID: updatedWorkingHours.employeeID,
            storeID: updatedWorkingHours.storeID,
            start: updatedWorkingHours.start,
            end: updatedWorkingHours.end,
            description: updatedWorkingHours.description ?? undefined,
            absence: updatedWorkingHours.absence,
          })
        : left("couldn't update or create special working hours")
    })
    return employeeHours
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getEmployeeWorkingHours(
  employee: EmployeeID,
  storeID: StoreID,
): Promise<Either<string, workingHoursCreated>> {
  try {
    const [fetchedWorkingHours] = await db
      .select()
      .from(employeeWorkingHours)
      .where(
        and(
          eq(employeeWorkingHours.storeID, storeID),
          eq(employeeWorkingHours.employeeID, employee),
        ),
      )
    return fetchedWorkingHours
      ? right({
          employeeID: fetchedWorkingHours.employeeID,
          storeID: fetchedWorkingHours.storeID,
          mondayStart: fetchedWorkingHours.mondayStart ?? undefined,
          mondayStop: fetchedWorkingHours.mondayStop ?? undefined,
          mondayBreak: fetchedWorkingHours.mondayBreak ?? undefined,
          tuesdayStart: fetchedWorkingHours.tuesdayStart ?? undefined,
          tuesdayStop: fetchedWorkingHours.tuesdayStop ?? undefined,
          tuesdayBreak: fetchedWorkingHours.tuesdayBreak ?? undefined,
          wednesdayStart: fetchedWorkingHours.wednesdayStart ?? undefined,
          wednesdayStop: fetchedWorkingHours.wednesdayStop ?? undefined,
          wednesdayBreak: fetchedWorkingHours.wednesdayBreak ?? undefined,
          thursdayStart: fetchedWorkingHours.thursdayStart ?? undefined,
          thursdayStop: fetchedWorkingHours.thursdayStop ?? undefined,
          thursdayBreak: fetchedWorkingHours.thursdayBreak ?? undefined,
          fridayStart: fetchedWorkingHours.fridayStart ?? undefined,
          fridayStop: fetchedWorkingHours.fridayStop ?? undefined,
          fridayBreak: fetchedWorkingHours.fridayBreak ?? undefined,
          saturdayStart: fetchedWorkingHours.saturdayStart ?? undefined,
          saturdayStop: fetchedWorkingHours.saturdayStop ?? undefined,
          saturdayBreak: fetchedWorkingHours.saturdayBreak ?? undefined,
          sundayStart: fetchedWorkingHours.sundayStart ?? undefined,
          sundayStop: fetchedWorkingHours.sundayStop ?? undefined,
          sundayBreak: fetchedWorkingHours.sundayBreak ?? undefined,
          createdAt: fetchedWorkingHours.createdAt,
          updatedAt: fetchedWorkingHours.updatedAt,
        })
      : left("couldn't fetch working hours")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getEmployeeSpecialWorkingHours(
  employeeSpceialHoursID: EmployeeSpceialHoursID,
): Promise<Either<string, SpecialWorkingHours>> {
  try {
    const [fetchedWorkingHours] = await db
      .select()
      .from(employeeSpecialHours)
      .where(eq(employeeSpecialHours.employeeSpceialHoursID, employeeSpceialHoursID))
    return fetchedWorkingHours
      ? right({
          employeeSpceialHoursID: fetchedWorkingHours.employeeSpceialHoursID,
          employeeID: fetchedWorkingHours.employeeID,
          storeID: fetchedWorkingHours.storeID,
          start: fetchedWorkingHours.start,
          end: fetchedWorkingHours.end,
          description: fetchedWorkingHours.description ?? undefined,
          absence: fetchedWorkingHours.absence,
        })
      : left("couldn't fetch special working hours")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteEmployeeSpecialWorkingHours(
  employeeSpceialHoursID: EmployeeSpceialHoursID,
): Promise<Either<string, SpecialWorkingHours>> {
  try {
    const [deletedWorkingHours] = await db
      .delete(employeeSpecialHours)
      .where(eq(employeeSpecialHours.employeeSpceialHoursID, employeeSpceialHoursID))
      .returning()
    return deletedWorkingHours
      ? right({
          employeeSpceialHoursID: deletedWorkingHours.employeeSpceialHoursID,
          employeeID: deletedWorkingHours.employeeID,
          storeID: deletedWorkingHours.storeID,
          start: deletedWorkingHours.start,
          end: deletedWorkingHours.end,
          description: deletedWorkingHours.description ?? undefined,
          absence: deletedWorkingHours.absence,
        })
      : left("couldn't delete special working hours")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteEmployeeWorkingHours(
  employee: EmployeeID,
  storeID: StoreID,
): Promise<Either<string, workingHoursCreated>> {
  try {
    const [deletedWorkingHours] = await db
      .delete(employeeWorkingHours)
      .where(
        and(
          eq(employeeWorkingHours.storeID, storeID),
          eq(employeeWorkingHours.employeeID, employee),
        ),
      )
      .returning()
    return deletedWorkingHours
      ? right({
          employeeID: deletedWorkingHours.employeeID,
          storeID: deletedWorkingHours.storeID,
          mondayStart: deletedWorkingHours.mondayStart ?? undefined,
          mondayStop: deletedWorkingHours.mondayStop ?? undefined,
          mondayBreak: deletedWorkingHours.mondayBreak ?? undefined,
          tuesdayStart: deletedWorkingHours.tuesdayStart ?? undefined,
          tuesdayStop: deletedWorkingHours.tuesdayStop ?? undefined,
          tuesdayBreak: deletedWorkingHours.tuesdayBreak ?? undefined,
          wednesdayStart: deletedWorkingHours.wednesdayStart ?? undefined,
          wednesdayStop: deletedWorkingHours.wednesdayStop ?? undefined,
          wednesdayBreak: deletedWorkingHours.wednesdayBreak ?? undefined,
          thursdayStart: deletedWorkingHours.thursdayStart ?? undefined,
          thursdayStop: deletedWorkingHours.thursdayStop ?? undefined,
          thursdayBreak: deletedWorkingHours.thursdayBreak ?? undefined,
          fridayStart: deletedWorkingHours.fridayStart ?? undefined,
          fridayStop: deletedWorkingHours.fridayStop ?? undefined,
          fridayBreak: deletedWorkingHours.fridayBreak ?? undefined,
          saturdayStart: deletedWorkingHours.saturdayStart ?? undefined,
          saturdayStop: deletedWorkingHours.saturdayStop ?? undefined,
          saturdayBreak: deletedWorkingHours.saturdayBreak ?? undefined,
          sundayStart: deletedWorkingHours.sundayStart ?? undefined,
          sundayStop: deletedWorkingHours.sundayStop ?? undefined,
          sundayBreak: deletedWorkingHours.sundayBreak ?? undefined,
          createdAt: deletedWorkingHours.createdAt,
          updatedAt: deletedWorkingHours.updatedAt,
        })
      : left("couldn't delete working hours")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function listWorkingEmployees(
  storeID: StoreID,
  day: WorkTime,
  quals: GlobalQualID[],
  localQuals: LocalQualID[],
) {
  try {
    const createdEmployeeWithStores = await db.transaction(async (tx) => {
      let employeeTimes
      if (quals.length > 0) {
        employeeTimes = await await tx
          .select()
          .from(employeeSpecialHours)
          .innerJoin(
            userGlobalQualifications,
            eq(userGlobalQualifications.employeeID, employeeSpecialHours.employeeID),
          )
          .where(
            and(
              eq(employeeSpecialHours.storeID, storeID),
              gte(employeeSpecialHours.start, day),
              lte(employeeSpecialHours.end, day),
            ),
          )

        tx.execute(
          sql`  SELECT .*
        FROM employeeSpecialHours e
        JOIN userGlobalQualifications q ON e.employeeID = q.employeeID
        WHERE e.storeID = ${storeID}
          AND e.start >= ${day}
          AND e."end" <= ${day}
          AND q.globalQualID = ANY(${quals}::int[])`,
        )
      }

      if (localQuals.length > 0) {
        employeeTimes = await tx.execute(
          sql`  SELECT .*
        FROM employeeSpecialHours e
        JOIN userLocalQualifications q ON e.employeeID = q.employeeID
        WHERE e.storeID = ${storeID}
          AND e.start >= ${day}
          AND e."end" <= ${day}
          AND q.LocalQualID = ANY(${localQuals}::int[])`,
        )
      }

      if (quals.length === 0 && localQuals.length === 0) {
        employeeTimes = tx
          .select()
          .from(employeeSpecialHours)
          .where(
            and(
              eq(employeeSpecialHours.storeID, storeID),
              gte(employeeSpecialHours.start, day),
              lte(employeeSpecialHours.end, day),
            ),
          )
      }

      console.log(employeeTimes)
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function listCheckedinStatus(
  storeID: StoreID,
): Promise<ListCheckInStatus[] | undefined> {
  const employeesList = await db
    .select({
      employeeID: employees.employeeID,
      employeeCheckedIn: employees.employeeCheckedIn,
      employeeCheckedOut: employees.employeeCheckedOut,
    })
    .from(employees)
    .innerJoin(employeeStore, eq(employeeStore.employeeID, employees.employeeID))
    .where(eq(employeeStore.storeID, storeID))

  function toListCheckinStatus(checkedin: Date | null, checkedout: Date | null) {
    if (checkedin == null) return { time: undefined, status: 'CheckedOut' as CheckedInStatus }
    if (checkedout == null || checkedout < checkedin)
      return {
        status: 'CheckedIn' as CheckedInStatus,
        time: EmployeeCheckIn(checkedin.toISOString()),
      }
    return {
      status: 'CheckedOut' as CheckedInStatus,
      time: EmployeeCheckOut(checkedout.toISOString()),
    }
  }
  const employeeCheckinStatus = employeesList.map((employee) => {
    const status = toListCheckinStatus(employee.employeeCheckedIn, employee.employeeCheckedOut)
    return {
      employeeID: employee.employeeID,
      time: status?.time,
      status: status.status,
    }
  })
  console.log(employeeCheckinStatus)
  return employeeCheckinStatus
}

export async function checkInCheckOut(
  employeeID: EmployeeID,
  checkIn: CheckedInStatus,
): Promise<CheckInTimes | undefined> {
  const timestamp: Date = new Date()
  if (timestamp != null) {
    switch (checkIn) {
      case 'CheckedIn':
        const [setCheckinTime] = await db
          .update(employees)
          .set({ employeeCheckedIn: timestamp })
          .where(eq(employees.employeeID, employeeID))
          .returning({
            employeeID: employees.employeeID,
            employeeCheckedIn: employees.employeeCheckedIn ?? undefined,
            employeeCheckedOut: employees.employeeCheckedOut ?? undefined,
          })

        return {
          employeeID: setCheckinTime.employeeID,
          employeeCheckIn: setCheckinTime.employeeCheckedIn
            ? EmployeeCheckIn(setCheckinTime.employeeCheckedIn.toISOString())
            : undefined,
          employeeCheckOut: setCheckinTime.employeeCheckedOut
            ? EmployeeCheckOut(setCheckinTime.employeeCheckedOut.toISOString())
            : undefined,
        }
      case 'CheckedOut':
        const [setCheckOutTime] = await db
          .update(employees)
          .set({ employeeCheckedOut: timestamp })
          .where(eq(employees.employeeID, employeeID))
          .returning({
            employeeID: employees.employeeID,
            employeeCheckedIn: employees.employeeCheckedIn,
            employeeCheckedOut: employees.employeeCheckedOut,
          })
        return {
          employeeID: setCheckOutTime.employeeID,
          employeeCheckIn: setCheckOutTime.employeeCheckedIn
            ? EmployeeCheckIn(setCheckOutTime.employeeCheckedIn.toISOString())
            : undefined,
          employeeCheckOut: setCheckOutTime.employeeCheckedOut
            ? EmployeeCheckOut(setCheckOutTime.employeeCheckedOut.toISOString())
            : undefined,
        }
    }
  }
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
    if (fetchedEmployee == null) return undefined

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
      employeeCheckedIn: employees.employeeCheckedIn
        ? undefined
        : EmployeeCheckIn(employees.employeeCheckedIn),
      employeeCheckedOut: employees.employeeCheckedOut
        ? undefined
        : EmployeeCheckOut(employees.employeeCheckedOut),
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
        employeeCheckIn: employee.employees.employeeCheckedIn
          ? EmployeeCheckIn(employee.employees.employeeCheckedIn.toISOString())
          : undefined,
        employeeCheckOut: employee.employees.employeeCheckedOut
          ? EmployeeCheckOut(employee.employees.employeeCheckedOut.toISOString())
          : undefined,
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
