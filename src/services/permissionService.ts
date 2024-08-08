import { desc, eq, or, sql } from 'drizzle-orm'

import { db } from '../config/db-connect.js'

import {
  PermissionDescription,
  PermissionID,
  PermissionTitle,
  permissions,
} from '../schema/schema.js'

import { ilike } from 'drizzle-orm'

import { Limit, Offset, Page, Search } from '../plugins/pagination.js'

import { Either, errorHandling, left, right } from '../utils/helper.js'

export type PermissionIDDescName = {
  permissionID: PermissionID
  permissionTitle: PermissionTitle
  permissionDescription?: PermissionDescription
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
): Promise<Either<string, PermissionsPaginate>> {
  try {
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
      .select()
      .from(permissions)
      .where(condition)
      .orderBy(desc(permissions.permissionID))
      .limit(limit || 10)
      .offset(offset || 0)

    const totalPage = Math.ceil(totalItems.count / limit)

    return right({
      totalItems: totalItems.count,
      totalPage,
      perPage: page,
      data: permissionsList.map((perm) => ({
        permissionID: perm.permissionID,
        permissionTitle: perm.permissionTitle,
        permissionDescription: perm.description ?? undefined,
        createdAt: perm.createdAt,
        updatedAt: perm.updatedAt,
      })),
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function createPermission(
  permissionTitle: PermissionTitle,
  description: PermissionDescription,
): Promise<Either<string, PermissionIDDescName>> {
  try {
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

    const brandedPerm = {
      permissionID: createdPermission.permissionID,
      permissionTitle: createdPermission.permissionTitle,
      permissionDescription: createdPermission.permissionDescription ?? undefined,
    }
    return createdPermission ? right(brandedPerm) : left("couldn't create permission")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getPermissionByID(id: PermissionID): Promise<Either<string, Permission>> {
  try {
    const [permission] = await db
      .select({
        permissionID: permissions.permissionID,
        permissionTitle: permissions.permissionTitle,
        permissionDescription: permissions.description,
        createdAt: permissions.createdAt,
        updatedAt: permissions.updatedAt,
      })
      .from(permissions)
      .where(eq(permissions.permissionID, id))
    const brandedPerm = {
      permissionID: permission.permissionID,
      permissionTitle: permission.permissionTitle,
      permissionDescription: permission.permissionDescription ?? undefined,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    }
    return permission ? right(brandedPerm) : left("couldn't find permission")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function updatePermissionByID(
  permission: PermissionIDDescName,
): Promise<Either<string, Permission>> {
  try {
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
    const brandedPerm = {
      permissionID: updatedPermission.permissionID,
      permissionTitle: updatedPermission.permissionTitle,
      permissionDescription: updatedPermission.permissionDescription ?? undefined,
      createdAt: updatedPermission.createdAt,
      updatedAt: updatedPermission.updatedAt,
    }
    return updatedPermission ? right(brandedPerm) : left("couldn't find permission")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deletePermission(id: PermissionID): Promise<Either<string, Permission>> {
  try {
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
    const brandedPerm = {
      permissionID: deletedPermission.permissionID,
      permissionTitle: deletedPermission.permissionTitle,
      permissionDescription: deletedPermission.permissionDescription ?? undefined,
      createdAt: deletedPermission.createdAt,
      updatedAt: deletedPermission.updatedAt,
    }
    return deletedPermission ? right(brandedPerm) : left("couldn't find permission")
  } catch (e) {
    return left(errorHandling(e))
  }
}
