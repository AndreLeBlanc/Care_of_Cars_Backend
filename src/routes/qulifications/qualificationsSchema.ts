import { Static, Type } from '@sinclair/typebox'

import { EmployeeID, GlobalQualID, LocalQualID } from '../../utils/helper.js'
import { storeID } from '../stores/storesSchema.js'

export const LocalQualIDSchema = Type.Object({ localQualID: LocalQualID })
export type LocalQualIDSchemaType = Static<typeof LocalQualIDSchema>
export const GlobalQualIDSchema = Type.Object({ globalQualID: GlobalQualID })
export const LocalQualNameSchema = Type.String({ minLength: 3, maxLength: 64 })
export const GlobalQualNameSchema = Type.String({ minLength: 3, maxLength: 64 })
export type GlobalQualNameSchemaType = Static<typeof GlobalQualNameSchema>
export type GlobalQualIDSchemaType = Static<typeof GlobalQualIDSchema>

export const CreateQualificationsLocalSchema = Type.Array(
  Type.Object({
    localQualID: Type.Optional(LocalQualID),
    storeID: storeID,
    localQualName: LocalQualNameSchema,
  }),
)
export type CreateQualificationsLocalSchemaType = Static<typeof CreateQualificationsLocalSchema>

export const DeleteGlobalQalsSchema = Type.Array(GlobalQualIDSchema)

export type DeleteGlobalQalsSchemaType = Static<typeof DeleteGlobalQalsSchema>

export const DeleteLocalQalsSchema = Type.Array(LocalQualIDSchema)

export type DeleteLocalQalsSchemaType = Static<typeof DeleteLocalQalsSchema>

export const QualificationsLocalSchema = Type.Object({
  localQualID: LocalQualID,
  storeID: storeID,
  localQualName: LocalQualNameSchema,
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
})

export type QualificationsLocalSchemaType = Static<typeof QualificationsLocalSchema>

export const QualificationsLocalArraySchema = Type.Array(QualificationsLocalSchema)

export type QualificationsLocalArraySchemaType = Static<typeof QualificationsLocalArraySchema>

export const CreateQualificationsGlobalSchema = Type.Array(
  Type.Object({
    globalQualID: Type.Optional(GlobalQualID),
    globalQualName: GlobalQualNameSchema,
  }),
)

export type CreateQualificationsGlobalSchemaType = Static<typeof CreateQualificationsGlobalSchema>

export const QualificationsGlobalSchema = Type.Object({
  globalQualID: GlobalQualID,
  globalQualName: GlobalQualNameSchema,
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
})

export type QualificationsGlobalSchemaType = Static<typeof QualificationsGlobalSchema>

export const QualificationsGlobalArraySchema = Type.Array(QualificationsGlobalSchema)

export type QualificationsGlobalArraySchemaType = Static<typeof QualificationsGlobalArraySchema>

export const QualificationMessage = Type.String()
export type QualificationMessageType = Static<typeof QualificationMessage>

export const ListQualsReplySchema = Type.Object({
  message: QualificationMessage,
  totalLocalQuals: Type.Integer(),
  totalGlobalQuals: Type.Integer(),
  localQuals: Type.Array(
    Type.Object({
      localQualID: LocalQualID,
      storeID: storeID,
      localQualName: LocalQualNameSchema,
    }),
  ),
  globalQuals: Type.Array(
    Type.Object({
      globalQualID: Type.Optional(GlobalQualID),
      globalQualName: GlobalQualNameSchema,
    }),
  ),
})

export type ListQualsReplySchemaType = Static<typeof ListQualsReplySchema>

export const ListQualsSchema = Type.Object({
  search: Type.Optional(Type.String()),
  storeID: Type.Optional(storeID),
  employeeID: Type.Optional(EmployeeID),
})
export type ListQualsSchemaType = Static<typeof ListQualsSchema>

export const PutEmployeeLocalQualSchema = Type.Array(
  Type.Composite([Type.Object({ employeeID: EmployeeID }), LocalQualIDSchema]),
)

export type PutEmployeeLocalQualSchemaType = Static<typeof PutEmployeeLocalQualSchema>

export const PutEmployeeGlobalQualSchema = Type.Array(
  Type.Composite([Type.Object({ employeeID: EmployeeID }), GlobalQualIDSchema]),
)

export type PutEmployeeGlobalQualSchemaType = Static<typeof PutEmployeeGlobalQualSchema>

export const EmployeesQualsSchema = Type.Object({
  message: QualificationMessage,
  localQuals: CreateQualificationsLocalSchema,
  globalQuals: CreateQualificationsGlobalSchema,
})

export type EmployeesQualsSchemaType = Static<typeof EmployeesQualsSchema>

export const EmployeesQualsStatusSchema = Type.Object({
  message: QualificationMessage,
  employeeID: EmployeeID,
  employeesGlobalQuals: CreateQualificationsGlobalSchema,
  NotEmployeesGlobalQuals: CreateQualificationsGlobalSchema,
  employeesLocalQuals: CreateQualificationsLocalSchema,
  NotEmployeesLocalQuals: CreateQualificationsLocalSchema,
})

export type EmployeesQualsStatusSchemaType = Static<typeof EmployeesQualsStatusSchema>
