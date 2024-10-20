import { Brand, make } from 'ts-brand'
import { Either, errorHandling, jsonAggBuildObject, left, right } from '../utils/helper.js'
import {
  EmployeePin,
  PermissionDescription,
  PermissionID,
  PermissionTitle,
  RoleDescription,
  RoleID,
  RoleName,
  UserID,
  employees,
  permissions,
  roleToPermissions,
  roles,
} from '../schema/schema.js'
import { and, count, eq } from 'drizzle-orm'
import { CreatedRole } from './roleService.js'
import { PermissionIDDescName } from './permissionService.js'
import { db } from '../config/db-connect.js'

type MaybeRoleID = Brand<number | null, 'MaybeRoleID'>
const MaybeRoleID = make<MaybeRoleID>()

type MaybePermissionID = Brand<number | null, 'permissionID'>
const MaybePermissionID = make<MaybePermissionID>()

export type CreateRoleToPermission = {
  roleID: RoleID
  permissionID: PermissionID
}

export type RoleToPermissions = {
  createdAt: Date
  updatedAt: Date
  roleID: MaybeRoleID
  permissionID: MaybePermissionID
}

export type PermissionsByRole = {
  permissions: PermissionIDDescName[]
  roleID: RoleID
  roleName: RoleName
  description?: RoleDescription
}

type RoleWithPermissions = {
  perms: {
    permissionID: PermissionID
    description: PermissionDescription | null
    permissionTitle: PermissionTitle
  }[]
  role: {
    roleID: RoleID
    roleName: RoleName
    description: RoleDescription | null
  }
}

export async function createRoleToPermissions(
  newRTP: CreateRoleToPermission[],
): Promise<Either<string, RoleToPermissions[]>> {
  try {
    const createdRole = await db.insert(roleToPermissions).values(newRTP).returning({
      permissionID: roleToPermissions.permissionID,
      roleID: roleToPermissions.roleID,
      createdAt: roleToPermissions.createdAt,
      updatedAt: roleToPermissions.updatedAt,
    })
    return createdRole
      ? right(
          createdRole.map((rtp) => ({
            roleID: MaybeRoleID(rtp.roleID),
            permissionID: MaybePermissionID(rtp.permissionID),
            createdAt: rtp.createdAt,
            updatedAt: rtp.updatedAt,
          })),
        )
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
          roleID: MaybeRoleID(deletedRoleToPermissions.roleID),
          permissionID: MaybePermissionID(deletedRoleToPermissions.permissionID),
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
      .from(roleToPermissions)
      .where(eq(roleToPermissions.roleID, roleID))
      .innerJoin(permissions, eq(permissions.permissionID, roleToPermissions.permissionID))

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
      const roleWithPermissions: RoleWithPermissions[] = await tx
        .select({
          perms: jsonAggBuildObject({
            permissionID: permissions.permissionID,
            permissionTitle: permissions.permissionTitle,
            description: permissions.description,
          }),
          role: {
            roleID: roles.roleID,
            roleName: roles.roleName,
            description: roles.description,
          },
        })
        .from(roleToPermissions)
        .where(eq(roleToPermissions.roleID, roleID))
        .innerJoin(roles, eq(roleToPermissions.roleID, roles.roleID))
        .leftJoin(permissions, eq(roleToPermissions.permissionID, permissions.permissionID))
        .groupBy(roles.roleID)

      const roleBranded: CreatedRole = {
        roleID: roleWithPermissions[0].role.roleID,
        roleName: roleWithPermissions[0].role.roleName,
        description: roleWithPermissions[0].role.description ?? undefined,
      }

      return { role: roleBranded, roleWithPermissions: roleWithPermissions }
    })
    const brandedRoleWithPermissions: PermissionIDDescName[] =
      rolePerms.roleWithPermissions[0].perms.reduce((acc, roleWPerm) => {
        if (roleWPerm.permissionID != null && roleWPerm.permissionTitle != null) {
          acc.push({
            permissionID: PermissionID(roleWPerm.permissionID),
            permissionTitle: PermissionTitle(roleWPerm.permissionTitle),
            description: roleWPerm.description ?? undefined,
          })
        }
        return acc
      }, new Array<PermissionIDDescName>())
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
      .where(
        and(eq(roleToPermissions.roleID, roleID), eq(permissions.permissionTitle, permissionTitle)),
      )
      .innerJoin(permissions, eq(permissions.permissionID, roleToPermissions.permissionID))

    return countOfCombo ? right(countOfCombo.count > 0) : left('error')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function roleHasPermissionPin(
  roleID: RoleID,
  permissionTitle: PermissionTitle,
  user: UserID,
  pin: EmployeePin,
): Promise<Either<string, boolean>> {
  try {
    const [countOfCombo] = await db
      .select({ count: count() })
      .from(roleToPermissions)
      .where(and(eq(roleToPermissions.roleID, roleID)))
      .innerJoin(permissions, eq(permissions.permissionTitle, permissionTitle))
      .innerJoin(employees, and(eq(employees.userID, user), eq(employees.employeePin, pin)))
    return countOfCombo ? right(countOfCombo.count > 0) : left('error')
  } catch (e) {
    return left(errorHandling(e))
  }
}
