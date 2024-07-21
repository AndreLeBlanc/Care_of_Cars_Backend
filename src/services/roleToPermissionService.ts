import { and, eq } from 'drizzle-orm'

import { db } from '../config/db-connect.js'

import { PermissionID, RoleID, roleToPermissions } from '../schema/schema.js'

import { Brand, make } from 'ts-brand'

import { Either, errorHandling, left, right } from '../utils/helper.js'

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
): Promise<Either<string, RoleToPermissions>> {
  try {
    const [createdRole] = await db
      .insert(roleToPermissions)
      .values({ roleID: roleID, permissionID: permissionID })
      .returning({
        permissionID: roleToPermissions.permissionID,
        roleID: roleToPermissions.roleID,
        createdAt: roleToPermissions.createdAt,
        updatedAt: roleToPermissions.updatedAt,
      })
    return createdRole
      ? right({
          maybeRoleID: MaybeRoleID(createdRole.roleID),
          maybePermissionID: MaybePermissionID(createdRole.permissionID),
          createdAt: createdRole.createdAt,
          updatedAt: createdRole.updatedAt,
        })
      : left("couldn't creat role to permission")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteRoleToPermissions(
  roleID: RoleID,
  permissionID: PermissionID,
): Promise<Either<string, RoleToPermissions>> {
  try {
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
      ? right({
          maybeRoleID: MaybeRoleID(deletedRoleToPermissions.roleID),
          maybePermissionID: MaybePermissionID(deletedRoleToPermissions.permissionID),
          createdAt: deletedRoleToPermissions.createdAt,
          updatedAt: deletedRoleToPermissions.updatedAt,
        })
      : left("couldn't find role to permission")
  } catch (e) {
    return left(errorHandling(e))
  }
}
