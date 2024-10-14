import { Static, Type } from '@sinclair/typebox'

export const PermissionID = Type.Integer()
const PermissionName = Type.String({ minLength: 3, maxLength: 256 })
const PermissionDescription = Type.String()
const MessageSchema = Type.String()

export const MessageReplySchema = Type.Object({ message: MessageSchema })

export type MessageReplySchemaType = Static<typeof MessageReplySchema>

export const ListPermissionQueryParamSchema = Type.Object({
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Integer({ minimum: 1, default: 10 })),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
})

export type ListPermissionQueryParamSchemaType = Static<typeof ListPermissionQueryParamSchema>

export const CreatePermissionSchema = Type.Array(
  Type.Object({
    permissionTitle: PermissionName,
    description: Type.Optional(PermissionDescription),
  }),
)

export type CreatePermissionSchemaType = Static<typeof CreatePermissionSchema>

export const CreatePermissionResponseSchema = Type.Object({
  message: MessageSchema,
  permissions: Type.Array(
    Type.Object({
      permissionID: PermissionID,
      permissionTitle: PermissionName,
      description: Type.Optional(PermissionDescription),
    }),
  ),
})

export type CreatePermissionResponseSchemaType = Static<typeof CreatePermissionResponseSchema>

export const getPermissionByIDSchema = Type.Object({
  permissionID: PermissionID,
})

export type getPermissionByIDType = Static<typeof getPermissionByIDSchema>

export const PatchPermissionSchema = Type.Object({
  permissionTitle: PermissionName,
  description: Type.Optional(PermissionDescription),
})

export type PatchPermissionSchemaType = Static<typeof PatchPermissionSchema>

export const PermissionIDDescNameSchema = Type.Object({
  permissionID: PermissionID,
  permissionTitle: PermissionName,
  permissionDescription: Type.Optional(PermissionDescription),
})
