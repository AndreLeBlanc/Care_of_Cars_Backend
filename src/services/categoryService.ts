import { desc, eq, or, sql } from 'drizzle-orm'
import { db } from '../config/db-connect.js'

import {
  ProductCategoryDescription,
  ProductCategoryID,
  ProductCategoryName,
  ServiceCategoryDescription,
  ServiceCategoryID,
  ServiceCategoryName,
  productCategories,
  serviceCategories,
} from '../schema/schema.js'
import { ilike } from 'drizzle-orm'

import { Limit, Offset, Page, Search } from '../plugins/pagination.js'

import { Either, errorHandling, left, right } from '../utils/helper.js'

export type CreateServiceCategory = {
  serviceCategoryID: ServiceCategoryID
  serviceCategoryName: ServiceCategoryName
  serviceCategoryDescription?: ServiceCategoryDescription
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
  productCategoryDescription?: ProductCategoryDescription
}

export type UpdatedServiceCategoryByID = {
  description?: ServiceCategoryID
  name?: ServiceCategoryName
}

export type UpdatedProductCategory = {
  productCategoryID: ProductCategoryID
  productCategoryDescription?: ProductCategoryDescription
  productCategoryName: ProductCategoryName
  createdAt: Date
  updatedAt: Date
}

export type ServicesPaginated = {
  totalItems: number
  totalPage: number
  perPage: number
  data: CreateServiceCategory[]
}

export type ProductsCategoryPaginated = {
  totalItems: number
  totalPage: number
  perPage: number
  data: CreateProductCategory[]
}

//Get Product Category List
export async function getProductCategoriesPaginate(
  search: Search,
  limit = Limit(10),
  page = Page(1),
  offset = Offset(0),
): Promise<Either<string, ProductsCategoryPaginated>> {
  try {
    const condition = or(
      ilike(productCategories.productCategoryName, '%' + search + '%'),
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
        name: productCategories.productCategoryName,
        description: productCategories.description,
      })
      .from(productCategories)
      .where(condition)
      .orderBy(desc(productCategories.productCategoryID))
      .limit(limit || 10)
      .offset(offset || 0)

    const productCategoryListBranded: CreateProductCategory[] = productCategorysList.map(
      (productCategory) => {
        return {
          productCategoryID: productCategory.id,
          productCategoryName: productCategory.name,
          productCategoryDescription: productCategory.description ?? undefined,
        }
      },
    )

    const totalPage = Math.ceil(totalItems.count / limit)

    return right({
      totalItems: totalItems.count,
      totalPage,
      perPage: page,
      data: productCategoryListBranded,
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}

//Get Service Category List
export async function getServiceCategoriesPaginate(
  search: Search,
  limit = Limit(10),
  page = Page(1),
  offset = Offset(0),
): Promise<Either<string, ServicesPaginated>> {
  const condition = or(
    ilike(serviceCategories.serviceCategoryName, '%' + search + '%'),
    ilike(serviceCategories.serviceCategoryDescription, '%' + search + '%'),
  )

  try {
    const [totalItems] = await db
      .select({
        count: sql`count(*)`.mapWith(Number).as('count'),
      })
      .from(serviceCategories)
      .where(condition)

    const serviceCategorysList = await db
      .select({
        id: serviceCategories.serviceCategoryID,
        name: serviceCategories.serviceCategoryName,
        description: serviceCategories.serviceCategoryDescription,
      })
      .from(serviceCategories)
      .where(condition)
      .orderBy(desc(serviceCategories.serviceCategoryID))
      .limit(limit || 10)
      .offset(offset || 0)

    const serviceCategorysListBranded: CreateServiceCategory[] = serviceCategorysList.map(
      (serviceCategory) => {
        return {
          serviceCategoryID: serviceCategory.id,
          serviceCategoryName: serviceCategory.name,
          serviceCategoryDescription: serviceCategory.description ?? undefined,
        }
      },
    )

    const totalPage = Math.ceil(totalItems.count / limit)

    return right({
      totalItems: totalItems.count,
      totalPage,
      perPage: page,
      data: serviceCategorysListBranded,
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}

//Create Service Category
export async function createServiceCategory(
  name: ServiceCategoryName,
  description: ServiceCategoryDescription,
): Promise<Either<string, CreateServiceCategory>> {
  try {
    const [createdServiceCategory] = await db
      .insert(serviceCategories)
      .values({ serviceCategoryName: name, serviceCategoryDescription: description })
      .returning({
        id: serviceCategories.serviceCategoryID,
        serviceCategoryName: serviceCategories.serviceCategoryName,
        serviceCategoryDescription: serviceCategories.serviceCategoryDescription,
      })
    return right({
      serviceCategoryID: createdServiceCategory.id,
      serviceCategoryName: createdServiceCategory.serviceCategoryName,
      serviceCategoryDescription: createdServiceCategory.serviceCategoryDescription ?? undefined,
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}

//Create Product Category
export async function createProductCategory(
  productCategoryName: ProductCategoryName,
  description: ProductCategoryDescription,
): Promise<Either<string, CreateProductCategory>> {
  try {
    const [createdProductCategory] = await db
      .insert(productCategories)
      .values({ productCategoryName: productCategoryName, description: description })
      .returning({
        id: productCategories.productCategoryID,
        productCategoryName: productCategories.productCategoryName,
        description: productCategories.description,
      })
    return right({
      productCategoryID: createdProductCategory.id,
      productCategoryName: createdProductCategory.productCategoryName,
      productCategoryDescription: createdProductCategory.description ?? undefined,
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getServiceCategoryByID(
  id: ServiceCategoryID,
): Promise<Either<string, ServiceCategory>> {
  try {
    const [results] = await db
      .select({
        serviceCategoryID: serviceCategories.serviceCategoryID,
        serviceCategoryName: serviceCategories.serviceCategoryName,
        serviceCategoryDescription: serviceCategories.serviceCategoryDescription,
        createdAt: serviceCategories.createdAt,
        updatedAt: serviceCategories.updatedAt,
      })
      .from(serviceCategories)
      .where(eq(serviceCategories.serviceCategoryID, id))

    return results
      ? right({
          serviceCategoryID: results.serviceCategoryID,
          serviceCategoryName: results.serviceCategoryName,
          serviceCategoryDescription: results.serviceCategoryDescription ?? undefined,
          createdAt: results.createdAt,
          updatedAt: results.updatedAt,
        })
      : left('no services found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getProductCategoryByID(
  id: ProductCategoryID,
): Promise<Either<string, ProductCategory>> {
  try {
    const [results] = await db
      .select({
        productCategoryID: productCategories.productCategoryID,
        productCategoryName: productCategories.productCategoryName,
        productCategoryDescription: productCategories.description,
        createdAt: productCategories.createdAt,
        updatedAt: productCategories.updatedAt,
      })
      .from(productCategories)
      .where(eq(productCategories.productCategoryID, id))

    return results
      ? right({
          productCategoryID: results.productCategoryID,
          productCategoryName: results.productCategoryName,
          productCategoryDescription: results.productCategoryDescription ?? undefined,
          createdAt: results.createdAt,
          updatedAt: results.updatedAt,
        })
      : left('No product category found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function updateServiceCategoryByID(
  serviceCategory: CreateServiceCategory,
): Promise<Either<string, ServiceCategory>> {
  const serviceCategoryWithUpdatedAt = { ...serviceCategory, updatedAt: new Date() }
  try {
    const [updatedServiceCategory] = await db
      .update(serviceCategories)
      .set(serviceCategoryWithUpdatedAt)
      .where(eq(serviceCategories.serviceCategoryID, serviceCategory.serviceCategoryID))
      .returning({
        serviceCategoryID: serviceCategories.serviceCategoryID,
        serviceCategoryName: serviceCategories.serviceCategoryName,
        serviceCategoryDescription: serviceCategories.serviceCategoryDescription,
        createdAt: serviceCategories.createdAt,
        updatedAt: serviceCategories.updatedAt,
      })
    return right({
      serviceCategoryID: updatedServiceCategory.serviceCategoryID,
      serviceCategoryDescription: updatedServiceCategory.serviceCategoryDescription ?? undefined,
      serviceCategoryName: updatedServiceCategory.serviceCategoryName,
      createdAt: updatedServiceCategory.createdAt,
      updatedAt: updatedServiceCategory.updatedAt,
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function updateProductCategoryByID(
  productCategory: CreateProductCategory,
): Promise<Either<string, UpdatedProductCategory>> {
  const productCategoryWithUpdatedAt = { ...productCategory, updatedAt: new Date() }
  try {
    const [updatedProductCategory] = await db
      .update(productCategories)
      .set(productCategoryWithUpdatedAt)
      .where(eq(productCategories.productCategoryID, productCategory.productCategoryID))
      .returning()
    return updatedProductCategory
      ? right(updatedProductCategory)
      : left('no product category found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteServiceCategory(
  id: ServiceCategoryID,
): Promise<Either<string, ServiceCategory>> {
  try {
    const [deletedServiceCategory] = await db
      .delete(serviceCategories)
      .where(eq(serviceCategories.serviceCategoryID, id))
      .returning()
    return deletedServiceCategory
      ? right({
          serviceCategoryID: deletedServiceCategory.serviceCategoryID,
          serviceCategoryName: deletedServiceCategory.serviceCategoryName,
          serviceCategoryDescription:
            deletedServiceCategory.serviceCategoryDescription ?? undefined,
          createdAt: deletedServiceCategory.createdAt,
          updatedAt: deletedServiceCategory.updatedAt,
        })
      : left('no service category found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteProductCategory(
  id: ProductCategoryID,
): Promise<Either<string, ProductCategory>> {
  try {
    const [deletedProductCategory] = await db
      .delete(productCategories)
      .where(eq(productCategories.productCategoryID, id))
      .returning()
    return deletedProductCategory
      ? right({
          productCategoryID: deletedProductCategory.productCategoryID,
          productCategoryName: deletedProductCategory.productCategoryName,
          productCategoryDescription: deletedProductCategory.description ?? undefined,
          createdAt: deletedProductCategory.createdAt,
          updatedAt: deletedProductCategory.updatedAt,
        })
      : left('no product category found')
  } catch (e) {
    return left(errorHandling(e))
  }
}
