import { Static, Type } from '@sinclair/typebox'

const CreatedAndUpdatedAT = Type.Object({
  createdAt: Type.String({ format: 'date' }),
  updatedAt: Type.String({ format: 'date' }),
})

const PaymentInfoSchema = Type.Object({
  bankgiro: Type.Optional(Type.String()),
  plusgiro: Type.Optional(Type.String()),
  paymentdays: Type.Integer({ minimum: 0, maximum: 365 }),
})

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
  storeDescription: Type.Optional(Type.String()),
  storeContactPerson: Type.Optional(Type.String()),
  storeMaxUsers: Type.Optional(Type.Integer({ minimum: 1, maximum: 1024 })),
  storeAllowCarAPI: Type.Optional(Type.Boolean()),
  storeAllowSendSMS: Type.Optional(Type.Boolean()),
  storeSendSMS: Type.Optional(Type.Boolean()),
  storeUsesCheckin: Type.Optional(Type.Boolean()),
  storeUsesPIN: Type.Optional(Type.Boolean()),
})

export type CreateStoreSchemaType = Static<typeof CreateStoreSchema>

export const StoreReplySchema = Type.Composite([
  CreateStoreSchema,
  CreatedAndUpdatedAT,
  Type.Object({
    storeID: Type.Integer(),
    storePaymentOptions: Type.Optional(PaymentInfoSchema),
  }),
])

export type StoreReplySchemaType = Static<typeof StoreReplySchema>

export const StoreIDAndDaySchema = Type.Object({
  storeID: Type.Integer(),
  day: Type.String({ format: 'date' }),
})

export type StoreIDAndDaySchemaType = Static<typeof StoreIDAndDaySchema>

export const StoreIDSchema = Type.Object({
  storeID: Type.Integer(),
})

export type StoreIDSchemaType = Static<typeof StoreIDSchema>

export const StoreUpdateSchema = Type.Composite([
  CreateStoreSchema,
  Type.Object({
    storePaymentOptions: Type.Optional(PaymentInfoSchema),
  }),
])
export type StoreUpdateSchemaType = Static<typeof StoreReplySchema>

export const StoreUpdateReplySchema = Type.Object({
  store: Type.Optional(
    Type.Composite([
      CreateStoreSchema,
      CreatedAndUpdatedAT,
      Type.Object({
        storeID: Type.Integer(),
      }),
    ]),
  ),
  storePaymentOptions: Type.Optional(Type.Composite([PaymentInfoSchema, CreatedAndUpdatedAT])),
})

export type StoreUpdateReplySchemaType = Static<typeof StoreUpdateReplySchema>

export const storeReplyMessage = Type.Object({
  message: Type.String(),
})

export type storeReplyMessageType = Static<typeof storeReplyMessage>

export const ListStoresQueryParam = Type.Object({
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Integer({ minimum: 1, default: 10 })),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
})

export type ListStoresQueryParamType = Static<typeof ListStoresQueryParam>

export const StorePaginateReply = Type.Object({
  message: Type.String(),
  totalStores: Type.Integer(),
  nextUrl: Type.Optional(Type.String()),
  previousUrl: Type.Optional(Type.String()),
  totalPage: Type.Integer(),
  page: Type.Integer(),
  limit: Type.Integer(),
  data: Type.Array(
    Type.Object({
      storeName: Type.String(),
      storeOrgNumber: Type.String(),
      storeID: Type.Integer(),
    }),
  ),
})

export type StorePaginateReplyType = Static<typeof StorePaginateReply>

const DayOpeningTimesSchema = Type.Object({
  mondayOpen: Type.Optional(Type.String({ format: 'time' })),
  mondayClose: Type.Optional(Type.String({ format: 'time' })),
  tuesdayOpen: Type.Optional(Type.String({ format: 'time' })),
  tuesdayClose: Type.Optional(Type.String({ format: 'time' })),
  wednesdayOpen: Type.Optional(Type.String({ format: 'time' })),
  wednesdayClose: Type.Optional(Type.String({ format: 'time' })),
  thursdayOpen: Type.Optional(Type.String({ format: 'time' })),
  thursdayClose: Type.Optional(Type.String({ format: 'time' })),
  fridayOpen: Type.Optional(Type.String({ format: 'time' })),
  fridayClose: Type.Optional(Type.String({ format: 'time' })),
  saturdayOpen: Type.Optional(Type.String({ format: 'time' })),
  saturdayClose: Type.Optional(Type.String({ format: 'time' })),
  sundayOpen: Type.Optional(Type.String({ format: 'time' })),
  sundayClose: Type.Optional(Type.String({ format: 'time' })),
})

export const StoreOpeningHoursCreate = Type.Composite([
  DayOpeningTimesSchema,
  Type.Object({
    storeID: Type.Integer(),
  }),
])

export type StoreOpeningHoursCreateType = Static<typeof StoreOpeningHoursCreate>

export const StoreOpeningHours = Type.Composite([
  DayOpeningTimesSchema,
  Type.Object({
    message: Type.String(),
    storeID: Type.Integer(),
  }),
])

export type StoreOpeningHoursType = Static<typeof StoreOpeningHours>

export const StoreSpecialHoursSchemaCreate = Type.Object({
  storeID: Type.Integer(),
  day: Type.String({ format: 'date' }),
  dayOpen: Type.String({ format: 'time' }),
  dayClose: Type.String({ format: 'time' }),
})

export type StoreSpecialHoursSchemaCreateType = Static<typeof StoreSpecialHoursSchemaCreate>

export const StoreSpecialHoursSchema = Type.Composite([
  StoreSpecialHoursSchemaCreate,
  Type.Object({
    message: Type.Optional(Type.String()),
  }),
])

export type StoreSpecialHoursSchemaType = Static<typeof StoreSpecialHoursSchema>

export const GetOpeningHours = Type.Object({
  message: Type.Optional(Type.String()),
  storeID: Type.Integer(),
  from: Type.String({ format: 'date' }),
  to: Type.String({ format: 'date' }),
})

export type GetOpeningHoursType = Static<typeof GetOpeningHours>

export const ReturnedOpeningHours = Type.Object({
  message: Type.Optional(Type.String()),
  storeID: Type.Integer(),
  specialHours: Type.Array(StoreSpecialHoursSchema),
  weeklyOpeningHours: Type.Optional(DayOpeningTimesSchema),
})

export type ReturnedOpeningHoursType = Static<typeof ReturnedOpeningHours>

export const StoreOpeningHoursWithSpecial = Type.Object({
  weekyOpeningHours: Type.Optional(StoreOpeningHoursCreate),
  specialOpeningHours: Type.Array(StoreSpecialHoursSchema),
})

export type StoreOpeningHoursWithSpecialType = Static<typeof StoreOpeningHoursWithSpecial>

export const StoreWeeklyNotes = Type.Object({
  storeID: Type.Integer(),
  week: Type.String({ format: 'date' }),
  weekNote: Type.String({ format: 'date' }),
  mondayNote: Type.String({ format: 'date' }),
  tuesdayNote: Type.String({ format: 'date' }),
  wednesdayNote: Type.String({ format: 'date' }),
  thursdayNote: Type.String({ format: 'date' }),
  fridayNote: Type.String({ format: 'date' }),
  saturdayNote: Type.String({ format: 'date' }),
  sundayNote: Type.String({ format: 'date' }),
})

export type StoreWeeklyNotesType = Static<typeof StoreWeeklyNotes>
