import { desc, eq, or, sql } from 'drizzle-orm'

import { db } from '../config/db-connect'

import { PermissionDescription, PermissionID, PermissionTitle, permissions } from '../schema/schema'

import { ilike } from 'drizzle-orm'

import { Limit, Offset, Page, Search } from '../plugins/pagination'

export type PermissionIDDescName = {
  permissionID: PermissionID
  permissionTitle: PermissionTitle
  permissionDescription: PermissionDescription | null
}

type PermissionCreatedAndUpdated = {
  createdAt: Date
  updatedAt: Date
}

export type Permission = PermissionIDDescName & PermissionCreatedAndUpdated

export type PermissionsPaginate = {
  totalItems: number
  totalPage: number
  perPage: number
  data: Permission[]
}

export async function getPermissionsPaginate(
  search: Search,
  limit = Limit(10),
  page = Page(1),
  offset = Offset(0),
): Promise<PermissionsPaginate> {
  const condition = or(
    ilike(permissions.permissionTitle, '%' + search + '%'),
    ilike(permissions.description, '%' + search + '%'),
  )

  const [totalItems] = await db
    .select({
      count: sql`count(*)`.mapWith(Number).as('count'),
    })
    .from(permissions)
    .where(condition)

  const permissionsList = await db
    .select({
      permissionID: permissions.permissionID,
      permissionTitle: permissions.permissionTitle,
      permissionDescription: permissions.description,
      createdAt: permissions.createdAt,
      updatedAt: permissions.updatedAt,
    })
    .from(permissions)
    .where(condition)
    .orderBy(desc(permissions.permissionID))
    .limit(limit || 10)
    .offset(offset || 0)

  const totalPage = Math.ceil(totalItems.count / limit)

  return {
    totalItems: totalItems.count,
    totalPage,
    perPage: page,
    data: permissionsList,
  }
}
export async function createPermission(
  permissionTitle: PermissionTitle,
  description: PermissionDescription,
): Promise<PermissionIDDescName> {
  const [createdPermission] = await db
    .insert(permissions)
    .values({
      permissionTitle: permissionTitle,
      description: description,
    })
    .returning({
      permissionID: permissions.permissionID,
      permissionTitle: permissions.permissionTitle,
      permissionDescription: permissions.description,
    })
  return createdPermission
}

export async function getPermissionByID(id: PermissionID): Promise<Permission | undefined> {
  const [results] = await db
    .select({
      permissionID: permissions.permissionID,
      permissionTitle: permissions.permissionTitle,
      permissionDescription: permissions.description,
      createdAt: permissions.createdAt,
      updatedAt: permissions.updatedAt,
    })
    .from(permissions)
    .where(eq(permissions.permissionID, id))
  return results
}

export async function updatePermissionByID(permission: PermissionIDDescName): Promise<Permission> {
  const permissionWithUpdatedAt = {
    permissionTitle: permission.permissionTitle,
    description: permission.permissionDescription,
    updatedAt: new Date(),
  }
  const [updatedPermission] = await db
    .update(permissions)
    .set(permissionWithUpdatedAt)
    .where(eq(permissions.permissionID, permission.permissionID))
    .returning({
      permissionID: permissions.permissionID,
      permissionTitle: permissions.permissionTitle,
      permissionDescription: permissions.description,
      createdAt: permissions.createdAt,
      updatedAt: permissions.updatedAt,
    })
  return updatedPermission
}

export async function deletePermission(id: PermissionID): Promise<Permission | undefined> {
  const [deletedPermission] = await db
    .delete(permissions)
    .where(eq(permissions.permissionID, id))
    .returning({
      permissionID: permissions.permissionID,
      permissionTitle: permissions.permissionTitle,
      permissionDescription: permissions.description,
      createdAt: permissions.createdAt,
      updatedAt: permissions.updatedAt,
    })
  return deletedPermission
}
