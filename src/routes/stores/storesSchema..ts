import { Static, Type } from '@sinclair/typebox'

import { CreatedAndUpdatedAT } from '../../utils/helper.js'
const storeName = Type.String()
const storeOrgNumber = Type.String()
export const storeID = Type.Integer()
const storeStatus = Type.Boolean()
const storeEmail = Type.String({ format: 'email' })
const storePhone = Type.String({ pattern: '^([+]?[s0-9]+)?(d{3}|[(]?[0-9]+[)])?([-]?[s]?[0-9])+$' })
const storeAddress = Type.String()
const storeZipCode = Type.String()
const storeCity = Type.String()
const storeCountry = Type.String()
const storeDescription = Type.String()
const storeContactPerson = Type.String()
const storeMaxUsers = Type.Integer({ minimum: 1, maximum: 1024 })
const storeAllowCarAPI = Type.Boolean()
const storeAllowSendSMS = Type.Boolean()
const storeSendSMS = Type.Boolean()
const storeUsesCheckin = Type.Boolean()
const storeUsesPIN = Type.Boolean()
const day = Type.String({ format: 'date' })
const week = Type.String({ format: 'date' })
const note = Type.String()
const openingTime = Type.String({ format: 'time' })

const PaymentInfoSchema = Type.Object({
  bankgiro: Type.Optional(Type.String()),
  plusgiro: Type.Optional(Type.String()),
  paymentdays: Type.Integer({ minimum: 0, maximum: 365 }),
})

export const CreateStoreSchema = Type.Object({
  storeName: storeName,
  storeOrgNumber: storeOrgNumber,
  storeStatus: storeStatus,
  storeEmail: storeEmail,
  storePhone: storePhone,
  storeAddress: storeAddress,
  storeZipCode: storeZipCode,
  storeCity: storeCity,
  storeCountry: storeCountry,
  storeDescription: Type.Optional(storeDescription),
  storeContactPerson: Type.Optional(storeContactPerson),
  storeMaxUsers: Type.Optional(storeMaxUsers),
  storeAllowCarAPI: Type.Optional(storeAllowCarAPI),
  storeAllowSendSMS: Type.Optional(storeAllowSendSMS),
  storeSendSMS: Type.Optional(storeSendSMS),
  storeUsesCheckin: Type.Optional(storeUsesCheckin),
  storeUsesPIN: Type.Optional(storeUsesPIN),
})

export type CreateStoreSchemaType = Static<typeof CreateStoreSchema>

export const StoreReplySchema = Type.Composite([
  CreateStoreSchema,
  CreatedAndUpdatedAT,
  Type.Object({
    storeID: storeID,
    storePaymentOptions: Type.Optional(PaymentInfoSchema),
  }),
])

export type StoreReplySchemaType = Static<typeof StoreReplySchema>

export const StoreIDAndDaySchema = Type.Object({
  storeID: storeID,
  day: day,
})

export type StoreIDAndDaySchemaType = Static<typeof StoreIDAndDaySchema>

export const StoreIDSchema = Type.Object({
  storeID: storeID,
})

export type StoreIDSchemaType = Static<typeof StoreIDSchema>

export const StoreIDWeekSchema = Type.Object({
  storeID: storeID,
  week: week,
})

export type StoreIDWeekSchemaType = Static<typeof StoreIDWeekSchema>

export const WeekSchema = Type.Object({
  week: week,
})

export type WeekSchemaType = Static<typeof WeekSchema>

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
        storeID: storeID,
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
      storeName: storeName,
      storeOrgNumber: storeOrgNumber,
      storeID: storeID,
    }),
  ),
})

export type StorePaginateReplyType = Static<typeof StorePaginateReply>

const DayOpeningTimesSchema = Type.Object({
  mondayOpen: Type.Optional(openingTime),
  mondayClose: Type.Optional(openingTime),
  tuesdayOpen: Type.Optional(openingTime),
  tuesdayClose: Type.Optional(openingTime),
  wednesdayOpen: Type.Optional(openingTime),
  wednesdayClose: Type.Optional(openingTime),
  thursdayOpen: Type.Optional(openingTime),
  thursdayClose: Type.Optional(openingTime),
  fridayOpen: Type.Optional(openingTime),
  fridayClose: Type.Optional(openingTime),
  saturdayOpen: Type.Optional(openingTime),
  saturdayClose: Type.Optional(openingTime),
  sundayOpen: Type.Optional(openingTime),
  sundayClose: Type.Optional(openingTime),
})

export const StoreOpeningHoursCreate = Type.Composite([
  DayOpeningTimesSchema,
  Type.Object({
    storeID: storeID,
  }),
])

export type StoreOpeningHoursCreateType = Static<typeof StoreOpeningHoursCreate>

export const StoreOpeningHours = Type.Composite([
  DayOpeningTimesSchema,
  Type.Object({
    message: Type.String(),
    storeID: storeID,
  }),
])

export type StoreOpeningHoursType = Static<typeof StoreOpeningHours>

export const StoreSpecialHoursSchemaCreate = Type.Object({
  storeID: storeID,
  day: day,
  dayOpen: openingTime,
  dayClose: openingTime,
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
  storeID: storeID,
  from: day,
  to: day,
})

export type GetOpeningHoursType = Static<typeof GetOpeningHours>

export const ReturnedOpeningHours = Type.Object({
  message: Type.Optional(Type.String()),
  storeID: storeID,
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
  storeID: storeID,
  week: week,
  weekNote: Type.Optional(note),
  mondayNote: Type.Optional(note),
  tuesdayNote: Type.Optional(note),
  wednesdayNote: Type.Optional(note),
  thursdayNote: Type.Optional(note),
  fridayNote: Type.Optional(note),
  saturdayNote: Type.Optional(note),
  sundayNote: Type.Optional(note),
})

export type StoreWeeklyNotesType = Static<typeof StoreWeeklyNotes>

export const StoreNotes = Type.Object({
  storeID: storeID,
  weekNote: Type.Optional(note),
  mondayNote: Type.Optional(note),
  tuesdayNote: Type.Optional(note),
  wednesdayNote: Type.Optional(note),
  thursdayNote: Type.Optional(note),
  fridayNote: Type.Optional(note),
  saturdayNote: Type.Optional(note),
  sundayNote: Type.Optional(note),
})

export type StoreNotesType = Static<typeof StoreNotes>
