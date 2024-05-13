import { desc, eq, or, sql } from 'drizzle-orm'
import { PatchServiceCategorySchemaType } from '../routes/category/categorySchema.js'
import { db } from '../config/db-connect.js'

import { productCategories, serviceCategories } from '../schema/schema.js'
import { ilike } from 'drizzle-orm'

import { RoleName } from './roleService.js'

import { Limit, Offset, Page, Search } from '../plugins/pagination.js'

import { Brand, make } from 'ts-brand'

export type ServiceCategoryID = Brand<number, 'serviceCategoryID'>
export const ServiceCategoryID = make<ServiceCategoryID>()
export type ServiceCategoryName = Brand<string, 'serviceCategoryName'>
export const ServiceCategoryName = make<ServiceCategoryName>()
export type ServiceCategoryDescription = Brand<string | null, 'ServiceCategoryDescription'>
export const ServiceCategoryDescription = make<ServiceCategoryDescription>()

export type ProductCategoryID = Brand<number, 'productCategoryID'>
export const ProductCategoryID = make<ProductCategoryID>()
export type ProductCategoryName = Brand<string, 'productCategoryName'>
export const ProductCategoryName = make<ProductCategoryName>()
export type ProductCategoryDescription = Brand<string | null, 'productCategoryDescription'>
export const ProductCategoryDescription = make<ProductCategoryDescription>()

export type CreateServiceCategory = {
  serviceCategoryID: ServiceCategoryID
  serviceCategoryName: ServiceCategoryName
  ServiceCategoryDescription: ServiceCategoryDescription
}

export type ServiceCategory = CreateServiceCategory & {
  createdAt: Date
  updatedAt: Date
}

export type ProductCategory = CreateProductCategory & {
  createdAt: Date
  updatedAt: Date
}

export type CreateProductCategory = {
  productCategoryID: ProductCategoryID
  productCategoryName: ProductCategoryName
  productCategoryDescription: ProductCategoryDescription
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

export type UpdatedProductCategory = {
  productCategoryID: ProductCategoryID
  productCategoryDescription: ProductCategoryDescription
  productCategoryName: ProductCategoryName
  createdAt: Date
  updatedAt: Date
}

export type ServicesPaginated = {
  totalItems: number
  totalPage: number
  perPage: number
  data: ServiceCategory[]
}

export type ProductsCategoryPaginated = {
  totalItems: number
  totalPage: number
  perPage: number
  data: ProductCategory[]
}

//Get Product Category List
export async function getProductCategoriesPaginate(
  search: Search,
  limit = Limit(10),
  page = Page(1),
  offset = Offset(0),
): Promise<ProductsCategoryPaginated | undefined> {
  const condition = or(
    ilike(productCategories.name, '%' + search + '%'),
    ilike(productCategories.description, '%' + search + '%'),
  )

  const [totalItems] = await db
    .select({
      count: sql`count(*)`.mapWith(Number).as('count'),
    })
    .from(productCategories)
    .where(condition)

  const productCategorysList = await db
    .select({
      id: productCategories.productCategoryID,
      name: productCategories.name,
      description: productCategories.description,
      createdAt: productCategories.createdAt,
      updatedAt: productCategories.updatedAt,
    })
    .from(productCategories)
    .where(condition)
    .orderBy(desc(productCategories.productCategoryID))
    .limit(limit || 10)
    .offset(offset || 0)

  const productCategoryListBranded: ProductCategory[] = productCategorysList.map(
    (productCategory) => {
      return {
        productCategoryID: ProductCategoryID(productCategory.id),
        productCategoryName: ProductCategoryName(productCategory.name),
        productCategoryDescription: ProductCategoryDescription(productCategory.description),
        createdAt: productCategory.createdAt,
        updatedAt: productCategory.updatedAt,
      }
    },
  )

  const totalPage = Math.ceil(totalItems.count / limit)

  return {
    totalItems: totalItems.count,
    totalPage,
    perPage: page,
    data: productCategoryListBranded,
  }
}

//Get Service Category List
export async function getServiceCategoriesPaginate(
  search: Search,
  limit = Limit(10),
  page = Page(1),
  offset = Offset(0),
): Promise<ServicesPaginated | undefined> {
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

  const serviceCategorysListBranded: ServiceCategory[] = serviceCategorysList.map(
    (serviceCategory) => {
      return {
        serviceCategoryID: ServiceCategoryID(serviceCategory.id),
        serviceCategoryName: ServiceCategoryName(serviceCategory.name),
        ServiceCategoryDescription: ServiceCategoryDescription(serviceCategory.description),
        createdAt: serviceCategory.createdAt,
        updatedAt: serviceCategory.updatedAt,
      }
    },
  )

  const totalPage = Math.ceil(totalItems.count / limit)

  return {
    totalItems: totalItems.count,
    totalPage,
    perPage: page,
    data: serviceCategorysListBranded,
  }
}

//Create Service Category
export async function createServiceCategory(
  name: ServiceCategoryName,
  description: ServiceCategoryDescription,
): Promise<CreateServiceCategory> {
  const [createdServiceCategory] = await db
    .insert(serviceCategories)
    .values({ name: name, description: description })
    .returning({
      id: serviceCategories.serviceCategoryID,
      serviceCategoryName: serviceCategories.name,
      description: serviceCategories.description,
    })
  return {
    serviceCategoryID: ServiceCategoryID(createdServiceCategory.id),
    serviceCategoryName: ServiceCategoryName(createdServiceCategory.serviceCategoryName),
    ServiceCategoryDescription: ServiceCategoryDescription(createdServiceCategory.description),
  }
}

//Create Product Category
export async function createProductCategory(
  name: ProductCategoryName,
  description: ProductCategoryDescription,
): Promise<CreateProductCategory> {
  const [createdProductCategory] = await db
    .insert(productCategories)
    .values({ name: name, description: description })
    .returning({
      id: productCategories.productCategoryID,
      productCategoryName: productCategories.name,
      description: productCategories.description,
    })
  return {
    productCategoryID: ProductCategoryID(createdProductCategory.id),
    productCategoryName: ProductCategoryName(createdProductCategory.productCategoryName),
    productCategoryDescription: ProductCategoryDescription(createdProductCategory.description),
  }
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

export async function getProductCategoryByID(id: number): Promise<ProductCategory | undefined> {
  const [results] = await db
    .select({
      productCategoryID: productCategories.productCategoryID,
      productCategoryName: productCategories.name,
      productCategoryDescription: productCategories.description,
      createdAt: productCategories.createdAt,
      updatedAt: productCategories.updatedAt,
    })
    .from(productCategories)
    .where(eq(productCategories.productCategoryID, id))

  return results
    ? {
        productCategoryID: ProductCategoryID(results.productCategoryID),
        productCategoryName: ProductCategoryName(results.productCategoryName),
        productCategoryDescription: ProductCategoryDescription(results.productCategoryDescription),
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

export async function updateProductCategoryByID(
  id: ProductCategoryID,
  productCategory: PatchServiceCategorySchemaType,
): Promise<UpdatedProductCategory | undefined> {
  const productCategoryWithUpdatedAt = { ...productCategory, updatedAt: new Date() }
  const [updatedProductCategory] = await db
    .update(productCategories)
    .set(productCategoryWithUpdatedAt)
    .where(eq(productCategories.productCategoryID, id))
    .returning({
      productCategoryID: productCategories.productCategoryID,
      productCategoryName: productCategories.name,
      productCategoryDescription: productCategories.description,
      createdAt: productCategories.createdAt,
      updatedAt: productCategories.updatedAt,
    })
  return {
    productCategoryID: ProductCategoryID(updatedProductCategory.productCategoryID),
    productCategoryDescription: ProductCategoryDescription(
      updatedProductCategory.productCategoryDescription,
    ),
    productCategoryName: ProductCategoryName(updatedProductCategory.productCategoryName),
    createdAt: updatedProductCategory.createdAt,
    updatedAt: updatedProductCategory.updatedAt,
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
      serviceCategoryDescription: serviceCategories.description,
      createdAt: serviceCategories.createdAt,
      updatedAt: serviceCategories.updatedAt,
    })
  return deletedServiceCategory
    ? {
        serviceCategoryID: ServiceCategoryID(deletedServiceCategory.serviceCategoryID),
        serviceCategoryName: ServiceCategoryName(deletedServiceCategory.serviceCategoryName),
        ServiceCategoryDescription: ServiceCategoryDescription(
          deletedServiceCategory.serviceCategoryDescription,
        ),
        createdAt: deletedServiceCategory.createdAt,
        updatedAt: deletedServiceCategory.updatedAt,
      }
    : undefined
}

export async function deleteProductCategory(
  id: ProductCategoryID,
): Promise<ProductCategory | undefined> {
  const [deletedProductCategory] = await db
    .delete(productCategories)
    .where(eq(productCategories.productCategoryID, id))
    .returning({
      productCategoryID: productCategories.productCategoryID,
      productCategoryName: productCategories.name,
      productCategoryDescription: productCategories.description,
      createdAt: productCategories.createdAt,
      updatedAt: productCategories.updatedAt,
    })
  return deletedProductCategory
    ? {
        productCategoryID: ProductCategoryID(deletedProductCategory.productCategoryID),
        productCategoryName: ProductCategoryName(deletedProductCategory.productCategoryName),
        productCategoryDescription: ProductCategoryDescription(
          deletedProductCategory.productCategoryDescription,
        ),
        createdAt: deletedProductCategory.createdAt,
        updatedAt: deletedProductCategory.updatedAt,
      }
    : undefined
}
