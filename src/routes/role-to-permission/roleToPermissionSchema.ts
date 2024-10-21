import { Static, Type } from '@sinclair/typebox'

import { PermissionID, PermissionIDDescNameSchema } from '../permissions/permissionSchema.js'
import { RoleDescription, RoleID, RoleName } from '../roles/roleSchema.js'
const Message = Type.String()

export const CreateRoleToPermissionSchema = Type.Array(
  Type.Object({
    roleID: RoleID,
    permissionID: PermissionID,
  }),
)

export type CreateRoleToPermissionSchemaType = Static<typeof CreateRoleToPermissionSchema>

export const CreateRoleToPermissionReplyeSchema = Type.Object({
  message: Message,
  roleToPerms: Type.Array(
    Type.Object({
      createdAt: Type.String({ format: 'date-time' }),
      updatedAt: Type.String({ format: 'date-time' }),
      roleID: RoleID,
      permissionID: PermissionID,
    }),
  ),
})

export type CreateRoleToPermissionReplySchemaType = Static<
  typeof CreateRoleToPermissionReplyeSchema
>

export const DeleteRoleToPermissionSchema = Type.Object({
  roleID: RoleID,
  permissionID: PermissionID,
})

export type DeleteRoleToPermissionType = Static<typeof DeleteRoleToPermissionSchema>

export const ListRolesToPermissionReplySchema = Type.Object({
  message: Message,
  rolesWithPerms: Type.Array(
    Type.Object({
      permissions: Type.Array(PermissionIDDescNameSchema),
      roleID: RoleID,
      roleName: RoleName,
      description: RoleDescription,
    }),
  ),
})

export const MessageSchema = Type.Object({
  message: Message,
})
