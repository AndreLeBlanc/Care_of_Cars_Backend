import { Static, Type } from '@sinclair/typebox'

import { PermissionID } from '../permissions/permissionSchema'
import { RoleID } from '../roles/roleSchema'

export const CreateRoleToPermissionSchema = Type.Object({
  roleID: RoleID,
  permissionID: PermissionID,
})
export type CreateRoleToPermissionSchemaType = Static<typeof CreateRoleToPermissionSchema>

export const DeleteRoleToPermissionSchema = Type.Object({
  roleID: RoleID,
  permissionID: PermissionID,
})
export type DeleteRoleToPermissionType = Static<typeof DeleteRoleToPermissionSchema>
