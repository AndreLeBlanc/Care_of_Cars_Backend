import { desc, eq, or, sql } from 'drizzle-orm'

import { db } from '../config/db-connect.js'
import { permissions, roleToPermissions, roles } from '../schema/schema.js'
import { ilike } from 'drizzle-orm'
import { PatchRoleSchemaType } from '../routes/roles/roleSchema.js'
import { PermissionTitle, PermissionID } from './permissionService.js'

export type RoleName = string

export type RoleID = number

export type RoleDescription = string | null

type RoleDate = {
  createdAt: Date
  updatedAt: Date
}

export type CreatedRole = { id: RoleID; roleName: RoleName; description: RoleDescription }

export type RoleDescDate = { roleName: RoleName; role: RoleID } & RoleDate

export type RoleIDName = { roleName: RoleName; id: RoleID }

export type Role = RoleIDName & RoleDate

type RolesList = Role & { description: RoleDescription }

export type PermissionStatus = {
  permissionId: number
  permissionName: string
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
      id: roles.id,
      roleName: roles.roleName,
      description: roles.description,
      createdAt: roles.createdAt,
      updatedAt: roles.updatedAt,
    })
    .from(roles)
    .where(condition)
    .orderBy(desc(roles.id))
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
    .values({ roleName: roleName, description: description })
    .returning({ id: roles.id, roleName: roles.roleName, description: roles.description })
  return newRole[0]
}

export async function getRoleById(id: RoleID): Promise<Role | undefined> {
  const results = await db.select().from(roles).where(eq(roles.id, id))
  return results[0] ? results[0] : undefined
}

export async function updateRoleById(id: RoleID, role: PatchRoleSchemaType): Promise<Role> {
  const roleWithUpdatedAt = { ...role, updatedAt: new Date() }
  const updatedRole = await db
    .update(roles)
    .set(roleWithUpdatedAt)
    .where(eq(roles.id, id))
    .returning({
      id: roles.id,
      roleName: roles.roleName,
      description: roles.description,
      createdAt: roles.createdAt,
      updatedAt: roles.updatedAt,
    })
  return updatedRole[0]
}

export async function deleteRole(id: RoleID): Promise<Role | undefined> {
  const deletedRole = await db.delete(roles).where(eq(roles.id, id)).returning()
  return deletedRole[0] ? deletedRole[0] : undefined
}

export async function getRoleWithPermissions(roleId: RoleID): Promise<any> {
  const roleWithPermissions = db
    .select({
      permissionId: permissions.id,
      permissionName: permissions.permissionName,
      createdAt: permissions.createdAt,
      updatedAt: permissions.updatedAt,
    })
    .from(roleToPermissions)
    .leftJoin(roles, eq(roleToPermissions.roleId, roles.id))
    .leftJoin(permissions, eq(roleToPermissions.permissionId, permissions.id))
    .where(eq(roles.id, roleId))
  return roleWithPermissions
}

export async function getAllPermissionStatus(roleId: RoleID): Promise<PermissionStatus[]> {
  const allPermissions = await db
    .select({ id: permissions.id, permissionName: permissions.permissionName })
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
      rolePermissions.filter((e) => e.permissionName === el.permissionName).length > 0
    allPermissionsWithStatus.push({
      permissionId: el.id,
      permissionName: el.permissionName,
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
