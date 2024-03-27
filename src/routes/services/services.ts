import { FastifyInstance } from 'fastify'
import {
  CreateServiceSchema,
  CreateServiceSchemaType,
  ListServiceQueryParamSchema,
  ListServiceQueryParamSchemaType,
  listServiceOrderByEnum,
  serviceOrderEnum,
} from './serviceSchema.js'
import { createService, getServicesPaginate } from '../../services/serviceService.js'

export async function services(fastify: FastifyInstance) {
  fastify.get<{ Querystring: ListServiceQueryParamSchemaType }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = 'list_service'
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
    async function (request, reply) {
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
      let message: string = fastify.responseMessage('services', result.data.length)
      let requestUrl: string | null = request.protocol + '://' + request.hostname + request.url
      const nextUrl: string | null = fastify.findNextPageUrl(requestUrl, result.totalPage, page)
      const previousUrl: string | null = fastify.findPreviousPageUrl(
        requestUrl,
        result.totalPage,
        page,
      )

      return {
        message: message,
        totalItems: result.totalItems,
        nextUrl: nextUrl,
        previousUrl: previousUrl,
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
        const permissionName = 'create_service'
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
}
export default services
