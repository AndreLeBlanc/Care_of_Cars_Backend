import { FastifyInstance } from 'fastify'

import {
  ListServiceQueryParamSchema,
  ListServiceQueryParamSchemaType,
  ServiceSchema,
  ServiceSchemaType,
  getServiceByIDSchema,
  getServiceByIDSchemaType,
  listServiceOrderByEnum,
  serviceOrderEnum,
} from './serviceSchema.js'
import {
  ServiceID,
  ServiceNoVariant,
  createService,
  getServiceById,
  getServicesPaginate,
  updateServiceByID,
} from '../../services/serviceService.js'
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
    async function (request) {
      const {
        search = '',
        limit = 10,
        page = 1,
        orderBy = listServiceOrderByEnum.id,
        order = serviceOrderEnum.desc,
        hidden = true,
      } = request.query

      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)
      const result = await getServicesPaginate(
        brandedSearch,
        brandedLimit,
        brandedPage,
        offset,
        orderBy,
        order,
        hidden,
      )
      const message: ResponseMessage = fastify.responseMessage(
        ModelName('services'),
        ResultCount(result.data.length),
      )
      const requestUrl: RequestUrl = RequestUrl(
        request.protocol + '://' + request.hostname + request.url,
      )
      const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
        requestUrl,
        result.totalPage,
        brandedPage,
      )
      const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
        requestUrl,
        result.totalPage,
        brandedPage,
      )

      return {
        message: message,
        totalItems: result.totalItems,
        nextUrl: nextUrl,
        previousUrl: previousUrl,
        totalPage: result.totalPage,
        page: brandedPage,
        limit: limit,
        data: result.data,
      }
    },
  )
  fastify.post<{ Body: ServiceSchemaType; Reply: object }>(
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
        body: ServiceSchema,
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
    Body: ServiceSchemaType
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
        body: ServiceSchema,
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
