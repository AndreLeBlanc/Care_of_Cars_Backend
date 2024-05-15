import { Static, Type } from '@sinclair/typebox'
import { CreatedAndUpdatedAT } from '../../utils/helper'
import { storeID } from '../stores/storesSchema..js'

export const LocalQualIDSchema = Type.Object({ localQualID: Type.Integer() })
export type LocalQualIDSchemaType = Static<typeof LocalQualIDSchema>
export const GlobalQualIDSchema = Type.Object({ globalQualID: Type.Integer() })
export type GlobalQualIDSchemaType = Static<typeof GlobalQualIDSchema>
const LocalQualNameSchema = Type.String({ minLength: 3, maxLength: 64 })
const GlobalQualNameSchema = Type.String({ minLength: 3, maxLength: 64 })

export const CreateQualificationsLocalSchema = Type.Object({
  storeID: storeID,
  localQualName: LocalQualNameSchema,
})

export type CreateQualificationsLocalSchemaType = Static<typeof CreateQualificationsLocalSchema>

export const QualificationsLocalSchema = Type.Object({
  qual: Type.Composite([LocalQualIDSchema, CreateQualificationsLocalSchema]),
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
