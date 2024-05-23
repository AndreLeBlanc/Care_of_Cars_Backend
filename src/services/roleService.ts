import { desc, eq, or, sql } from 'drizzle-orm'

import { db } from '../config/db-connect.js'

import { permissions, roleToPermissions, roles } from '../schema/schema.js'

import { ilike } from 'drizzle-orm'

import { PermissionID, PermissionTitle } from './permissionService.js'

import { Limit, Offset, Page, Search } from '../plugins/pagination.js'

import { Brand, make } from 'ts-brand'

export type RoleName = Brand<string, 'roleName'>
export const RoleName = make<RoleName>()

export type RoleID = Brand<number, 'roleID'>
export const RoleID = make<RoleID>()

export type RoleDescription = Brand<string, 'roleDescription'>
export const RoleDescription = make<RoleDescription>()

type RoleDate = {
  createdAt: Date
  updatedAt: Date
}

export type CreatedRole = {
  roleID: RoleID
  roleName: RoleName
  roleDescription: RoleDescription | null
}

export type RoleIDName = { roleName: RoleName; roleID: RoleID } & RoleDate

export type Role = { roleName: RoleName } & RoleDate

type RolesList = Role & { roleDescription: RoleDescription | null }

export type RoleHasPermission = {
  permissionID: PermissionID
  permissionName: PermissionTitle
  createdAt: Date
  updatedAt: Date
}

type PermissionStatus = {
  permissionID: PermissionID
  permissionName: PermissionTitle
  hasPermission: boolean
}
export type RolesPaginated = {
  totalItems: number
  totalPage: number
  perPage: number
  data: RolesList[]
}

export async function getRolesPaginate(
  search: Search,
  limit = Limit(10),
  page = Page(1),
  offset = Offset(0),
): Promise<RolesPaginated> {
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
    .select({
      roleID: roles.roleID,
      roleName: roles.roleName,
      roleDescription: roles.description,
      createdAt: roles.createdAt,
      updatedAt: roles.updatedAt,
    })
    .from(roles)
    .where(condition)
    .orderBy(desc(roles.roleID))
    .limit(limit || 10)
    .offset(offset || 0)
  const totalPage = Math.ceil(totalItems.count / limit)

  return {
    totalItems: totalItems.count,
    totalPage,
    perPage: page,
    data: rolesList,
  }
}

export async function createRole(
  roleName: RoleName,
  description: RoleDescription,
): Promise<CreatedRole> {
  const [newRole] = await db
    .insert(roles)
    .values({ roleName: roleName, description: description })
    .returning({
      roleID: roles.roleID,
      roleName: roles.roleName,
      roleDescription: roles.description,
    })
  return newRole
}

export async function getRoleByID(id: RoleID): Promise<Role | undefined> {
  const [role] = await db
    .select({ roleName: roles.roleName, createdAt: roles.createdAt, updatedAt: roles.updatedAt })
    .from(roles)
    .where(eq(roles.roleID, id))
    .limit(1)
  return role
}

export async function updateRoleByID(role: CreatedRole): Promise<Role> {
  const roleWithUpdatedAt = { ...role, updatedAt: new Date() }
  const [updatedRole] = await db
    .update(roles)
    .set(roleWithUpdatedAt)
    .where(eq(roles.roleID, role.roleID))
    .returning({
      roleID: roles.roleID,
      roleName: roles.roleName,
      description: roles.description,
      createdAt: roles.createdAt,
      updatedAt: roles.updatedAt,
    })
  return updatedRole
}

export async function deleteRole(id: RoleID): Promise<Role | undefined> {
  const [deletedRole] = await db.delete(roles).where(eq(roles.roleID, id)).returning()
  return deletedRole
    ? {
        roleName: RoleName(deletedRole.roleName),
        createdAt: deletedRole.createdAt,
        updatedAt: deletedRole.updatedAt,
      }
    : undefined
}

export async function getRoleWithPermissions(roleID: RoleID): Promise<RoleHasPermission[]> {
  const roleWithPermissions = await db
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

  const brandedRoleWithPermissions: RoleHasPermission[] = roleWithPermissions.reduce(
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
}

export async function getAllPermissionStatus(roleID: RoleID): Promise<PermissionStatus[]> {
  const allPermissions = await db
    .select({ id: permissions.permissionID, permissionName: permissions.permissionTitle })
    .from(permissions)
    .limit(1000) // pagination is not possible here still we need to limit the rows.
  const rolePermissions: Array<{ permissionID: PermissionID; permissionName: PermissionTitle }> =
    await getRoleWithPermissions(roleID)
  const allPermissionsWithStatus: Array<{
    permissionID: PermissionID
    permissionName: PermissionTitle
    hasPermission: boolean
  }> = []
  for (const el of allPermissions) {
    const hasPermission: boolean =
      rolePermissions.filter((e) => e.permissionName === el.permissionName).length > 0
    allPermissionsWithStatus.push({
      permissionID: PermissionID(el.id),
      permissionName: PermissionTitle(el.permissionName),
      hasPermission: hasPermission,
    })
  }
  return allPermissionsWithStatus
}

export async function roleHasPermission(
  roleID: RoleID,
  permissionName: PermissionTitle,
): Promise<boolean> {
  const roleToPermissions: Array<{ permissionID: PermissionID; permissionName: PermissionTitle }> =
    await getRoleWithPermissions(roleID)
  const roleHasPermission =
    roleToPermissions.filter((e) => e.permissionName === permissionName).length > 0
  return roleHasPermission
}
