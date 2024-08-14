import {
  Award,
  DbDateType,
  LocalProductID,
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
  localProducts,
  products,
} from '../schema/schema.js'
import { db } from '../config/db-connect.js'

import { and, desc, eq, ilike, or, sql } from 'drizzle-orm'

import { Limit, Offset, Page } from '../plugins/pagination.js'

import { Either, errorHandling, left, right } from '../utils/helper.js'

import Dinero from 'dinero.js'

export type ProductBase = {
  productItemNumber: ProductItemNumber
  cost: ProductCostDinero
  productCategoryID: ProductCategoryID
  productDescription?: ProductDescription
  productSupplierArticleNumber?: ProductSupplierArticleNumber
  productExternalArticleNumber?: ProductExternalArticleNumber
  productUpdateRelatedData?: ProductUpdateRelatedData
  award: Award
  productInventoryBalance?: ProductInventoryBalance
}

export type ProductAdd = ProductBase & { currency: Dinero.Currency }

export type LocalProductAdd = ProductBase & {
  localProductID?: LocalProductID
  currency: Dinero.Currency
}

export type Product = ProductBase & { productID: ProductID } & DbDateType

export type LocalProduct = ProductBase & { localProductID: LocalProductID } & DbDateType

export type ProductEdit = ProductAdd

export type ProductsPaginate = {
  totalItems: number
  totalPage: number
  perPage: number
  products: Product[]
  localProducts: LocalProduct[]
}

export type LocalOrGlobal = 'Local' | 'Global'

type BrandMe = {
  productItemNumber: ProductItemNumber
  cost: ProductCostNumber
  currency: string
  productCategoryID: ProductCategoryID
  productDescription: ProductDescription | null
  productSupplierArticleNumber: ProductSupplierArticleNumber | null
  productExternalArticleNumber: ProductExternalArticleNumber | null
  productUpdateRelatedData: ProductUpdateRelatedData | null
  award: Award
  productInventoryBalance: ProductInventoryBalance | null
} & DbDateType &
  ({ productID: ProductID } | { localProductID: LocalProductID })

function brander(newProduct: BrandMe): Either<string, Product | LocalProduct> {
  let id: { localProductID: LocalProductID } | { productID: ProductID }
  if ('productID' in newProduct) {
    id = { productID: newProduct.productID }
  } else {
    id = { localProductID: newProduct.localProductID }
  }

  return newProduct
    ? right({
        ...{
          productCategoryID: newProduct.productCategoryID,
          productItemNumber: newProduct.productItemNumber,
          award: newProduct.award,
          cost: ProductCostDinero(
            Dinero({
              amount: newProduct.cost,
              currency: newProduct.currency as Dinero.Currency,
            }),
          ),
          productDescription: newProduct.productDescription ?? undefined,
          productExternalArticleNumber: newProduct.productExternalArticleNumber ?? undefined,
          productInventoryBalance: newProduct.productInventoryBalance ?? undefined,
          productSupplierArticleNumber: newProduct.productSupplierArticleNumber ?? undefined,
          productUpdateRelatedData: newProduct.productUpdateRelatedData ?? undefined,
          createdAt: newProduct.createdAt,
          updatedAt: newProduct.updatedAt,
        },
        ...id,
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
): Promise<Either<string, Product | LocalProduct>> {
  const add = addValue(product)
  try {
    if (type === 'Global') {
      const [newProduct] = await db.insert(products).values(add).returning()
      return brander(newProduct)
    } else if (storeID != null) {
      const [newProduct] = await db
        .insert(localProducts)
        .values({ ...add, storeID: storeID })
        .returning()
      return brander(newProduct)
    } else {
      return left('store not found')
    }
  } catch (e) {
    return left(errorHandling(e))
  }
}

//edit product
export async function editProduct(
  product: ProductBase,
  localProductID?: LocalProductID,
  productID?: ProductID,
): Promise<Either<string, Product | LocalProduct>> {
  const add = addValue(product)
  try {
    if (productID != null) {
      const [editProduct] = await db
        .update(products)
        .set(add)
        .where(eq(products.productID, productID))
        .returning()
      return brander(editProduct)
    } else if (localProductID != null) {
      const [editProduct] = await db
        .update(localProducts)
        .set(add)
        .where(eq(localProducts.localProductID, localProductID))
        .returning()
      return brander(editProduct)
    }
    return left('no product to update')
  } catch (e) {
    return left(errorHandling(e))
  }
}

//Delete Product
export async function deleteProductByID(
  localProductID?: LocalProductID,
  productID?: ProductID,
): Promise<Either<string, ProductID | LocalProductID>> {
  try {
    if (productID != null) {
      const [deletedProduct] = await db
        .delete(products)
        .where(eq(products.productID, productID))
        .returning({ productID: products.productID })
      return right(deletedProduct.productID)
    } else if (localProductID != null) {
      const [deletedProduct] = await db
        .delete(localProducts)
        .where(eq(localProducts.localProductID, localProductID))
        .returning({ productID: localProducts.localProductID })
      return right(deletedProduct.productID)
    }
    return left('Product not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

//Get product by Id,
export async function getProductById(
  localProductID?: LocalProductID,
  productID?: ProductID,
): Promise<Either<string, Product | LocalProduct>> {
  try {
    if (productID != null) {
      const [productData] = await db
        .select()
        .from(products)
        .where(eq(products.productID, productID))
      return productData ? brander(productData) : left('Product Not Found')
    } else if (localProductID != null) {
      const [productData] = await db
        .select()
        .from(localProducts)
        .where(eq(localProducts.localProductID, localProductID))
      return productData ? brander(productData) : left('Product Not Found')
    }
    return left('Product not found')
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
    const { totalItems, productList, localProductList } = await db.transaction(async (tx) => {
      const condition = or(
        ilike(products.productItemNumber, '%' + search + '%'),
        ilike(products.productExternalArticleNumber, '%' + search + '%'),
        ilike(products.productDescription, '%' + search + '%'),
        ilike(products.productSupplierArticleNumber, '%' + search + '%'),
      )
      const conditionLocal = and(
        eq(localProducts.storeID, storeID),
        or(
          ilike(localProducts.productItemNumber, '%' + search + '%'),
          ilike(localProducts.productExternalArticleNumber, '%' + search + '%'),
          ilike(localProducts.productDescription, '%' + search + '%'),
          ilike(localProducts.productSupplierArticleNumber, '%' + search + '%'),
        ),
      )
      // Query for total items count
      const [totalItems] = await tx
        .select({ count: sql`COUNT(*)`.mapWith(Number).as('count') }) //{
        .from(products)
        .where(condition)
        .fullJoin(localProducts, conditionLocal)

      // Query for paginated products
      const productList = await tx
        .select({
          productID: products.productID,
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

      const localProductList = await tx
        .select({
          localProductID: localProducts.localProductID, // Cast NULL to integer
          productCategoryID: localProducts.productCategoryID,
          productItemNumber: localProducts.productItemNumber,
          award: localProducts.award,
          cost: localProducts.cost,
          currency: localProducts.currency,
          productDescription: localProducts.productDescription,
          productExternalArticleNumber: localProducts.productExternalArticleNumber,
          productInventoryBalance: localProducts.productInventoryBalance,
          productSupplierArticleNumber: localProducts.productSupplierArticleNumber,
          productUpdateRelatedData: localProducts.productUpdateRelatedData,
          createdAt: localProducts.createdAt,
          updatedAt: localProducts.updatedAt,
        })
        .from(localProducts)
        .where(conditionLocal)
        .orderBy(desc(localProducts.createdAt))
        .limit(limit || 10)
        .offset(offset || 0)

      return { totalItems, productList, localProductList }
    })

    const productsBrandedList = productList.map((item) => {
      return {
        productID: item.productID,
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

    const localProductsBrandedList = localProductList.map((item) => {
      return {
        localProductID: item.localProductID,
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
      localProducts: localProductsBrandedList,
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}
