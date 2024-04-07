import { desc, eq, or, sql } from 'drizzle-orm'
import { PatchServiceCategorySchemaType } from '../routes/service-category/serviceCategorySchema.js'
import { db } from '../config/db-connect.js'
import { serviceCategories } from '../schema/schema.js'
import { ilike } from 'drizzle-orm'
import { RoleName } from './roleService.js'
import { Offset } from '../plugins/pagination.js'

export type ServiceCategoryID = { serviceCategoryID: number }
type ServiceCategoryName = { serviceCategoryName: string }
type serviceCategoryDescription = { serviceCategoryDescription: string | null }
type ServiceCategory = {
  createdAt: Date
  updatedAt: Date
} & ServiceCategoryID &
  ServiceCategoryName &
  serviceCategoryDescription

export type UpdatedServiceCategoryByID = {
  description?: ServiceCategoryID
  name?: ServiceCategoryName
}
export type UpdatedServiceCategory = {
  serviceCategoryID: ServiceCategoryID
  serviceCategoryDescription: serviceCategoryDescription
  roleName: RoleName
  createdAt: Date
  updatedAt: Date
}

export type ServicesPaginated = {
  totalItems: number
  totalPage: number
  perPage: number
  data: ServiceCategory[]
}

export async function getServiceCategoriesPaginate(
  search: string,
  limit = 10,
  page = 1,
  offset: Offset = { offset: 0 },
): Promise<any> {
  //ServicesPaginated | undefined {
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
    .offset(offset.offset || 0)

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
      ServiceCategoryName: serviceCategories.name,
      description: serviceCategories.description,
    })
}

export async function getServiceCategoryByID(id: number): Promise<ServiceCategory | undefined> {
  const results: ServiceCategory[] = await db
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

export async function updateServiceCategoryByID(
  id: ServiceCategoryID,
  serviceCategory: PatchServiceCategorySchemaType,
): Promise<UpdatedServiceCategory | undefined> {
  const serviceCategoryWithUpdatedAt = { ...serviceCategory, updatedAt: new Date() }
  const updatedServiceCategory: UpdatedServiceCategory[] = await db
    .update(serviceCategories)
    .set(serviceCategoryWithUpdatedAt)
    .where(eq(serviceCategories.serviceCategoryID, id.serviceCategoryID))
    .returning({
      serviceCategoryID: { serviceCategoryID: serviceCategories.serviceCategoryID },
      roleName: { roleName: serviceCategories.name },
      serviceCategoryDescription: { serviceCategoryDescription: serviceCategories.description },
      createdAt: serviceCategories.createdAt,
      updatedAt: serviceCategories.updatedAt,
    })
  return updatedServiceCategory[0]
}

export async function deleteServiceCategory(
  id: ServiceCategoryID,
): Promise<ServiceCategory | undefined> {
  const deletedServiceCategory: ServiceCategory[] = await db
    .delete(serviceCategories)
    .where(eq(serviceCategories.serviceCategoryID, id.serviceCategoryID))
    .returning({
      serviceCategoryID: serviceCategories.serviceCategoryID,
      serviceCategoryName: serviceCategories.name,
      serviceCategoryDescription: serviceCategories.description,
      createdAt: serviceCategories.createdAt,
      updatedAt: serviceCategories.updatedAt,
    })
  return deletedServiceCategory[0] ? deletedServiceCategory[0] : undefined
}
