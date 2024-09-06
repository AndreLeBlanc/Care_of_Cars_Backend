import { FastifyInstance } from 'fastify'

import {
  AddProductSchema,
  AddProductSchemaType,
  DeleteProductReplySchema,
  DeleteProductReplySchemaType,
  DeleteProductSchema,
  DeleteProductSchemaType,
  GetProductSchema,
  GetProductSchemaType,
  ListProductsQueryParamSchema,
  ListProductsQueryParamSchemaType,
  ProductReplyMessageSchema,
  ProductReplyMessageSchemaType,
  ProductReplySchema,
  ProductReplySchemaType,
  ProductsPaginatedSchema,
  ProductsPaginatedSchemaType,
} from './productSchema.js'

import {
  LocalOrGlobal,
  Product,
  ProductBase,
  ProductsPaginate,
  addProduct,
  deleteProductByID,
  editProduct,
  getProductById,
  getProductsPaginated,
} from '../../services/productService.js'

import {
  Limit,
  ModelName,
  NextPageUrl,
  Offset,
  Page,
  PreviousPageUrl,
  RequestUrl,
  ResponseMessage,
  ResultCount,
  Search,
} from '../../plugins/pagination.js'

import {
  Award,
  PermissionTitle,
  ProductCategoryID,
  ProductCostDinero,
  ProductDescription,
  ProductExternalArticleNumber,
  ProductID,
  ProductInventoryBalance,
  ProductItemNumber,
  ProductSupplierArticleNumber,
  ProductUpdateRelatedData,
  StoreID,
} from '../../schema/schema.js'

import Dinero from 'dinero.js'

import { Either, left, match } from '../../utils/helper.js'

export const productsRoute = async (fastify: FastifyInstance) => {
  fastify.post<{
    Body: AddProductSchemaType
    Reply: ProductReplySchemaType | ProductReplyMessageSchemaType
  }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        //fastify.authorize(request, reply, PermissionTitle('create_product'))
        done()
        return reply
      },
      schema: {
        body: AddProductSchema,
        response: { 201: ProductReplySchema, 504: ProductReplyMessageSchema },
      },
    },
    async (req, rep) => {
      const {
        type,
        storeID,
        productItemNumber,
        cost,
        currency,
        productCategoryID,
        productDescription,
        productSupplierArticleNumber,
        productExternalArticleNumber,
        productUpdateRelatedData,
        award,
        productInventoryBalance,
      } = req.body
      const store = storeID ? StoreID(storeID) : undefined
      const productDetails: ProductBase = {
        productCategoryID: ProductCategoryID(productCategoryID),
        productItemNumber: ProductItemNumber(productItemNumber),
        award: Award(award),
        cost: ProductCostDinero(Dinero({ amount: cost, currency: currency as Dinero.Currency })),
        productDescription: ProductDescription(productDescription),
        productExternalArticleNumber: productExternalArticleNumber
          ? ProductExternalArticleNumber(productExternalArticleNumber)
          : undefined,
        productInventoryBalance: productInventoryBalance
          ? ProductInventoryBalance(productInventoryBalance)
          : undefined,
        productSupplierArticleNumber: productSupplierArticleNumber
          ? ProductSupplierArticleNumber(productSupplierArticleNumber)
          : undefined,
        productUpdateRelatedData: productUpdateRelatedData
          ? ProductUpdateRelatedData(productUpdateRelatedData)
          : undefined,
      }

      const createdProduct: Either<string, Product> = await addProduct(
        productDetails,
        type as LocalOrGlobal,
        store,
      )

      match(
        createdProduct,
        (newProduct) => {
          const { cost, ...product } = newProduct
          const costNumber = {
            ...product,
            cost: cost.getAmount(),
            currency: cost.getCurrency(),
          }
          return rep.status(201).send({
            message: 'Product Created successfully',
            ...costNumber,
          })
        },
        (err) => {
          return rep.status(504).send({
            message: err,
          })
        },
      )
    },
  )

  //Edit product
  fastify.patch<{
    Body: AddProductSchemaType
    Reply: ProductReplySchemaType | ProductReplyMessageSchemaType
  }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        //const permissionName: PermissionTitle = PermissionTitle('update_product')
        // fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        body: AddProductSchema,
        response: {
          200: ProductReplySchema,
          404: ProductReplyMessageSchema,
        },
      },
    },
    async (req, reply) => {
      const {
        award,
        localProductID,
        type,
        storeID,
        productID,
        productCategoryID,
        cost,
        currency,
        productInventoryBalance,
        productItemNumber,
        productDescription,
        productExternalArticleNumber,
        productSupplierArticleNumber,
        productUpdateRelatedData,
      } = req.body

      const productDetails: ProductBase = {
        productCategoryID: ProductCategoryID(productCategoryID),
        productItemNumber: ProductItemNumber(productItemNumber),
        award: Award(award),
        cost: ProductCostDinero(Dinero({ amount: cost, currency: currency as Dinero.Currency })),
        productDescription: ProductDescription(productDescription),
        productExternalArticleNumber: productExternalArticleNumber
          ? ProductExternalArticleNumber(productExternalArticleNumber)
          : undefined,
        productInventoryBalance: productInventoryBalance
          ? ProductInventoryBalance(productInventoryBalance)
          : undefined,
        productSupplierArticleNumber: productSupplierArticleNumber
          ? ProductSupplierArticleNumber(productSupplierArticleNumber)
          : undefined,
        productUpdateRelatedData: productUpdateRelatedData
          ? ProductUpdateRelatedData(productUpdateRelatedData)
          : undefined,
      }

      let editedProduct: Either<string, Product> = left(
        'global products have productIDs and localProducts have stores',
      )
      if (type === 'Global' && productID != undefined) {
        editedProduct = await editProduct(productDetails, ProductID(productID))
      }
      if (type === 'Local' && localProductID != undefined && storeID != undefined) {
        editedProduct = await editProduct(productDetails, ProductID(localProductID))
      }

      match(
        editedProduct,
        (newProduct: Product) => {
          const { cost, ...product } = newProduct
          const costNumber = {
            ...product,
            cost: cost.getAmount(),
            currency: cost.getCurrency(),
          }
          return reply.status(200).send({
            message: 'Product edited successfully',
            ...costNumber,
          })
        },
        (err) => {
          return reply.status(404).send({
            message: err,
          })
        },
      )
    },
  )

  //Deleted Product
  fastify.delete<{
    Params: DeleteProductSchemaType
    Reply: DeleteProductReplySchemaType | ProductReplyMessageSchemaType
  }>(
    '/:id/:type',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_product')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: DeleteProductSchema,
        response: {
          200: DeleteProductReplySchema,
          404: ProductReplyMessageSchema,
        },
      },
    },

    // TODO Check store deleting product!
    async (request, reply) => {
      const { id, type } = request.params
      let deletedProduct: Either<string, ProductID> = left(' product not found')
      if (type === 'Global') {
        deletedProduct = await deleteProductByID(ProductID(id))
      } else if (type === 'Local') {
        deletedProduct = await deleteProductByID(ProductID(id))
      }
      match(
        deletedProduct,
        (product) => {
          return reply.status(200).send({ message: 'Product deleted', product: product })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Params: GetProductSchemaType
    Reply: ProductReplySchemaType | ProductReplyMessageSchemaType
  }>(
    '/:productID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_product_by_id')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: GetProductSchema,
        response: {
          200: ProductReplySchema,
          404: ProductReplyMessageSchema,
        },
      },
    },
    async (request, reply) => {
      const { productID } = request.params

      let productData: Either<string, Product> = left('Product not found')
      productData = await getProductById(ProductID(productID))

      function unDineroGlobal(prod: Product) {
        const { cost, ...prodInfo } = prod
        return { ...prodInfo, cost: cost.getAmount(), currency: cost.getCurrency() }
      }

      match(
        productData,
        (product) => {
          return reply.status(200).send({ message: 'Product', ...unDineroGlobal(product) })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  //List products
  fastify.get<{
    Querystring: ListProductsQueryParamSchemaType
    Reply: ProductsPaginatedSchemaType | ProductReplyMessageSchemaType
  }>(
    '/product-list',
    {
      preHandler: async (request, reply, done) => {
        //   const permissionName: PermissionTitle = PermissionTitle('list_company_drivers')
        console.log(request.body)
        //   const authorizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        // if (!authorizeStatus) {
        //   return reply.status(403).send({
        //     message: `Permission denied, user doesn't have permission ${permissionName}`,
        //   })
        // }
        done()
        return reply
      },
      schema: {
        querystring: ListProductsQueryParamSchema,
        response: {
          200: ProductsPaginatedSchema,
          404: ProductReplyMessageSchema,
        },
      },
    },
    async function (request, reply) {
      const { search = '', limit = 10, page = 1, storeID } = request.query
      const brandedStoreID = StoreID(storeID)
      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)
      const products: Either<string, ProductsPaginate> = await getProductsPaginated(
        brandedSearch,
        brandedLimit,
        brandedPage,
        offset,
        brandedStoreID,
      )
      match(
        products,
        (productsPaginated) => {
          const message: ResponseMessage = fastify.responseMessage(
            ModelName('Products'),
            ResultCount(productsPaginated.products.length),
          )
          const requestUrl: RequestUrl = RequestUrl(
            request.protocol + '://' + request.hostname + request.url,
          )
          const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
            requestUrl,
            Page(productsPaginated.totalPage),
            Page(page),
          )
          const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
            requestUrl,
            Page(productsPaginated.totalPage),
            Page(page),
          )
          function unDineroGlobal(prod: Product) {
            const { cost, ...prodInfo } = prod
            return { ...prodInfo, cost: cost.getAmount(), currency: cost.getCurrency() }
          }

          return reply.status(200).send({
            message,
            totalItems: productsPaginated.totalItems,
            nextUrl: nextUrl,
            previousUrl,
            totalPage: productsPaginated.totalPage,
            page: page,
            limit: limit,
            products: productsPaginated.products.map(unDineroGlobal),
          })
        },
        (err) => {
          return reply.status(403).send({
            message: err,
          })
        },
      )
    },
  )
}
