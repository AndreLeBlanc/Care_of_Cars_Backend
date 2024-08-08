import { Static, Type } from '@sinclair/typebox'

import { CreatedAndUpdatedAT, EmployeeID, GlobalQualID, LocalQualID } from '../../utils/helper.js'
import { storeID } from '../stores/storesSchema.js'

export const LocalQualIDSchema = Type.Object({ localQualID: LocalQualID })
export type LocalQualIDSchemaType = Static<typeof LocalQualIDSchema>
export const GlobalQualIDSchema = Type.Object({ globalQualID: GlobalQualID })
export type GlobalQualIDSchemaType = Static<typeof GlobalQualIDSchema>
const LocalQualNameSchema = Type.String({ minLength: 3, maxLength: 64 })
const GlobalQualNameSchema = Type.String({ minLength: 3, maxLength: 64 })
export type GlobalQualNameSchemaType = Static<typeof GlobalQualNameSchema>

export const CreateQualificationsLocalSchema = Type.Object({
  localQualID: Type.Optional(LocalQualID),
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
  globalQualID: Type.Optional(GlobalQualID),
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
  employeeID: Type.Optional(EmployeeID),
})
export type ListQualsSchemaType = Static<typeof ListQualsSchema>

export const PutEmployeeLocalQualSchema = Type.Composite([
  Type.Object({ employeeID: EmployeeID }),
  LocalQualIDSchema,
])

export type PutEmployeeLocalQualSchemaType = Static<typeof PutEmployeeLocalQualSchema>

export const PutEmployeeGlobalQualSchema = Type.Composite([
  Type.Object({ employeeID: EmployeeID }),
  GlobalQualIDSchema,
])

export type PutEmployeeGlobalQualSchemaType = Static<typeof PutEmployeeGlobalQualSchema>

export const EmployeesQualsSchema = Type.Object({
  message: QualificationMessage,
  localQuals: Type.Array(CreateQualificationsLocalSchema),
  globalQuals: Type.Array(CreateQualificationsGlobalSchema),
})

export type EmployeesQualsSchemaType = Static<typeof EmployeesQualsSchema>

export const EmployeesQualsStatusSchema = Type.Object({
  message: QualificationMessage,
  employeeID: EmployeeID,
  employeesGlobalQuals: Type.Array(CreateQualificationsGlobalSchema),
  NotEmployeesGlobalQuals: Type.Array(CreateQualificationsGlobalSchema),
  employeesLocalQuals: Type.Array(CreateQualificationsLocalSchema),
  NotEmployeesLocalQuals: Type.Array(CreateQualificationsLocalSchema),
})

export type EmployeesQualsStatusSchemaType = Static<typeof EmployeesQualsStatusSchema>
