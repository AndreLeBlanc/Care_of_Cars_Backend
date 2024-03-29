import { and, eq } from 'drizzle-orm'

import { db } from '../config/db-connect.js'
import { roleToPermissions } from '../schema/schema.js'

export type RoleToPermissions = {
  roleId: number | null
  createdAt: Date
  updatedAt: Date
  permissionId: number | null
}

export async function createRoleToPermissions(
  roleId: number,
  permissionId: number,
): Promise<RoleToPermissions> {
  const createdRole: RoleToPermissions[] = await db
    .insert(roleToPermissions)
    .values({ roleId: roleId, permissionId: permissionId })
    .returning({
      permissionId: roleToPermissions.permissionId,
      roleId: roleToPermissions.roleId,
      createdAt: roleToPermissions.createdAt,
      updatedAt: roleToPermissions.updatedAt,
    })
  return createdRole[0]
}

export async function deleteRoleToPermissions(
  roleId: number,
  permissionId: number,
): Promise<RoleToPermissions | undefined> {
  const deletedRoleToPermissions = await db
    .delete(roleToPermissions)
    .where(
      and(eq(roleToPermissions.roleId, roleId), eq(roleToPermissions.permissionId, permissionId)),
    )
    .returning()
  return deletedRoleToPermissions[0] ? deletedRoleToPermissions[0] : undefined
}
