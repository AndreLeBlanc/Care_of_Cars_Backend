import { Brand, make } from 'ts-brand'
import { stores, storepaymentinfo } from '../schema/schema.js'
import { Offset, Page, Search, Limit } from '../plugins/pagination.js'
import { db } from '../config/db-connect.js'
import { eq, sql, ilike, or } from 'drizzle-orm'

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
