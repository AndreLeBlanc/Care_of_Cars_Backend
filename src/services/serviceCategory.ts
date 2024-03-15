import { desc, eq, or, sql } from 'drizzle-orm'

import { db } from '../config/db-connect'
import { serviceCategories } from '../schema/schema'
import { ilike } from 'drizzle-orm'

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
      id: serviceCategories.id,
      name: serviceCategories.name,
      description: serviceCategories.description,
      createdAt: serviceCategories.createdAt,
      updatedAt: serviceCategories.updatedAt,
    })
    .from(serviceCategories)
    .where(condition)
    .orderBy(desc(serviceCategories.id))
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
      id: serviceCategories.id,
      serviceCategoryName: serviceCategories.name,
      description: serviceCategories.description,
    })
}

export async function getServiceCategoryById(id: number): Promise<any> {
  const results = await db.select().from(serviceCategories).where(eq(serviceCategories.id, id))
  return results[0] ? results[0] : null
}

export async function updateServiceCategoryById(id: number, serviceCategory: any): Promise<any> {
  const serviceCategoryWithUpdatedAt = { ...serviceCategory, updatedAt: new Date() }
  const updatedServiceCategory = await db
    .update(serviceCategories)
    .set(serviceCategoryWithUpdatedAt)
    .where(eq(serviceCategories.id, id))
    .returning({
      id: serviceCategories.id,
      roleName: serviceCategories.name,
      description: serviceCategories.description,
      createdAt: serviceCategories.createdAt,
      updatedAt: serviceCategories.updatedAt,
    })
  return updatedServiceCategory
}

export async function deleteServiceCategory(id: number): Promise<any> {
  const deletedServiceCategory = await db
    .delete(serviceCategories)
    .where(eq(serviceCategories.id, id))
    .returning()
  return deletedServiceCategory[0] ? deletedServiceCategory[0] : null
}
