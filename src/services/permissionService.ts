import { desc, eq, or, sql } from 'drizzle-orm'

import { db } from '../config/db-connect.js'
import { permissions } from '../schema/schema.js'

import { ilike } from 'drizzle-orm'

import { PatchPermissionSchemaType } from '../routes/permissions/permissionSchema.js'

import { Limit, Offset, Page, Search } from '../plugins/pagination.js'

import { Brand, make } from 'ts-brand'

export type PermissionID = Brand<number, 'permissionID'>
export const PermissionID = make<PermissionID>()
export type PermissionTitle = Brand<string, 'permissionName'>
export const PermissionTitle = make<PermissionTitle>()
export type PermissionDescription = Brand<string | null, ' permissionDescription'>
export const PermissionDescription = make<PermissionDescription>()

export type PermissionIDDescName = {
  permissionID: PermissionID
  permissionName: PermissionTitle
  permissionDescription: PermissionDescription
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
      permissionID: permissions.permissionID,
      permissionName: permissions.permissionName,
      permissionDesc: permissions.description,
      createdAt: permissions.createdAt,
      updatedAt: permissions.updatedAt,
    })
    .from(permissions)
    .where(condition)
    .orderBy(desc(permissions.permissionID))
    .limit(limit || 10)
    .offset(offset || 0)

  const permissionsBrandedList = permissionsList.map((permList) => {
    return {
      permissionID: PermissionID(permList.permissionID),
      permissionName: PermissionTitle(permList.permissionName),
      permissionDescription: PermissionDescription(permList.permissionDesc),
      createdAt: permList.createdAt,
      updatedAt: permList.updatedAt,
    }
  })

  const totalPage = Math.ceil(totalItems.count / limit)

  return {
    totalItems: totalItems.count,
    totalPage,
    perPage: page,
    data: permissionsBrandedList,
  }
}
export async function createPermission(
  permissionName: PermissionTitle,
  description: PermissionDescription,
): Promise<PermissionIDDescName> {
  const [createdPermission] = await db
    .insert(permissions)
    .values({
      permissionName: permissionName,
      description: description,
    })
    .returning({
      permissionID: permissions.permissionID,
      permissionName: permissions.permissionName,
      permissionDescription: permissions.description,
    })
  return {
    permissionID: PermissionID(createdPermission.permissionID),
    permissionName: PermissionTitle(createdPermission.permissionName),
    permissionDescription: PermissionDescription(createdPermission.permissionDescription),
  }
}

export async function getPermissionByID(id: PermissionID): Promise<Permission | undefined> {
  const [results] = await db
    .select({
      permissionID: permissions.permissionID,
      permissionName: permissions.permissionName,
      permissionDescription: permissions.description,
      createdAt: permissions.createdAt,
      updatedAt: permissions.updatedAt,
    })
    .from(permissions)
    .where(eq(permissions.permissionID, id))

  return results
    ? {
        permissionID: PermissionID(results.permissionID),
        permissionName: PermissionTitle(results.permissionName),
        permissionDescription: PermissionDescription(results.permissionDescription),
        createdAt: results.createdAt,
        updatedAt: results.updatedAt,
      }
    : undefined
}

export async function updatePermissionByID(
  id: PermissionID,
  permission: PatchPermissionSchemaType,
): Promise<Permission> {
  const permissionWithUpdatedAt = {
    permissionName: permission.PermissionName,
    description: permission.description,
    updatedAt: new Date(),
  }
  const [updatedPermission] = await db
    .update(permissions)
    .set(permissionWithUpdatedAt)
    .where(eq(permissions.permissionID, id))
    .returning({
      permissionID: permissions.permissionID,
      permissionName: permissions.permissionName,
      permissionDescription: permissions.description,
      createdAt: permissions.createdAt,
      updatedAt: permissions.updatedAt,
    })
  return {
    permissionID: PermissionID(updatedPermission.permissionID),
    permissionName: PermissionTitle(updatedPermission.permissionName),
    permissionDescription: PermissionDescription(updatedPermission.permissionDescription),
    createdAt: updatedPermission.createdAt,
    updatedAt: updatedPermission.updatedAt,
  }
}

export async function deletePermission(id: PermissionID): Promise<Permission | undefined> {
  const [deletedPermission] = await db
    .delete(permissions)
    .where(eq(permissions.permissionID, id))
    .returning({
      permissionID: permissions.permissionID,
      permissionName: permissions.permissionName,
      permissionDesc: permissions.description,
      createdAt: permissions.createdAt,
      updatedAt: permissions.updatedAt,
    })
  return deletedPermission
    ? {
        permissionID: PermissionID(deletedPermission.permissionID),
        permissionName: PermissionTitle(deletedPermission.permissionName),
        permissionDescription: PermissionDescription(deletedPermission.permissionDesc),
        createdAt: deletedPermission.createdAt,
        updatedAt: deletedPermission.updatedAt,
      }
    : undefined
}
