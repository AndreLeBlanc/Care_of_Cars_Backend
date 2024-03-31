import { desc, eq, or, sql } from 'drizzle-orm'

import { db } from '../config/db-connect.js'
import { permissions, roleToPermissions, roles } from '../schema/schema.js'
import { ilike } from 'drizzle-orm'
import { PatchRoleSchemaType } from '../routes/roles/roleSchema.js'
import { PermissionTitle, PermissionID } from './permissionService.js'

export type RoleName = { roleName: string }

export type RoleID = { roleID: number }

type RoleDescription = { roleDescription: string | null }

type RoleDate = {
  createdAt: Date
  updatedAt: Date
}

export type CreatedRole = RoleID & RoleName & RoleDescription

export type RoleDescDate = RoleName & RoleID & RoleDate

type RoleIDName = RoleName & RoleID

export type Role = RoleIDName & RoleDate

type RolesList = Role & RoleDescription

type PermissionStatus = {
  permissionId: PermissionID
  permissionName: PermissionTitle
  hasPermission: boolean
}
type RolesPaginated = {
  totalItems: number
  totalPage: number
  perPage: number
  data: RolesList[]
}

export async function getRolesPaginate(
  search: string,
  limit = 10,
  page = 1,
  offset = 0,
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

  const rolesList: RolesList[] = await db
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
  const newRole: CreatedRole[] = await db
    .insert(roles)
    .values({ roleName: roleName.roleName, description: description.roleDescription })
    .returning({
      roleID: roles.roleID,
      roleName: roles.roleName,
      roleDescription: roles.description,
    })
  return newRole[0]
}

export async function getRoleById(id: RoleID): Promise<Role | undefined> {
  const results = await db.select().from(roles).where(eq(roles.roleID, id.roleID))
  return results[0] ? results[0] : undefined
}

export async function updateRoleById(id: RoleID, role: PatchRoleSchemaType): Promise<Role> {
  const roleWithUpdatedAt = { ...role, updatedAt: new Date() }
  const updatedRole: Role[] = await db
    .update(roles)
    .set(roleWithUpdatedAt)
    .where(eq(roles.roleID, id.roleID))
    .returning({
      roleID: roles.roleID,
      roleName: roles.roleName,
      description: roles.description,
      createdAt: roles.createdAt,
      updatedAt: roles.updatedAt,
    })
  return updatedRole[0]
}

export async function deleteRole(id: RoleID): Promise<Role | undefined> {
  const deletedRole = await db.delete(roles).where(eq(roles.roleID, id.roleID)).returning()
  return deletedRole[0] ? deletedRole[0] : undefined
}

export async function getRoleWithPermissions(roleId: RoleID): Promise<any> {
  const roleWithPermissions = db
    .select({
      permissionId: permissions.permissionID,
      permissionName: permissions.permissionName,
      createdAt: permissions.createdAt,
      updatedAt: permissions.updatedAt,
    })
    .from(roleToPermissions)
    .leftJoin(roles, eq(roleToPermissions.roleId, roles.roleID))
    .leftJoin(permissions, eq(roleToPermissions.permissionId, permissions.permissionID))
    .where(eq(roles.roleID, roleId.roleID))
  return roleWithPermissions
}

export async function getAllPermissionStatus(roleId: RoleID): Promise<PermissionStatus[]> {
  const allPermissions = await db
    .select({ id: permissions.permissionID, permissionName: permissions.permissionName })
    .from(permissions)
    .limit(1000) // pagination is not possible here still we need to limit the rows.
  const rolePermissions: Array<{ permissionId: PermissionID; permissionName: PermissionTitle }> =
    await getRoleWithPermissions(roleId)
  const allPermissionsWithStatus: Array<{
    permissionId: PermissionID
    permissionName: PermissionTitle
    hasPermission: boolean
  }> = []
  for (const el of allPermissions) {
    const hasPermission: boolean =
      rolePermissions.filter((e) => e.permissionName.permissionName === el.permissionName).length >
      0
    allPermissionsWithStatus.push({
      permissionId: { permissionID: el.id },
      permissionName: { permissionName: el.permissionName },
      hasPermission: hasPermission,
    })
  }
  return allPermissionsWithStatus
}

export async function roleHasPermission(
  roleId: RoleID,
  permissionName: PermissionTitle,
): Promise<boolean> {
  const roleToPermissions: Array<{ permissionId: PermissionID; permissionName: PermissionTitle }> =
    await getRoleWithPermissions(roleId)
  const roleHasPermission =
    roleToPermissions.filter((e) => e.permissionName === permissionName).length > 0
  return roleHasPermission
}
