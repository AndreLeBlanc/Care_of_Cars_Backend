import { Static, Type } from '@sinclair/typebox'

export const RoleID = Type.Number()

export const ListRoleQueryParamSchema = Type.Object({
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Integer({ minimum: 1, default: 10 })),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
})
export type ListRoleQueryParamSchemaType = Static<typeof ListRoleQueryParamSchema>

export const RoleSchema = Type.Object({
  roleName: Type.String(),
  description: Type.Optional(Type.String()),
})
export type RoleSchemaType = Static<typeof RoleSchema>

export const getRoleByIDSchema = Type.Object({
  roleID: RoleID,
})
export type getRoleByIDType = Static<typeof getRoleByIDSchema>
