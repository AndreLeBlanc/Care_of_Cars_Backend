import {
  Day,
  DayClose,
  DayOpen,
  FridayClose,
  FridayNote,
  FridayOpen,
  MondayClose,
  MondayNote,
  MondayOpen,
  SaturdayClose,
  SaturdayNote,
  SaturdayOpen,
  StoreAddress,
  StoreAllowCarAPI,
  StoreAllowSendSMS,
  StoreBankgiro,
  StoreCity,
  StoreContactPerson,
  StoreCountry,
  StoreDescription,
  StoreEmail,
  StoreID,
  StoreMaxUsers,
  StoreName,
  StoreOrgNumber,
  StorePaymentdays,
  StorePhone,
  StorePlusgiro,
  StoreSendSMS,
  StoreStatus,
  StoreUsesCheckin,
  StoreUsesPIN,
  StoreZipCode,
  SundayClose,
  SundayNote,
  SundayOpen,
  ThursdayClose,
  ThursdayNote,
  ThursdayOpen,
  TuesdayClose,
  TuesdayNote,
  TuesdayOpen,
  WednesdayClose,
  WednesdayNote,
  WednesdayOpen,
  Week,
  WeekNote,
  storeopeninghours,
  storepaymentinfo,
  stores,
  storespecialhours,
  storeweeklynotes,
} from '../schema/schema.js'

import { Limit, Offset, Page, ResultCount, Search } from '../plugins/pagination.js'

import { db } from '../config/db-connect.js'

import { and, between, eq, ilike, or, sql } from 'drizzle-orm'

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

export type Notes = {
  storeID: StoreID
  weekNote?: WeekNote
  mondayNote?: MondayNote
  tuesdayNote?: TuesdayNote
  wednesdayNote?: WednesdayNote
  thursdayNote?: ThursdayNote
  fridayNote?: FridayNote
  saturdayNote?: SaturdayNote
  sundayNote?: SundayNote
}

export type WeekOpeningHoursCreate = {
  mondayOpen?: MondayOpen
  mondayClose?: MondayClose
  tuesdayOpen?: TuesdayOpen
  tuesdayClose?: TuesdayClose
  wednesdayOpen?: WednesdayOpen
  wednesdayClose?: WednesdayClose
  thursdayOpen?: ThursdayOpen
  thursdayClose?: ThursdayClose
  fridayOpen?: FridayOpen
  fridayClose?: FridayClose
  saturdayOpen?: SaturdayOpen
  saturdayClose?: SaturdayClose
  sundayOpen?: SundayOpen
  sundayClose?: SundayClose
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
  totalStores: ResultCount
  totalPage: Page
  perPage: Limit
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
export async function updateWeeklyNotes(
  notes: Notes,
  week: Week,
): Promise<{ notes: Notes; week: Week } | undefined> {
  week = startOfWeek(week)
  const [storeNotes] = await db
    .insert(storeweeklynotes)
    .values({ ...notes, week })
    .onConflictDoUpdate({
      target: [storeweeklynotes.storeID, storeweeklynotes.week],
      set: { ...notes, week },
    })
    .returning()
  return storeNotes
    ? {
        notes: {
          storeID: storeNotes.storeID,
          weekNote: storeNotes.weekNote ?? undefined,
          mondayNote: storeNotes.mondayNote ?? undefined,
          tuesdayNote: storeNotes.tuesdayNote ?? undefined,
          wednesdayNote: storeNotes.wednesdayNote ?? undefined,
          thursdayNote: storeNotes.thursdayNote ?? undefined,
          fridayNote: storeNotes.fridayNote ?? undefined,
          saturdayNote: storeNotes.saturdayNote ?? undefined,
          sundayNote: storeNotes.sundayNote ?? undefined,
        },
        week: Week(storeNotes.week),
      }
    : undefined
}

export async function getWeeklyNotes(
  storeID: StoreID,
  week: Week,
): Promise<{ notes: Notes; week: Week } | undefined> {
  week = startOfWeek(week)
  const [storeNotes] = await db
    .select()
    .from(storeweeklynotes)
    .where(and(eq(storeweeklynotes.storeID, storeID), eq(storeweeklynotes.week, week)))
  return storeNotes
    ? {
        notes: {
          storeID: StoreID(storeNotes.storeID),
          weekNote: storeNotes.weekNote ?? undefined,
          mondayNote: storeNotes.mondayNote ?? undefined,
          tuesdayNote: storeNotes.tuesdayNote ?? undefined,
          wednesdayNote: storeNotes.wednesdayNote ?? undefined,
          thursdayNote: storeNotes.thursdayNote ?? undefined,
          fridayNote: storeNotes.fridayNote ?? undefined,
          saturdayNote: storeNotes.saturdayNote ?? undefined,
          sundayNote: storeNotes.sundayNote ?? undefined,
        },
        week: Week(storeNotes.week),
      }
    : undefined
}

export async function deleteWeeklyNotes(
  storeID: StoreID,
  week: Week,
): Promise<{ notes: Notes; week: Week } | undefined> {
  week = startOfWeek(week)
  const [storeNotes] = await db
    .delete(storeweeklynotes)
    .where(and(eq(storeweeklynotes.storeID, storeID), eq(storeweeklynotes.week, week)))
    .returning()
  return storeNotes
    ? {
        notes: {
          storeID: StoreID(storeNotes.storeID),
          weekNote: storeNotes.weekNote ?? undefined,
          mondayNote: storeNotes.mondayNote ?? undefined,
          tuesdayNote: storeNotes.tuesdayNote ?? undefined,
          wednesdayNote: storeNotes.wednesdayNote ?? undefined,
          thursdayNote: storeNotes.thursdayNote ?? undefined,
          fridayNote: storeNotes.fridayNote ?? undefined,
          saturdayNote: storeNotes.saturdayNote ?? undefined,
          sundayNote: storeNotes.sundayNote ?? undefined,
        },
        week: Week(storeNotes.week),
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
        mondayOpen: storeHours.mondayOpen ?? undefined,
        mondayClose: storeHours.mondayClose ?? undefined,
        tuesdayOpen: storeHours.tuesdayopen ?? undefined,
        tuesdayClose: storeHours.tuesdayClose ?? undefined,
        wednesdayOpen: storeHours.wednesdayopen ?? undefined,
        wednesdayClose: storeHours.wednesdayClose ?? undefined,
        thursdayOpen: storeHours.thursdayopen ?? undefined,
        thursdayClose: storeHours.thursdayClose ?? undefined,
        fridayOpen: storeHours.fridayopen ?? undefined,
        fridayClose: storeHours.fridayClose ?? undefined,
        saturdayOpen: storeHours.saturdayopen ?? undefined,
        saturdayClose: storeHours.saturdayClose ?? undefined,
        sundayOpen: storeHours.sundayopen ?? undefined,
        sundayClose: storeHours.sundayClose ?? undefined,
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
        eq(storespecialhours.day, openingHours.day),
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
    .where(and(eq(storespecialhours.storeID, storeID), eq(storespecialhours.day, day)))
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
  fromDate: Day,
  toDate: Day,
  storeID: StoreID,
): Promise<StoreSpecialHours | undefined> {
  const [storeHours] = await db
    .delete(storespecialhours)
    .where(
      and(eq(storespecialhours.storeID, storeID), between(storespecialhours.day, fromDate, toDate)),
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
        mondayOpen: storeHours.mondayOpen ?? undefined,
        mondayClose: storeHours.mondayClose ?? undefined,
        tuesdayOpen: storeHours.tuesdayOpen ?? undefined,
        tuesdayClose: storeHours.tuesdayClose ?? undefined,
        wednesdayOpen: storeHours.wednesdayOpen ?? undefined,
        wednesdayClose: storeHours.wednesdayClose ?? undefined,
        thursdayOpen: storeHours.thursdayOpen ?? undefined,
        thursdayClose: storeHours.thursdayClose ?? undefined,
        fridayOpen: storeHours.fridayOpen ?? undefined,
        fridayClose: storeHours.fridayClose ?? undefined,
        saturdayOpen: storeHours.saturdayOpen ?? undefined,
        saturdayClose: storeHours.saturdayClose ?? undefined,
        sundayOpen: storeHours.sundayOpen ?? undefined,
        sundayClose: storeHours.sundayClose ?? undefined,
      }
    : undefined
}

export async function getOpeningHours(
  storeID: StoreID,
  from: Day,
  to: Day,
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
      .where(and(eq(storespecialhours.storeID, storeID), between(storespecialhours.day, from, to)))

    return { weeklyOpeningHours, specialOpeningHours }
  })

  const brandedWeeklyOpeningHours: WeekOpeningHours | undefined = weeklyOpeningHours
    ? {
        storeID: storeID,
        mondayOpen: weeklyOpeningHours.mondayOpen ?? undefined,
        mondayClose: weeklyOpeningHours.mondayClose ?? undefined,
        tuesdayOpen: weeklyOpeningHours.tuesdayOpen ?? undefined,
        tuesdayClose: weeklyOpeningHours.tuesdayClose ?? undefined,
        wednesdayOpen: weeklyOpeningHours.wednesdayOpen ?? undefined,
        wednesdayClose: weeklyOpeningHours.wednesdayClose ?? undefined,
        thursdayOpen: weeklyOpeningHours.thursdayOpen ?? undefined,
        thursdayClose: weeklyOpeningHours.thursdayClose ?? undefined,
        fridayOpen: weeklyOpeningHours.fridayOpen ?? undefined,
        fridayClose: weeklyOpeningHours.fridayClose ?? undefined,
        saturdayOpen: weeklyOpeningHours.saturdayOpen ?? undefined,
        saturdayClose: weeklyOpeningHours.saturdayClose ?? undefined,
        sundayOpen: weeklyOpeningHours.sundayOpen ?? undefined,
        sundayClose: weeklyOpeningHours.sundayClose ?? undefined,
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
            storeSendSMS: getStore.storeSendSMS ?? undefined,
            storeUsesCheckin: getStore.storeUsesCheckin ?? undefined,
            storeUsesPIN: getStore.storeUsesPIN ? StoreUsesPIN(getStore.storeUsesPIN) : undefined,
          },
          createdAt: getStore.createdAt,
          updatedAt: getStore.updatedAt,
        }
      : undefined,
    paymentInfo: paymentInfo
      ? {
          storePaymentOptions: {
            bankgiro: paymentInfo.bankgiro ?? undefined,
            plusgiro: paymentInfo.plusgiro ?? undefined,
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

  return {
    totalStores: ResultCount(totalStores.count),
    totalPage: Page(totalPage),
    perPage: Limit(page),
    data: storesList,
  }
}
