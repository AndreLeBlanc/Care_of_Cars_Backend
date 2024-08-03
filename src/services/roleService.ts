import { desc, eq, or, sql } from 'drizzle-orm'

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

import { ilike } from 'drizzle-orm'

import { Limit, Offset, Page, Search } from '../plugins/pagination.js'

import { Either, errorHandling, left, match, right } from '../utils/helper.js'

type RoleDate = {
  createdAt: Date
  updatedAt: Date
}

export type CreatedRole = {
  roleID: RoleID
  roleName: RoleName
  description?: RoleDescription
}

export type RoleIDName = { roleName: RoleName; roleID: RoleID } & RoleDate

export type Role = RoleIDName & { description?: RoleDescription } & RoleDate

export type RoleHasPermission = {
  permissionID: PermissionID
  permissionName: PermissionTitle
  createdAt: Date
  updatedAt: Date
}

export type PermissionStatus = {
  permissionID: PermissionID
  permissionName: PermissionTitle
  hasPermission: boolean
}
export type RolesPaginated = {
  totalItems: number
  totalPage: number
  perPage: number
  data: Role[]
}

export async function getRolesPaginate(
  search: Search,
  limit = Limit(10),
  page = Page(1),
  offset = Offset(0),
): Promise<Either<string, RolesPaginated>> {
  try {
    const condition = or(
      ilike(roles.roleName, '%' + search + '%'),
      ilike(roles.description, '%' + search + '%'),
    )

    const [totalItems] = await db
      .select({
        count: sql`count(*)`.mapWith(Number).as('count'),
      })
      .from(roles)
      .where(condition)

    const rolesList = await db
      .select()
      .from(roles)
      .where(condition)
      .orderBy(desc(roles.roleID))
      .limit(limit || 10)
      .offset(offset || 0)
    const totalPage = Math.ceil(totalItems.count / limit)

    const rolesBranded = rolesList.map((role) => ({
      roleID: role.roleID,
      roleName: role.roleName,
      description: role.description ?? undefined,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    }))

    return right({
      totalItems: totalItems.count,
      totalPage,
      perPage: page,
      data: rolesBranded,
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function createRole(
  roleName: RoleName,
  description: RoleDescription,
): Promise<Either<string, CreatedRole>> {
  try {
    const [newRole] = await db
      .insert(roles)
      .values({ roleName: roleName, description: description })
      .returning()
    const roleBranded: Role = {
      roleID: newRole.roleID,
      roleName: newRole.roleName,
      description: newRole.description ?? undefined,
      createdAt: newRole.createdAt,
      updatedAt: newRole.updatedAt,
    }
    return newRole ? right(roleBranded) : left("couldn't create role")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getRoleByID(id: RoleID): Promise<Either<string, Role>> {
  try {
    const [role] = await db
      .select({
        roleID: roles.roleID,
        roleName: roles.roleName,
        description: roles.description ?? undefined,
        createdAt: roles.createdAt,
        updatedAt: roles.updatedAt,
      })
      .from(roles)
      .where(eq(roles.roleID, id))
      .limit(1)

    const roleBranded: Role = {
      roleID: role.roleID,
      roleName: role.roleName,
      description: role.description ?? undefined,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    }
    return role ? right(roleBranded) : left("couldn't find role")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function updateRoleByID(role: CreatedRole): Promise<Either<string, Role>> {
  try {
    const roleWithUpdatedAt = { ...role, updatedAt: new Date() }
    const [updatedRole] = await db
      .update(roles)
      .set(roleWithUpdatedAt)
      .where(eq(roles.roleID, role.roleID))
      .returning()

    const roleBranded: Role = {
      roleID: updatedRole.roleID,
      roleName: updatedRole.roleName,
      description: updatedRole.description ?? undefined,
      createdAt: updatedRole.createdAt,
      updatedAt: updatedRole.updatedAt,
    }
    return updatedRole ? right(roleBranded) : left("Couldn't find role")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteRole(id: RoleID): Promise<Either<string, Role>> {
  try {
    const [deletedRole] = await db.delete(roles).where(eq(roles.roleID, id)).returning()
    return deletedRole
      ? right({
          roleID: deletedRole.roleID,
          description: deletedRole.description ?? undefined,
          roleName: RoleName(deletedRole.roleName),
          createdAt: deletedRole.createdAt,
          updatedAt: deletedRole.updatedAt,
        })
      : left("couldn't find role")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getRoleWithPermissions(
  roleID: RoleID,
): Promise<Either<string, { role: Role; roleHasPermission: RoleHasPermission[] }>> {
  try {
    const rolePerms = await db.transaction(async (tx) => {
      const roleWithPermissions = await tx
        .select({
          permissionID: permissions.permissionID,
          permissionName: permissions.permissionTitle,
          createdAt: permissions.createdAt,
          updatedAt: permissions.updatedAt,
        })
        .from(roleToPermissions)
        .leftJoin(roles, eq(roleToPermissions.roleID, roles.roleID))
        .leftJoin(permissions, eq(roleToPermissions.permissionID, permissions.permissionID))
        .where(eq(roles.roleID, roleID))

      const [role] = await tx.select().from(roles).where(eq(roles.roleID, roleID)).limit(1)

      const roleBranded: Role = {
        roleID: role.roleID,
        roleName: role.roleName,
        description: role.description ?? undefined,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      }

      return { role: roleBranded, roleWithPermissions: roleWithPermissions }
    })
    const brandedRoleWithPermissions: RoleHasPermission[] = rolePerms.roleWithPermissions.reduce(
      (acc, roleWPerm) => {
        if (
          roleWPerm.permissionID != null &&
          roleWPerm.permissionName != null &&
          roleWPerm.createdAt != null &&
          roleWPerm.updatedAt != null
        ) {
          acc.push({
            permissionID: PermissionID(roleWPerm.permissionID),
            permissionName: PermissionTitle(roleWPerm.permissionName),
            createdAt: roleWPerm.createdAt,
            updatedAt: roleWPerm.updatedAt,
          })
        }
        return acc
      },
      new Array<RoleHasPermission>(),
    )
    return brandedRoleWithPermissions
      ? right({ role: rolePerms.role, roleHasPermission: brandedRoleWithPermissions })
      : left("couldn't find role with permissions")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getAllPermissionStatus(
  roleID: RoleID,
): Promise<Either<string, { role: Role; allPermissionsWithStatus: PermissionStatus[] }>> {
  try {
    const rolePerms = await db.transaction(async (tx) => {
      const allPermissions = await db
        .select({
          permissions: {
            id: permissions.permissionID,
            permissionName: permissions.permissionTitle,
          },
          roleToPermissions: { permissionID: roleToPermissions.permissionID },
        })
        .from(permissions)
        .leftJoin(roleToPermissions, eq(roleToPermissions.roleID, roleID))

      const [role] = await tx.select().from(roles).where(eq(roles.roleID, roleID)).limit(1)

      const roleBranded: Role = {
        roleID: role.roleID,
        roleName: role.roleName,
        description: role.description ?? undefined,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      }
      return { role: roleBranded, allPermissions: allPermissions }
    })

    const allPermissionsWithStatus: Array<{
      permissionID: PermissionID
      permissionName: PermissionTitle
      hasPermission: boolean
    }> = []
    for (const el of rolePerms.allPermissions) {
      allPermissionsWithStatus.push({
        permissionID: PermissionID(el.permissions.id),
        permissionName: PermissionTitle(el.permissions.permissionName),
        hasPermission: el.roleToPermissions ? true : false,
      })
    }
    return allPermissionsWithStatus
      ? right({
          role: rolePerms.role,
          allPermissionsWithStatus: allPermissionsWithStatus,
        })
      : left("Couldn't find any permissions")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function roleHasPermission(
  roleID: RoleID,
  permissionName: PermissionTitle,
): Promise<Either<string, boolean>> {
  try {
    const roleToPermissions: Either<
      string,
      { role: Role; roleHasPermission: RoleHasPermission[] }
    > = await getRoleWithPermissions(roleID)

    return match(
      roleToPermissions,
      (rolesToPerms) => {
        return right(
          rolesToPerms.roleHasPermission.filter((e) => e.permissionName === permissionName).length >
            0,
        )
      },
      (err) => {
        return left(err)
      },
    )
  } catch (e) {
    return left(errorHandling(e))
  }
}
