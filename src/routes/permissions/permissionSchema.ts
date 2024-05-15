import { Static, Type } from '@sinclair/typebox'

export const PermissionID = Type.Integer()

export const ListPermissionQueryParamSchema = Type.Object({
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Integer({ minimum: 1, default: 10 })),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
})
export type ListPermissionQueryParamSchemaType = Static<typeof ListPermissionQueryParamSchema>

const PermissionName = Type.String({ minLength: 3, maxLength: 256 })
const PermissionDescription = Type.String()

export const CreatePermissionSchema = Type.Object({
  PermissionName: PermissionName,
  description: Type.Optional(PermissionDescription),
})
export type CreatePermissionSchemaType = Static<typeof CreatePermissionSchema>

export const getPermissionByIDSchema = Type.Object({
  permissionID: PermissionID,
})
export type getPermissionByIDType = Static<typeof getPermissionByIDSchema>

export const PatchPermissionSchema = Type.Object({
  PermissionName: Type.Optional(Type.String()),
  description: Type.Optional(PermissionDescription),
})
export type PatchPermissionSchemaType = Static<typeof PatchPermissionSchema>
