import { FastifyInstance } from 'fastify'
import {
  createServiceCategory,
  deleteServiceCategory,
  getServiceCategoriesPaginate,
  getServiceCategoryById,
  UpdatedServiceCategory,
  updateServiceCategoryById,
  serviceCategoryID,
} from '../../services/serviceCategory.js'
import {
  CreateServiceCategorySchema,
  CreateServiceCategorySchemaType,
  ListServiceCategoryQueryParamSchema,
  ListServiceCategoryQueryParamSchemaType,
  PatchServiceCategorySchema,
  PatchServiceCategorySchemaType,
  getServiceCategoryByIdSchema,
  getServiceCategoryByIdType,
} from './serviceCategorySchema.js'
import { PermissionTitle } from '../../services/permissionService.js'

export async function serviceCategory(fastify: FastifyInstance) {
  fastify.get<{ Querystring: ListServiceCategoryQueryParamSchemaType }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = { permissionName: 'list_service_category' }
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
      const offset = fastify.findOffset(limit, page)
      const result = await getServiceCategoriesPaginate(search, limit, page, offset)
      let message: string = fastify.responseMessage('service category', result.data.length)
      let requestUrl: string | undefined = request.protocol + '://' + request.hostname + request.url
      const nextUrl: string | undefined = fastify.findNextPageUrl(
        requestUrl,
        result.totalPage,
        page,
      )
      const previousUrl: string | undefined = fastify.findPreviousPageUrl(
        requestUrl,
        result.totalPage,
        page,
      )

      return reply.status(200).send({
        message: message,
        totalItems: result.totalItems,
        nextUrl: nextUrl,
        previousUrl: previousUrl,
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
        const permissionName: PermissionTitle = { permissionName: 'create_service_category' }
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
  fastify.get<{ Params: getServiceCategoryByIdType }>(
    '/:id',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = { permissionName: 'view_service_category' }
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
        params: getServiceCategoryByIdSchema,
      },
    },
    async (request, reply) => {
      const id = request.params.id
      const serviceCategory = await getServiceCategoryById(id)
      if (serviceCategory == undefined || serviceCategory == null) {
        return reply.status(404).send({ message: 'Service Category not found' })
      }
      reply.status(200).send({ serviceCategory: serviceCategory })
    },
  )
  fastify.patch<{
    Body: PatchServiceCategorySchemaType
    Reply: object
    Params: getServiceCategoryByIdType
  }>(
    '/:id',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = { permissionName: 'update_service_category' }
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
        params: getServiceCategoryByIdSchema,
      },
    },
    async (request, reply) => {
      const serviceCategoryData = request.body
      if (!(serviceCategoryData.name as string) && !(serviceCategoryData.description as string)) {
        return reply
          .status(422)
          .send({ message: 'Provide at least one required property to update.' })
      } else {
        const id: serviceCategoryID = { serviceCategoryID: request.params.id }
        const serviceCategory: UpdatedServiceCategory | undefined = await updateServiceCategoryById(
          id.serviceCategoryID,
          serviceCategoryData as PatchServiceCategorySchemaType,
        )
        if (serviceCategory == null) {
          return reply.status(404).send({ message: 'Service Category not found' })
        }
      }
      reply.status(201).send({ message: 'Service Category Updated', data: serviceCategory })
    },
  )
  fastify.delete<{ Params: getServiceCategoryByIdType }>(
    '/:id',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = { permissionName: 'delete_service_category' }
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
        params: getServiceCategoryByIdSchema,
      },
    },
    async (request, reply) => {
      const id = request.params.id
      const deletedServiceCategory = await deleteServiceCategory(id)
      if (deletedServiceCategory == undefined || deletedServiceCategory == null) {
        return reply.status(404).send({ message: "Service Category doesn't exist!" })
      }
      return reply.status(200).send({ message: 'Service Category deleted' })
    },
  )
}
