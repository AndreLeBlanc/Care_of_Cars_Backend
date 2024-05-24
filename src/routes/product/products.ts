import { FastifyInstance } from 'fastify'

import {
  AddProductType,
  ListProductsQueryParamSchema,
  ListProductsQueryParamSchemaType,
  addProductBody,
  deleteProduct,
  deleteProductType,
} from './productSchema'

import {
  Product,
  ProductAddType,
  ProductEdit,
  ProductsPaginate,
  addProduct,
  deleteProductByItemNumber,
  editProduct,
  getProductById,
  getProductsPaginated,
} from '../../services/productService'

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
} from '../../plugins/pagination'
import {
  PermissionTitle,
  ProductAward,
  ProductCategoryID,
  ProductCost,
  ProductDescription,
  ProductExternalArticleNumber,
  ProductInventoryBalance,
  ProductItemNumber,
  ProductSupplierArticleNumber,
  ProductUpdateRelatedData,
} from '../../schema/schema'

export const productsRoute = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: AddProductType; Reply: object }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, PermissionTitle('create_product'))
        done()
        return reply
      },
      schema: {
        body: addProductBody,
      },
    },
    async (req, rep) => {
      const {
        productAward,
        productCategoryID,
        productCost,
        productInventoryBalance,
        productItemNumber,
        productDescription,
        productExternalArticleNumber,
        productSupplierArticleNumber,
        productUpdateRelatedData,
      } = req.body

      const productDetails: ProductAddType = {
        productCategoryID: ProductCategoryID(productCategoryID),
        productItemNumber: ProductItemNumber(productItemNumber),
        productAward: ProductAward(productAward),
        productCost: ProductCost(productCost),
        productDescription: productDescription ? ProductDescription(productDescription) : undefined,
        productExternalArticleNumber: productExternalArticleNumber
          ? ProductExternalArticleNumber(productExternalArticleNumber)
          : undefined,
        productInventoryBalance: ProductInventoryBalance(productInventoryBalance),
        productSupplierArticleNumber: productSupplierArticleNumber
          ? ProductSupplierArticleNumber(productSupplierArticleNumber)
          : undefined,
        productUpdateRelatedData: productUpdateRelatedData
          ? ProductUpdateRelatedData(productUpdateRelatedData)
          : undefined,
      }

      const createdProduct: Product | undefined = await addProduct(productDetails)
      if (createdProduct !== undefined) {
        return rep.status(201).send({
          message: 'Product Created successfully',
          data: createdProduct,
          productAdded: true,
        })
      } else {
        return rep.status(504).send({
          message: 'Fail to add product',
          productAdded: false,
        })
      }
    },
  )

  //Edit product
  fastify.patch<{ Body: AddProductType; Reply: object }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('update_product')
        fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        body: addProductBody,
      },
    },
    async (req, reply) => {
      const {
        productAward,
        productCategoryID,
        productCost,
        productInventoryBalance,
        productItemNumber,
        productDescription,
        productExternalArticleNumber,
        productSupplierArticleNumber,
        productUpdateRelatedData,
      } = req.body

      const productDetails: ProductAddType = {
        productCategoryID: ProductCategoryID(productCategoryID),
        productItemNumber: ProductItemNumber(productItemNumber),
        productAward: ProductAward(productAward),
        productCost: ProductCost(productCost),
        productDescription: productDescription ? ProductDescription(productDescription) : undefined,
        productExternalArticleNumber: productExternalArticleNumber
          ? ProductExternalArticleNumber(productExternalArticleNumber)
          : undefined,
        productInventoryBalance: ProductInventoryBalance(productInventoryBalance),
        productSupplierArticleNumber: productSupplierArticleNumber
          ? ProductSupplierArticleNumber(productSupplierArticleNumber)
          : undefined,
        productUpdateRelatedData: productUpdateRelatedData
          ? ProductUpdateRelatedData(productUpdateRelatedData)
          : undefined,
      }

      const editedProduct: ProductEdit | undefined = await editProduct(productDetails)

      if (editedProduct) {
        reply.status(201).send({
          message: 'Rent Car details edited',
          editedProduct,
          productEdited: true,
        })
      } else {
        reply.status(201).send({
          message: 'Failed to edit product',
          editedProduct,
          productEdited: false,
        })
      }
    },
  )

  //Deleted Product
  fastify.delete<{ Params: deleteProductType }>(
    '/:itemCodeNumber',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_product')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: deleteProduct,
      },
    },
    async (request, reply) => {
      const { itemCodeNumber } = request.params
      const deletedProduct: ProductItemNumber | undefined = await deleteProductByItemNumber(
        ProductItemNumber(itemCodeNumber),
      )
      if (deletedProduct == null) {
        return reply.status(404).send({ message: "Product doesn't exist!" })
      }
      return reply
        .status(200)
        .send({ message: 'Product deleted', deletedRegNumber: deletedProduct })
    },
  )

  //Deleted Product
  fastify.get<{ Params: deleteProductType }>(
    '/:itemCodeNumber',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_product_by_id')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: deleteProduct,
      },
    },
    async (request, reply) => {
      const { itemCodeNumber } = request.params

      const productData: Product | undefined = await getProductById(
        ProductItemNumber(itemCodeNumber),
      )
      if (productData == null) {
        return reply.status(404).send({ message: "Product doesn't exist!" })
      }
      return reply.status(200).send({ productDataFetch: true, productData })
    },
  )

  //List products

  fastify.get<{ Querystring: ListProductsQueryParamSchemaType }>(
    '/product-list',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('list_company_drivers')
        const authorizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply.status(403).send({
            message: `Permission denied, user doesn't have permission ${permissionName}`,
          })
        }
        done()
        return reply
      },
      schema: {
        querystring: ListProductsQueryParamSchema,
      },
    },
    async function (request) {
      const { search = '', limit = 10, page = 1 } = request.query
      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)
      const result: ProductsPaginate = await getProductsPaginated(
        brandedSearch,
        brandedLimit,
        brandedPage,
        offset,
      )

      const message: ResponseMessage = fastify.responseMessage(
        ModelName('Products'),
        ResultCount(result.data.length),
      )
      const requestUrl: RequestUrl = RequestUrl(
        request.protocol + '://' + request.hostname + request.url,
      )
      const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
        requestUrl,
        Page(result.totalPage),
        Page(page),
      )
      const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
        requestUrl,
        Page(result.totalPage),
        Page(page),
      )

      return {
        message,
        totalItems: result.totalItems,
        nextUrl: nextUrl,
        previousUrl,
        totalPage: result.totalPage,
        page: page,
        limit: limit,
        data: result.data,
      }
    },
  )
}
