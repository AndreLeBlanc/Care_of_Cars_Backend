import { and, count, eq } from 'drizzle-orm'

import { db } from '../config/db-connect.js'

import {
  PermissionID,
  PermissionTitle,
  RoleDescription,
  RoleID,
  RoleName,
  permissions,
  roleToPermissions,
  roles,
} from '../schema/schema.js'

import { Brand, make } from 'ts-brand'

import { PermissionIDDescName } from './permissionService.js'
import { CreatedRole } from './roleService.js'

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

export type PermissionsByRole = {
  permissions: PermissionIDDescName[]
  roleID: RoleID
  roleName: RoleName
  description?: RoleDescription
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

export async function getAllPermissionStatus(
  roleID: RoleID,
): Promise<Either<string, { roleID: RoleID; allPermissionsWithStatus: PermissionIDDescName[] }>> {
  try {
    const perms = await db
      .select({
        permissionID: permissions.permissionID,
        permissionTitle: permissions.permissionTitle,
        description: permissions.description,
      })
      .from(roles)
      .innerJoin(roleToPermissions, eq(roleToPermissions.roleID, roleID))
      .innerJoin(permissions, eq(permissions.permissionID, roleToPermissions.permissionID))
      .where(eq(roles.roleID, roleID))

    const permWithStatus = perms.map((perm) => ({
      permissionID: perm.permissionID,
      permissionTitle: perm.permissionTitle,
      description: perm.description ?? undefined,
    }))
    return permWithStatus
      ? right({
          roleID: roleID,
          allPermissionsWithStatus: permWithStatus,
        })
      : left("Couldn't find any permissions")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function listRolesToPermissions(): Promise<Either<string, PermissionsByRole[]>> {
  try {
    //const permissionsByRole = await db
    //  .select({
    //    permissionID: permissions.permissionID,
    //    permissionTitle: permissions.permissionTitle,
    //    description: permissions.description,
    //  })
    //  .from(roles)
    //  .innerJoin(roleToPermissions, eq(roleToPermissions.roleID, sql`"excluded"."roleID"`))
    //  .innerJoin(permissions, eq(permissions.permissionID, roleToPermissions.permissionID))
    //
    const permissionsByRole = await db.query.roles.findMany({
      columns: {
        roleID: true,
        roleName: true,
        description: true,
      },
      with: {
        roleToPermissions: {
          columns: {
            roleID: true,
            permissionID: true,
          },
          with: {
            permissions: {
              columns: {
                permissionID: true,
                permissionTitle: true,
                description: true,
              },
            },
          },
        },
      },
    })

    const permissionsByRoleBranded: PermissionsByRole[] = permissionsByRole.map((pbr) => ({
      roleID: pbr.roleID,
      roleName: pbr.roleName,
      description: pbr.description ?? undefined,
      permissions: pbr.roleToPermissions.reduce<PermissionIDDescName[]>((acc, perm) => {
        if (perm.permissions != null) {
          acc.push({
            permissionID: perm.permissions.permissionID,
            permissionTitle: perm.permissions.permissionTitle,
            description: perm.permissions.description ?? undefined,
          })
        }
        return acc
      }, []),
    }))

    return permissionsByRoleBranded.length > 0
      ? right(permissionsByRoleBranded)
      : left('no roles found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getRoleWithPermissions(
  roleID: RoleID,
): Promise<Either<string, { role: CreatedRole; roleHasPermission: PermissionIDDescName[] }>> {
  try {
    const rolePerms = await db.transaction(async (tx) => {
      const roleWithPermissions = await tx
        .select({
          permissionID: permissions.permissionID,
          permissionTitle: permissions.permissionTitle,
          description: permissions.description,
        })
        .from(roleToPermissions)
        .leftJoin(roles, eq(roleToPermissions.roleID, roles.roleID))
        .leftJoin(permissions, eq(roleToPermissions.permissionID, permissions.permissionID))
        .where(eq(roles.roleID, roleID))

      const [role] = await tx
        .select({ roleID: roles.roleID, roleName: roles.roleName, description: roles.description })
        .from(roles)
        .where(eq(roles.roleID, roleID))
        .limit(1)

      const roleBranded: CreatedRole = {
        roleID: role.roleID,
        roleName: role.roleName,
        description: role.description ?? undefined,
      }

      return { role: roleBranded, roleWithPermissions: roleWithPermissions }
    })
    const brandedRoleWithPermissions: PermissionIDDescName[] = rolePerms.roleWithPermissions.reduce(
      (acc, roleWPerm) => {
        if (roleWPerm.permissionID != null && roleWPerm.permissionTitle != null) {
          acc.push({
            permissionID: PermissionID(roleWPerm.permissionID),
            permissionTitle: PermissionTitle(roleWPerm.permissionTitle),
            description: roleWPerm.description ?? undefined,
          })
        }
        return acc
      },
      new Array<PermissionIDDescName>(),
    )
    return brandedRoleWithPermissions
      ? right({ role: rolePerms.role, roleHasPermission: brandedRoleWithPermissions })
      : left("couldn't find role with permissions")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function roleHasPermission(
  roleID: RoleID,
  permissionTitle: PermissionTitle,
): Promise<Either<string, boolean>> {
  try {
    const [countOfCombo] = await db
      .select({ count: count() })
      .from(roleToPermissions)
      .where(and(eq(roleToPermissions.roleID, roleID)))
      .innerJoin(permissions, eq(permissions.permissionTitle, permissionTitle))
    return countOfCombo ? right(countOfCombo.count > 0) : left('error')
  } catch (e) {
    return left(errorHandling(e))
  }
}
