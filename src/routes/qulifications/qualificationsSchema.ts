import { Static, Type } from '@sinclair/typebox'
import { CreatedAndUpdatedAT } from '../../utils/helper.js'
import { storeID } from '../stores/storesSchema..js'
import { userID } from '../users/userSchema.js'

const localQualID = Type.Integer()
const globalQualID = Type.Integer()
export const LocalQualIDSchema = Type.Object({ localQualID })
export type LocalQualIDSchemaType = Static<typeof LocalQualIDSchema>
export const GlobalQualIDSchema = Type.Object({ globalQualID: globalQualID })
export type GlobalQualIDSchemaType = Static<typeof GlobalQualIDSchema>
const LocalQualNameSchema = Type.String({ minLength: 3, maxLength: 64 })
const GlobalQualNameSchema = Type.String({ minLength: 3, maxLength: 64 })

export const CreateQualificationsLocalSchema = Type.Object({
  localQualID: Type.Optional(localQualID),
  storeID: storeID,
  localQualName: LocalQualNameSchema,
})

export type CreateQualificationsLocalSchemaType = Static<typeof CreateQualificationsLocalSchema>

export const QualificationsLocalSchema = Type.Object({
  qual: CreateQualificationsLocalSchema,
  dates: CreatedAndUpdatedAT,
})

export type QualificationsLocalSchemaType = Static<typeof QualificationsLocalSchema>

export const CreateQualificationsGlobalSchema = Type.Composite([
  GlobalQualIDSchema,
  Type.Object({ globalQualName: GlobalQualNameSchema }),
])

export type CreateQualificationsGlobalSchemaType = Static<typeof CreateQualificationsGlobalSchema>

export const QualificationsGlobalSchema = Type.Object({
  qual: CreateQualificationsGlobalSchema,
  dates: CreatedAndUpdatedAT,
})

export type QualificationsGlobalSchemaType = Static<typeof QualificationsGlobalSchema>

export const QualificationMessage = Type.String()
export type QualificationMessageType = Static<typeof QualificationMessage>

export const ListQualsReplySchema = Type.Object({
  totalLocalQuals: Type.Integer(),
  totalGlobalQuals: Type.Integer(),
  localQuals: Type.Array(Type.Composite([LocalQualIDSchema, CreateQualificationsLocalSchema])),
  globalQuas: Type.Array(CreateQualificationsGlobalSchema),
})

export type ListQualsReplySchemaType = Static<typeof ListQualsReplySchema>

export const ListQualsSchema = Type.Object({
  search: Type.Optional(Type.String()),
  storeID: Type.Optional(storeID),
})
export type ListQualsSchemaType = Static<typeof ListQualsSchema>

export const PutUserLocalQualSchema = Type.Composite([
  Type.Object({ userID: userID }),
  LocalQualIDSchema,
])

export type PutUserLocalQualSchemaType = Static<typeof PutUserLocalQualSchema>

export const PutUserGlobalQualSchema = Type.Composite([
  Type.Object({ userID: userID }),
  GlobalQualIDSchema,
])

export type PutUserGlobalQualSchemaType = Static<typeof PutUserGlobalQualSchema>
