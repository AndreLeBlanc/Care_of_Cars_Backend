import { and, eq } from 'drizzle-orm'

import { db } from '../config/db-connect.js'
import { roleToPermissions } from '../schema/schema.js'
import { RoleID } from './roleService.js'
import { PermissionID } from './permissionService.js'

import { Brand, make } from 'ts-brand'

type MaybeRoleID = Brand<number | null, 'MaybeRoleID'>
const MaybeRoleID = make<MaybeRoleID>()

type MaybePermissionID = Brand<number | null, 'permissionID'>
const MaybePermissionID = make<MaybePermissionID>()

export type RoleToPermissions = {
  createdAt: Date
  updatedAt: Date
  maybeRoleID: MaybeRoleID
  maybePermissionID: MaybePermissionID
}

export async function createRoleToPermissions(
  roleID: RoleID,
  permissionID: PermissionID,
): Promise<RoleToPermissions> {
  const [createdRole] = await db
    .insert(roleToPermissions)
    .values({ roleID: roleID, permissionID: permissionID })
    .returning({
      permissionID: roleToPermissions.permissionID,
      roleID: roleToPermissions.roleID,
      createdAt: roleToPermissions.createdAt,
      updatedAt: roleToPermissions.updatedAt,
    })
  return {
    maybeRoleID: MaybeRoleID(createdRole.roleID),
    maybePermissionID: MaybePermissionID(createdRole.permissionID),
    createdAt: createdRole.createdAt,
    updatedAt: createdRole.updatedAt,
  }
}
export async function deleteRoleToPermissions(
  roleID: RoleID,
  permissionID: PermissionID,
): Promise<RoleToPermissions | undefined> {
  const [deletedRoleToPermissions] = await db
    .delete(roleToPermissions)
    .where(
      and(eq(roleToPermissions.roleID, roleID), eq(roleToPermissions.permissionID, permissionID)),
    )
    .returning({
      permissionID: roleToPermissions.permissionID,
      roleID: roleToPermissions.roleID,
      createdAt: roleToPermissions.createdAt,
      updatedAt: roleToPermissions.updatedAt,
    })
  return deletedRoleToPermissions
    ? {
        maybeRoleID: MaybeRoleID(deletedRoleToPermissions.roleID),
        maybePermissionID: MaybePermissionID(deletedRoleToPermissions.permissionID),
        createdAt: deletedRoleToPermissions.createdAt,
        updatedAt: deletedRoleToPermissions.updatedAt,
      }
    : undefined
}
