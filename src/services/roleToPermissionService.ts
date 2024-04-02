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
  roleID: RoleID,
  permissionID: PermissionID,
): Promise<RoleToPermissions> {
  const createdRole: RoleToPermissions[] = await db
    .insert(roleToPermissions)
    .values({ roleID: roleID.roleID, permissionID: permissionID.permissionID })
    .returning({
      permissionID: roleToPermissions.permissionID,
      roleID: roleToPermissions.roleID,
      createdAt: roleToPermissions.createdAt,
      updatedAt: roleToPermissions.updatedAt,
    })
  return createdRole[0]
}
export async function deleteRoleToPermissions(
  roleID: RoleID,
  permissionID: PermissionID,
): Promise<RoleToPermissions | undefined> {
  const deletedRoleToPermissions: RoleToPermissions[] = await db
    .delete(roleToPermissions)
    .where(
      and(
        eq(roleToPermissions.roleID, roleID.roleID),
        eq(roleToPermissions.permissionID, permissionID.permissionID),
      ),
    )
    .returning({
      permissionID: roleToPermissions.permissionID,
      roleID: roleToPermissions.roleID,
      createdAt: roleToPermissions.createdAt,
      updatedAt: roleToPermissions.updatedAt,
    })
  return deletedRoleToPermissions[0] ? deletedRoleToPermissions[0] : undefined
}
