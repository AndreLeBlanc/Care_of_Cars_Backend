import {
  DbDateType,
  ProductAward,
  ProductCategoryID,
  ProductCost,
  ProductDescription,
  ProductExternalArticleNumber,
  ProductID,
  ProductInventoryBalance,
  ProductItemNumber,
  ProductSupplierArticleNumber,
  ProductUpdateRelatedData,
  products,
} from '../schema/schema'
import { db } from '../config/db-connect'

import { desc, eq, ilike, or, sql } from 'drizzle-orm'
import { Offset } from '../plugins/pagination'

export type ProductAddType = {
  productItemNumber: ProductItemNumber
  productCategoryID: ProductCategoryID
  productDescription?: ProductDescription
  productSupplierArticleNumber?: ProductSupplierArticleNumber
  productExternalArticleNumber?: ProductExternalArticleNumber
  productUpdateRelatedData?: ProductUpdateRelatedData
  productInventoryBalance?: ProductInventoryBalance
  productAward: ProductAward
  productCost: ProductCost
  productId?: ProductID
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
    .returning()
  return newProduct
    ? {
        productCategoryID: ProductCategoryID(newProduct.productCategoryID),
        productItemNumber: ProductItemNumber(newProduct.productItemNumber),
        productAward: ProductAward(newProduct.productAward),
        productCost: ProductCost(newProduct.productCost),
        productDescription: newProduct.productDescription
          ? ProductDescription(newProduct.productDescription)
          : undefined,
        productExternalArticleNumber: newProduct.productExternalArticleNumber
          ? ProductExternalArticleNumber(newProduct.productExternalArticleNumber)
          : undefined,
        productInventoryBalance: newProduct.productInventoryBalance
          ? ProductInventoryBalance(newProduct.productInventoryBalance)
          : undefined,
        productSupplierArticleNumber: newProduct.productSupplierArticleNumber
          ? ProductSupplierArticleNumber(newProduct.productSupplierArticleNumber)
          : undefined,
        productUpdateRelatedData: newProduct.productUpdateRelatedData
          ? ProductUpdateRelatedData(newProduct.productUpdateRelatedData)
          : undefined,
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
        productCategoryID: ProductCategoryID(editProduct.productCategoryID),
        productItemNumber: ProductItemNumber(editProduct.productItemNumber),
        productAward: ProductAward(editProduct.productAward),
        productCost: ProductCost(editProduct.productCost),
        productDescription: editProduct.productDescription
          ? ProductDescription(editProduct.productDescription)
          : undefined,
        productExternalArticleNumber: editProduct.productExternalArticleNumber
          ? ProductExternalArticleNumber(editProduct.productExternalArticleNumber)
          : undefined,
        productInventoryBalance: editProduct.productInventoryBalance
          ? ProductInventoryBalance(editProduct.productInventoryBalance)
          : undefined,
        productSupplierArticleNumber: editProduct.productSupplierArticleNumber
          ? ProductSupplierArticleNumber(editProduct.productSupplierArticleNumber)
          : undefined,
        productUpdateRelatedData: editProduct.productUpdateRelatedData
          ? ProductUpdateRelatedData(editProduct.productUpdateRelatedData)
          : undefined,
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
export async function getProductById(
  productItemNumber: ProductItemNumber,
): Promise<Product | undefined> {
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
        productCategoryID: ProductCategoryID(productData.productCategoryID),
        productItemNumber: ProductItemNumber(productData.productItemNumber),
        productAward: ProductAward(productData.productAward),
        productCost: ProductCost(productData.productCost),
        productDescription: productData.productDescription
          ? ProductDescription(productData.productDescription)
          : undefined,
        productExternalArticleNumber: productData.productExternalArticleNumber
          ? ProductExternalArticleNumber(productData.productExternalArticleNumber)
          : undefined,
        productInventoryBalance: productData.productInventoryBalance
          ? ProductInventoryBalance(productData.productInventoryBalance)
          : undefined,
        productSupplierArticleNumber: productData.productSupplierArticleNumber
          ? ProductSupplierArticleNumber(productData.productSupplierArticleNumber)
          : undefined,
        productUpdateRelatedData: productData.productUpdateRelatedData
          ? ProductUpdateRelatedData(productData.productUpdateRelatedData)
          : undefined,
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
      .where(condition)
      .orderBy(desc(products.createdAt))
      .limit(limit || 10)
      .offset(offset || 0)

    return { totalItems, productList }
  })

  const ProductsBrandedList = returnData.productList.map((item) => {
    return {
      productId: item.productId,
      productCategoryID: ProductCategoryID(item.productCategoryID),
      productItemNumber: ProductItemNumber(item.productItemNumber),
      productAward: ProductAward(item.productAward),
      productCost: ProductCost(item.productCost),
      productDescription: item.productDescription
        ? ProductDescription(item.productDescription)
        : undefined,
      productExternalArticleNumber: item.productExternalArticleNumber
        ? ProductExternalArticleNumber(item.productExternalArticleNumber)
        : undefined,
      productInventoryBalance: item.productInventoryBalance
        ? ProductInventoryBalance(item.productInventoryBalance)
        : undefined,
      productSupplierArticleNumber: item.productSupplierArticleNumber
        ? ProductSupplierArticleNumber(item.productSupplierArticleNumber)
        : undefined,
      productUpdateRelatedData: item.productUpdateRelatedData
        ? ProductUpdateRelatedData(item.productUpdateRelatedData)
        : undefined,
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
