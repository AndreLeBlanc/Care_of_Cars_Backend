import { Brand, make } from 'ts-brand'
import {
  storeopeninghours,
  storepaymentinfo,
  stores,
  storespecialhours,
  storeweeklynotes,
} from '../schema/schema.js'

import { Limit, Offset, Page, Search } from '../plugins/pagination.js'

import { db } from '../config/db-connect.js'

import { and, between, eq, ilike, or, sql } from 'drizzle-orm'

type PositiveInteger<T extends number> = `${T}` extends '0' | `-${any}` | `${any}.${any}`
  ? never
  : T

export type StoreName = Brand<string, 'storeName'>
export const StoreName = make<StoreName>()
export type StoreOrgNumber = Brand<string, 'storeOrgNumber'>
export const StoreOrgNumber = make<StoreOrgNumber>()
export type StoreID = Brand<number, 'storeID'>
export const StoreID = make<StoreID>()
export type StoreStatus = Brand<boolean, 'storeStatus'>
export const StoreStatus = make<StoreStatus>()
export type StoreEmail = Brand<string, 'storeEmail'>
export const StoreEmail = make<StoreEmail>()
export type StorePhone = Brand<string, 'storePhone'>
export const StorePhone = make<StorePhone>()
export type StoreAddress = Brand<string, 'storeAddress'>
export const StoreAddress = make<StoreAddress>()
export type StoreZipCode = Brand<string, 'storeZipCode'>
export const StoreZipCode = make<StoreZipCode>()
export type StoreCity = Brand<string, 'storeCity'>
export const StoreCity = make<StoreCity>()
export type StoreCountry = Brand<string, 'storeCountry'>
export const StoreCountry = make<StoreCountry>()
export type StoreDescription = Brand<string, 'storeDescription'>
export const StoreDescription = make<StoreDescription>()
export type StoreContactPerson = Brand<string, 'storeContactPerson'>
export const StoreContactPerson = make<StoreContactPerson>()
export type StoreMaxUsers = Brand<PositiveInteger<number>, 'storeMaxUsers'>
export const StoreMaxUsers = make<StoreMaxUsers>()
export type StoreAllowCarAPI = Brand<boolean, 'storeAllowCarAPI'>
export const StoreAllowCarAPI = make<StoreAllowCarAPI>()
export type StoreAllowSendSMS = Brand<boolean, 'storeAllowSendSMS'>
export const StoreAllowSendSMS = make<StoreAllowSendSMS>()
export type StoreSendSMS = Brand<boolean, 'storeSendSMS'>
export const StoreSendSMS = make<StoreSendSMS>()
export type StoreUsesCheckin = Brand<boolean, 'storeUsesCheckin'>
export const StoreUsesCheckin = make<StoreUsesCheckin>()
export type StoreUsesPIN = Brand<boolean, 'storeUsesPIN'>
export const StoreUsesPIN = make<StoreUsesPIN>()
export type StoreBankgiro = Brand<string, 'storeBankgiro'>
export const StoreBankgiro = make<StoreBankgiro>()
export type StorePlusgiro = Brand<string, 'storePlusgiro'>
export const StorePlusgiro = make<StorePlusgiro>()
export type StorePaymentdays = Brand<PositiveInteger<number>, 'storePaymentdays'>
export const StorePaymentdays = make<StorePaymentdays>()

export type MondayOpen = Brand<string | null, 'mondayOpen'>
export const MondayOpen = make<MondayOpen>()
export type MondayClose = Brand<string | null, 'mondayClose'>
export const MondayClose = make<MondayClose>()
export type TuesdayOpen = Brand<string | null, 'tuesdayOpen'>
export const TuesdayOpen = make<TuesdayOpen>()
export type TuesdayClose = Brand<string | null, 'tuesdayClose'>
export const TuesdayClose = make<TuesdayClose>()
export type WednesdayOpen = Brand<string | null, 'wednesdayOpen'>
export const WednesdayOpen = make<WednesdayOpen>()
export type WednesdayClose = Brand<string | null, 'wednesdayClose'>
export const WednesdayClose = make<WednesdayClose>()
export type ThursdayOpen = Brand<string | null, 'thursdayOpen'>
export const ThursdayOpen = make<ThursdayOpen>()
export type ThursdayClose = Brand<string | null, 'thursdayClose'>
export const ThursdayClose = make<ThursdayClose>()
export type FridayOpen = Brand<string | null, 'fridayOpen'>
export const FridayOpen = make<FridayOpen>()
export type FridayClose = Brand<string | null, 'fridayClose'>
export const FridayClose = make<FridayClose>()
export type SaturdayOpen = Brand<string | null, 'saturdayOpen'>
export const SaturdayOpen = make<SaturdayOpen>()
export type SaturdayClose = Brand<string | null, 'saturdayClose'>
export const SaturdayClose = make<SaturdayClose>()
export type SundayOpen = Brand<string | null, 'sundayOpen'>
export const SundayOpen = make<SundayOpen>()
export type SundayClose = Brand<string | null, 'sundayClose'>
export const SundayClose = make<SundayClose>()

export type WeekNote = Brand<string | null, 'weekNote'>
export const WeekNote = make<WeekNote>()
export type MondayNote = Brand<string | null, 'mondayNote'>
export const MondayNote = make<MondayNote>()
export type TuesdayNote = Brand<string | null, 'tuesdayNote'>
export const TuesdayNote = make<TuesdayNote>()
export type WednesdayNote = Brand<string | null, 'wednesdayNote'>
export const WednesdayNote = make<WednesdayNote>()
export type ThursdayNote = Brand<string | null, 'thursdayNote'>
export const ThursdayNote = make<ThursdayNote>()
export type FridayNote = Brand<string | null, 'fridayNote'>
export const FridayNote = make<FridayNote>()
export type SaturdayNote = Brand<string | null, 'saturdayNote'>
export const SaturdayNote = make<SaturdayNote>()
export type SundayNote = Brand<string | null, 'sundayNote'>
export const SundayNote = make<SundayNote>()
export type Week = Brand<Date, 'week'>
export const Week = make<Week>()

export type Day = Brand<Date, 'day'>
export const Day = make<Day>()
export type DayOpen = Brand<string, 'dayOpen'>
export const DayOpen = make<DayOpen>()
export type DayClose = Brand<string, 'dayClose'>
export const DayClose = make<DayClose>()
export type FromDate = Brand<Date, 'fromDate'>
export const FromDate = make<FromDate>()
export type ToDate = Brand<Date, 'toDate'>
export const ToDate = make<ToDate>()

export type StoreSpecialHoursCreate = {
  storeID: StoreID
  day: Day
  dayOpen: DayOpen
  dayClose: DayClose
}

export type StoreSpecialHours = {
  storeID: StoreID
  day: Day
  dayOpen: DayOpen
  dayClose: DayClose
}

export type WeeklyNotes = {
  storeID: StoreID
  week: Week
  weekNote: WeekNote
  mondayNote: MondayNote
  tuesdayNote: TuesdayNote
  wednesdayNote: WednesdayNote
  thursdayNote: ThursdayNote
  fridayNote: FridayNote
  saturdayNote: SaturdayNote
  sundayNote: SundayNote
}

export type WeekOpeningHoursCreate = {
  mondayOpen: MondayOpen
  mondayClose: MondayClose
  tuesdayOpen: TuesdayOpen
  tuesdayClose: TuesdayClose
  wednesdayOpen: WednesdayOpen
  wednesdayClose: WednesdayClose
  thursdayOpen: ThursdayOpen
  thursdayClose: ThursdayClose
  fridayOpen: FridayOpen
  fridayClose: FridayClose
  saturdayOpen: SaturdayOpen
  saturdayClose: SaturdayClose
  sundayOpen: SundayOpen
  sundayClose: SundayClose
}

export type WeekOpeningHours = WeekOpeningHoursCreate & {
  storeID: StoreID
}

export type OpeningHours = {
  weekyOpeningHours?: WeekOpeningHoursCreate
  specialOpeningHours: StoreSpecialHours[]
}

export type StoreCreate = {
  storeName: StoreName
  storeOrgNumber: StoreOrgNumber
  storeStatus: StoreStatus
  storeEmail: StoreEmail
  storePhone: StorePhone
  storeAddress: StoreAddress
  storeZipCode: StoreZipCode
  storeCity: StoreCity
  storeCountry: StoreCountry
  storeDescription?: StoreDescription
  storeContactPerson?: StoreContactPerson
  storeMaxUsers?: StoreMaxUsers
  storeAllowCarAPI?: StoreAllowCarAPI
  storeAllowSendSMS?: StoreAllowSendSMS
  storeSendSMS?: StoreSendSMS
  storeUsesCheckin?: StoreUsesCheckin
  storeUsesPIN?: StoreUsesPIN
}

export type StoreUpdateCreate = {
  storeName?: StoreName
  storeOrgNumber?: StoreOrgNumber
  storeStatus?: StoreStatus
  storeEmail?: StoreEmail
  storePhone?: StorePhone
  storeAddress?: StoreAddress
  storeZipCode?: StoreZipCode
  storeCity?: StoreCity
  storeCountry?: StoreCountry
  storeDescription?: StoreDescription
  storeContactPerson?: StoreContactPerson
  storeMaxUsers?: StoreMaxUsers
  storeAllowCarAPI?: StoreAllowCarAPI
  storeAllowSendSMS?: StoreAllowSendSMS
  storeSendSMS?: StoreSendSMS
  storeUsesCheckin?: StoreUsesCheckin
  storeUsesPIN?: StoreUsesPIN
}

export type StorePaymentOptions = {
  bankgiro?: StoreBankgiro
  plusgiro?: StorePlusgiro
  paymentdays: StorePaymentdays
}

export type StoreMaybePaymentOptions =
  | {
      bankgiro?: StoreBankgiro
      plusgiro?: StorePlusgiro
      paymentdays?: StorePaymentdays
    }
  | undefined

export type StoresPaginated = {
  totalStores: number
  totalPage: number
  perPage: number
  data: { storeName: StoreName; storeID: StoreID; storeOrgNumber: StoreOrgNumber }[]
}

export type StoreWithSeparateDates = {
  store: { store: Store; createdAt: Date; updatedAt: Date } | undefined
  paymentInfo:
    | { storePaymentOptions: StorePaymentOptions; createdAt: Date; updatedAt: Date }
    | undefined
}

export type Store = StoreCreate & { storeID: StoreID }
function startOfWeek(date: Date): Week {
  date = new Date(date.toLocaleDateString())
  const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)

  return Week(new Date(date.setDate(diff)))
}
export async function updateWeeklyNotes(weekNote: WeeklyNotes): Promise<WeeklyNotes | undefined> {
  weekNote.week = startOfWeek(weekNote.week)
  const [storeNotes] = await db
    .insert(storeweeklynotes)
    .values(weekNote)
    .onConflictDoUpdate({
      target: [storeweeklynotes.storeID, storeweeklynotes.week],
      set: weekNote,
    })
    .returning()
  console.log(storeNotes)
  return storeNotes
    ? {
        storeID: StoreID(storeNotes.storeID),
        week: startOfWeek(storeNotes.week),
        weekNote: WeekNote(storeNotes.weekNote),
        mondayNote: MondayNote(storeNotes.mondayNote),
        tuesdayNote: TuesdayNote(storeNotes.tuesdayNote),
        wednesdayNote: WednesdayNote(storeNotes.wednesdayNote),
        thursdayNote: ThursdayNote(storeNotes.thursdayNote),
        fridayNote: FridayNote(storeNotes.fridayNote),
        saturdayNote: SaturdayNote(storeNotes.saturdayNote),
        sundayNote: SundayNote(storeNotes.sundayNote),
      }
    : undefined
}

export async function getWeeklyNotes(
  storeID: StoreID,
  week: Week,
): Promise<WeeklyNotes | undefined> {
  week = startOfWeek(week)
  const [storeNotes] = await db
    .select()
    .from(storeweeklynotes)
    .where(and(eq(storeweeklynotes.storeID, storeID), eq(storeweeklynotes.week, week)))
  return storeNotes
    ? {
        storeID: StoreID(storeNotes.storeID),
        week: startOfWeek(storeNotes.week),
        weekNote: WeekNote(storeNotes.weekNote),
        mondayNote: MondayNote(storeNotes.mondayNote),
        tuesdayNote: TuesdayNote(storeNotes.tuesdayNote),
        wednesdayNote: WednesdayNote(storeNotes.wednesdayNote),
        thursdayNote: ThursdayNote(storeNotes.thursdayNote),
        fridayNote: FridayNote(storeNotes.fridayNote),
        saturdayNote: SaturdayNote(storeNotes.saturdayNote),
        sundayNote: SundayNote(storeNotes.sundayNote),
      }
    : undefined
}

export async function deleteWeeklyNotes(
  storeID: StoreID,
  week: Week,
): Promise<WeeklyNotes | undefined> {
  week = startOfWeek(week)
  const [storeNotes] = await db
    .delete(storeweeklynotes)
    .where(and(eq(storeweeklynotes.storeID, storeID), eq(storeweeklynotes.week, week)))
    .returning()
  return storeNotes
    ? {
        storeID: StoreID(storeNotes.storeID),
        week: startOfWeek(storeNotes.week),
        weekNote: WeekNote(storeNotes.weekNote),
        mondayNote: MondayNote(storeNotes.mondayNote),
        tuesdayNote: TuesdayNote(storeNotes.tuesdayNote),
        wednesdayNote: WednesdayNote(storeNotes.wednesdayNote),
        thursdayNote: ThursdayNote(storeNotes.thursdayNote),
        fridayNote: FridayNote(storeNotes.fridayNote),
        saturdayNote: SaturdayNote(storeNotes.saturdayNote),
        sundayNote: SundayNote(storeNotes.sundayNote),
      }
    : undefined
}

export async function updateWeeklyOpeningHours(
  storeID: StoreID,
  openingHours: WeekOpeningHoursCreate,
): Promise<WeekOpeningHours | undefined> {
  const [storeHours] = await db
    .insert(storeopeninghours)
    .values({ ...openingHours, storeID: storeID })
    .onConflictDoUpdate({
      target: storepaymentinfo.storeID,
      set: openingHours,
    })
    .returning({
      mondayOpen: storeopeninghours.mondayOpen,
      mondayClose: storeopeninghours.mondayClose,
      tuesdayopen: storeopeninghours.tuesdayOpen,
      tuesdayClose: storeopeninghours.tuesdayClose,
      wednesdayopen: storeopeninghours.wednesdayOpen,
      wednesdayClose: storeopeninghours.wednesdayClose,
      thursdayopen: storeopeninghours.thursdayOpen,
      thursdayClose: storeopeninghours.thursdayClose,
      fridayopen: storeopeninghours.fridayOpen,
      fridayClose: storeopeninghours.fridayClose,
      saturdayopen: storeopeninghours.saturdayOpen,
      saturdayClose: storeopeninghours.saturdayClose,
      sundayopen: storeopeninghours.sundayOpen,
      sundayClose: storeopeninghours.sundayClose,
    })

  return storeHours
    ? {
        storeID: storeID,
        mondayOpen: MondayOpen(storeHours.mondayOpen),
        mondayClose: MondayClose(storeHours.mondayClose),
        tuesdayOpen: TuesdayOpen(storeHours.tuesdayopen),
        tuesdayClose: TuesdayClose(storeHours.tuesdayClose),
        wednesdayOpen: WednesdayOpen(storeHours.wednesdayopen),
        wednesdayClose: WednesdayClose(storeHours.wednesdayClose),
        thursdayOpen: ThursdayOpen(storeHours.thursdayopen),
        thursdayClose: ThursdayClose(storeHours.thursdayClose),
        fridayOpen: FridayOpen(storeHours.fridayopen),
        fridayClose: FridayClose(storeHours.fridayClose),
        saturdayOpen: SaturdayOpen(storeHours.saturdayopen),
        saturdayClose: SaturdayClose(storeHours.saturdayClose),
        sundayOpen: SundayOpen(storeHours.sundayopen),
        sundayClose: SundayClose(storeHours.sundayClose),
      }
    : undefined
}

export async function createSpecialOpeningHours(
  openingHours: StoreSpecialHoursCreate,
): Promise<StoreSpecialHours | undefined> {
  const [storeHours] = await db.insert(storespecialhours).values(openingHours).returning({
    storeID: storespecialhours.storeID,
    day: storespecialhours.day,
    dayOpen: storespecialhours.dayOpen,
    dayClose: storespecialhours.dayClose,
  })

  return storeHours
    ? {
        storeID: StoreID(storeHours.storeID),
        day: Day(storeHours.day),
        dayOpen: DayOpen(storeHours.dayOpen),
        dayClose: DayClose(storeHours.dayClose),
      }
    : undefined
}

export async function updateSpecialOpeningHours(
  openingHours: StoreSpecialHours,
): Promise<StoreSpecialHours | undefined> {
  const [storeHours] = await db
    .update(storespecialhours)
    .set(openingHours)
    .where(
      and(
        eq(storespecialhours.storeID, openingHours.storeID),
        eq(storespecialhours.day, new Date(openingHours.day.toISOString().split('T')[0])),
      ),
    )
    .returning({
      storeID: storespecialhours.storeID,
      day: storespecialhours.day,
      dayOpen: storespecialhours.dayOpen,
      dayClose: storespecialhours.dayClose,
    })

  return storeHours
    ? {
        storeID: StoreID(storeHours.storeID),
        day: Day(storeHours.day),
        dayOpen: DayOpen(storeHours.dayOpen),
        dayClose: DayClose(storeHours.dayClose),
      }
    : undefined
}

export async function deleteSpecialOpeningHoursByDayAndStore(
  day: Day,
  storeID: StoreID,
): Promise<StoreSpecialHours | undefined> {
  const [storeHours] = await db
    .delete(storespecialhours)
    .where(
      and(
        eq(storespecialhours.storeID, storeID),
        eq(storespecialhours.day, new Date(day.toISOString().split('T')[0])),
      ),
    )
    .returning({
      storeID: storespecialhours.storeID,
      day: storespecialhours.day,
      dayOpen: storespecialhours.dayOpen,
      dayClose: storespecialhours.dayClose,
    })
  return storeHours
    ? {
        storeID: StoreID(storeHours.storeID),
        day: Day(storeHours.day),
        dayOpen: DayOpen(storeHours.dayOpen),
        dayClose: DayClose(storeHours.dayClose),
      }
    : undefined
}

export async function deleteSpecialOpeningHoursDates(
  fromDate: FromDate,
  toDate: ToDate,
  storeID: StoreID,
): Promise<StoreSpecialHours | undefined> {
  const [storeHours] = await db
    .delete(storespecialhours)
    .where(
      and(
        eq(storespecialhours.storeID, storeID),
        between(
          storespecialhours.day,
          new Date(fromDate.toISOString().split('T')[0]),
          new Date(toDate.toISOString().split('T')[0]),
        ),
      ),
    )
    .returning({
      storeID: storespecialhours.storeID,
      day: storespecialhours.day,
      dayOpen: storespecialhours.dayOpen,
      dayClose: storespecialhours.dayClose,
    })

  return storeHours
    ? {
        storeID: StoreID(storeHours.storeID),
        day: Day(storeHours.day),
        dayOpen: DayOpen(storeHours.dayOpen),
        dayClose: DayClose(storeHours.dayClose),
      }
    : undefined
}

export async function deleteWeeklyOpeningHours(
  storeID: StoreID,
): Promise<WeekOpeningHours | undefined> {
  const [storeHours] = await db
    .delete(storeopeninghours)
    .where(eq(storeopeninghours.storeID, storeID))
    .returning({
      mondayOpen: storeopeninghours.mondayOpen,
      mondayClose: storeopeninghours.mondayClose,
      tuesdayOpen: storeopeninghours.tuesdayOpen,
      tuesdayClose: storeopeninghours.tuesdayClose,
      wednesdayOpen: storeopeninghours.wednesdayOpen,
      wednesdayClose: storeopeninghours.wednesdayClose,
      thursdayOpen: storeopeninghours.thursdayOpen,
      thursdayClose: storeopeninghours.thursdayClose,
      fridayOpen: storeopeninghours.fridayOpen,
      fridayClose: storeopeninghours.fridayClose,
      saturdayOpen: storeopeninghours.saturdayOpen,
      saturdayClose: storeopeninghours.saturdayClose,
      sundayOpen: storeopeninghours.sundayOpen,
      sundayClose: storeopeninghours.sundayClose,
    })

  return storeHours
    ? {
        storeID: storeID,
        mondayOpen: MondayOpen(storeHours.mondayOpen),
        mondayClose: MondayClose(storeHours.mondayClose),
        tuesdayOpen: TuesdayOpen(storeHours.tuesdayOpen),
        tuesdayClose: TuesdayClose(storeHours.tuesdayClose),
        wednesdayOpen: WednesdayOpen(storeHours.wednesdayOpen),
        wednesdayClose: WednesdayClose(storeHours.wednesdayClose),
        thursdayOpen: ThursdayOpen(storeHours.thursdayOpen),
        thursdayClose: ThursdayClose(storeHours.thursdayClose),
        fridayOpen: FridayOpen(storeHours.fridayOpen),
        fridayClose: FridayClose(storeHours.fridayClose),
        saturdayOpen: SaturdayOpen(storeHours.saturdayOpen),
        saturdayClose: SaturdayClose(storeHours.saturdayClose),
        sundayOpen: SundayOpen(storeHours.sundayOpen),
        sundayClose: SundayClose(storeHours.sundayClose),
      }
    : undefined
}

export async function getOpeningHours(
  storeID: StoreID,
  from: FromDate,
  to: ToDate,
): Promise<OpeningHours | undefined> {
  const { weeklyOpeningHours, specialOpeningHours } = await db.transaction(async (tx) => {
    const weeklyOpeningHours = await tx.query.storeopeninghours.findFirst({
      where: eq(storeopeninghours.storeID, storeID),
    })

    const specialOpeningHours = await tx
      .select({
        storeID: storespecialhours.storeID,
        day: storespecialhours.day,
        dayOpen: storespecialhours.dayOpen,
        dayClose: storespecialhours.dayClose,
      })
      .from(storespecialhours)
      .where(
        and(
          eq(storespecialhours.storeID, storeID),
          between(
            storespecialhours.day,
            new Date(from.toISOString().split('T')[0]),
            new Date(to.toISOString().split('T')[0]),
          ),
        ),
      )

    return { weeklyOpeningHours, specialOpeningHours }
  })

  const brandedWeeklyOpeningHours: WeekOpeningHours | undefined = weeklyOpeningHours
    ? {
        storeID: storeID,
        mondayOpen: MondayOpen(weeklyOpeningHours.mondayOpen),
        mondayClose: MondayClose(weeklyOpeningHours.mondayClose),
        tuesdayOpen: TuesdayOpen(weeklyOpeningHours.tuesdayOpen),
        tuesdayClose: TuesdayClose(weeklyOpeningHours.tuesdayClose),
        wednesdayOpen: WednesdayOpen(weeklyOpeningHours.wednesdayOpen),
        wednesdayClose: WednesdayClose(weeklyOpeningHours.wednesdayClose),
        thursdayOpen: ThursdayOpen(weeklyOpeningHours.thursdayOpen),
        thursdayClose: ThursdayClose(weeklyOpeningHours.thursdayClose),
        fridayOpen: FridayOpen(weeklyOpeningHours.fridayOpen),
        fridayClose: FridayClose(weeklyOpeningHours.fridayClose),
        saturdayOpen: SaturdayOpen(weeklyOpeningHours.saturdayOpen),
        saturdayClose: SaturdayClose(weeklyOpeningHours.saturdayClose),
        sundayOpen: SundayOpen(weeklyOpeningHours.sundayOpen),
        sundayClose: SundayClose(weeklyOpeningHours.sundayClose),
      }
    : undefined

  const brandedSpecialOpeningHours: StoreSpecialHours[] = specialOpeningHours.map((openingHour) => {
    return {
      storeID: StoreID(openingHour.storeID),
      day: Day(openingHour.day),
      dayOpen: DayOpen(openingHour.dayOpen),
      dayClose: DayClose(openingHour.dayClose),
    }
  })
  return {
    weekyOpeningHours: brandedWeeklyOpeningHours,
    specialOpeningHours: brandedSpecialOpeningHours,
  }
}

export async function createStore(
  store: StoreCreate,
  paymentInfo?: StorePaymentOptions,
): Promise<
  | {
      store: Store
      paymentInfo: StorePaymentOptions | undefined
      updatedAt: Date
      createdAt: Date
    }
  | undefined
> {
  const { newStore, maybePaymentInfo } = await db.transaction(async (tx) => {
    const [newStore] = await tx
      .insert(stores)
      .values({
        storeName: store.storeName,
        storeOrgNumber: store.storeOrgNumber,
        storeStatus: store.storeStatus,
        storeEmail: store.storeEmail,
        storePhone: store.storePhone,
        storeAddress: store.storeAddress,
        storeZipCode: store.storeZipCode,
        storeCity: store.storeCity,
        storeCountry: store.storeCountry,
        storeDescription: store.storeDescription,
        storeContactPerson: store.storeContactPerson,
        storeMaxUsers: store.storeMaxUsers,
        storeAllowCarAPI: store.storeAllowCarAPI,
        storeAllowSendSMS: store.storeAllowSendSMS,
        storeSendSMS: store.storeSendSMS,
        storeUsesCheckin: store.storeUsesCheckin,
        storeUsesPIN: store.storeUsesPIN,
      })
      .returning({
        storeName: stores.storeName,
        storeID: stores.storeID,
        storeOrgNumber: stores.storeOrgNumber,
        storeStatus: stores.storeStatus,
        storeEmail: stores.storeEmail,
        storePhone: stores.storePhone,
        storeAddress: stores.storeAddress,
        storeZipCode: stores.storeZipCode,
        storeCity: stores.storeCity,
        storeCountry: stores.storeCountry,
        storeDescription: stores.storeDescription,
        storeContactPerson: stores.storeContactPerson,
        storeMaxUsers: stores.storeMaxUsers,
        storeAllowCarAPI: stores.storeAllowCarAPI,
        storeAllowSendSMS: stores.storeAllowSendSMS,
        storeSendSMS: stores.storeSendSMS,
        storeUsesCheckin: stores.storeUsesCheckin,
        storeUsesPIN: stores.storeUsesPIN,
        createdAt: stores.createdAt,
        updatedAt: stores.updatedAt,
      })
    let maybePaymentInfo = undefined
    if (newStore != null && paymentInfo != null) {
      ;[maybePaymentInfo] = await tx
        .insert(storepaymentinfo)
        .values({
          storeID: newStore.storeID,
          bankgiro: paymentInfo.bankgiro,
          plusgiro: paymentInfo.plusgiro,
          paymentdays: paymentInfo.paymentdays,
        })
        .returning({
          storeID: storepaymentinfo.storeID,
          bankgiro: storepaymentinfo.bankgiro,
          plusgiro: storepaymentinfo.plusgiro,
          paymentdays: storepaymentinfo.paymentdays,
          createdAt: storepaymentinfo.createdAt,
          updatedAt: storepaymentinfo.updatedAt,
        })
    }
    return { newStore, maybePaymentInfo }
  })
  if (newStore != null) {
    return {
      store: {
        storeName: StoreName(newStore.storeName),
        storeID: StoreID(newStore.storeID),
        storeOrgNumber: StoreOrgNumber(newStore.storeOrgNumber),
        storeStatus: StoreStatus(newStore.storeStatus),
        storeEmail: StoreEmail(newStore.storeEmail),
        storePhone: StorePhone(newStore.storePhone),
        storeAddress: StoreAddress(newStore.storeAddress),
        storeZipCode: StoreZipCode(newStore.storeZipCode),
        storeCity: StoreCity(newStore.storeCity),
        storeCountry: StoreCountry(newStore.storeCountry),
        storeDescription: newStore.storeDescription
          ? StoreDescription(newStore.storeDescription)
          : undefined,
        storeContactPerson: newStore.storeContactPerson
          ? StoreContactPerson(newStore.storeContactPerson)
          : undefined,
        storeMaxUsers: newStore.storeMaxUsers ? StoreMaxUsers(newStore.storeMaxUsers) : undefined,
        storeAllowCarAPI: newStore.storeAllowCarAPI
          ? StoreAllowCarAPI(newStore.storeAllowCarAPI)
          : undefined,
        storeAllowSendSMS: newStore.storeAllowSendSMS
          ? StoreAllowSendSMS(newStore.storeAllowSendSMS)
          : undefined,
        storeSendSMS: newStore.storeSendSMS ? StoreSendSMS(newStore.storeSendSMS) : undefined,
        storeUsesCheckin: newStore.storeUsesCheckin
          ? StoreUsesCheckin(newStore.storeUsesCheckin)
          : undefined,
        storeUsesPIN: newStore.storeUsesPIN ? StoreUsesPIN(newStore.storeUsesPIN) : undefined,
      },
      paymentInfo: maybePaymentInfo
        ? {
            bankgiro: maybePaymentInfo.bankgiro
              ? StoreBankgiro(maybePaymentInfo.bankgiro)
              : undefined,
            plusgiro: maybePaymentInfo.plusgiro
              ? StorePlusgiro(maybePaymentInfo.plusgiro)
              : undefined,
            paymentdays: StorePaymentdays(maybePaymentInfo.paymentdays),
          }
        : undefined,
      createdAt: newStore.createdAt,
      updatedAt: newStore.updatedAt,
    }
  }
  return undefined
}

export async function deleteStore(
  storeID: StoreID,
): Promise<{ store: Store; createdAt: Date; updatedAt: Date } | undefined> {
  const [deletedStore] = await db.delete(stores).where(eq(stores.storeID, storeID)).returning({
    storeName: stores.storeName,
    storeID: stores.storeID,
    storeOrgNumber: stores.storeOrgNumber,
    storeStatus: stores.storeStatus,
    storeEmail: stores.storeEmail,
    storePhone: stores.storePhone,
    storeAddress: stores.storeAddress,
    storeZipCode: stores.storeZipCode,
    storeCity: stores.storeCity,
    storeCountry: stores.storeCountry,
    storeDescription: stores.storeDescription,
    storeContactPerson: stores.storeContactPerson,
    storeMaxUsers: stores.storeMaxUsers,
    storeAllowCarAPI: stores.storeAllowCarAPI,
    storeAllowSendSMS: stores.storeAllowSendSMS,
    storeSendSMS: stores.storeSendSMS,
    storeUsesCheckin: stores.storeUsesCheckin,
    storeUsesPIN: stores.storeUsesPIN,
    createdAt: stores.createdAt,
    updatedAt: stores.updatedAt,
  })
  return deletedStore
    ? {
        store: {
          storeName: StoreName(deletedStore.storeName),
          storeID: StoreID(deletedStore.storeID),
          storeOrgNumber: StoreOrgNumber(deletedStore.storeOrgNumber),
          storeStatus: StoreStatus(deletedStore.storeStatus),
          storeEmail: StoreEmail(deletedStore.storeEmail),
          storePhone: StorePhone(deletedStore.storePhone),
          storeAddress: StoreAddress(deletedStore.storeAddress),
          storeZipCode: StoreZipCode(deletedStore.storeZipCode),
          storeCity: StoreCity(deletedStore.storeCity),
          storeCountry: StoreCountry(deletedStore.storeCountry),
          storeDescription: deletedStore.storeDescription
            ? StoreDescription(deletedStore.storeDescription)
            : undefined,
          storeContactPerson: deletedStore.storeContactPerson
            ? StoreContactPerson(deletedStore.storeContactPerson)
            : undefined,
          storeMaxUsers: deletedStore.storeMaxUsers
            ? StoreMaxUsers(deletedStore.storeMaxUsers)
            : undefined,
          storeAllowCarAPI: deletedStore.storeAllowCarAPI
            ? StoreAllowCarAPI(deletedStore.storeAllowCarAPI)
            : undefined,
          storeAllowSendSMS: deletedStore.storeAllowSendSMS
            ? StoreAllowSendSMS(deletedStore.storeAllowSendSMS)
            : undefined,
          storeSendSMS: deletedStore.storeSendSMS
            ? StoreSendSMS(deletedStore.storeSendSMS)
            : undefined,
          storeUsesCheckin: deletedStore.storeUsesCheckin
            ? StoreUsesCheckin(deletedStore.storeUsesCheckin)
            : undefined,
          storeUsesPIN: deletedStore.storeUsesPIN
            ? StoreUsesPIN(deletedStore.storeUsesPIN)
            : undefined,
        },
        createdAt: deletedStore.createdAt,
        updatedAt: deletedStore.updatedAt,
      }
    : undefined
}

export async function updateStoreByStoreID(
  storeID: StoreID,
  storePatch?: StoreUpdateCreate,
  storePaymentPatch?: StoreMaybePaymentOptions,
): Promise<StoreWithSeparateDates> {
  const updatedAt: Date = new Date()

  const { updatedStore, updatedPaymentInfo } = await db.transaction(async (tx) => {
    let updatedStore = undefined
    if (storePatch !== null) {
      const storeWithUpdatedAt = { ...storePatch, updatedAt: updatedAt }
      ;[updatedStore] = await tx
        .update(stores)
        .set(storeWithUpdatedAt)
        .where(eq(stores.storeID, storeID))
        .returning({
          storeName: stores.storeName,
          storeID: stores.storeID,
          storeOrgNumber: stores.storeOrgNumber,
          storeStatus: stores.storeStatus,
          storeEmail: stores.storeEmail,
          storePhone: stores.storePhone,
          storeAddress: stores.storeAddress,
          storeZipCode: stores.storeZipCode,
          storeCity: stores.storeCity,
          storeCountry: stores.storeCountry,
          storeDescription: stores.storeDescription,
          storeContactPerson: stores.storeContactPerson,
          storeMaxUsers: stores.storeMaxUsers,
          storeAllowCarAPI: stores.storeAllowCarAPI,
          storeAllowSendSMS: stores.storeAllowSendSMS,
          storeSendSMS: stores.storeSendSMS,
          storeUsesCheckin: stores.storeUsesCheckin,
          storeUsesPIN: stores.storeUsesPIN,
          createdAt: stores.createdAt,
          updatedAt: stores.updatedAt,
        })
    }
    let updatedPaymentInfo = undefined
    if (storePaymentPatch != null && updatedStore != null) {
      const storePaymentPatchWithUpdatedAt = { ...storePaymentPatch, updatedAt: updatedAt }
      console.log('updating payment info')
      ;[updatedPaymentInfo] = await tx
        .insert(storepaymentinfo)
        .values({ ...storePaymentPatchWithUpdatedAt, storeID: updatedStore.storeID })
        .onConflictDoUpdate({
          target: storepaymentinfo.storeID,
          set: storePaymentPatchWithUpdatedAt,
        })
        .returning({
          bankgiro: storepaymentinfo.bankgiro,
          plusgiro: storepaymentinfo.plusgiro,
          paymentdays: storepaymentinfo.paymentdays,
          createdAt: storepaymentinfo.createdAt,
          updatedAt: storepaymentinfo.updatedAt,
        })
    }
    console.log(updatedPaymentInfo)
    return { updatedStore, updatedPaymentInfo }
  })
  return {
    store: updatedStore
      ? {
          store: {
            storeName: StoreName(updatedStore.storeName),
            storeID: StoreID(updatedStore.storeID),
            storeOrgNumber: StoreOrgNumber(updatedStore.storeOrgNumber),
            storeStatus: StoreStatus(updatedStore.storeStatus),
            storeEmail: StoreEmail(updatedStore.storeEmail),
            storePhone: StorePhone(updatedStore.storePhone),
            storeAddress: StoreAddress(updatedStore.storeAddress),
            storeZipCode: StoreZipCode(updatedStore.storeZipCode),
            storeCity: StoreCity(updatedStore.storeCity),
            storeCountry: StoreCountry(updatedStore.storeCountry),
            storeDescription: updatedStore.storeDescription
              ? StoreDescription(updatedStore.storeDescription)
              : undefined,
            storeContactPerson: updatedStore.storeContactPerson
              ? StoreContactPerson(updatedStore.storeContactPerson)
              : undefined,
            storeMaxUsers: updatedStore.storeMaxUsers
              ? StoreMaxUsers(updatedStore.storeMaxUsers)
              : undefined,
            storeAllowCarAPI: updatedStore.storeAllowCarAPI
              ? StoreAllowCarAPI(updatedStore.storeAllowCarAPI)
              : undefined,
            storeAllowSendSMS: updatedStore.storeAllowSendSMS
              ? StoreAllowSendSMS(updatedStore.storeAllowSendSMS)
              : undefined,
            storeSendSMS: updatedStore.storeSendSMS
              ? StoreSendSMS(updatedStore.storeSendSMS)
              : undefined,
            storeUsesCheckin: updatedStore.storeUsesCheckin
              ? StoreUsesCheckin(updatedStore.storeUsesCheckin)
              : undefined,
            storeUsesPIN: updatedStore.storeUsesPIN
              ? StoreUsesPIN(updatedStore.storeUsesPIN)
              : undefined,
          },
          createdAt: updatedStore.createdAt,
          updatedAt: updatedStore.updatedAt,
        }
      : undefined,
    paymentInfo: updatedPaymentInfo
      ? {
          storePaymentOptions: {
            bankgiro: updatedPaymentInfo.bankgiro
              ? StoreBankgiro(updatedPaymentInfo.bankgiro)
              : undefined,
            plusgiro: updatedPaymentInfo.plusgiro
              ? StorePlusgiro(updatedPaymentInfo.plusgiro)
              : undefined,
            paymentdays: StorePaymentdays(updatedPaymentInfo.paymentdays),
          },
          createdAt: updatedPaymentInfo.createdAt,
          updatedAt: updatedPaymentInfo.updatedAt,
        }
      : undefined,
  }
}

export async function getStoreByID(storeID: StoreID): Promise<StoreWithSeparateDates> {
  const { getStore, paymentInfo } = await db.transaction(async (tx) => {
    let paymentInfo = undefined
    const [getStore] = await tx.select().from(stores).where(eq(stores.storeID, storeID))
    if (getStore != null) {
      ;[paymentInfo] = await tx
        .select()
        .from(storepaymentinfo)
        .where(eq(storepaymentinfo.storeID, storeID))
    }
    return { getStore, paymentInfo }
  })

  return {
    store: getStore
      ? {
          store: {
            storeName: StoreName(getStore.storeName),
            storeID: StoreID(getStore.storeID),
            storeOrgNumber: StoreOrgNumber(getStore.storeOrgNumber),
            storeStatus: StoreStatus(getStore.storeStatus),
            storeEmail: StoreEmail(getStore.storeEmail),
            storePhone: StorePhone(getStore.storePhone),
            storeAddress: StoreAddress(getStore.storeAddress),
            storeZipCode: StoreZipCode(getStore.storeZipCode),
            storeCity: StoreCity(getStore.storeCity),
            storeCountry: StoreCountry(getStore.storeCountry),
            storeDescription: getStore.storeDescription
              ? StoreDescription(getStore.storeDescription)
              : undefined,
            storeContactPerson: getStore.storeContactPerson
              ? StoreContactPerson(getStore.storeContactPerson)
              : undefined,
            storeMaxUsers: getStore.storeMaxUsers
              ? StoreMaxUsers(getStore.storeMaxUsers)
              : undefined,
            storeAllowCarAPI: getStore.storeAllowCarAPI
              ? StoreAllowCarAPI(getStore.storeAllowCarAPI)
              : undefined,
            storeAllowSendSMS: getStore.storeAllowSendSMS
              ? StoreAllowSendSMS(getStore.storeAllowSendSMS)
              : undefined,
            storeSendSMS: getStore.storeSendSMS ? StoreSendSMS(getStore.storeSendSMS) : undefined,
            storeUsesCheckin: getStore.storeUsesCheckin
              ? StoreUsesCheckin(getStore.storeUsesCheckin)
              : undefined,
            storeUsesPIN: getStore.storeUsesPIN ? StoreUsesPIN(getStore.storeUsesPIN) : undefined,
          },
          createdAt: getStore.createdAt,
          updatedAt: getStore.updatedAt,
        }
      : undefined,
    paymentInfo: paymentInfo
      ? {
          storePaymentOptions: {
            bankgiro: paymentInfo.bankgiro ? StoreBankgiro(paymentInfo.bankgiro) : undefined,
            plusgiro: paymentInfo.plusgiro ? StorePlusgiro(paymentInfo.plusgiro) : undefined,
            paymentdays: StorePaymentdays(paymentInfo.paymentdays),
          },
          createdAt: paymentInfo.createdAt,
          updatedAt: paymentInfo.updatedAt,
        }
      : undefined,
  }
}

export async function getStoresPaginate(
  search: Search,
  limit = Limit(10),
  page = Page(1),
  offset = Offset(0),
): Promise<StoresPaginated> {
  const { totalStores, storesList } = await db.transaction(async (tx) => {
    const condition = or(
      ilike(stores.storeName, '%' + search + '%'),
      ilike(stores.storeOrgNumber, '%' + search + '%'),
      ilike(stores.storeAddress, '%' + search + '%'),
    )
    const [totalStores] = await tx
      .select({
        count: sql`count(*)`.mapWith(Number).as('count'),
      })
      .from(stores)
      .where(condition)

    const storesList = await tx
      .select({
        storeID: stores.storeID,
        storeName: stores.storeName,
        storeOrgNumber: stores.storeOrgNumber,
      })
      .from(stores)
      .where(condition)
      .limit(limit || 10)
      .offset(offset || 0)
    return { totalStores, storesList }
  })
  const totalPage = Math.ceil(totalStores.count / limit)

  const brandedStoresList = storesList.map((stores) => {
    return {
      storeID: StoreID(stores.storeID),
      storeName: StoreName(stores.storeName),
      storeOrgNumber: StoreOrgNumber(stores.storeOrgNumber),
    }
  })
  return {
    totalStores: totalStores.count,
    totalPage,
    perPage: page,
    data: brandedStoresList,
  }
}
