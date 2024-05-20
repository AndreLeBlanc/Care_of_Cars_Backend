import { Brand, make } from 'ts-brand'
import { DbDateType, products } from '../schema/schema.js'
import { db } from '../config/db-connect.js'

import { desc, eq, ilike, or, sql } from 'drizzle-orm'
import { Offset } from '../plugins/pagination.js'
import { ServiceCategoryID } from './CategoryService.js'

export type ProductItemNumber = Brand<string, 'productItemNumber'>
export const ProductItemNumber = make<ProductItemNumber>()
export type ProductDescription = Brand<string | null, 'productDescription'>
export const ProductDescription = make<ProductDescription>()
export type ProductSupplierArticleNumber = Brand<string | null, 'productSupplierArticleNumber'>
export const ProductSupplierArticleNumber = make<ProductSupplierArticleNumber>()
export type ProductExternalArticleNumber = Brand<string | null, 'productExternalArticleNumber'>
export const ProductExternalArticleNumber = make<ProductExternalArticleNumber>()
export type ProductUpdateRelatedData = Brand<boolean | null, 'productUpdateRelatedData'>
export const ProductUpdateRelatedData = make<ProductUpdateRelatedData>()
export type ProductInventoryBalance = Brand<number, 'productInventoryBalance'>
export const ProductInventoryBalance = make<ProductInventoryBalance>()
export type ProductAward = Brand<number, 'productAward'>
export const ProductAward = make<ProductAward>()
export type ProductCost = Brand<number, 'productCost'>
export const ProductCost = make<ProductCost>()

export type ProductAddType = {
  productItemNumber: ProductItemNumber
  productCategoryID: ServiceCategoryID
  productDescription?: ProductDescription
  productSupplierArticleNumber?: ProductSupplierArticleNumber
  productExternalArticleNumber?: ProductExternalArticleNumber
  productUpdateRelatedData?: ProductUpdateRelatedData
  productInventoryBalance: ProductInventoryBalance
  productAward: ProductAward
  productCost: ProductCost
  productId?: number
}

export type Product = ProductAddType & DbDateType

export type ProductEdit = ProductAddType

export type ProductsPaginate = {
  totalItems: number
  totalPage: number
  perPage: number
  data: Product[]
}

//Add product
export async function addProduct(data: ProductAddType): Promise<Product | undefined> {
  const [newProduct] = await db
    .insert(products)
    .values({
      productCategoryID: data.productCategoryID,
      productItemNumber: data.productItemNumber,
      productAward: data.productAward,
      productCost: data.productCost,
      productDescription: data.productDescription,
      productExternalArticleNumber: data.productExternalArticleNumber,
      productInventoryBalance: data.productInventoryBalance,
      productSupplierArticleNumber: data.productSupplierArticleNumber,
      productUpdateRelatedData: data.productUpdateRelatedData,
    })
    .returning({
      productCategoryID: products.productCategoryID,
      productItemNumber: products.productItemNumber,
      productAward: products.productAward,
      productCost: products.productCost,
      productDescription: products.productDescription,
      productExternalArticleNumber: products.productExternalArticleNumber,
      productInventoryBalance: products.productInventoryBalance,
      productSupplierArticleNumber: products.productSupplierArticleNumber,
      productUpdateRelatedData: products.productUpdateRelatedData,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
  return newProduct
    ? {
        productCategoryID: ServiceCategoryID(newProduct.productCategoryID),
        productItemNumber: ProductItemNumber(newProduct.productItemNumber),
        productAward: ProductAward(newProduct.productAward),
        productCost: ProductCost(newProduct.productCost),
        productDescription: ProductDescription(newProduct.productDescription),
        productExternalArticleNumber: ProductExternalArticleNumber(
          newProduct.productExternalArticleNumber,
        ),
        productInventoryBalance: ProductInventoryBalance(newProduct.productInventoryBalance),
        productSupplierArticleNumber: ProductSupplierArticleNumber(
          newProduct.productSupplierArticleNumber,
        ),
        productUpdateRelatedData: ProductUpdateRelatedData(newProduct.productUpdateRelatedData),
        createdAt: newProduct.createdAt,
        updatedAt: newProduct.updatedAt,
      }
    : undefined
}

//edit product
export async function editProduct(data: ProductAddType): Promise<ProductEdit | undefined> {
  const [editProduct] = await db
    .update(products)
    .set({
      productCategoryID: data.productCategoryID,
      productAward: data.productAward,
      productCost: data.productCost,
      productDescription: data.productDescription,
      productExternalArticleNumber: data.productExternalArticleNumber,
      productInventoryBalance: data.productInventoryBalance,
      productSupplierArticleNumber: data.productSupplierArticleNumber,
      productUpdateRelatedData: data.productUpdateRelatedData,
    })
    .where(eq(products.productItemNumber, data.productItemNumber))
    .returning({
      productCategoryID: products.productCategoryID,
      productItemNumber: products.productItemNumber,
      productAward: products.productAward,
      productCost: products.productCost,
      productDescription: products.productDescription,
      productExternalArticleNumber: products.productExternalArticleNumber,
      productInventoryBalance: products.productInventoryBalance,
      productSupplierArticleNumber: products.productSupplierArticleNumber,
      productUpdateRelatedData: products.productUpdateRelatedData,
    })

  return editProduct
    ? {
        productCategoryID: ServiceCategoryID(editProduct.productCategoryID),
        productItemNumber: ProductItemNumber(editProduct.productItemNumber),
        productAward: ProductAward(editProduct.productAward),
        productCost: ProductCost(editProduct.productCost),
        productDescription: ProductDescription(editProduct.productDescription),
        productExternalArticleNumber: ProductExternalArticleNumber(
          editProduct.productExternalArticleNumber,
        ),
        productInventoryBalance: ProductInventoryBalance(editProduct.productInventoryBalance),
        productSupplierArticleNumber: ProductSupplierArticleNumber(
          editProduct.productSupplierArticleNumber,
        ),
        productUpdateRelatedData: ProductUpdateRelatedData(editProduct.productUpdateRelatedData),
      }
    : undefined
}

//Delete Product
export async function deleteProductByItemNumber(
  productItemNumber: ProductItemNumber,
): Promise<ProductItemNumber | undefined> {
  const [deletedProduct] = await db
    .delete(products)
    .where(eq(products.productItemNumber, productItemNumber))
    .returning({ productItemNumber: products.productItemNumber })
  return deletedProduct ? ProductItemNumber(deletedProduct.productItemNumber) : undefined
}

//Get product by Id,
export async function getProductById(productItemNumber: ProductItemNumber) {
  const [productData] = await db
    .select({
      productCategoryID: products.productCategoryID,
      productItemNumber: products.productItemNumber,
      productAward: products.productAward,
      productCost: products.productCost,
      productDescription: products.productDescription,
      productExternalArticleNumber: products.productExternalArticleNumber,
      productInventoryBalance: products.productInventoryBalance,
      productSupplierArticleNumber: products.productSupplierArticleNumber,
      productUpdateRelatedData: products.productUpdateRelatedData,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .where(eq(products.productItemNumber, productItemNumber))
  return productData
    ? {
        productCategoryID: ServiceCategoryID(productData.productCategoryID),
        productItemNumber: ProductItemNumber(productData.productItemNumber),
        productAward: ProductAward(productData.productAward),
        productCost: ProductCost(productData.productCost),
        productDescription: ProductDescription(productData.productDescription),
        productExternalArticleNumber: ProductExternalArticleNumber(
          productData.productExternalArticleNumber,
        ),
        productInventoryBalance: ProductInventoryBalance(productData.productInventoryBalance),
        productSupplierArticleNumber: ProductSupplierArticleNumber(
          productData.productSupplierArticleNumber,
        ),
        productUpdateRelatedData: ProductUpdateRelatedData(productData.productUpdateRelatedData),
        createdAt: productData.createdAt,
        updatedAt: productData.updatedAt,
      }
    : undefined
}

//getProduct list
export async function getProductsPaginated(
  search: string,
  limit = 10,
  page = 1,
  offset = Offset(0),
): Promise<ProductsPaginate> {
  const returnData = await db.transaction(async (tx) => {
    const condition = or(
      ilike(products.productItemNumber, '%' + search + '%'),
      ilike(products.productCategoryID, '%' + search + '%'),
      ilike(products.productExternalArticleNumber, '%' + search + '%'),
      ilike(products.productDescription, '%' + search + '%'),
      ilike(products.productSupplierArticleNumber, '%' + search + '%'),
    )

    const [totalItems] = await tx
      .select({
        count: sql`count(*)`.mapWith(Number).as('count'),
      })
      .from(products)
      .where(condition)

    const productList = await tx
      .select({
        productId: products.productId,
        serviceCategoryID: products.productCategoryID,
        productItemNumber: products.productItemNumber,
        productAward: products.productAward,
        productCost: products.productCost,
        productDescription: products.productDescription,
        productExternalArticleNumber: products.productExternalArticleNumber,
        productInventoryBalance: products.productInventoryBalance,
        productSupplierArticleNumber: products.productSupplierArticleNumber,
        productUpdateRelatedData: products.productUpdateRelatedData,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .where(condition)
      .orderBy(desc(products.createdAt))
      .limit(limit || 10)
      .offset(offset || 0)

    return { totalItems, productList }
  })

  const ProductsBrandedList = returnData.productList.map((item) => {
    return {
      productId: item.productId,
      productCategoryID: ServiceCategoryID(item.serviceCategoryID),
      productItemNumber: ProductItemNumber(item.productItemNumber),
      productAward: ProductAward(item.productAward),
      productCost: ProductCost(item.productCost),
      productDescription: ProductDescription(item.productDescription),
      productExternalArticleNumber: ProductExternalArticleNumber(item.productExternalArticleNumber),
      productInventoryBalance: ProductInventoryBalance(item.productInventoryBalance),
      productSupplierArticleNumber: ProductSupplierArticleNumber(item.productSupplierArticleNumber),
      productUpdateRelatedData: ProductUpdateRelatedData(item.productUpdateRelatedData),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }
  })

  const totalPage = Math.ceil(returnData.totalItems.count / limit)

  return {
    totalItems: returnData.totalItems.count,
    totalPage,
    perPage: page,
    data: ProductsBrandedList,
  }
}
