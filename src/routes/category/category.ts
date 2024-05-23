import { FastifyInstance } from 'fastify'

import {
  CreateProductCategory,
  ProductCategory,
  ProductCategoryDescription,
  ProductCategoryID,
  ProductCategoryName,
  ProductsCategoryPaginated,
  ServiceCategory,
  ServiceCategoryDescription,
  ServiceCategoryID,
  ServiceCategoryName,
  ServicesPaginated,
  UpdatedProductCategory,
  UpdatedServiceCategory,
  createProductCategory,
  createServiceCategory,
  deleteProductCategory,
  deleteServiceCategory,
  getProductCategoriesPaginate,
  getProductCategoryByID,
  getServiceCategoriesPaginate,
  getServiceCategoryByID,
  updateProductCategoryByID,
  updateServiceCategoryByID,
} from '../../services/CategoryService.js'

import {
  CreateServiceCategorySchema,
  CreateServiceCategorySchemaType,
  ListServiceCategoryQueryParamSchema,
  ListServiceCategoryQueryParamSchemaType,
  PatchServiceCategorySchema,
  PatchServiceCategorySchemaType,
  getServiceCategoryByIDSchema,
  getServiceCategoryByIDType,
} from './categorySchema.js'
import { PermissionTitle } from '../../services/permissionService.js'

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

export async function serviceCategory(fastify: FastifyInstance) {
  //Get service categories
  fastify.get<{ Querystring: ListServiceCategoryQueryParamSchemaType }>(
    '/service-category-list',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('list_service_category')
        const authorizeStatus = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        querystring: ListServiceCategoryQueryParamSchema,
      },
    },
    async function (request, reply) {
      const { search = '', limit = 10, page = 1 } = request.query
      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)
      const servicesPaginated: ServicesPaginated | undefined = await getServiceCategoriesPaginate(
        brandedSearch,
        brandedLimit,
        brandedPage,
        offset,
      )

      if (servicesPaginated == null) {
        return reply.status(403).send({ message: "Can't find service Categories" })
      } else {
        const message: ResponseMessage = fastify.responseMessage(
          ModelName('service category'),
          ResultCount(servicesPaginated.data.length),
        )
        const requestUrl: RequestUrl = RequestUrl(
          request.protocol + '://' + request.hostname + request.url,
        )
        const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
          requestUrl,
          Page(servicesPaginated.totalPage),
          Page(page),
        )
        const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
          requestUrl,
          Page(servicesPaginated.totalPage),
          Page(page),
        )

        return reply.status(200).send({
          message: message,
          totalItems: servicesPaginated.totalItems,
          nextUrl: nextUrl,
          previousUrl: previousUrl,
          totalPage: servicesPaginated.totalPage,
          page: page,
          limit: limit,
          data: servicesPaginated.data,
        })
      }
    },
  )

  //Get Product categories
  fastify.get<{ Querystring: ListServiceCategoryQueryParamSchemaType }>(
    '/products-category-list',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('list_product_category')
        const authorizeStatus = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        querystring: ListServiceCategoryQueryParamSchema,
      },
    },
    async function (request, reply) {
      const { search = '', limit = 10, page = 1 } = request.query
      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)
      const productsCategory: ProductsCategoryPaginated | undefined =
        await getProductCategoriesPaginate(brandedSearch, brandedLimit, brandedPage, offset)

      if (productsCategory == null) {
        return reply.status(403).send({ message: "Can't find service Categories" })
      } else {
        const message: ResponseMessage = fastify.responseMessage(
          ModelName('Products category'),
          ResultCount(productsCategory.data.length),
        )
        const requestUrl: RequestUrl = RequestUrl(
          request.protocol + '://' + request.hostname + request.url,
        )
        const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
          requestUrl,
          Page(productsCategory.totalPage),
          Page(page),
        )
        const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
          requestUrl,
          Page(productsCategory.totalPage),
          Page(page),
        )

        return reply.status(200).send({
          message: message,
          totalItems: productsCategory.totalItems,
          nextUrl: nextUrl,
          previousUrl: previousUrl,
          totalPage: productsCategory.totalPage,
          page: page,
          limit: limit,
          data: productsCategory.data,
        })
      }
    },
  )

  //create service category
  fastify.post<{ Body: CreateServiceCategorySchemaType; Reply: object }>(
    '/service',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('create_service_category')
        const authorizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        body: CreateServiceCategorySchema,
        response: {},
      },
    },
    async (request, reply) => {
      const { name, description = '' } = request.body

      const serviceCategory = await createServiceCategory(
        ServiceCategoryName(name),
        ServiceCategoryDescription(description),
      )

      reply.status(201).send({ message: 'Service Category created', serviceCategory })
    },
  )
  //Create Product category
  fastify.post<{ Body: CreateServiceCategorySchemaType; Reply: object }>(
    '/product',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('create_product_category')
        const authorizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        body: CreateServiceCategorySchema,
        response: {},
      },
    },
    async (request, reply) => {
      const { name, description = '' } = request.body

      const productCategory = await createProductCategory(
        ProductCategoryName(name),
        ProductCategoryDescription(description),
      )

      reply.status(201).send({ message: 'Product Category created', productCategory })
    },
  )

  // Get Product category
  fastify.get<{ Params: getServiceCategoryByIDType }>(
    '/product/:productID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('view_product_category')
        const authorizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        params: getServiceCategoryByIDSchema,
      },
    },
    async (request, reply) => {
      const id = ProductCategoryID(request.params.id)
      const productCategory = await getProductCategoryByID(id)
      if (productCategory == undefined || productCategory == null) {
        return reply.status(404).send({ message: 'Product Category not found' })
      }
      reply.status(200).send({ productCategory })
    },
  )

  //Get service category by id
  fastify.get<{ Params: getServiceCategoryByIDType }>(
    '/service/:serviceID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('view_service_category')
        const authorizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        params: getServiceCategoryByIDSchema,
      },
    },
    async (request, reply) => {
      const id = ServiceCategoryID(request.params.id)
      const serviceCategory = await getServiceCategoryByID(id)
      if (serviceCategory == undefined || serviceCategory == null) {
        return reply.status(404).send({ message: 'Service Category not found' })
      }
      reply.status(200).send({ serviceCategory: serviceCategory })
    },
  )

  fastify.patch<{
    Body: PatchServiceCategorySchemaType
    Reply: object
    Params: getServiceCategoryByIDType
  }>(
    '/service/:serviceID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('update_service_category')
        const authorizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        body: PatchServiceCategorySchema,
        params: getServiceCategoryByIDSchema,
      },
    },
    async (request, reply) => {
      const serviceCategoryData = request.body
      if (!(serviceCategoryData.name as string) && !(serviceCategoryData.description as string)) {
        return reply
          .status(422)
          .send({ message: 'Provide at least one required property to update.' })
      } else {
        const serviceCategory: UpdatedServiceCategory | undefined = await updateServiceCategoryByID(
          {
            serviceCategoryID: ServiceCategoryID(request.params.id),
            serviceCategoryName: request.body.name
              ? ServiceCategoryName(request.body.name)
              : undefined,
            ServiceCategoryDescription: request.body.description
              ? ServiceCategoryDescription(request.body.description)
              : undefined,
          },
        )
        if (serviceCategory == null) {
          return reply.status(404).send({ message: 'Service Category not found' })
        }
      }
      reply.status(201).send({ message: 'Service Category Updated', data: serviceCategory })
    },
  )

  //Delete product category
  fastify.patch<{
    Body: PatchServiceCategorySchemaType
    Reply: object
    Params: getServiceCategoryByIDType
  }>(
    '/product/:productID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('update_product_category')
        const authorizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        body: PatchServiceCategorySchema,
        params: getServiceCategoryByIDSchema,
      },
    },
    async (request, reply) => {
      if (!(request.body.name as string) && !(request.body.description as string)) {
        return reply
          .status(422)
          .send({ message: 'Provide at least one required property to update.' })
      } else {
        const id: ProductCategoryID = ProductCategoryID(request.params.id)
        const productCategoryName = ProductCategoryName(request.body.name)
        const productCategoryDescription = request.body.description
          ? ProductCategoryDescription(request.body.description)
          : undefined
        const makeProductCategory: CreateProductCategory = {
          productCategoryID: id,
          productCategoryName: productCategoryName,
          productCategoryDescription: productCategoryDescription,
        }
        const productCategory: UpdatedProductCategory | undefined = await updateProductCategoryByID(
          makeProductCategory,
        )
        if (productCategory == null) {
          return reply.status(404).send({ message: 'product Category not found' })
        }
      }
      reply.status(201).send({ message: 'product Category Updated', data: serviceCategory })
    },
  )

  //Delete service category
  fastify.delete<{ Params: getServiceCategoryByIDType }>(
    '/service/:serviceID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('delete_service_category')
        const authorizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        params: getServiceCategoryByIDSchema,
      },
    },
    async (request, reply) => {
      const id = ServiceCategoryID(request.params.id)
      const deletedServiceCategory: ServiceCategory | undefined = await deleteServiceCategory(id)
      if (deletedServiceCategory == undefined || deletedServiceCategory == null) {
        return reply.status(404).send({ message: "Service Category doesn't exist!" })
      }
      return reply.status(200).send({ message: 'Service Category deleted', deletedServiceCategory })
    },
  )

  //Delete product category
  fastify.delete<{ Params: getServiceCategoryByIDType }>(
    '/product/:productID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('delete_product_category')
        const authorizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        params: getServiceCategoryByIDSchema,
      },
    },
    async (request, reply) => {
      const id = ProductCategoryID(request.params.id)
      const deletedProductCategory: ProductCategory | undefined = await deleteProductCategory(id)
      if (deletedProductCategory == undefined || deletedProductCategory == null) {
        return reply.status(404).send({ message: "Product Category doesn't exist!" })
      }
      return reply.status(200).send({ message: 'Product Category deleted', deletedProductCategory })
    },
  )
}
