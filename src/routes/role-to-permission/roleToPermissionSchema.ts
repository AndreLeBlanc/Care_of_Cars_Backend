import { Static, Type } from '@sinclair/typebox'

export const CreateRoleToPermissionSchema = Type.Object({
  roleID: Type.Integer(),
  permissionID: Type.Integer(),
})
export type CreateRoleToPermissionSchemaType = Static<typeof CreateRoleToPermissionSchema>

export const DeleteRoleToPermissionSchema = Type.Object({
  roleID: Type.Integer(),
  permissionID: Type.Integer(),
})
export type DeleteRoleToPermissionType = Static<typeof DeleteRoleToPermissionSchema>
