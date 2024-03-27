import { and, eq } from 'drizzle-orm'

import { db } from '../config/db-connect.js'
import { roleToPermissions } from '../schema/schema.js'

export async function createRoleToPermissions(roleId: number, permissionId: number) {
  return await db
    .insert(roleToPermissions)
    .values({ roleId: roleId, permissionId: permissionId })
    .returning({
      permissionId: roleToPermissions.permissionId,
      roleId: roleToPermissions.roleId,
      createdAt: roleToPermissions.createdAt,
      updatedAt: roleToPermissions.updatedAt,
    })
}

export async function deleteRoleToPermissions(roleId: number, permissionId: number): Promise<any> {
  const deletedRoleToPermissions = await db
    .delete(roleToPermissions)
    .where(
      and(eq(roleToPermissions.roleId, roleId), eq(roleToPermissions.permissionId, permissionId)),
    )
    .returning()
  return deletedRoleToPermissions[0] ? deletedRoleToPermissions[0] : undefined
}
