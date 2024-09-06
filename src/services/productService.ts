import {
  Award,
  DbDateType,
  ProductCategoryID,
  ProductCostDinero,
  ProductCostNumber,
  ProductDescription,
  ProductExternalArticleNumber,
  ProductID,
  ProductInventoryBalance,
  ProductItemNumber,
  ProductSupplierArticleNumber,
  ProductUpdateRelatedData,
  StoreID,
  products,
} from '../schema/schema.js'
import { db } from '../config/db-connect.js'

import { and, desc, eq, ilike, isNull, or, sql } from 'drizzle-orm'

import { Limit, Offset, Page } from '../plugins/pagination.js'

import { Either, errorHandling, left, right } from '../utils/helper.js'

import Dinero from 'dinero.js'

export type ProductBase = {
  productItemNumber: ProductItemNumber
  cost: ProductCostDinero
  productCategoryID: ProductCategoryID
  productDescription: ProductDescription
  productSupplierArticleNumber?: ProductSupplierArticleNumber
  productExternalArticleNumber?: ProductExternalArticleNumber
  productUpdateRelatedData?: ProductUpdateRelatedData
  award: Award
  productInventoryBalance?: ProductInventoryBalance
  storeID?: StoreID
}

export type Product = ProductBase & { productID: ProductID } & DbDateType

export type ProductsPaginate = {
  totalItems: number
  totalPage: number
  perPage: number
  products: Product[]
}

export type LocalOrGlobal = 'Local' | 'Global'

type BrandMe = {
  productID: ProductID
  productItemNumber: ProductItemNumber
  cost: ProductCostNumber
  currency: string
  productCategoryID: ProductCategoryID
  productDescription: ProductDescription
  productSupplierArticleNumber: ProductSupplierArticleNumber | null
  productExternalArticleNumber: ProductExternalArticleNumber | null
  productUpdateRelatedData: ProductUpdateRelatedData | null
  award: Award
  productInventoryBalance: ProductInventoryBalance | null
} & DbDateType

function brander(newProduct: BrandMe): Either<string, Product> {
  return newProduct
    ? right({
        productID: newProduct.productID,
        productCategoryID: newProduct.productCategoryID,
        productItemNumber: newProduct.productItemNumber,
        award: newProduct.award,
        cost: ProductCostDinero(
          Dinero({
            amount: newProduct.cost,
            currency: newProduct.currency as Dinero.Currency,
          }),
        ),
        productDescription: newProduct.productDescription,
        productExternalArticleNumber: newProduct.productExternalArticleNumber ?? undefined,
        productInventoryBalance: newProduct.productInventoryBalance ?? undefined,
        productSupplierArticleNumber: newProduct.productSupplierArticleNumber ?? undefined,
        productUpdateRelatedData: newProduct.productUpdateRelatedData ?? undefined,
        createdAt: newProduct.createdAt,
        updatedAt: newProduct.updatedAt,
      })
    : left("couldn't add product")
}

function addValue(product: ProductBase) {
  return {
    productCategoryID: product.productCategoryID,
    productItemNumber: product.productItemNumber,
    cost: ProductCostNumber(product.cost.getAmount()),
    currency: product.cost.getCurrency(),
    award: product.award,
    productDescription: product.productDescription,
    productExternalArticleNumber: product.productExternalArticleNumber,
    productInventoryBalance: product.productInventoryBalance,
    productSupplierArticleNumber: product.productSupplierArticleNumber,
    productUpdateRelatedData: product.productUpdateRelatedData,
  }
}

//Add product
export async function addProduct(
  product: ProductBase,
  type: LocalOrGlobal,
  storeID?: StoreID,
): Promise<Either<string, Product>> {
  const add = addValue(product)
  try {
    if (type === 'Global' && storeID === undefined) {
      const [newProduct] = await db.insert(products).values(add).returning()
      return brander(newProduct)
    } else if (type === 'Local' && storeID != null) {
      const [newProduct] = await db
        .insert(products)
        .values({ ...add, storeID: storeID })
        .returning()
      return brander(newProduct)
    } else {
      return left('Local products must have a store, global products can not have a store')
    }
  } catch (e) {
    return left(errorHandling(e))
  }
}

//edit product
export async function editProduct(
  product: ProductBase,
  productID: ProductID,
): Promise<Either<string, Product>> {
  const add = addValue(product)
  try {
    const [editProduct] = await db
      .update(products)
      .set(add)
      .where(eq(products.productID, productID))
      .returning()

    return brander(editProduct)
  } catch (e) {
    return left(errorHandling(e))
  }
}

//Delete Product
export async function deleteProductByID(productID: ProductID): Promise<Either<string, ProductID>> {
  try {
    const [deletedProduct] = await db
      .delete(products)
      .where(eq(products.productID, productID))
      .returning({ productID: products.productID })
    return right(deletedProduct.productID)
  } catch (e) {
    return left(errorHandling(e))
  }
}

//Get product by Id,
export async function getProductById(productID: ProductID): Promise<Either<string, Product>> {
  try {
    const [productData] = await db.select().from(products).where(eq(products.productID, productID))
    return productData ? brander(productData) : left('Product Not Found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getProductsPaginated(
  search: string,
  limit = Limit(10),
  page = Page(1),
  offset = Offset(0),
  storeID: StoreID,
): Promise<Either<string, ProductsPaginate>> {
  try {
    const { totalItems, productList } = await db.transaction(async (tx) => {
      let condition = or(
        ilike(products.productItemNumber, '%' + search + '%'),
        ilike(products.productExternalArticleNumber, '%' + search + '%'),
        ilike(products.productDescription, '%' + search + '%'),
        ilike(products.productSupplierArticleNumber, '%' + search + '%'),
      )

      condition = storeID
        ? and(condition, or(eq(products.storeID, storeID), isNull(products.storeID)))
        : condition
      // Query for total items count
      const [totalItems] = await tx
        .select({ count: sql`COUNT(*)`.mapWith(Number).as('count') }) //{
        .from(products)
        .where(condition)

      // Query for paginated products
      const productList = await tx
        .select({
          productID: products.productID,
          storeID: products.storeID,
          productCategoryID: products.productCategoryID,
          productItemNumber: products.productItemNumber,
          award: products.award,
          cost: products.cost,
          currency: products.currency,
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

    const productsBrandedList = productList.map((item) => {
      return {
        productID: item.productID,
        storeID: item.storeID ?? undefined,
        productCategoryID: item.productCategoryID,
        productItemNumber: item.productItemNumber,
        award: item.award,
        cost: ProductCostDinero(
          Dinero({
            amount: item.cost,
            currency: item.currency as Dinero.Currency,
          }),
        ),
        productDescription: item.productDescription ?? undefined,
        productExternalArticleNumber: item.productExternalArticleNumber ?? undefined,
        productInventoryBalance: item.productInventoryBalance ?? undefined,
        productSupplierArticleNumber: item.productSupplierArticleNumber ?? undefined,
        productUpdateRelatedData: item.productUpdateRelatedData ?? undefined,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }
    })

    const totalPage = Math.ceil(totalItems.count / limit)

    return right({
      totalItems: totalItems.count,
      totalPage,
      perPage: page,
      products: productsBrandedList,
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}
