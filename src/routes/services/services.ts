import { FastifyInstance } from 'fastify'
import {
  CreateServiceSchema,
  CreateServiceSchemaType,
  ListServiceQueryParamSchema,
  ListServiceQueryParamSchemaType,
  PatchServiceSchemaType,
  listServiceOrderByEnum,
  serviceOrderEnum,
  getServiceByIDSchemaType,
  PatchServiceSchema,
  getServiceByIDSchema,
} from './serviceSchema.js'
import {
  ServiceID,
  createService,
  getServicesPaginate,
  updateServiceByID,
  getServiceById,
  ServiceNoVariant,
} from '../../services/serviceService.js'
import { PermissionTitle } from '../../services/permissionService.js'
import { NextPageUrl, PreviousPageUrl, ResponseMessage } from '../../plugins/pagination.js'

export async function services(fastify: FastifyInstance) {
  fastify.get<{ Querystring: ListServiceQueryParamSchemaType }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('list_service')
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
        querystring: ListServiceQueryParamSchema,
      },
    },
    async function (request, _) {
      let {
        search = '',
        limit = 10,
        page = 1,
        orderBy = listServiceOrderByEnum.id,
        order = serviceOrderEnum.desc,
        hidden = true,
      } = request.query
      const offset = fastify.findOffset(limit, page)
      const result = await getServicesPaginate(search, limit, page, offset, orderBy, order, hidden)
      let message: ResponseMessage = fastify.responseMessage('services', result.data.length)
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

      return {
        message: message,
        totalItems: result.totalItems,
        nextUrl: nextUrl?.nextPageUrl,
        previousUrl: previousUrl?.previousPageUrl,
        totalPage: result.totalPage,
        page: page,
        limit: limit,
        data: result.data,
      }
    },
  )
  fastify.post<{ Body: CreateServiceSchemaType; Reply: object }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('create_service')
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
        body: CreateServiceSchema,
        response: {},
      },
    },
    async (request, reply) => {
      const service = request.body
      const serviceData = await createService(service)
      reply.status(201).send({ message: 'Service created', data: serviceData })
    },
  )
  fastify.patch<{
    Body: PatchServiceSchemaType
    Reply: object
    Params: getServiceByIDSchemaType
  }>(
    '/:id',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('update_service')
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
        body: PatchServiceSchema,
        params: getServiceByIDSchema,
      },
    },
    async (request, reply) => {
      const serviceData = request.body
      if (Object.keys(serviceData).length == 0) {
        return reply.status(422).send({ message: 'Provide at least one column to update.' })
      }

      const service = await updateServiceByID(ServiceID(request.params.id), serviceData)
      if (service == undefined) {
        return reply.status(404).send({ message: 'Service not found' })
      }
      reply.status(201).send({ message: 'Service Updated', data: service })
    },
  )

  fastify.get<{ Params: getServiceByIDSchemaType }>(
    '/:id',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, PermissionTitle('view_user'))
        done()
        return reply
      },

      schema: {
        params: getServiceByIDSchema,
      },
    },
    async (request, reply) => {
      const id = ServiceID(request.params.id)
      const user: ServiceNoVariant | undefined = await getServiceById(id)
      if (user == null) {
        return reply.status(404).send({ message: 'user not found' })
      }
      return reply.status(200).send(user)
    },
  )
}
export default services
