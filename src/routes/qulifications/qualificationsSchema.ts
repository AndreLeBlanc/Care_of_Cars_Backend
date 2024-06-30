import { Static, Type } from '@sinclair/typebox'
import { CreatedAndUpdatedAT } from '../../utils/helper.js'
import { storeID } from '../stores/storesSchema.js'

import { employeeID } from '../employees/employeesSchema.js'

export const localQualID = Type.Integer()
export const globalQualID = Type.Integer()
export const LocalQualIDSchema = Type.Object({ localQualID })
export type LocalQualIDSchemaType = Static<typeof LocalQualIDSchema>
export const GlobalQualIDSchema = Type.Object({ globalQualID: globalQualID })
export type GlobalQualIDSchemaType = Static<typeof GlobalQualIDSchema>
const LocalQualNameSchema = Type.String({ minLength: 3, maxLength: 64 })
const GlobalQualNameSchema = Type.String({ minLength: 3, maxLength: 64 })
export type GlobalQualNameSchemaType = Static<typeof GlobalQualNameSchema>

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

export const CreateQualificationsGlobalSchema = Type.Object({
  globalQualID: Type.Optional(globalQualID),
  globalQualName: GlobalQualNameSchema,
})

export type CreateQualificationsGlobalSchemaType = Static<typeof CreateQualificationsGlobalSchema>

export const QualificationsGlobalSchema = Type.Object({
  qual: CreateQualificationsGlobalSchema,
  dates: CreatedAndUpdatedAT,
})

export type QualificationsGlobalSchemaType = Static<typeof QualificationsGlobalSchema>

export const QualificationMessage = Type.String()
export type QualificationMessageType = Static<typeof QualificationMessage>

export const ListQualsReplySchema = Type.Object({
  message: QualificationMessage,
  totalLocalQuals: Type.Integer(),
  totalGlobalQuals: Type.Integer(),
  localQuals: Type.Array(Type.Composite([LocalQualIDSchema, CreateQualificationsLocalSchema])),
  globalQuals: Type.Array(CreateQualificationsGlobalSchema),
})

export type ListQualsReplySchemaType = Static<typeof ListQualsReplySchema>

export const ListQualsSchema = Type.Object({
  search: Type.Optional(Type.String()),
  storeID: Type.Optional(storeID),
  employeeID: Type.Optional(employeeID),
})
export type ListQualsSchemaType = Static<typeof ListQualsSchema>

export const PutEmployeeLocalQualSchema = Type.Composite([
  Type.Object({ employeeID: employeeID }),
  LocalQualIDSchema,
])

export type PutEmployeeLocalQualSchemaType = Static<typeof PutEmployeeLocalQualSchema>

export const PutEmployeeGlobalQualSchema = Type.Composite([
  Type.Object({ employeeID: employeeID }),
  GlobalQualIDSchema,
])

export type PutEmployeeGlobalQualSchemaType = Static<typeof PutEmployeeGlobalQualSchema>
