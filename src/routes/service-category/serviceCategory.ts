import { FastifyInstance } from 'fastify'

import {
  ServiceCategory,
  ServiceCategoryDescription,
  ServiceCategoryID,
  ServiceCategoryName,
  ServicesPaginated,
  UpdatedServiceCategory,
  createServiceCategory,
  deleteServiceCategory,
  getServiceCategoriesPaginate,
  getServiceCategoryByID,
  updateServiceCategoryByID,
} from '../../services/serviceCategory.js'

import {
  CreateServiceCategorySchema,
  CreateServiceCategorySchemaType,
  ListServiceCategoryQueryParamSchema,
  ListServiceCategoryQueryParamSchemaType,
  PatchServiceCategorySchema,
  PatchServiceCategorySchemaType,
  getServiceCategoryByIDSchema,
  getServiceCategoryByIDType,
} from './serviceCategorySchema.js'
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
  fastify.get<{ Querystring: ListServiceCategoryQueryParamSchemaType }>(
    '/',
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
  fastify.post<{ Body: CreateServiceCategorySchemaType; Reply: object }>(
    '/',
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
      reply.status(201).send({ message: 'Service created', data: serviceCategory })
    },
  )
  fastify.get<{ Params: getServiceCategoryByIDType }>(
    '/:id',
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
      const id = request.params.id
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
    '/:id',
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
        const id: ServiceCategoryID = ServiceCategoryID(request.params.id)

        const serviceCategory: UpdatedServiceCategory | undefined = await updateServiceCategoryByID(
          id,
          serviceCategoryData as PatchServiceCategorySchemaType,
        )
        if (serviceCategory == null) {
          return reply.status(404).send({ message: 'Service Category not found' })
        }
      }
      reply.status(201).send({ message: 'Service Category Updated', data: serviceCategory })
    },
  )
  fastify.delete<{ Params: getServiceCategoryByIDType }>(
    '/:id',
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
      return reply.status(200).send({ message: 'Service Category deleted' })
    },
  )
}
