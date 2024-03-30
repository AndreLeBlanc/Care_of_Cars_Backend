import { desc, eq, or, sql } from 'drizzle-orm'

import { db } from '../config/db-connect.js'
import { permissions } from '../schema/schema.js'
import { ilike } from 'drizzle-orm'
import { PatchPermissionSchemaType } from '../routes/permissions/permissionSchema.js'

export type PermissionID = number
export type PermissionTitle = string
type PermissionDescription = string | null

export type PermissionIDDescName = {
  id: PermissionID
  permissionName: PermissionTitle
  description: PermissionDescription
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
  search: string,
  limit = 10,
  page = 1,
  offset = 0,
): Promise<PermissionsPaginate> {
  const condition = or(
    ilike(permissions.permissionName, '%' + search + '%'),
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
      id: permissions.id,
      permissionName: permissions.permissionName,
      description: permissions.description,
      createdAt: permissions.createdAt,
      updatedAt: permissions.updatedAt,
    })
    .from(permissions)
    .where(condition)
    .orderBy(desc(permissions.id))
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
  permissionName: PermissionTitle,
  description: PermissionDescription,
): Promise<PermissionIDDescName> {
  const createdPermission: PermissionIDDescName[] = await db
    .insert(permissions)
    .values({ permissionName: permissionName, description: description })
    .returning({
      id: permissions.id,
      permissionName: permissions.permissionName,
      description: permissions.description,
    })
  return createdPermission[0]
}

export async function getPermissionById(id: number): Promise<Permission | undefined> {
  const results = await db.select().from(permissions).where(eq(permissions.id, id))
  return results[0] ? results[0] : undefined
}

export async function updatePermissionById(
  id: PermissionID,
  permission: PatchPermissionSchemaType,
): Promise<Permission> {
  const permissionWithUpdatedAt = { ...permission, updatedAt: new Date() }
  const updatedPermission = await db
    .update(permissions)
    .set(permissionWithUpdatedAt)
    .where(eq(permissions.id, id))
    .returning({
      id: permissions.id,
      permissionName: permissions.permissionName,
      description: permissions.description,
      createdAt: permissions.createdAt,
      updatedAt: permissions.updatedAt,
    })
  return updatedPermission[0]
}

export async function deletePermission(id: number): Promise<Permission | undefined> {
  const deletedPermission = await db.delete(permissions).where(eq(permissions.id, id)).returning()
  return deletedPermission[0] ? deletedPermission[0] : undefined
}
