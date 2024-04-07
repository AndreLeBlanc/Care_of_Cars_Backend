import { FastifyInstance } from 'fastify'
import {
  createServiceCategory,
  deleteServiceCategory,
  getServiceCategoriesPaginate,
  getServiceCategoryByID,
  UpdatedServiceCategory,
  updateServiceCategoryByID,
  ServiceCategoryID,
  ServiceCategory,
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
import { NextPageUrl, PreviousPageUrl, ResponseMessage, Offset } from '../../plugins/pagination.js'

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
      let { search = '', limit = 10, page = 1 } = request.query
      const offset: Offset = fastify.findOffset(limit, page)
      const result = await getServiceCategoriesPaginate(search, limit, page, offset)
      let message: ResponseMessage = fastify.responseMessage('service category', result.data.length)
      let requestUrl: string | undefined = request.protocol + '://' + request.hostname + request.url
      const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
        requestUrl,
        result.totalPage,
        page,
      )
      const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
        requestUrl,
        result.totalPage,
        page,
      )

      return reply.status(200).send({
        message: message,
        totalItems: result.totalItems,
        nextUrl: nextUrl?.nextPageUrl,
        previousUrl: previousUrl?.previousPageUrl,
        totalPage: result.totalPage,
        page: page,
        limit: limit,
        data: result.data,
      })
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
      const serviceCategory = await createServiceCategory(name, description)
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
