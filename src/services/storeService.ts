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
  StoreFSkatt,
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
  StoreVatNumber,
  StoreWebSite,
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

import { Either, errorHandling, left, right } from '../utils/helper.js'

export type StoreIDName = {
  storeName: StoreName
  storeID: StoreID
}

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
  specialHours: StoreSpecialHours[]
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
  storeWebSite?: StoreWebSite
  storeVatNumber?: StoreVatNumber
  storeFSkatt: StoreFSkatt
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
  storeWebSite?: StoreWebSite
  storeVatNumber?: StoreVatNumber
  storeFSkatt: StoreFSkatt
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
  data: {
    storeName: StoreName
    storeID: StoreID
    storeOrgNumber: StoreOrgNumber
    storePhone: StorePhone
    storeAddress: StoreAddress
    storeEmail: StoreEmail
  }[]
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
): Promise<Either<string, { notes: Notes; week: Week }>> {
  try {
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
      ? right({
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
        })
      : left('store not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getWeeklyNotes(
  storeID: StoreID,
  week: Week,
): Promise<Either<string, { notes: Notes; week: Week }>> {
  week = startOfWeek(week)
  try {
    const [storeNotes] = await db
      .select()
      .from(storeweeklynotes)
      .where(and(eq(storeweeklynotes.storeID, storeID), eq(storeweeklynotes.week, week)))
    return storeNotes
      ? right({
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
        })
      : left('notes not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteWeeklyNotes(
  storeID: StoreID,
  week: Week,
): Promise<Either<string, { notes: Notes; week: Week }>> {
  week = startOfWeek(week)
  try {
    const [storeNotes] = await db
      .delete(storeweeklynotes)
      .where(and(eq(storeweeklynotes.storeID, storeID), eq(storeweeklynotes.week, week)))
      .returning()
    return storeNotes
      ? right({
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
        })
      : left('notes not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function updateWeeklyOpeningHours(
  storeID: StoreID,
  openingHours: WeekOpeningHoursCreate,
): Promise<Either<string, WeekOpeningHours>> {
  try {
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
      ? right({
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
        })
      : left('opening hours not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function createSpecialOpeningHours(
  openingHours: StoreSpecialHoursCreate[],
): Promise<Either<string, StoreSpecialHours[]>> {
  try {
    const storeHours = await db.insert(storespecialhours).values(openingHours).returning({
      storeID: storespecialhours.storeID,
      day: storespecialhours.day,
      dayOpen: storespecialhours.dayOpen,
      dayClose: storespecialhours.dayClose,
    })

    const typesStoreHours = storeHours.map((hours) => ({
      storeID: StoreID(hours.storeID),
      day: Day(hours.day),
      dayOpen: DayOpen(hours.dayOpen),
      dayClose: DayClose(hours.dayClose),
    }))
    return typesStoreHours ? right(typesStoreHours) : left('Store not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function updateSpecialOpeningHours(
  openingHours: StoreSpecialHours[],
): Promise<Either<string, StoreSpecialHours[]>> {
  try {
    // You have to be sure that inputs array is not empty
    if (openingHours.length === 0) {
      return left('No opening hours to update')
    }

    const allUpdates = await db.transaction(async (tx) => {
      return await Promise.all(
        openingHours.map(async (update) => {
          const result = await tx
            .update(storespecialhours)
            .set(update)
            .where(
              and(
                eq(storespecialhours.storeID, update.storeID),
                eq(storespecialhours.day, update.day),
              ),
            )
            .returning()
          return result.at(0)
        }),
      )
    })

    const definedUpdates = allUpdates.reduce(
      (acc: StoreSpecialHours[], el: StoreSpecialHours | undefined) => {
        if (el) {
          acc.push({
            storeID: StoreID(el.storeID),
            day: Day(el.day),
            dayOpen: DayOpen(el.dayOpen),
            dayClose: DayClose(el.dayClose),
          })
        }
        return acc
      },
      [],
    )

    return definedUpdates.length > 0
      ? right(definedUpdates)
      : left('Opening hours or store not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteSpecialOpeningHoursByDayAndStore(
  day: Day,
  storeID: StoreID,
): Promise<Either<string, StoreSpecialHours>> {
  try {
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
      ? right({
          storeID: StoreID(storeHours.storeID),
          day: Day(storeHours.day),
          dayOpen: DayOpen(storeHours.dayOpen),
          dayClose: DayClose(storeHours.dayClose),
        })
      : left('special opening hours not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteSpecialOpeningHoursDates(
  fromDate: Day,
  toDate: Day,
  storeID: StoreID,
): Promise<Either<string, StoreSpecialHours>> {
  try {
    const [storeHours] = await db
      .delete(storespecialhours)
      .where(
        and(
          eq(storespecialhours.storeID, storeID),
          between(storespecialhours.day, fromDate, toDate),
        ),
      )
      .returning({
        storeID: storespecialhours.storeID,
        day: storespecialhours.day,
        dayOpen: storespecialhours.dayOpen,
        dayClose: storespecialhours.dayClose,
      })

    return storeHours
      ? right({
          storeID: StoreID(storeHours.storeID),
          day: Day(storeHours.day),
          dayOpen: DayOpen(storeHours.dayOpen),
          dayClose: DayClose(storeHours.dayClose),
        })
      : left('special opening hours not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteWeeklyOpeningHours(
  storeID: StoreID,
): Promise<Either<string, WeekOpeningHours>> {
  try {
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
      ? right({
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
        })
      : left('weekly opening hours not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getOpeningHours(
  storeID: StoreID,
  from: Day,
  to: Day,
): Promise<Either<string, OpeningHours>> {
  try {
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
          and(eq(storespecialhours.storeID, storeID), between(storespecialhours.day, from, to)),
        )

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

    return right({
      weekyOpeningHours: brandedWeeklyOpeningHours,
      specialHours: specialOpeningHours,
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function createStore(
  store: StoreCreate,
  paymentInfo?: StorePaymentOptions,
): Promise<
  Either<
    string,
    {
      store: Store
      paymentInfo: StorePaymentOptions | undefined
      updatedAt: Date
      createdAt: Date
    }
  >
> {
  try {
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
          storeWebSite: store.storeWebSite,
          storeVatNumber: store.storeVatNumber,
          storeFSkatt: store.storeFSkatt,
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
          storeWebSite: stores.storeWebSite,
          storeVatNumber: stores.storeVatNumber,
          storeFSkatt: stores.storeFSkatt,
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
      return right({
        store: {
          storeName: newStore.storeName,
          storeWebSite: newStore.storeWebSite ?? undefined,
          storeVatNumber: newStore.storeVatNumber ?? undefined,
          storeFSkatt: newStore.storeFSkatt,
          storeID: newStore.storeID,
          storeOrgNumber: newStore.storeOrgNumber,
          storeStatus: newStore.storeStatus,
          storeEmail: newStore.storeEmail,
          storePhone: newStore.storePhone,
          storeAddress: newStore.storeAddress,
          storeZipCode: newStore.storeZipCode,
          storeCity: newStore.storeCity,
          storeCountry: newStore.storeCountry,
          storeDescription: newStore.storeDescription ?? undefined,
          storeContactPerson: newStore.storeContactPerson ?? undefined,
          storeMaxUsers: newStore.storeMaxUsers ?? undefined,
          storeAllowCarAPI: newStore.storeAllowCarAPI ?? undefined,
          storeAllowSendSMS: newStore.storeAllowSendSMS ?? undefined,
          storeSendSMS: newStore.storeSendSMS ?? undefined,
          storeUsesCheckin: newStore.storeUsesCheckin ?? undefined,
          storeUsesPIN: newStore.storeUsesPIN ?? undefined,
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
      })
    } else {
      return left("couldn't create store")
    }
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteStore(
  storeID: StoreID,
): Promise<Either<string, { store: Store; createdAt: Date; updatedAt: Date }>> {
  try {
    const [deletedStore] = await db.delete(stores).where(eq(stores.storeID, storeID)).returning({
      storeName: stores.storeName,
      storeWebSite: stores.storeWebSite,
      storeVatNumber: stores.storeVatNumber,
      storeFSkatt: stores.storeFSkatt,
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
      ? right({
          store: {
            storeName: deletedStore.storeName,
            storeWebSite: deletedStore.storeWebSite ?? undefined,
            storeVatNumber: deletedStore.storeVatNumber ?? undefined,
            storeFSkatt: deletedStore.storeFSkatt ?? undefined,
            storeID: deletedStore.storeID,
            storeOrgNumber: deletedStore.storeOrgNumber,
            storeStatus: deletedStore.storeStatus,
            storeEmail: deletedStore.storeEmail,
            storePhone: deletedStore.storePhone,
            storeAddress: deletedStore.storeAddress,
            storeZipCode: deletedStore.storeZipCode,
            storeCity: deletedStore.storeCity,
            storeCountry: deletedStore.storeCountry,
            storeDescription: deletedStore.storeDescription ?? undefined,
            storeContactPerson: deletedStore.storeContactPerson ?? undefined,
            storeMaxUsers: deletedStore.storeMaxUsers ?? undefined,
            storeAllowCarAPI: deletedStore.storeAllowCarAPI ?? undefined,
            storeAllowSendSMS: deletedStore.storeAllowSendSMS ?? undefined,
            storeSendSMS: deletedStore.storeSendSMS ?? undefined,
            storeUsesCheckin: deletedStore.storeUsesCheckin ?? undefined,
            storeUsesPIN: deletedStore.storeUsesPIN ?? undefined,
          },
          createdAt: deletedStore.createdAt,
          updatedAt: deletedStore.updatedAt,
        })
      : left("couldn't find store")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function updateStoreByStoreID(
  storeID: StoreID,
  storePatch?: StoreUpdateCreate,
  storePaymentPatch?: StoreMaybePaymentOptions,
): Promise<Either<string, StoreWithSeparateDates>> {
  try {
    const { updatedStore, updatedPaymentInfo } = await db.transaction(async (tx) => {
      const updatedAt: Date = new Date()
      let updatedStore = undefined
      if (storePatch !== null) {
        const storeWithUpdatedAt = { ...storePatch, updatedAt: updatedAt }
        console.log(storeWithUpdatedAt)
        ;[updatedStore] = await tx
          .update(stores)
          .set(storeWithUpdatedAt)
          .where(eq(stores.storeID, storeID))
          .returning({
            storeName: stores.storeName,
            storeWebSite: stores.storeWebSite,
            storeVatNumber: stores.storeVatNumber,
            storeFSkatt: stores.storeFSkatt,
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
      return { updatedStore, updatedPaymentInfo }
    })
    return right({
      store: updatedStore
        ? {
            store: {
              storeName: updatedStore.storeName,
              storeWebSite: updatedStore.storeWebSite ?? undefined,
              storeVatNumber: updatedStore.storeVatNumber ?? undefined,
              storeFSkatt: updatedStore.storeFSkatt,
              storeID: updatedStore.storeID,
              storeOrgNumber: updatedStore.storeOrgNumber,
              storeStatus: updatedStore.storeStatus,
              storeEmail: updatedStore.storeEmail,
              storePhone: updatedStore.storePhone,
              storeAddress: updatedStore.storeAddress,
              storeZipCode: updatedStore.storeZipCode,
              storeCity: updatedStore.storeCity,
              storeCountry: updatedStore.storeCountry,
              storeDescription: updatedStore.storeDescription ?? undefined,
              storeContactPerson: updatedStore.storeContactPerson ?? undefined,
              storeMaxUsers: updatedStore.storeMaxUsers ?? undefined,
              storeAllowCarAPI: updatedStore.storeAllowCarAPI ?? undefined,
              storeAllowSendSMS: updatedStore.storeAllowSendSMS ?? undefined,
              storeSendSMS: updatedStore.storeSendSMS ?? undefined,
              storeUsesCheckin: updatedStore.storeUsesCheckin ?? undefined,
              storeUsesPIN: updatedStore.storeUsesPIN ?? undefined,
            },
            createdAt: updatedStore.createdAt,
            updatedAt: updatedStore.updatedAt,
          }
        : undefined,
      paymentInfo: updatedPaymentInfo
        ? {
            storePaymentOptions: {
              bankgiro: updatedPaymentInfo.bankgiro ?? undefined,
              plusgiro: updatedPaymentInfo.plusgiro ?? undefined,
              paymentdays: updatedPaymentInfo.paymentdays,
            },
            createdAt: updatedPaymentInfo.createdAt,
            updatedAt: updatedPaymentInfo.updatedAt,
          }
        : undefined,
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getStoreByID(
  storeID: StoreID,
): Promise<Either<string, StoreWithSeparateDates>> {
  try {
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

    return getStore
      ? right({
          store: getStore
            ? {
                store: {
                  storeName: getStore.storeName,
                  storeWebSite: getStore.storeWebSite ?? undefined,
                  storeVatNumber: getStore.storeVatNumber ?? undefined,
                  storeFSkatt: getStore.storeFSkatt,
                  storeID: getStore.storeID,
                  storeOrgNumber: getStore.storeOrgNumber,
                  storeStatus: getStore.storeStatus,
                  storeEmail: getStore.storeEmail,
                  storePhone: getStore.storePhone,
                  storeAddress: getStore.storeAddress,
                  storeZipCode: getStore.storeZipCode,
                  storeCity: getStore.storeCity,
                  storeCountry: getStore.storeCountry,
                  storeDescription: getStore.storeDescription ?? undefined,
                  storeContactPerson: getStore.storeContactPerson ?? undefined,
                  storeMaxUsers: getStore.storeMaxUsers ?? undefined,
                  storeAllowCarAPI: getStore.storeAllowCarAPI ?? undefined,
                  storeAllowSendSMS: getStore.storeAllowSendSMS ?? undefined,
                  storeSendSMS: getStore.storeSendSMS ?? undefined,
                  storeUsesCheckin: getStore.storeUsesCheckin ?? undefined,
                  storeUsesPIN: getStore.storeUsesPIN ?? undefined,
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
                  paymentdays: paymentInfo.paymentdays,
                },
                createdAt: paymentInfo.createdAt,
                updatedAt: paymentInfo.updatedAt,
              }
            : undefined,
        })
      : left('store not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getStoresPaginate(
  search: Search,
  limit = Limit(10),
  page = Page(1),
  offset = Offset(0),
): Promise<Either<string, StoresPaginated>> {
  try {
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
          storePhone: stores.storePhone,
          storeAddress: stores.storeAddress,
          storeEmail: stores.storeEmail,
        })
        .from(stores)
        .where(condition)
        .limit(limit || 10)
        .offset(offset || 0)
      return { totalStores, storesList }
    })
    const totalPage = Math.ceil(totalStores.count / limit)

    return right({
      totalStores: ResultCount(totalStores.count),
      totalPage: Page(totalPage),
      perPage: Limit(page),
      data: storesList,
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}
