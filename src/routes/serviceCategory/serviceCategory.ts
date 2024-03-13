import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { createServiceCategory, getServiceCategoriesPaginate } from '../../services/serviceCategory'
import {
  CreateServiceCategorySchema,
  CreateServiceCategorySchemaType,
  ListServiceCategoryQueryParamSchema,
  ListServiceCategoryQueryParamSchemaType,
} from './serviceCategorySchema'

const serviceCategories: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get<{ Querystring: ListServiceCategoryQueryParamSchemaType }>(
    '/',
    {
      // onRequest: [fastify.authenticate],
      schema: {
        querystring: ListServiceCategoryQueryParamSchema,
      },
    },
    async function (request, reply) {
      let { search = '', limit = 10, page = 1 } = request.query
      const offset = fastify.findOffset(limit, page)
      const result = await getServiceCategoriesPaginate(search, limit, page, offset)
      let message: string = fastify.responseMessage('service category', result.data.length)
      let requestUrl: string | null = request.protocol + '://' + request.hostname + request.url
      const nextUrl: string | null = fastify.findNextPageUrl(requestUrl, result.totalPage, page)
      const previousUrl: string | null = fastify.findPreviousPageUrl(
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
      //onRequest: [fastify.authenticate],
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
}
export default serviceCategories
