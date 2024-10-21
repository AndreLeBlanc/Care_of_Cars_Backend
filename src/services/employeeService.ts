import { Either, errorHandling, jsonAggBuildObject, left, right } from '../utils/helper.js'

import {
  Absence,
  CheckedInStatus,
  EmployeeActive,
  EmployeeCheckIn,
  EmployeeCheckOut,
  EmployeeCheckinStatus,
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
  IsSuperAdmin,
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
  UserEmail,
  UserFirstName,
  UserID,
  UserLastName,
  WednesdayBreak,
  WednesdayStart,
  WednesdayStop,
  WorkDay1,
  WorkDay2,
  WorkDay3,
  WorkDay4,
  WorkDay5,
  WorkDuration,
  WorkTime,
  WorkTimeDescription,
  employeeCheckin,
  employeeGlobalQualifications,
  employeeLocalQualifications,
  employeeSpecialHours,
  employeeStore,
  employeeWorkingHours,
  employees,
  orderListing,
  stores,
  users,
} from '../schema/schema.js'

import Dinero, { Currency } from 'dinero.js'

import { db } from '../config/db-connect.js'

import { Limit, Offset, Page, ResultCount, Search } from '../plugins/pagination.js'

import { and, desc, eq, gte, ilike, lte, or, sql } from 'drizzle-orm'

import { StoreIDName } from './storeService.js'

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
  employeeSpecialHoursID?: EmployeeSpceialHoursID
  employeeID: EmployeeID
  storeID: StoreID
  start: WorkTime
  end: WorkTime
  description?: WorkTimeDescription
  absence: Absence
}

export type WorkingHoursIDTotal = {
  employeeInfo: SpecialWorkingHours[]
  totalTimes: {
    monday: WorkDuration
    tuesday: WorkDuration
    wednesday: WorkDuration
    thursday: WorkDuration
    friday: WorkDuration
    saturday: WorkDuration
    sunday: WorkDuration
  }
}

export type WorkingHoursNull = {
  storeID: StoreID
  employeeID: EmployeeID
  mondayStart?: MondayStart | null
  mondayStop?: MondayStop | null
  mondayBreak?: MondayBreak | null
  tuesdayStart?: TuesdayStart | null
  tuesdayStop?: TuesdayStop | null
  tuesdayBreak?: TuesdayBreak | null
  wednesdayStart?: WednesdayStart | null
  wednesdayStop?: WednesdayStop | null
  wednesdayBreak?: WednesdayBreak | null
  thursdayStart?: ThursdayStart | null
  thursdayStop?: ThursdayStop | null
  thursdayBreak?: ThursdayBreak | null
  fridayStart?: FridayStart | null
  fridayStop?: FridayStop | null
  fridayBreak?: FridayBreak | null
  saturdayStart?: SaturdayStart | null
  saturdayStop?: SaturdayStop | null
  saturdayBreak?: SaturdayBreak | null
  sundayStart?: SundayStart | null
  sundayStop?: SundayStop | null
  sundayBreak?: SundayBreak | null
}

export type WorkingHoursCreated = WorkingHours & {
  employeeID: EmployeeID
  storeID: StoreID
  createdAt: Date
  updatedAt: Date
}

export type GetEmployee = {
  userID: UserID
  firstName: UserFirstName
  lastName: UserLastName
  email: UserEmail
  isSuperAdmin: IsSuperAdmin
  employeeID?: EmployeeID
  shortUserName?: ShortUserName
  employmentNumber?: EmploymentNumber
  employeePersonalNumber?: EmployeePersonalNumber
  signature?: Signature
  employeeHourlyRate?: EmployeeHourlyRateDinero
  employeePin?: EmployeePin
  employeeActive?: EmployeeActive
  employeeComment?: EmployeeComment
  employeeCheckedIn?: EmployeeCheckIn
  employeeCheckedOut?: EmployeeCheckOut
  storeIDs: StoreIDName[]
}

type EmployeeNoRate = {
  userID: UserID
  employeeID?: EmployeeID
  shortUserName: ShortUserName
  employmentNumber: EmploymentNumber
  employeePersonalNumber: EmployeePersonalNumber
  signature: Signature
  employeePin: EmployeePin
  employeeActive: EmployeeActive
  employeeComment?: EmployeeComment
}

export type CreateEmployee = EmployeeNoRate & {
  employeeHourlyRateCurrency?: EmployeeHourlyRateCurrency
  employeeHourlyRate?: EmployeeHourlyRate
}

export type Employee = EmployeeNoRate & {
  employeeHourlyRateDinero?: EmployeeHourlyRateDinero
  storeIDs: StoreIDName[] | StoreID[]
  employeeID: EmployeeID
  employeeCheckIn?: EmployeeCheckIn
  employeeCheckOut?: EmployeeCheckOut
  createdAt: Date
  updatedAt: Date
}

export type EmployeeStoreID = EmployeeNoRate & {
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
  employees: {
    userID: UserID
    employeeID: EmployeeID
    shortUserName: ShortUserName
    employmentNumber: EmploymentNumber
    employeePersonalNumber: EmployeePersonalNumber
    signature: Signature
    employeePin: EmployeePin
    employeeActive: EmployeeActive
    employeeComment?: EmployeeComment
    firstName: UserFirstName
    lastName: UserLastName
    employeeHourlyRateDinero?: EmployeeHourlyRateDinero
    employeeCheckIn?: EmployeeCheckIn
    employeeCheckOut?: EmployeeCheckOut
    employeeCheckinStatus: EmployeeCheckinStatus
  }[]
}

export type CheckInTimes = {
  employeeID: EmployeeID
  employeeCheckIn?: EmployeeCheckIn
  employeeCheckOut?: EmployeeCheckOut
}

export type ListCheckInStatus = {
  employeeID: EmployeeID
  shortUserName: ShortUserName
  firstName: UserFirstName
  lastName: UserLastName
  time: EmployeeCheckIn | EmployeeCheckOut | undefined
  status: CheckedInStatus
}

export function dineroDBReturn(
  amount: number | null,
  currency: string | null,
): EmployeeHourlyRateDinero | undefined {
  if (currency != null && amount != null) {
    return EmployeeHourlyRateDinero(
      Dinero({
        amount: amount,
        currency: currency as Currency,
      }),
    )
  }
  return undefined
}

function validateWorkingHours(hours: WorkingHours): boolean {
  const days = [
    { start: hours.mondayStart, stop: hours.mondayStop, break: hours.mondayBreak },
    { start: hours.tuesdayStart, stop: hours.tuesdayStop, break: hours.tuesdayBreak },
    { start: hours.wednesdayStart, stop: hours.wednesdayStop, break: hours.wednesdayBreak },
    { start: hours.thursdayStart, stop: hours.thursdayStop, break: hours.thursdayBreak },
    { start: hours.fridayStart, stop: hours.fridayStop, break: hours.fridayBreak },
    { start: hours.saturdayStart, stop: hours.saturdayStop, break: hours.saturdayBreak },
    { start: hours.sundayStart, stop: hours.sundayStop, break: hours.sundayBreak },
  ]

  for (const day of days) {
    if (day.start != null && day.stop != null) {
    }
    if (day.start != null && day.stop == null) {
      return false
    }
    if (day.start == null && (day.stop != null || day.break != null)) {
      return false
    }
  }
  return true
}

export async function setEmployeeWorkingHours(
  employee: EmployeeID,
  storeID: StoreID,
  workingHours: WorkingHours,
): Promise<Either<string, WorkingHoursCreated>> {
  if (!validateWorkingHours(workingHours)) {
    return left('working hours are invalid. Start times may be later than stop times')
  }
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
  workingHours: SpecialWorkingHours[],
): Promise<Either<string, { specialHours: SpecialWorkingHours[] }>> {
  try {
    const employeeHours = await db.transaction(async (tx) => {
      const [employeeHasStore] = await tx
        .select({ count: sql`count(*)`.mapWith(Number) })
        .from(employeeStore)
        .where(
          and(
            eq(employeeStore.storeID, workingHours[0].storeID),
            eq(employeeStore.employeeID, workingHours[0].employeeID),
          ),
        )

      if (employeeHasStore.count === 0) {
        return left('Employee is not associated with the store')
      }

      const updatedWorkingHours = await tx
        .insert(employeeSpecialHours)
        .values(workingHours)
        .onConflictDoUpdate({
          target: employeeSpecialHours.employeeSpecialHoursID,
          set: {
            employeeID: sql`"excluded"."employeeID"`,
            storeID: sql`"excluded"."storeID"`,
            start: sql`"excluded"."start"`,
            end: sql`"excluded"."end"`,
            description: sql`"excluded"."description"`,
            absence: sql`"excluded"."absence"`,
          },
        })
        .returning()
      return updatedWorkingHours
        ? right({
            specialHours: updatedWorkingHours.map((hours) => ({
              employeeSpecialHoursID: hours.employeeSpecialHoursID,
              employeeID: hours.employeeID,
              storeID: hours.storeID,
              start: hours.start,
              end: hours.end,
              description: hours.description ?? undefined,
              absence: hours.absence,
            })),
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
): Promise<Either<string, WorkingHoursCreated>> {
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

export async function getEmployeeSpecialWorkingHoursByID(
  employeeSpecialHoursID: EmployeeSpceialHoursID,
): Promise<Either<string, SpecialWorkingHours>> {
  try {
    const [fetchedWorkingHours] = await db
      .select()
      .from(employeeSpecialHours)
      .where(eq(employeeSpecialHours.employeeSpecialHoursID, employeeSpecialHoursID))
    return fetchedWorkingHours
      ? right({
          employeeSpecialHoursID: fetchedWorkingHours.employeeSpecialHoursID,
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

export async function getEmployeeSpecialWorkingHoursByDates(
  begin: WorkTime,
  end: WorkTime,
  storeID?: StoreID,
  employeeID?: EmployeeID,
): Promise<Either<string, { specialHours: SpecialWorkingHours[] }>> {
  try {
    let condition = and(lte(employeeSpecialHours.start, end), gte(employeeSpecialHours.end, begin))
    if (storeID) {
      condition = and(condition, eq(employeeSpecialHours.storeID, storeID))
    }
    if (employeeID) {
      condition = and(condition, eq(employeeSpecialHours.employeeID, employeeID))
    }
    const fetchedWorkingHours = await db.select().from(employeeSpecialHours).where(condition)
    return fetchedWorkingHours
      ? right({
          specialHours: fetchedWorkingHours.map((hours) => ({
            employeeSpecialHoursID: hours.employeeSpecialHoursID,
            employeeID: hours.employeeID,
            storeID: hours.storeID,
            start: hours.start,
            end: hours.end,
            description: hours.description ?? undefined,
            absence: hours.absence,
          })),
        })
      : left("couldn't fetch special working hours")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteEmployeeSpecialWorkingHours(
  employeeSpecialHoursID: EmployeeSpceialHoursID,
): Promise<Either<string, SpecialWorkingHours>> {
  try {
    const [deletedWorkingHours] = await db
      .delete(employeeSpecialHours)
      .where(eq(employeeSpecialHours.employeeSpecialHoursID, employeeSpecialHoursID))
      .returning()
    return deletedWorkingHours
      ? right({
          employeeSpecialHoursID: deletedWorkingHours.employeeSpecialHoursID,
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
): Promise<Either<string, WorkingHoursCreated>> {
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

export async function listCheckedinStatus(
  storeID: StoreID,
): Promise<Either<string, ListCheckInStatus[]>> {
  try {
    const employeesList = await db
      .select({
        employeeID: employees.employeeID,
        shortUserName: employees.shortUserName,
        employeeCheckedIn: sql<Date>`(
          SELECT employeeCheckedIn
          FROM ${employeeCheckin}
          WHERE ${employeeCheckin.employeeStoreID} = ${employeeStore.employeeStoreID}
          ORDER BY ${employeeCheckin.employeeCheckedIn} DESC
          LIMIT 1
        )`.as('employeeCheckedIn'),
        employeeCheckedOut: sql<Date>`(
          SELECT employeeCheckedOut
          FROM ${employeeCheckin}
          WHERE ${employeeCheckin.employeeStoreID} = ${employeeStore.employeeStoreID}
          ORDER BY ${employeeCheckin.employeeCheckedIn} DESC
          LIMIT 1
        )`.as('employeeCheckedOut'),
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(employees)
      .innerJoin(employeeStore, eq(employeeStore.employeeID, employees.employeeID))
      .innerJoin(users, eq(users.userID, employees.userID))
      .leftJoin(employeeCheckin, eq(employeeCheckin.employeeStoreID, employeeStore.employeeStoreID))
      .where(
        and(eq(employeeStore.storeID, storeID), eq(employees.employeeActive, EmployeeActive(true))),
      )

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
    const employeeCheckinStatus = employeesList.map<ListCheckInStatus>((employee) => {
      const status = toListCheckinStatus(employee.employeeCheckedIn, employee.employeeCheckedOut)
      return {
        employeeID: employee.employeeID,
        shortUserName: employee.shortUserName,
        firstName: employee.firstName,
        lastName: employee.lastName,
        time: status?.time,
        status: status.status,
      }
    })
    return right(employeeCheckinStatus)
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function checkInCheckOut(
  employeeID: EmployeeID,
  storeID: StoreID,
  checkIn: CheckedInStatus,
): Promise<Either<string, CheckInTimes>> {
  const timestamp: Date = new Date()
  try {
    const newCheckin = await db.transaction(async (tx) => {
      const [latestCheckin] = await tx
        .select({
          employeeCheckedIn: employeeCheckin.employeeCheckedIn,
          employeeCheckedOut: employeeCheckin.employeeCheckedOut,
          employeeStoreID: employeeStore.employeeStoreID,
        })
        .from(employeeStore)
        .where(and(eq(employeeStore.storeID, storeID), eq(employeeStore.employeeID, employeeID)))
        .leftJoin(
          employeeCheckin,
          eq(employeeCheckin.employeeStoreID, employeeStore.employeeStoreID),
        )
        .orderBy(desc(employeeCheckin.employeeCheckedIn))
        .limit(1)

      if (timestamp != null) {
        switch (checkIn) {
          case 'CheckedIn':
            if (
              latestCheckin === undefined ||
              (latestCheckin.employeeCheckedIn != null && latestCheckin.employeeCheckedOut === null)
            ) {
              return left('Already checked in')
            }

            const [setCheckinTime] = await tx
              .insert(employeeCheckin)
              .values({
                employeeStoreID: latestCheckin.employeeStoreID,
                employeeCheckedIn: timestamp,
              })
              .returning()

            return setCheckinTime
              ? right({
                  employeeID: employeeID,
                  employeeCheckIn: setCheckinTime.employeeCheckedIn
                    ? EmployeeCheckIn(setCheckinTime.employeeCheckedIn.toISOString())
                    : undefined,
                  employeeCheckOut: setCheckinTime.employeeCheckedOut
                    ? EmployeeCheckOut(setCheckinTime.employeeCheckedOut.toISOString())
                    : undefined,
                })
              : left('could not check in')

          case 'CheckedOut':
            if (
              latestCheckin != null &&
              latestCheckin.employeeCheckedIn != null &&
              latestCheckin.employeeCheckedOut === null
            ) {
              const [setCheckOutTime] = await db
                .update(employeeCheckin)
                .set({ employeeCheckedOut: timestamp })
                .where(
                  and(
                    eq(employeeCheckin.employeeStoreID, latestCheckin.employeeStoreID),
                    eq(employeeCheckin.employeeCheckedIn, latestCheckin.employeeCheckedIn),
                  ),
                )
                .returning()
              return setCheckOutTime
                ? right({
                    employeeID: employeeID,
                    employeeCheckIn: setCheckOutTime.employeeCheckedIn
                      ? EmployeeCheckIn(setCheckOutTime.employeeCheckedIn.toISOString())
                      : undefined,
                    employeeCheckOut: setCheckOutTime.employeeCheckedOut
                      ? EmployeeCheckOut(setCheckOutTime.employeeCheckedOut.toISOString())
                      : undefined,
                  })
                : left('could not check out')
            }
            return left('Already checked out')
        }
      }
      return left("couldn't checkin/out")
    })
    return newCheckin
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function putEmployee(
  storeList: StoreID[],
  employee: CreateEmployee,
  employeeID?: EmployeeID,
): Promise<Either<string, Employee>> {
  if (storeList.length < 1) {
    return left('no store given')
  }
  try {
    const createdEmployeeWithStores = await db.transaction(async (tx) => {
      const [createdEmployee] = employeeID
        ? await tx
            .update(employees)
            .set(employee)
            .where(eq(employees.employeeID, employeeID))
            .returning()
        : await db.insert(employees).values(employee).returning()

      const employeeIDStoreID = storeList.map((store) => {
        return { storeID: store, employeeID: createdEmployee.employeeID }
      })

      if (employeeID != null) {
        await tx.delete(employeeStore).where(eq(employeeStore.employeeID, employeeID))
      }
      const employeeStoresRes = await tx
        .insert(employeeStore)
        .values(employeeIDStoreID)
        .returning({ storeID: employeeStore.storeID })

      const employeeStoreNames = await tx
        .select({ storeName: stores.storeName, storeID: stores.storeID })
        .from(stores)
        .where(or(...employeeStoresRes.map((storeID) => eq(stores.storeID, storeID.storeID))))

      const createdEmployeeWithUndefined = {
        userID: createdEmployee.userID,
        employeeID: createdEmployee.employeeID,
        shortUserName: createdEmployee.shortUserName,
        employmentNumber: createdEmployee.employmentNumber,
        employeePersonalNumber: createdEmployee.employeePersonalNumber,
        signature: createdEmployee.signature,
        employeeHourlyRateDinero: dineroDBReturn(
          createdEmployee.employeeHourlyRate,
          createdEmployee.employeeHourlyRateCurrency,
        ),
        employeePin: createdEmployee.employeePin,
        employeeActive: createdEmployee.employeeActive,
        employeeComment: createdEmployee.employeeComment ?? undefined,
        createdAt: createdEmployee.createdAt,
        updatedAt: createdEmployee.updatedAt,
      }
      return {
        ...createdEmployeeWithUndefined,
        storeIDs: employeeStoreNames,
      }
    })
    return right(createdEmployeeWithStores)
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getEmployee(employeeID: EmployeeID): Promise<Either<string, GetEmployee>> {
  try {
    const [verifiedUser] = await db
      .select({
        userID: users.userID,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        isSuperAdmin: users.isSuperAdmin,
        employeeID: employees.employeeID,
        shortUserName: employees.shortUserName,
        employmentNumber: employees.employmentNumber,
        employeePersonalNumber: employees.employeePersonalNumber,
        signature: employees.signature,
        employeeActive: employees.employeeActive,
        employeeHourlyRate: employees.employeeHourlyRate,
        employeeHourlyRateCurrency: employees.employeeHourlyRateCurrency,
        employeeComment: employees.employeeComment,
        employeeCheckedIn: sql<Date | null>`(
          SELECT "employeeCheckin"."employeeCheckedIn"
          FROM "employeeCheckin"
          JOIN "employeeStore" ON "employeeCheckin"."employeeStoreID" = "employeeStore"."employeeStoreID"
          WHERE "employeeStore"."employeeID" = "employees"."employeeID"
          ORDER BY "employeeCheckin"."employeeCheckedIn" DESC
          LIMIT 1
      ) as "employeeCheckedIn"`,
        employeeCheckedOut: sql<Date | null>` (
          SELECT "employeeCheckin"."employeeCheckedOut"
          FROM "employeeCheckin"
          JOIN "employeeStore" ON "employeeCheckin"."employeeStoreID" = "employeeStore"."employeeStoreID"
          WHERE "employeeStore"."employeeID" = "employees"."employeeID"
          ORDER BY "employeeCheckin"."employeeCheckedIn" DESC
          LIMIT 1
      )`.as('employeeCheckedOut'),
        storeIDs: sql<
          StoreIDName[]
        >`json_agg(json_build_object('storeID', ${stores.storeID}, 'storeName', ${stores.storeName}))`.as(
          'storeIDs',
        ),
      })
      .from(employees)
      .where(and(eq(employees.employeeID, employeeID)))
      .innerJoin(users, eq(users.userID, employees.userID))
      .leftJoin(employeeStore, eq(employeeStore.employeeID, employeeID))
      .leftJoin(stores, eq(stores.storeID, employeeStore.storeID))
      .groupBy(users.userID, employees.employeeID)

    return verifiedUser
      ? right({
          userID: verifiedUser.userID,
          firstName: verifiedUser.firstName,
          lastName: verifiedUser.lastName,
          email: verifiedUser.email,
          isSuperAdmin: verifiedUser.isSuperAdmin,
          employeeID: verifiedUser.employeeID ?? undefined,
          shortUserName: verifiedUser.shortUserName ?? undefined,
          employmentNumber: verifiedUser.employmentNumber ?? undefined,
          employeePersonalNumber: verifiedUser.employeePersonalNumber ?? undefined,
          signature: verifiedUser.signature ?? undefined,
          employeeHourlyRate: dineroDBReturn(
            verifiedUser.employeeHourlyRate,
            verifiedUser.employeeHourlyRateCurrency,
          ),
          employeeActive: verifiedUser.employeeActive ?? undefined,
          employeeCheckedIn: verifiedUser.employeeCheckedIn
            ? EmployeeCheckIn(verifiedUser.employeeCheckedIn.toISOString())
            : undefined,
          employeeCheckedOut: verifiedUser.employeeCheckedOut
            ? EmployeeCheckOut(verifiedUser.employeeCheckedOut?.toISOString())
            : undefined,
          employeeCheckinStatus: isCheckedIn(
            verifiedUser.employeeCheckedIn,
            verifiedUser.employeeCheckedOut,
          ),
          storeIDs: verifiedUser.storeIDs,
        })
      : left('Login failed, incorrect email or password')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteEmployee(employeeID: EmployeeID): Promise<Either<string, Employee>> {
  try {
    const deletedEmployeeWithStores = await db.transaction(async (tx) => {
      const employeeStores = await tx
        .select({ storeID: stores.storeID, storeName: stores.storeName })
        .from(employeeStore)
        .where(eq(employeeStore.employeeID, employeeID))
        .innerJoin(stores, eq(employeeStore.storeID, stores.storeID))
      await tx.delete(employeeStore).where(eq(employeeStore.employeeID, employeeID))

      const [deletedEmployee] = await tx
        .delete(employees)
        .where(eq(employees.employeeID, employeeID))
        .returning()

      const deletedEmployeeWithNull = {
        userID: deletedEmployee.userID,
        employeeID: deletedEmployee.employeeID,
        shortUserName: deletedEmployee.shortUserName,
        employmentNumber: deletedEmployee.employmentNumber,
        employeePersonalNumber: deletedEmployee.employeePersonalNumber,
        signature: deletedEmployee.signature,
        employeeHourlyRate: deletedEmployee.employeeHourlyRate ?? undefined,
        employeeHourlyRateCurrency: deletedEmployee.employeeHourlyRateCurrency ?? undefined,
        employeePin: deletedEmployee.employeePin,
        employeeActive: deletedEmployee.employeeActive,
        employeeComment: deletedEmployee.employeeComment ?? undefined,
        createdAt: deletedEmployee.createdAt,
        updatedAt: deletedEmployee.updatedAt,
      }
      return { ...deletedEmployeeWithNull, storeIDs: employeeStores }
    })
    if (deletedEmployeeWithStores == null) {
      return left('employee not found')
    }
    return right(deletedEmployeeWithStores)
  } catch (e) {
    return left(errorHandling(e))
  }
}

export function isCheckedIn(checkin: Date | null, checkout: Date | null): EmployeeCheckinStatus {
  let checkinStatus = EmployeeCheckinStatus(false)
  if (checkin != null) {
    const status = checkout == null || checkout < checkin
    checkinStatus = EmployeeCheckinStatus(status)
  }
  return checkinStatus
}

export async function getEmployeesPaginate(
  store: StoreID,
  search: Search,
  limit = Limit(10),
  page = Page(1),
  offset = Offset(0),
): Promise<Either<string, EmployeePaginated>> {
  try {
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
        .select({
          userID: users.userID,
          firstName: users.firstName,
          lastName: users.lastName,
          employeeID: employees.employeeID,
          shortUserName: employees.shortUserName,
          employmentNumber: employees.employmentNumber,
          employeePersonalNumber: employees.employeePersonalNumber,
          signature: employees.signature,
          employeeHourlyRate: employees.employeeHourlyRate,
          employeeHourlyRateCurrency: employees.employeeHourlyRateCurrency,
          employeePin: employees.employeePin,
          employeeComment: employees.employeeComment,
          employeeActive: employees.employeeActive,
          employeeCheckedIn: sql<Date>`(
            SELECT ${employeeCheckin.employeeCheckedIn}
            FROM ${employeeCheckin}
            WHERE ${employeeCheckin.employeeStoreID} = ${employeeStore.employeeStoreID}
            ORDER BY ${employeeCheckin.employeeCheckedIn} DESC
            LIMIT 1
          )`.as('employeeCheckedIn'),
          employeeCheckedOut: sql<Date>`(
            SELECT ${employeeCheckin.employeeCheckedOut}
            FROM ${employeeCheckin}
            WHERE ${employeeCheckin.employeeStoreID} = ${employeeStore.employeeStoreID}
            ORDER BY ${employeeCheckin.employeeCheckedIn} DESC
            LIMIT 1
          )`.as('employeeCheckedOut'),
          createdAt: employees.createdAt,
          updatedAt: employees.updatedAt,
        })
        .from(employees)
        .innerJoin(employeeStore, eq(employeeStore.employeeID, employees.employeeID))
        .innerJoin(users, eq(users.userID, employees.userID))
        .leftJoin(
          employeeCheckin,
          eq(employeeCheckin.employeeStoreID, employeeStore.employeeStoreID),
        )
        .where(condition)
        .limit(limit || 10)
        .offset(offset || 0)

      const listedEmployeeWithNull = employeesList.map((employee) => {
        const checkinStatus = isCheckedIn(employee.employeeCheckedIn, employee.employeeCheckedOut)
        return {
          userID: employee.userID,
          firstName: employee.firstName,
          lastName: employee.lastName,
          employeeID: employee.employeeID,
          shortUserName: employee.shortUserName,
          employmentNumber: employee.employmentNumber,
          employeePersonalNumber: employee.employeePersonalNumber,
          signature: employee.signature,
          employeeHourlyRateDinero: dineroDBReturn(
            employee.employeeHourlyRate,
            employee.employeeHourlyRateCurrency,
          ),
          employeePin: employee.employeePin,
          employeeComment: employee.employeeComment ?? undefined,
          employeeActive: employee.employeeActive,
          employeeCheckIn: employee.employeeCheckedIn
            ? EmployeeCheckIn(employee.employeeCheckedIn.toISOString())
            : undefined,
          employeeCheckOut: employee.employeeCheckedOut
            ? EmployeeCheckOut(employee.employeeCheckedOut.toISOString())
            : undefined,

          employeeCheckinStatus: checkinStatus,
          createdAt: employee.createdAt,
          updatedAt: employee.updatedAt,
        }
      })
      return { totalEmployees, listedEmployeeWithNull }
    })
    const totalPage = Math.ceil(totalEmployees.count / limit)

    return right({
      totalEmployees: ResultCount(totalEmployees.count),
      totalPage: Page(totalPage),
      perPage: Limit(page),
      employees: listedEmployeeWithNull,
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}

//export async function getEmployeesQuals(
//  storeID: StoreID,
//): Promise<Either<string, EmployeePaginated>> {
//  try {
//    const employeesList = await db
//      .select({
//        userID: users.userID,
//        firstName: users.firstName,
//        lastName: users.lastName,
//        employeeID: employees.employeeID,
//        globalQualID: qualificationsGlobal.globalQualID,
//        globalQualName: qualificationsGlobal.globalQualName,
//      })
//      .from(employeeStore)
//      .where(eq(employeeStore.storeID, storeID))
//      .innerJoin(employees, eq(employees.employeeID, employeeStore.employeeID))
//      .innerJoin(users, eq(users.userID, employees.userID))
//      .leftJoin(
//        employeeGlobalQualifications,
//        eq(employeeGlobalQualifications.employeeID, employees.employeeID),
//      )
//      .innerJoin(
//        qualificationsGlobal,
//        eq(qualificationsGlobal.globalQualID, employeeGlobalQualifications.globalQualID),
//      )
//
//    return right({
//      totalEmployees: ResultCount(totalEmployees.count),
//      totalPage: Page(totalPage),
//      perPage: Limit(page),
//      employees: listedEmployeeWithNull,
//    })
//  } catch (e) {
//    return left(errorHandling(e))
//  }
//}
function parseTime(timeString: string | null, baseDate: Date): Date | null {
  if (!timeString) return null
  const [hours, minutes] = timeString.split(':').map(Number)
  return new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), hours, minutes)
}

function parseInterval(interval: string | null): number {
  if (!interval) return 0
  const match = interval.match(/(\d+):(\d+):(\d+)/)
  if (match) {
    const [, hours, minutes, seconds] = match
    return Number(hours) * 60 + Number(minutes) + Number(seconds) / 60
  }
  return 0
}

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
export type DayToHours = {
  [key in DayOfWeek]: WorkDuration
}

type WorkTimeUnBranded = {
  employeeWorkingHours: WorkingHoursNull
  employeeSpecialHours: {
    employeeSpecialHoursID: EmployeeSpceialHoursID
    employeeID: EmployeeID
    start: WorkTime
    end: WorkTime
    absence: Absence
  }[]
}
export function differenceInMinutes(dateLeft: Date, dateRight: Date): number {
  const diff = dateLeft.getTime() - dateRight.getTime() / 60000
  return Math.trunc(diff)
}

function calculateDailyWorkHours(
  workInfo: WorkTimeUnBranded,
  week: Date,
  empHours: DayToHours,
): DayToHours {
  const days: DayOfWeek[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ]

  days.forEach((day, i) => {
    const weekWorker = new Date(week)
    weekWorker.setDate(weekWorker.getDate() + i)
    const startTime = parseTime(
      workInfo.employeeWorkingHours[`${day}Start` as keyof WorkingHoursNull] as string,
      weekWorker,
    )
    const endTime = parseTime(
      workInfo.employeeWorkingHours[`${day}Stop` as keyof WorkingHoursNull] as string,
      weekWorker,
    )
    if (!startTime || !endTime) {
      empHours[day] = WorkDuration(0)
    } else {
      const breakMinutes = parseInterval(
        workInfo.employeeWorkingHours[`${day}Break` as keyof WorkingHoursNull] as string,
      )

      let totalMinutes = differenceInMinutes(endTime, startTime) - breakMinutes

      // Subtract special hours
      workInfo.employeeSpecialHours.forEach((specialHour) => {
        if (specialHour.absence) {
          const overlapEnd = endTime < specialHour.end ? endTime : specialHour.end
          const overlapStart = startTime < specialHour.start ? specialHour.start : startTime
          const diff = overlapEnd.getTime() - overlapStart.getTime()
          if (diff > 0) {
            totalMinutes = totalMinutes - diff / 60000
          }
        } else {
          const nextDate = new Date()
          nextDate.setDate(weekWorker.getDate() + 1)
          const specialStart = weekWorker < specialHour.start ? specialHour.start : weekWorker
          const specialEnd = nextDate < specialHour.end ? nextDate : specialHour.start
          const specialMS = specialEnd.getTime() - specialStart.getTime()
          const overlapEnd = endTime < specialEnd ? endTime : specialEnd
          const overlapStart = startTime < specialStart ? specialStart : startTime
          const overlapMS = overlapEnd.getTime() - overlapStart.getTime()
          totalMinutes = totalMinutes + Math.max(specialMS - overlapMS, 0) / 60000
        }
      })

      empHours[day] = WorkDuration(Math.max(totalMinutes / 60, 0)) // Convert to hours and ensure non-negative
    }
    weekWorker.setDate(weekWorker.getDate() + 1)
  })

  return empHours
}

export async function listWorkingEmployees(
  storeID: StoreID,
  startDay: WorkTime,
  quals: GlobalQualID[],
  localQuals: LocalQualID[],
): Promise<Either<string, DayToHours>> {
  try {
    const startOfWeek = new Date(startDay)
    startOfWeek.setDate(new Date(startDay).getDate() - new Date(startDay).getDay() + 1)
    startOfWeek.setHours(0)
    startOfWeek.setMinutes(0)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 7)
    endOfWeek.setHours(23)
    endOfWeek.setMinutes(59)

    const locals = localQuals.map((q) =>
      and(
        eq(employeeWorkingHours.employeeID, employeeLocalQualifications.employeeID),
        eq(employeeLocalQualifications.localQualID, q),
      ),
    )

    const globals = quals.map((q) =>
      and(
        eq(employeeWorkingHours.employeeID, employeeGlobalQualifications.employeeID),
        eq(employeeGlobalQualifications.globalQualID, q),
      ),
    )

    let specAndRegular = db
      .select({
        employeeWorkingHours: employeeWorkingHours,
        employeeSpecialHours: jsonAggBuildObject({
          employeeSpecialHoursID: employeeSpecialHours.employeeSpecialHoursID,
          employeeID: employeeSpecialHours.employeeID,
          start: employeeSpecialHours.start,
          end: employeeSpecialHours.end,
          absence: employeeSpecialHours.absence,
        }),
        bookedHours: jsonAggBuildObject({
          day1: orderListing.day1,
          day1Work: orderListing.day1Work,
          day1Employee: orderListing.day1Employee,
          day2: orderListing.day2,
          day2Work: orderListing.day2Work,
          day2Employee: orderListing.day2Employee,
          day3: orderListing.day3,
          day3Work: orderListing.day3Work,
          day3Employee: orderListing.day3Employee,
          day4: orderListing.day4,
          day4Work: orderListing.day4Work,
          day4Employee: orderListing.day4Employee,
          day5: orderListing.day5,
          day5Work: orderListing.day5Work,
          day5Employee: orderListing.day5Employee,
        }),
      })
      .from(employeeWorkingHours)
      .where(
        and(
          eq(employees.employeeID, employeeWorkingHours.employeeID),
          eq(employeeWorkingHours.storeID, storeID),
        ),
      )
      .innerJoin(employees, eq(employees.employeeActive, EmployeeActive(true)))
      .leftJoin(
        employeeSpecialHours,
        and(
          eq(employeeSpecialHours.employeeID, employees.employeeID),
          eq(employeeSpecialHours.storeID, storeID),
          gte(employeeSpecialHours.end, WorkTime(startOfWeek)),
          lte(employeeSpecialHours.start, WorkTime(endOfWeek)),
        ),
      )
      .leftJoin(
        orderListing,
        and(
          eq(orderListing.storeID, storeID),
          or(
            and(
              lte(orderListing.day1, WorkDay1(endOfWeek)),
              gte(orderListing.day1, WorkDay1(startOfWeek)),
            ),
            and(
              lte(orderListing.day2, WorkDay2(endOfWeek)),
              gte(orderListing.day2, WorkDay2(startOfWeek)),
            ),
            and(
              lte(orderListing.day3, WorkDay3(endOfWeek)),
              gte(orderListing.day3, WorkDay3(startOfWeek)),
            ),
            and(
              lte(orderListing.day4, WorkDay4(endOfWeek)),
              gte(orderListing.day4, WorkDay4(startOfWeek)),
            ),
            and(
              lte(orderListing.day5, WorkDay5(endOfWeek)),
              gte(orderListing.day5, WorkDay5(startOfWeek)),
            ),
          ),
          or(
            eq(orderListing.day1Employee, employees.employeeID),
            eq(orderListing.day2Employee, employees.employeeID),
            eq(orderListing.day3Employee, employees.employeeID),
            eq(orderListing.day4Employee, employees.employeeID),
            eq(orderListing.day5Employee, employees.employeeID),
          ),
        ),
      )

    if (locals.length > 0) {
      specAndRegular = specAndRegular.innerJoin(employeeLocalQualifications, or(...locals))
    }

    if (globals.length > 0) {
      specAndRegular = specAndRegular.innerJoin(employeeGlobalQualifications, or(...globals))
    }

    const workTimes = await specAndRegular.groupBy(
      employeeWorkingHours.storeID,
      employeeWorkingHours.employeeID,
    )

    const workTimeDates = workTimes.map((work) => ({
      employeeWorkingHours: work.employeeWorkingHours,
      employeeSpecialHours: work.employeeSpecialHours.map((special) => ({
        employeeSpecialHoursID: special.employeeSpecialHoursID,
        employeeID: special.employeeID,
        start: WorkTime(new Date(special.start)),
        end: WorkTime(new Date(special.end)),
        absence: special.absence,
      })),
    }))

    const tuesday = new Date(startOfWeek)
    tuesday.setDate(tuesday.getDate() + 1)
    const wednesday = new Date(startOfWeek)
    wednesday.setDate(wednesday.getDate() + 2)
    const thursday = new Date(startOfWeek)
    thursday.setDate(thursday.getDate() + 3)
    const friday = new Date(startOfWeek)
    friday.setDate(friday.getDate() + 4)
    const saturday = new Date(startOfWeek)
    saturday.setDate(saturday.getDate() + 5)
    const sunday = new Date(startOfWeek)
    sunday.setDate(sunday.getDate() + 6)

    type BookedHours = {
      monday: { day: Date; hours: WorkDuration }
      tuesday: { day: Date; hours: WorkDuration }
      wednesday: { day: Date; hours: WorkDuration }
      thursday: { day: Date; hours: WorkDuration }
      friday: { day: Date; hours: WorkDuration }
      saturday: { day: Date; hours: WorkDuration }
      sunday: { day: Date; hours: WorkDuration }
    }
    const bookedHours: BookedHours = {
      monday: { day: startOfWeek, hours: WorkDuration(0) },
      tuesday: { day: tuesday, hours: WorkDuration(0) },
      wednesday: { day: wednesday, hours: WorkDuration(0) },
      thursday: { day: thursday, hours: WorkDuration(0) },
      friday: { day: friday, hours: WorkDuration(0) },
      saturday: { day: saturday, hours: WorkDuration(0) },
      sunday: { day: sunday, hours: WorkDuration(0) },
    }

    const datesAreOnSameDay = (weekDay: Date, bookingDay: Date) =>
      bookingDay instanceof Date &&
      weekDay.getFullYear() === bookingDay.getFullYear() &&
      weekDay.getMonth() === bookingDay.getMonth() &&
      weekDay.getDate() === bookingDay.getDate()

    function summarizeBooked(hours: BookedHours, day: Date, time: number) {
      if (datesAreOnSameDay(day, hours.monday.day)) {
        hours.monday.hours = WorkDuration(hours.monday.hours + time)
      } else if (datesAreOnSameDay(day, hours.tuesday.day)) {
        hours.tuesday.hours = WorkDuration(hours.tuesday.hours + time)
      } else if (datesAreOnSameDay(day, hours.wednesday.day)) {
        hours.wednesday.hours = WorkDuration(hours.wednesday.hours + time)
      } else if (datesAreOnSameDay(day, hours.thursday.day)) {
        hours.thursday.hours = WorkDuration(hours.thursday.hours + time)
      } else if (datesAreOnSameDay(day, hours.friday.day)) {
        hours.friday.hours = WorkDuration(hours.friday.hours + time)
      } else if (datesAreOnSameDay(day, hours.saturday.day)) {
        hours.saturday.hours = WorkDuration(hours.saturday.hours + time)
      } else if (datesAreOnSameDay(day, hours.sunday.day)) {
        hours.sunday.hours = WorkDuration(hours.sunday.hours + time)
      }
    }

    workTimes.forEach((work) => ({
      employeeID: work.employeeWorkingHours.employeeID,
      bookinHours: work.bookedHours.forEach((book) => {
        if (
          book.day1Work &&
          book.day1 &&
          book.day1Employee === work.employeeWorkingHours.employeeID
        ) {
          summarizeBooked(bookedHours, new Date(book.day1), parseInterval(book.day1Work) / 60)
        }
        if (
          book.day2Work &&
          book.day2 &&
          book.day2Employee === work.employeeWorkingHours.employeeID
        ) {
          summarizeBooked(bookedHours, new Date(book.day2), parseInterval(book.day2Work) / 60)
        }
        if (
          book.day3Work &&
          book.day3 &&
          book.day3Employee === work.employeeWorkingHours.employeeID
        ) {
          summarizeBooked(bookedHours, new Date(book.day3), parseInterval(book.day3Work) / 60)
        }
        if (
          book.day4Work &&
          book.day4 &&
          book.day4Employee === work.employeeWorkingHours.employeeID
        ) {
          summarizeBooked(bookedHours, new Date(book.day4), parseInterval(book.day4Work) / 60)
        }
        if (
          book.day5Work &&
          book.day5 &&
          book.day5Employee === work.employeeWorkingHours.employeeID
        ) {
          summarizeBooked(bookedHours, new Date(book.day5), parseInterval(book.day5Work) / 60)
        }
      }),
    }))

    const workingRegular = workTimeDates.reduce(
      (acc, empTime) => calculateDailyWorkHours(empTime, startOfWeek, acc),
      {
        monday: WorkDuration(0),
        tuesday: WorkDuration(0),
        wednesday: WorkDuration(0),
        thursday: WorkDuration(0),
        friday: WorkDuration(0),
        saturday: WorkDuration(0),
        sunday: WorkDuration(0),
      },
    )

    return workTimeDates
      ? right({
          monday: WorkDuration(workingRegular.monday - bookedHours.monday.hours),
          tuesday: WorkDuration(workingRegular.tuesday - bookedHours.tuesday.hours),
          wednesday: WorkDuration(workingRegular.wednesday - bookedHours.wednesday.hours),
          thursday: WorkDuration(workingRegular.thursday - bookedHours.thursday.hours),
          friday: WorkDuration(workingRegular.friday - bookedHours.friday.hours),
          saturday: WorkDuration(workingRegular.saturday - bookedHours.saturday.hours),
          sunday: WorkDuration(workingRegular.sunday - bookedHours.sunday.hours),
        })
      : left('could not find working hours')
  } catch (err) {
    return left(errorHandling(err))
  }
}
