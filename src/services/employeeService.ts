import { Either, errorHandling, left, right, timeStringToMS } from '../utils/helper.js'

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
  WorkDuration,
  WorkTime,
  WorkTimeDescription,
  employeeGlobalQualifications,
  employeeLocalQualifications,
  employeeSpecialHours,
  employeeStore,
  employeeWorkingHours,
  employees,
  stores,
  users,
} from '../schema/schema.js'

import Dinero, { Currency } from 'dinero.js'

import { db } from '../config/db-connect.js'

import { Limit, Offset, Page, ResultCount, Search } from '../plugins/pagination.js'

import { and, eq, gte, ilike, isNull, lte, or, sql } from 'drizzle-orm'

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

type WorkingHoursID = WorkingHours & { employeeID: EmployeeID } & { storeID: StoreID } & {
  special: SpecialWorkingHours[]
}

export type WorkingHoursIDTotal = {
  employeeInfo: WorkingHoursID[]
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

export type SpecialWorkingHours = {
  employeeSpecialHoursID?: EmployeeSpceialHoursID
  employeeID: EmployeeID
  storeID: StoreID
  start: WorkTime
  end: WorkTime
  description?: WorkTimeDescription
  absence: Absence
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
  storeID: StoreID,
  employeeID: EmployeeID,
  begin: WorkTime,
  end: WorkTime,
): Promise<Either<string, { specialHours: SpecialWorkingHours[] }>> {
  try {
    const fetchedWorkingHours = await db
      .select()
      .from(employeeSpecialHours)
      .where(
        and(
          eq(employeeSpecialHours.employeeID, employeeID),
          eq(employeeSpecialHours.storeID, storeID),
          lte(employeeSpecialHours.start, end),
          gte(employeeSpecialHours.end, begin),
        ),
      )
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

type Res = {
  employeeSpecialHoursID: EmployeeSpceialHoursID
  employeeID: EmployeeID
  storeID: StoreID
  start: WorkTime
  end: WorkTime
  description: WorkTimeDescription | undefined | null
  absence: Absence
}

export function firstDayOfWeek(t: WorkTime, startDay: WorkTime): WorkDuration {
  const dayOfWeek = startDay.getDay(),
    diff = dayOfWeek >= 1 ? dayOfWeek - 1 : 6 - dayOfWeek

  startDay.setDate(t.getDate() - diff)
  startDay.setHours(0, 0, 0, 0)
  return WorkDuration(new Date(t > startDay ? t : startDay).getTime())
}

function lastDayOfWeek(t: WorkTime, endDay: WorkTime): WorkDuration {
  const dayOfWeek = 6 - endDay.getDay()

  endDay.setDate(endDay.getDate() - dayOfWeek)
  endDay.setHours(0, 0, 0, 0)
  return WorkDuration(new Date(t < endDay ? t : endDay).getTime())
}

function calcTime(
  startDay: WorkTime,
  employeeSpecialTimes: Res[],
  fetchedWorkingHours: (WorkingHoursNull | null)[],
): Either<string, WorkingHoursIDTotal> {
  if (fetchedWorkingHours.includes(null)) {
    return left("can't get working hours")
  } else {
    const regularTimes = fetchedWorkingHours.reduce<WorkingHoursID[]>((acc, time) => {
      if (time !== null) {
        acc.push({
          employeeID: time.employeeID,
          storeID: time.storeID,
          mondayStart: time.mondayStart ?? undefined,
          mondayStop: time.mondayStop ?? undefined,
          mondayBreak: time.mondayBreak ?? undefined,
          tuesdayStart: time.tuesdayStart ?? undefined,
          tuesdayStop: time.tuesdayStop ?? undefined,
          tuesdayBreak: time.tuesdayBreak ?? undefined,
          wednesdayStart: time.wednesdayStart ?? undefined,
          wednesdayStop: time.wednesdayStop ?? undefined,
          wednesdayBreak: time.wednesdayBreak ?? undefined,
          thursdayStart: time.thursdayStart ?? undefined,
          thursdayStop: time.thursdayStop ?? undefined,
          thursdayBreak: time.thursdayBreak ?? undefined,
          fridayStart: time.fridayStart ?? undefined,
          fridayStop: time.fridayStop ?? undefined,
          fridayBreak: time.fridayBreak ?? undefined,
          saturdayStart: time.saturdayStart ?? undefined,
          saturdayStop: time.saturdayStop ?? undefined,
          saturdayBreak: time.saturdayBreak ?? undefined,
          sundayStart: time.sundayStart ?? undefined,
          sundayStop: time.sundayStop ?? undefined,
          sundayBreak: time.sundayBreak ?? undefined,
          special: employeeSpecialTimes.reduce<SpecialWorkingHours[]>((t, emp: Res) => {
            if (emp.employeeID === time.employeeID) {
              t.push({
                employeeSpecialHoursID: emp.employeeSpecialHoursID,
                employeeID: emp.employeeID,
                storeID: emp.storeID,
                start: emp.start,
                end: emp.end,
                description: emp.description ?? undefined,
                absence: emp.absence,
              })
            }
            return t
          }, [] as SpecialWorkingHours[]),
        })
      }
      return acc
    }, [])

    type DayOfWeek =
      | 'monday'
      | 'tuesday'
      | 'wednesday'
      | 'thursday'
      | 'friday'
      | 'saturday'
      | 'sunday'
    const worktimes: WorkingHoursIDTotal = {
      employeeInfo: regularTimes,
      totalTimes: {
        monday: WorkDuration(0),
        tuesday: WorkDuration(0),
        wednesday: WorkDuration(0),
        thursday: WorkDuration(0),
        friday: WorkDuration(0),
        saturday: WorkDuration(0),
        sunday: WorkDuration(0),
      },
    }

    regularTimes.map((emp) => {
      const mondayStart = timeStringToMS(emp.mondayStart)
      const mondayStop = timeStringToMS(emp.mondayStop)
      const tuesdayStart = timeStringToMS(emp.tuesdayStart)
      const tuesdayStop = timeStringToMS(emp.tuesdayStop)
      const wednesdayStart = timeStringToMS(emp.wednesdayStart)
      const wednesdayStop = timeStringToMS(emp.wednesdayStop)
      const thursdayStart = timeStringToMS(emp.thursdayStart)
      const thursdayStop = timeStringToMS(emp.thursdayStop)
      const fridayStart = timeStringToMS(emp.fridayStart)
      const fridayStop = timeStringToMS(emp.fridayStop)
      const saturdayStart = timeStringToMS(emp.saturdayStart)
      const saturdayStop = timeStringToMS(emp.saturdayStop)
      const sundayStart = timeStringToMS(emp.sundayStart)
      const sundayStop = timeStringToMS(emp.sundayStop)

      function isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
        return value !== null && value !== undefined
      }

      const shifts: { time: WorkDuration; shift: string }[] = [
        { time: mondayStart, shift: 'start' },
        { time: mondayStop, shift: 'stop' },
        { time: tuesdayStart, shift: 'start' },
        { time: tuesdayStop, shift: 'stop' },
        { time: wednesdayStart, shift: 'start' },
        { time: wednesdayStop, shift: 'stop' },
        { time: thursdayStart, shift: 'start' },
        { time: thursdayStop, shift: 'stop' },
        { time: fridayStart, shift: 'start' },
        { time: fridayStop, shift: 'stop' },
        { time: saturdayStart, shift: 'start' },
        { time: saturdayStop, shift: 'stop' },
        { time: sundayStart, shift: 'start' },
        { time: sundayStop, shift: 'stop' },
      ].filter((x): x is { time: WorkDuration; shift: string } => isNotNullOrUndefined(x.time))

      emp.special.map((hours) => {
        shifts.push({
          time: firstDayOfWeek(hours.start, startDay),
          shift: hours.absence ? 'stop' : 'start',
        })
        shifts.push({
          time: lastDayOfWeek(hours.end, startDay),
          shift: hours.absence ? 'start' : 'stop',
        })
      })

      shifts.sort((a, b) => {
        if (a.time < b.time) {
          return -1
        }
        if (a.time > b.time) {
          return 1
        }
        return 0
      })
      const dayOfWeek = startDay.getDay(),
        diff = dayOfWeek >= 1 ? dayOfWeek - 1 : 6 - dayOfWeek

      let currDate = WorkDuration(new Date(startDay.getDate() - diff).setHours(23, 59, 59))
      let st = null
      let i = 0
      let day = 0

      function incrementToNextDay(timestamp: WorkDuration): WorkDuration {
        const date = new Date(timestamp)
        date.setDate(date.getDate() + 1)
        date.setHours(0, 0, 0, 0)
        return WorkDuration(date.getTime())
      }
      const daysOfWeek: DayOfWeek[] = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ]

      while (i < shifts.length) {
        if (shifts[i].shift === 'start') {
          if (shifts[i].time > currDate) {
            currDate = incrementToNextDay(currDate)
            i = i - 1
          } else {
            st = shifts[i].time
          }
        } else if (shifts[i].time > currDate && st != null) {
          worktimes.totalTimes[daysOfWeek[day]] = WorkDuration(
            worktimes.totalTimes[daysOfWeek[day]] + currDate - st,
          )
          currDate = incrementToNextDay(currDate)
          st = currDate
          currDate = WorkDuration(new Date(currDate).setHours(23, 59, 59))
          day = day + 1
        } else if (st != null) {
          worktimes.totalTimes[daysOfWeek[day]] = WorkDuration(
            worktimes.totalTimes[daysOfWeek[day]] + shifts[i].time - st,
          )
          st = null
          day = day + 1
        }
        i++
      }

      function undefinedIsZero(num: number | undefined): number {
        return num ? num : 0
      }

      worktimes.totalTimes.monday = WorkDuration(
        worktimes.totalTimes.monday - undefinedIsZero(timeStringToMS(emp.mondayBreak)),
      )

      worktimes.totalTimes.tuesday = WorkDuration(
        worktimes.totalTimes.tuesday + undefinedIsZero(timeStringToMS(emp.tuesdayBreak)),
      )
      worktimes.totalTimes.wednesday = WorkDuration(
        worktimes.totalTimes.wednesday + undefinedIsZero(timeStringToMS(emp.wednesdayBreak)),
      )
      worktimes.totalTimes.thursday = WorkDuration(
        worktimes.totalTimes.thursday + undefinedIsZero(timeStringToMS(emp.thursdayBreak)),
      )
      worktimes.totalTimes.friday = WorkDuration(
        worktimes.totalTimes.friday + undefinedIsZero(timeStringToMS(emp.fridayBreak)),
      )
      worktimes.totalTimes.saturday = WorkDuration(
        undefinedIsZero(timeStringToMS(emp.saturdayBreak)),
      )

      worktimes.totalTimes.sunday = WorkDuration(undefinedIsZero(timeStringToMS(emp.sundayBreak)))
    })
    return right(worktimes)
  }
}

export async function listWorkingEmployees(
  storeID: StoreID,
  startDay: WorkTime,
  quals: GlobalQualID[],
  localQuals: LocalQualID[],
): Promise<Either<string, WorkingHoursIDTotal>> {
  const endDay = WorkTime(new Date())
  endDay.setDate(endDay.getDate() + 7)

  try {
    const createdEmployeeWithStores = await db.transaction(async (tx) => {
      let employeeSpecialTimes: Res[] = []
      let fetchedWorkingHours: (WorkingHoursNull | null)[] = []

      if (quals.length > 0 && localQuals.length > 0) {
        employeeSpecialTimes = await tx
          .select({
            employeeSpecialHoursID: employeeSpecialHours.employeeSpecialHoursID,
            employeeID: employeeSpecialHours.employeeID,
            storeID: employeeSpecialHours.storeID,
            start: employeeSpecialHours.start,
            end: employeeSpecialHours.end,
            description: employeeSpecialHours.description,
            absence: employeeSpecialHours.absence,
          })
          .from(employeeSpecialHours)
          .innerJoin(
            employeeGlobalQualifications,
            eq(employeeGlobalQualifications.employeeID, employeeSpecialHours.employeeID),
          )
          .innerJoin(
            employeeLocalQualifications,
            eq(employeeLocalQualifications.employeeID, employeeSpecialHours.employeeID),
          )
          .innerJoin(employees, eq(employees.employeeActive, EmployeeActive(true)))
          .where(
            and(
              eq(employeeSpecialHours.storeID, storeID),
              gte(employeeSpecialHours.start, endDay),
              lte(employeeSpecialHours.end, startDay),
            ),
          )

        fetchedWorkingHours = (
          await db
            .select()
            .from(employeeWorkingHours)
            .innerJoin(
              employeeGlobalQualifications,
              eq(employeeGlobalQualifications.employeeID, employeeWorkingHours.employeeID),
            )
            .innerJoin(
              employeeLocalQualifications,
              eq(employeeLocalQualifications.employeeID, employeeWorkingHours.employeeID),
            )
            .innerJoin(employees, eq(employees.employeeActive, EmployeeActive(true)))
            .where(and(eq(employeeWorkingHours.storeID, storeID)))
        ).map((x) => x.employeeWorkingHours)
      } else if (quals.length > 0) {
        employeeSpecialTimes = await tx
          .select({
            employeeSpecialHoursID: employeeSpecialHours.employeeSpecialHoursID,
            employeeID: employeeSpecialHours.employeeID,
            storeID: employeeSpecialHours.storeID,
            start: employeeSpecialHours.start,
            end: employeeSpecialHours.end,
            description: employeeSpecialHours.description,
            absence: employeeSpecialHours.absence,
          })
          .from(employeeSpecialHours)
          .innerJoin(
            employeeGlobalQualifications,
            eq(employeeGlobalQualifications.employeeID, employeeSpecialHours.employeeID),
          )
          .innerJoin(employees, eq(employees.employeeActive, EmployeeActive(true)))
          .where(
            and(
              eq(employeeSpecialHours.storeID, storeID),
              gte(employeeSpecialHours.start, endDay),
              lte(employeeSpecialHours.end, startDay),
            ),
          )

        fetchedWorkingHours = (
          await db
            .select()
            .from(employeeWorkingHours)
            .innerJoin(
              employeeGlobalQualifications,
              eq(employeeGlobalQualifications.employeeID, employeeWorkingHours.employeeID),
            )
            .innerJoin(employees, eq(employees.employeeActive, EmployeeActive(true)))
            .where(and(eq(employeeWorkingHours.storeID, storeID)))
        ).map((x) => x.employeeWorkingHours)
      } else if (localQuals.length > 0) {
        employeeSpecialTimes = await tx
          .select({
            employeeSpecialHoursID: employeeSpecialHours.employeeSpecialHoursID,
            employeeID: employeeSpecialHours.employeeID,
            storeID: employeeSpecialHours.storeID,
            start: employeeSpecialHours.start,
            end: employeeSpecialHours.end,
            description: employeeSpecialHours.description,
            absence: employeeSpecialHours.absence,
          })
          .from(employeeSpecialHours)
          .innerJoin(
            employeeLocalQualifications,
            eq(employeeLocalQualifications.employeeID, employeeSpecialHours.employeeID),
          )
          .innerJoin(employees, eq(employees.employeeActive, EmployeeActive(true)))
          .where(
            and(
              eq(employeeSpecialHours.storeID, storeID),
              gte(employeeSpecialHours.start, endDay),
              lte(employeeSpecialHours.end, startDay),
            ),
          )

        fetchedWorkingHours = (
          await db
            .select()
            .from(employeeWorkingHours)
            .innerJoin(
              employeeGlobalQualifications,
              eq(employeeGlobalQualifications.employeeID, employeeWorkingHours.employeeID),
            )
            .innerJoin(employees, eq(employees.employeeActive, EmployeeActive(true)))
            .where(and(eq(employeeWorkingHours.storeID, storeID)))
        ).map((x) => x.employeeWorkingHours)
      } else {
        employeeSpecialTimes = await tx
          .select({
            employeeSpecialHoursID: employeeSpecialHours.employeeSpecialHoursID,
            employeeID: employeeSpecialHours.employeeID,
            storeID: employeeSpecialHours.storeID,
            start: employeeSpecialHours.start,
            end: employeeSpecialHours.end,
            description: employeeSpecialHours.description,
            absence: employeeSpecialHours.absence,
          })
          .from(employeeSpecialHours)
          .innerJoin(employees, eq(employees.employeeActive, EmployeeActive(true)))
          .where(
            and(
              eq(employeeSpecialHours.storeID, storeID),
              gte(employeeSpecialHours.start, endDay),
              lte(employeeSpecialHours.end, startDay),
            ),
          )

        fetchedWorkingHours = await db
          .select()
          .from(employeeWorkingHours)
          .where(and(eq(employeeWorkingHours.storeID, storeID)))
      }
      return { special: employeeSpecialTimes, regular: fetchedWorkingHours }
    })

    return calcTime(startDay, createdEmployeeWithStores.special, createdEmployeeWithStores.regular)
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
        employeeCheckedIn: employeeStore.employeeCheckedIn,
        employeeCheckedOut: employeeStore.employeeCheckedOut,
      })
      .from(employees)
      .innerJoin(employeeStore, eq(employeeStore.employeeID, employees.employeeID))
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
    const employeeCheckinStatus = employeesList.map((employee) => {
      const status = toListCheckinStatus(employee.employeeCheckedIn, employee.employeeCheckedOut)
      return {
        employeeID: employee.employeeID,
        shortUserName: employee.shortUserName,
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
    if (timestamp != null) {
      switch (checkIn) {
        case 'CheckedIn':
          const [setCheckinTime] = await db
            .update(employeeStore)
            .set({ employeeCheckedIn: timestamp })
            .where(
              and(
                eq(employeeStore.employeeID, employeeID),
                or(
                  isNull(employeeStore.employeeCheckedIn),
                  lte(employeeStore.employeeCheckedIn, employeeStore.employeeCheckedOut),
                ),
                eq(employeeStore.storeID, storeID),
              ),
            )
            .returning()

          return setCheckinTime
            ? right({
                employeeID: setCheckinTime.employeeID,
                employeeCheckIn: setCheckinTime.employeeCheckedIn
                  ? EmployeeCheckIn(setCheckinTime.employeeCheckedIn.toISOString())
                  : undefined,
                employeeCheckOut: setCheckinTime.employeeCheckedOut
                  ? EmployeeCheckOut(setCheckinTime.employeeCheckedOut.toISOString())
                  : undefined,
              })
            : left('Already checked in')

        case 'CheckedOut':
          const [setCheckOutTime] = await db
            .update(employeeStore)
            .set({ employeeCheckedOut: timestamp })
            .where(
              and(
                eq(employeeStore.employeeID, employeeID),
                or(
                  isNull(employeeStore.employeeCheckedOut),
                  lte(employeeStore.employeeCheckedOut, employeeStore.employeeCheckedIn),
                ),
                eq(employeeStore.storeID, storeID),
              ),
            )
            .returning()
          return setCheckOutTime
            ? right({
                employeeID: setCheckOutTime.employeeID,
                employeeCheckIn: setCheckOutTime.employeeCheckedIn
                  ? EmployeeCheckIn(setCheckOutTime.employeeCheckedIn.toISOString())
                  : undefined,
                employeeCheckOut: setCheckOutTime.employeeCheckedOut
                  ? EmployeeCheckOut(setCheckOutTime.employeeCheckedOut.toISOString())
                  : undefined,
              })
            : left('Already checked out')
      }
    }
    return left("couldn't checkin/out")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function putEmployee(
  stores: StoreID[],
  employee: CreateEmployee,
  employeeID?: EmployeeID,
): Promise<Either<string, Employee>> {
  if (stores.length < 1) {
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

      const employeeIDStoreID = stores.map((store) => {
        return { storeID: store, employeeID: createdEmployee.employeeID }
      })

      const employeeStoresRes = await tx
        .insert(employeeStore)
        .values(employeeIDStoreID)
        .onConflictDoNothing()
        .returning({ storeID: employeeStore.storeID })

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
        storeIDs: employeeStoresRes.map((row) => row.storeID),
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
        EmployeeActive: employees.employeeActive,
        employeeHourlyRate: employees.employeeHourlyRate,
        employeeHourlyRateCurrency: employees.employeeHourlyRateCurrency,
        employeeActive: employees.employeeActive,
        employeeComment: employees.employeeComment,
        employeeCheckedIn: employeeStore.employeeCheckedIn,
        employeeCheckedOut: employeeStore.employeeCheckedOut,
        storeIDs: sql<
          StoreIDName[]
        >`json_agg(json_build_object('storeID', ${employeeStore.storeID}, 'storeName', ${stores.storeName}))`.as(
          'tagname',
        ),
      })
      .from(employees)
      .where(and(eq(employees.employeeID, employeeID)))
      .innerJoin(users, eq(users.userID, employees.userID))
      .leftJoin(employeeStore, eq(employeeStore.employeeID, employees.employeeID))
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
        .delete(employeeStore)
        .where(eq(employeeStore.employeeID, employeeID))
        .returning()

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
      return { ...deletedEmployeeWithNull, storeIDs: employeeStores.map((row) => row.storeID) }
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
          employeeCheckedIn: employeeStore.employeeCheckedIn,
          employeeCheckedOut: employeeStore.employeeCheckedOut,
          createdAt: employees.createdAt,
          updatedAt: employees.updatedAt,
        })
        .from(employees)
        .innerJoin(employeeStore, eq(employeeStore.employeeID, employees.employeeID))
        .innerJoin(users, eq(users.userID, employees.userID))
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
