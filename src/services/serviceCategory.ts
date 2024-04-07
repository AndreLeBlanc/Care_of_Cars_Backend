import { desc, eq, or, sql } from 'drizzle-orm'
import { PatchServiceCategorySchemaType } from '../routes/service-category/serviceCategorySchema.js'
import { db } from '../config/db-connect.js'
import { serviceCategories } from '../schema/schema.js'
import { ilike } from 'drizzle-orm'
import { RoleName } from './roleService.js'
import { Offset } from '../plugins/pagination.js'
import { Brand, make } from 'ts-brand'

export type ServiceCategoryID = Brand<number, 'serviceCategoryID'>
export const ServiceCategoryID = make<ServiceCategoryID>()
export type ServiceCategoryName = Brand<string, 'serviceCategoryName'>
export const ServiceCategoryName = make<ServiceCategoryName>()
export type ServiceCategoryDescription = Brand<string | null, 'ServiceCategoryDescription'>
export const ServiceCategoryDescription = make<ServiceCategoryDescription>()

export type ServiceCategory = {
  createdAt: Date
  updatedAt: Date
  serviceCategoryID: ServiceCategoryID
  serviceCategoryName: ServiceCategoryName
  ServiceCategoryDescription: ServiceCategoryDescription
}

export type UpdatedServiceCategoryByID = {
  description?: ServiceCategoryID
  name?: ServiceCategoryName
}
export type UpdatedServiceCategory = {
  serviceCategoryID: ServiceCategoryID
  ServiceCategoryDescription: ServiceCategoryDescription
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
  const [results] = await db
    .select({
      serviceCategoryID: serviceCategories.serviceCategoryID,
      serviceCategoryName: serviceCategories.name,
      ServiceCategoryDescription: serviceCategories.description,
      createdAt: serviceCategories.createdAt,
      updatedAt: serviceCategories.updatedAt,
    })
    .from(serviceCategories)
    .where(eq(serviceCategories.serviceCategoryID, id))

  return results
    ? {
        serviceCategoryID: ServiceCategoryID(results.serviceCategoryID),
        serviceCategoryName: ServiceCategoryName(results.serviceCategoryName),
        ServiceCategoryDescription: ServiceCategoryDescription(results.ServiceCategoryDescription),
        createdAt: results.createdAt,
        updatedAt: results.updatedAt,
      }
    : undefined
}

export async function updateServiceCategoryByID(
  id: ServiceCategoryID,
  serviceCategory: PatchServiceCategorySchemaType,
): Promise<UpdatedServiceCategory | undefined> {
  const serviceCategoryWithUpdatedAt = { ...serviceCategory, updatedAt: new Date() }
  const [updatedServiceCategory] = await db
    .update(serviceCategories)
    .set(serviceCategoryWithUpdatedAt)
    .where(eq(serviceCategories.serviceCategoryID, id))
    .returning({
      serviceCategoryID: serviceCategories.serviceCategoryID,
      roleName: serviceCategories.name,
      ServiceCategoryDescription: serviceCategories.description,
      createdAt: serviceCategories.createdAt,
      updatedAt: serviceCategories.updatedAt,
    })
  return {
    serviceCategoryID: ServiceCategoryID(updatedServiceCategory.serviceCategoryID),
    roleName: RoleName(updatedServiceCategory.roleName),
    ServiceCategoryDescription: ServiceCategoryDescription(
      updatedServiceCategory.ServiceCategoryDescription,
    ),
    createdAt: updatedServiceCategory.createdAt,
    updatedAt: updatedServiceCategory.updatedAt,
  }
}

export async function deleteServiceCategory(
  id: ServiceCategoryID,
): Promise<ServiceCategory | undefined> {
  const [deletedServiceCategory] = await db
    .delete(serviceCategories)
    .where(eq(serviceCategories.serviceCategoryID, id))
    .returning({
      serviceCategoryID: serviceCategories.serviceCategoryID,
      serviceCategoryName: serviceCategories.name,
      ServiceCategoryDescription: serviceCategories.description,
      createdAt: serviceCategories.createdAt,
      updatedAt: serviceCategories.updatedAt,
    })
  return deletedServiceCategory
    ? {
        serviceCategoryID: ServiceCategoryID(deletedServiceCategory.serviceCategoryID),
        serviceCategoryName: ServiceCategoryName(deletedServiceCategory.serviceCategoryName),
        ServiceCategoryDescription: ServiceCategoryDescription(
          deletedServiceCategory.ServiceCategoryDescription,
        ),
        createdAt: deletedServiceCategory.createdAt,
        updatedAt: deletedServiceCategory.updatedAt,
      }
    : undefined
}
