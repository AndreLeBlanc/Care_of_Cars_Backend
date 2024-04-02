import { and, eq } from 'drizzle-orm'

import { db } from '../config/db-connect.js'
import { roleToPermissions } from '../schema/schema.js'
import { RoleID } from './roleService.js'
import { PermissionID } from './permissionService.js'

type MaybeRoleID = { roleID: number | null }
type MaybePermissionID = { permissionID: number | null }

export type RoleToPermissions = {
  createdAt: Date
  updatedAt: Date
} & MaybeRoleID &
  MaybePermissionID

export async function createRoleToPermissions(
  roleId: RoleID,
  permissionId: PermissionID,
): Promise<RoleToPermissions> {
  const createdRole: RoleToPermissions[] = await db
    .insert(roleToPermissions)
    .values({ roleId: roleId.roleID, permissionId: permissionId.permissionID })
    .returning({
      permissionID: roleToPermissions.permissionId,
      roleID: roleToPermissions.roleId,
      createdAt: roleToPermissions.createdAt,
      updatedAt: roleToPermissions.updatedAt,
    })
  return createdRole[0]
}
export async function deleteRoleToPermissions(
  roleId: RoleID,
  permissionId: PermissionID,
): Promise<RoleToPermissions | undefined> {
  const deletedRoleToPermissions: RoleToPermissions[] = await db
    .delete(roleToPermissions)
    .where(
      and(
        eq(roleToPermissions.roleId, roleId.roleID),
        eq(roleToPermissions.permissionId, permissionId.permissionID),
      ),
    )
    .returning({
      permissionID: roleToPermissions.permissionId,
      roleID: roleToPermissions.roleId,
      createdAt: roleToPermissions.createdAt,
      updatedAt: roleToPermissions.updatedAt,
    })
  return deletedRoleToPermissions[0] ? deletedRoleToPermissions[0] : undefined
}
