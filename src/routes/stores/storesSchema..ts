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
  storeID: Type.Integer(),
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
  storePaymentOptions: Type.Optional(
    Type.Object({
      bankgiro: Type.Optional(Type.String()),
      plusgiro: Type.Optional(Type.String()),
      paymentdays: Type.Integer({ minimum: 0, maximum: 365 }),
    }),
  ),
})
export type StoreReplySchemaType = Static<typeof StoreReplySchema>

export const StoreIDSchema = Type.Object({
  storeID: Type.Integer(),
})

export type StoreIDSchemaType = Static<typeof StoreIDSchema>

export const StoreUpdateSchema = Type.Object({
  storeName: Type.Optional(Type.String()),
  storeOrgNumber: Type.Optional(Type.String()),
  storeStatus: Type.Optional(Type.Boolean()),
  storeEmail: Type.Optional(Type.String({ format: 'email' })),
  storePhone: Type.Optional(
    Type.String({
      pattern: '^([+]?[s0-9]+)?(d{3}|[(]?[0-9]+[)])?([-]?[s]?[0-9])+$',
    }),
  ),
  storeAddress: Type.Optional(Type.String()),
  storeZipCode: Type.Optional(Type.String()),
  storeCity: Type.Optional(Type.String()),
  storeCountry: Type.Optional(Type.String()),
  storeDescription: Type.Optional(Type.String()),
  storeContactPerson: Type.Optional(Type.String()),
  storeMaxUsers: Type.Optional(Type.Integer({ minimum: 1, maximum: 1024 })),
  storeAllowCarAPI: Type.Optional(Type.Boolean()),
  storeAllowSendSMS: Type.Optional(Type.Boolean()),
  storeSendSMS: Type.Optional(Type.Boolean()),
  storeUsesCheckin: Type.Optional(Type.Boolean()),
  storeUsesPIN: Type.Optional(Type.Boolean()),
  storePaymentOptions: Type.Optional(
    Type.Object({
      bankgiro: Type.Optional(Type.String()),
      plusgiro: Type.Optional(Type.String()),
      paymentdays: Type.Integer({ minimum: 0, maximum: 365 }),
    }),
  ),
})
export type StoreUpdateSchemaType = Static<typeof StoreReplySchema>

export const StoreUpdateReplySchema = Type.Object({
  store: Type.Optional(
    Type.Object({
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
      storeID: Type.Integer(),
      createdAt: Type.String({ format: 'date' }),
      updatedAt: Type.String({ format: 'date' }),
    }),
  ),
  storePaymentOptions: Type.Optional(
    Type.Object({
      bankgiro: Type.Optional(Type.String()),
      plusgiro: Type.Optional(Type.String()),
      paymentdays: Type.Integer({ minimum: 0, maximum: 365 }),
      createdAt: Type.String({ format: 'date' }),
      updatedAt: Type.String({ format: 'date' }),
    }),
  ),
})

export type StoreUpdateReplySchemaType = Static<typeof StoreUpdateReplySchema>
export const storeReplyMessage = Type.Object({
  message: Type.String(),
})

export type storeReplyMessageType = Static<typeof storeReplyMessage>
