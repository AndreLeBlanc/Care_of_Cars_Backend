import { Static, Type } from '@sinclair/typebox'

export const ListPermissionQueryParamSchema = Type.Object({
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Integer({ minimum: 1, default: 10 })),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
})
export type ListPermissionQueryParamSchemaType = Static<typeof ListPermissionQueryParamSchema>

export const CreatePermissionSchema = Type.Object({
  PermissionName: Type.String(),
  description: Type.Optional(Type.String()),
})
export type CreatePermissionSchemaType = Static<typeof CreatePermissionSchema>

export const getPermissionByIDSchema = Type.Object({
  id: Type.Number(),
})
export type getPermissionByIDType = Static<typeof getPermissionByIDSchema>

export const PatchPermissionSchema = Type.Object({
  PermissionName: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
})
export type PatchPermissionSchemaType = Static<typeof PatchPermissionSchema>
