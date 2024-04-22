import { Static, Type } from '@sinclair/typebox'

export const CreateStoreSchema = Type.Object({
  storeName: Type.String(),
  storeOrgNumber: Type.String(),
  storeStatus: Type.Boolean(),
  storeEmail: Type.String({ format: 'email' }),
  storePhone: Type.String({
    pattern: '^([+]?[s0-9]+)?(d{3}|[(]?[0-9]+[)])?([-]?[s]?[0-9])+$',
  }),
  storeAddress: Type.String(),
  storeZipCode: Type.String(),
  storeCity: Type.String(),
  storeCountry: Type.String(),
  storeContactPerson: Type.Optional(Type.String()),
  storeMaxUsers: Type.Optional(Type.Integer({ minimum: 1, maximum: 1024 })),
  storeAllowCarAPI: Type.Optional(Type.Boolean()),
  storeAllowSendSMS: Type.Optional(Type.Boolean()),
  storeSendSMS: Type.Optional(Type.Boolean()),
  storeUsesCheckin: Type.Optional(Type.Boolean()),
  storeUsesPIN: Type.Optional(Type.Boolean()),
})
export type CreateStoreSchemaType = Static<typeof CreateStoreSchema>

export const StoreReplySchema = Type.Object({
  storeName: Type.String(),
  storeOrgNumber: Type.String(),
  storeStatus: Type.Boolean(),
  storeEmail: Type.String({ format: 'email' }),
  storePhone: Type.String({
    pattern: '^([+]?[s0-9]+)?(d{3}|[(]?[0-9]+[)])?([-]?[s]?[0-9])+$',
  }),
  storeAddress: Type.String(),
  storeZipCode: Type.String(),
  storeCity: Type.String(),
  storeCountry: Type.String(),
  storeDescription: Type.Optional(Type.String()),
  storeContactPerson: Type.Optional(Type.String()),
  storeMaxUsers: Type.Optional(Type.Integer({ minimum: 1, maximum: 1024 })),
  storeAllowCarAPI: Type.Optional(Type.Boolean()),
  storeAllowSendSMS: Type.Optional(Type.Boolean()),
  storeSendSMS: Type.Optional(Type.Boolean()),
  storeUsesCheckin: Type.Optional(Type.Boolean()),
  storeUsesPIN: Type.Optional(Type.Boolean()),
  createdAt: Type.String({ format: 'date' }),
  updatedAt: Type.String({ format: 'date' }),
})
export type StoreReplySchemaType = Static<typeof StoreReplySchema>

export const StoreDeleteSchema = Type.Object({
  storeOrgNumber: Type.String(),
})
export type StoreDeleteSchemaType = Static<typeof StoreDeleteSchema>
