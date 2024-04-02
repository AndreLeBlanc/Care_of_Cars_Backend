import { desc, eq, or, sql } from 'drizzle-orm'

import { db } from '../config/db-connect.js'
import { serviceCategories } from '../schema/schema.js'
import { ilike } from 'drizzle-orm'

type serviceCategoryID = { serviceCategoryID: number }
type serviceCategoryName = { serviceCategoryName: string }
type serviceCategoryDescription = { serviceCategoryDescription: string | null }
type serviceCategory = {
  createdAt: Date
  updatedAt: Date
} & serviceCategoryID &
  serviceCategoryName &
  serviceCategoryDescription

export type UpdatedServiceCategoryByID = {
  description?: serviceCategoryID
  name?: serviceCategoryName
}

export type UpdatedServiceCategory = {
  serviceCategoryID: serviceCategoryID | null
  serviceCategoryDescription: serviceCategoryDescription | null
  createdAt: Date
  updatedAt: Date
}

export async function getServiceCategoriesPaginate(
  search: string,
  limit = 10,
  page = 1,
  offset = 0,
) {
  const condition = or(
    ilike(serviceCategories.name, '%' + search + '%'),
    ilike(serviceCategories.description, '%' + search + '%'),
  )

  const [totalItems] = await db
    .select({
      count: sql`count(*)`.mapWith(Number).as('count'),
    })
    .from(serviceCategories)
    .where(condition)

  const serviceCategorysList = await db
    .select({
      id: serviceCategories.serviceCategoryID,
      name: serviceCategories.name,
      description: serviceCategories.description,
      createdAt: serviceCategories.createdAt,
      updatedAt: serviceCategories.updatedAt,
    })
    .from(serviceCategories)
    .where(condition)
    .orderBy(desc(serviceCategories.serviceCategoryID))
    .limit(limit || 10)
    .offset(offset || 0)
  const totalPage = Math.ceil(totalItems.count / limit)

  return {
    totalItems: totalItems.count,
    totalPage,
    perPage: page,
    data: serviceCategorysList,
  }
}

export async function createServiceCategory(name: string, description: string) {
  return await db
    .insert(serviceCategories)
    .values({ name: name, description: description })
    .returning({
      id: serviceCategories.serviceCategoryID,
      serviceCategoryName: serviceCategories.name,
      description: serviceCategories.description,
    })
}

export async function getServiceCategoryById(id: number): Promise<serviceCategory | undefined> {
  const results: serviceCategory[] = await db
    .select({
      serviceCategoryID: serviceCategories.serviceCategoryID,
      serviceCategoryName: serviceCategories.name,
      serviceCategoryDescription: serviceCategories.description,
      createdAt: serviceCategories.createdAt,
      updatedAt: serviceCategories.updatedAt,
    })
    .from(serviceCategories)
    .where(eq(serviceCategories.serviceCategoryID, id))
  return results[0] ? results[0] : undefined
}

export async function updateServiceCategoryById(
  id: number,
  serviceCategory: UpdatedServiceCategoryById,
): Promise<UpdatedServiceCategory | undefined> {
  const serviceCategoryWithUpdatedAt = { ...serviceCategory, updatedAt: new Date() }
  const updatedServiceCategory: UpdatedServiceCategory[] = await db
    .update(serviceCategories)
    .set(serviceCategoryWithUpdatedAt)
    .where(eq(serviceCategories.serviceCategoryID, id))
    .returning({
      serviceCategoryID: { serviceCategoryID: serviceCategories.serviceCategoryID },
      roleName: serviceCategories.name,
      serviceCategoryDescription: { serviceCategoryDescription: serviceCategories.description },
      createdAt: serviceCategories.createdAt,
      updatedAt: serviceCategories.updatedAt,
    })
  return updatedServiceCategory[0]
}

export async function deleteServiceCategory(id: number): Promise<serviceCategory | undefined> {
  const deletedServiceCategory: serviceCategory[] = await db
    .delete(serviceCategories)
    .where(eq(serviceCategories.serviceCategoryID, id))
    .returning({
      serviceCategoryID: serviceCategories.serviceCategoryID,
      serviceCategoryName: serviceCategories.name,
      serviceCategoryDescription: serviceCategories.description,
      createdAt: serviceCategories.createdAt,
      updatedAt: serviceCategories.updatedAt,
    })
  return deletedServiceCategory[0] ? deletedServiceCategory[0] : undefined
}
