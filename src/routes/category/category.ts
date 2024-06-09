import { FastifyInstance } from 'fastify'

import {
  PermissionTitle,
  ProductCategoryDescription,
  ProductCategoryID,
  ProductCategoryName,
  ServiceCategoryDescription,
  ServiceCategoryID,
  ServiceCategoryName,
} from '../../schema/schema.js'

import {
  CreateProductCategory,
  CreateServiceCategory,
  ProductCategory,
  ProductsCategoryPaginated,
  ServiceCategory,
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
} from '../../services/categoryService.js'

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

import { Either, match } from '../../utils/helper.js'

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
      const servicesPaginated: Either<string, ServicesPaginated> =
        await getServiceCategoriesPaginate(brandedSearch, brandedLimit, brandedPage, offset)

      match(
        servicesPaginated,

        (servicesPaginated: ServicesPaginated) => {
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
        },
        () => {
          return reply.status(403).send({ message: "Can't find service Categories" })
        },
      )
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
      const productsCategory: Either<string, ProductsCategoryPaginated> =
        await getProductCategoriesPaginate(brandedSearch, brandedLimit, brandedPage, offset)

      match(
        productsCategory,

        (productsCategory: ProductsCategoryPaginated) => {
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
        },
        () => {
          return reply.status(403).send({ message: "Can't find service Categories" })
        },
      )
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

      const serviceCategory: Either<string, CreateServiceCategory> = await createServiceCategory(
        ServiceCategoryName(name),
        ServiceCategoryDescription(description),
      )
      match(
        serviceCategory,
        (serviceCategory: CreateServiceCategory) => {
          return reply.status(201).send({ message: 'Service Category created', serviceCategory })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
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

      const productCategory: Either<string, CreateProductCategory> = await createProductCategory(
        ProductCategoryName(name),
        ProductCategoryDescription(description),
      )
      match(
        productCategory,
        (prodCat) => reply.status(201).send({ message: 'Product Category created', prodCat }),
        (err) => {
          reply.status(404).send({ message: err })
        },
      )
    },
  )

  // Get Product category
  fastify.get<{ Params: getServiceCategoryByIDType }>(
    '/product/:producgCategoryID',
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
      const productCategory: Either<string, ProductCategory> = await getProductCategoryByID(id)
      match(
        productCategory,
        (prodCat: ProductCategory) => reply.status(200).send({ prodCat }),
        (err) => {
          reply.status(404).send({ message: err })
        },
      )
    },
  )

  //Get service category by id
  fastify.get<{ Params: getServiceCategoryByIDType }>(
    '/service/:serviceCategoryID',
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
      const serviceCategory: Either<string, ServiceCategory> = await getServiceCategoryByID(id)
      match(
        serviceCategory,
        (servCat: ServiceCategory) => reply.status(200).send({ serviceCategory: servCat }),
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.patch<{
    Body: PatchServiceCategorySchemaType
    Reply: object
    Params: getServiceCategoryByIDType
  }>(
    '/service/:serviceCategoryID',
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
        const serviceCategory: Either<string, UpdatedServiceCategory> =
          await updateServiceCategoryByID({
            serviceCategoryID: ServiceCategoryID(request.params.id),
            serviceCategoryName: request.body.name
              ? ServiceCategoryName(request.body.name)
              : undefined,
            ServiceCategoryDescription: request.body.description
              ? ServiceCategoryDescription(request.body.description)
              : undefined,
          })
        match(
          serviceCategory,
          (servCat: UpdatedServiceCategory) =>
            reply.status(201).send({ message: 'Service Category Updated', data: servCat }),
          (err) => {
            return reply.status(404).send({ message: err })
          },
        )
      }
    },
  )

  //Delete product category
  fastify.patch<{
    Body: PatchServiceCategorySchemaType
    Reply: object
    Params: getServiceCategoryByIDType
  }>(
    '/product/:producgCategoryID',
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
        const productCategory: Either<string, UpdatedProductCategory> =
          await updateProductCategoryByID(makeProductCategory)
        match(
          productCategory,
          (prodCat: UpdatedProductCategory) =>
            reply.status(201).send({ message: 'product Category Updated', data: prodCat }),
          (err) => {
            return reply.status(404).send({ message: err })
          },
        )
      }
    },
  )

  //Delete service category
  fastify.delete<{ Params: getServiceCategoryByIDType }>(
    '/service/:serviceCategoryID',
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
      const deletedServiceCategory: Either<string, ServiceCategory> = await deleteServiceCategory(
        id,
      )
      match(
        deletedServiceCategory,
        (delServCat: ServiceCategory) => {
          return reply.status(200).send({ message: 'Service Category deleted', delServCat })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  //Delete product category
  fastify.delete<{ Params: getServiceCategoryByIDType }>(
    '/product/:producgCategoryID',
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
      const deletedProductCategory: Either<string, ProductCategory> = await deleteProductCategory(
        id,
      )
      match(
        deletedProductCategory,
        (delProdCat: ProductCategory) => {
          return reply.status(200).send({ message: 'Product Category deleted', delProdCat })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )
}
