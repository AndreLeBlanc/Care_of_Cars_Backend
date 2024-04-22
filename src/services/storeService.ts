import { Brand, make } from 'ts-brand'
import { stores } from '../schema/schema.js'
import { db } from '../config/db-connect.js'
import { eq } from 'drizzle-orm'

type PositiveInteger<T extends number> = `${T}` extends '0' | `-${any}` | `${any}.${any}`
  ? never
  : T

export type StoreName = Brand<string, 'storeName'>
export const StoreName = make<StoreName>()
export type StoreOrgNumber = Brand<string, 'storeOrgNumber'>
export const StoreOrgNumber = make<StoreOrgNumber>()
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

export type Store = StoreCreate & { createdAt: Date; updatedAt: Date }

export async function createStore(store: StoreCreate): Promise<Store | undefined> {
  const [newStore] = await db
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
  return newStore
    ? {
        storeName: StoreName(newStore.storeName),
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
        createdAt: newStore.createdAt,
        updatedAt: newStore.updatedAt,
      }
    : undefined
}
export async function deleteStore(storeOrgNumber: StoreOrgNumber): Promise<Store | undefined> {
  const [deletedStore] = await db
    .delete(stores)
    .where(eq(stores.storeOrgNumber, storeOrgNumber))
    .returning({
      storeName: stores.storeName,
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
        storeName: StoreName(deletedStore.storeName),
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
        createdAt: deletedStore.createdAt,
        updatedAt: deletedStore.updatedAt,
      }
    : undefined
}
