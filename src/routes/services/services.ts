import { FastifyInstance } from 'fastify'

import {
  ListServiceQueryParamSchema,
  ListServiceQueryParamSchemaType,
  ServiceSchema,
  ServiceSchemaType,
  colorForService,
  getServiceByIDSchema,
  getServiceByIDSchemaType,
  listServiceOrderByEnum,
  serviceOrderEnum,
} from './serviceSchema.js'

import {
  createService,
  getServiceById,
  getServicesPaginate,
} from '../../services/serviceService.js'

import {
  Award,
  PermissionTitle,
  ServiceCallInterval,
  ServiceCategoryID,
  ServiceCost,
  ServiceDay1,
  ServiceDay2,
  ServiceDay3,
  ServiceDay4,
  ServiceDay5,
  ServiceExternalArticleNumber,
  ServiceHidden,
  ServiceID,
  ServiceIncludeInAutomaticSms,
  ServiceItemNumber,
  ServiceName,
  ServiceSuppliersArticleNumber,
  ServiceWarrantyCard,
} from '../../schema/schema.js'

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
        hidden = false,
      } = request.query

      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const brandedHidden = ServiceHidden(hidden)
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)
      const result = await getServicesPaginate(
        brandedSearch,
        brandedLimit,
        brandedPage,
        offset,
        orderBy,
        order,
        brandedHidden,
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
        Page(result.totalPage),
        brandedPage,
      )
      const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
        requestUrl,
        Page(result.totalPage),
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
      const service = {
        serviceName: ServiceName(request.body.serviceName),
        serviceCategoryID: ServiceCategoryID(request.body.serviceCategoryID),
        serviceIncludeInAutomaticSms: ServiceIncludeInAutomaticSms(
          request.body.serviceIncludeInAutomaticSms,
        ),
        serviceHidden: request.body.serviceHidden
          ? ServiceHidden(request.body.serviceHidden)
          : undefined,
        serviceCallInterval: ServiceCallInterval(request.body.serviceCallInterval),
        serviceColorForService: request.body.serviceColorForService as colorForService,
        serviceWarrantyCard: request.body.serviceWarrantyCard
          ? ServiceWarrantyCard(request.body.serviceWarrantyCard)
          : undefined,
        serviceItemNumber: request.body.serviceItemNumber
          ? ServiceItemNumber(request.body.serviceItemNumber)
          : undefined,
        serviceSuppliersArticleNumber: request.body.serviceSuppliersArticleNumber
          ? ServiceSuppliersArticleNumber(request.body.serviceSuppliersArticleNumber)
          : undefined,
        serviceExternalArticleNumber: request.body.serviceExternalArticleNumber
          ? ServiceExternalArticleNumber(request.body.serviceExternalArticleNumber)
          : undefined,
        serviceVariants: request.body.serviceVariants.map((serviceVariant) => {
          return {
            serviceName: ServiceName(serviceVariant.name),
            serviceAward: ServiceAward(serviceVariant.award),
            serviceCost: ServiceCost(serviceVariant.cost),
            serviceDay1: serviceVariant.serviceDay1
              ? ServiceDay1(serviceVariant.serviceDay1)
              : undefined,
            serviceDay2: serviceVariant.serviceDay2
              ? ServiceDay2(serviceVariant.serviceDay2)
              : undefined,
            serviceDay3: serviceVariant.serviceDay3
              ? ServiceDay3(serviceVariant.serviceDay3)
              : undefined,
            serviceDay4: serviceVariant.serviceDay4
              ? ServiceDay4(serviceVariant.serviceDay4)
              : undefined,
            serviceDay5: serviceVariant.serviceDay5
              ? ServiceDay5(serviceVariant.serviceDay5)
              : undefined,
          }
        }),
      }
      const serviceData: ServiceID = await createService(service)
      reply.status(201).send({ message: 'Service created', data: serviceData })
    },
  )
  fastify.patch<{
    Body: ServiceSchemaType
    Reply: object
    Params: getServiceByIDSchemaType
  }>(
    '/:serviceID',
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
      if (Object.keys(request.body).length == 0) {
        return reply.status(422).send({ message: 'Provide at least one column to update.' })
      }
      const serviceData = {
        serviceName: ServiceName(request.body.serviceName),
        serviceCategoryID: ServiceCategoryID(request.body.serviceCategoryID),
        serviceIncludeInAutomaticSms: ServiceIncludeInAutomaticSms(
          request.body.serviceIncludeInAutomaticSms,
        ),
        serviceHidden: request.body.serviceHidden
          ? ServiceHidden(request.body.serviceHidden)
          : undefined,
        serviceCallInterval: ServiceCallInterval(request.body.serviceCallInterval),
        serviceColorForService: request.body.serviceColorForService,
        serviceWarrantyCard: request.body.serviceWarrantyCard
          ? ServiceWarrantyCard(request.body.serviceWarrantyCard)
          : undefined,
        serviceItemNumber: request.body.serviceItemNumber
          ? ServiceItemNumber(request.body.serviceItemNumber)
          : undefined,
        serviceSuppliersArticleNumber: request.body.serviceSuppliersArticleNumber
          ? ServiceSuppliersArticleNumber(request.body.serviceSuppliersArticleNumber)
          : undefined,
        serviceExternalArticleNumber: request.body.serviceExternalArticleNumber
          ? ServiceExternalArticleNumber(request.body.serviceExternalArticleNumber)
          : undefined,
        serviceVariants: request.body.serviceVariants.map((serviceVariant) => {
          return {
            serviceName: ServiceName(serviceVariant.name),
            serviceAward: ServiceAward(serviceVariant.award),
            serviceCost: ServiceCost(serviceVariant.cost),
            serviceDay1: serviceVariant.serviceDay1
              ? ServiceDay1(serviceVariant.serviceDay1)
              : undefined,
            serviceDay2: serviceVariant.serviceDay2
              ? ServiceDay2(serviceVariant.serviceDay2)
              : undefined,
            serviceDay3: serviceVariant.serviceDay3
              ? ServiceDay3(serviceVariant.serviceDay3)
              : undefined,
            serviceDay4: serviceVariant.serviceDay4
              ? ServiceDay4(serviceVariant.serviceDay4)
              : undefined,
            serviceDay5: serviceVariant.serviceDay5
              ? ServiceDay5(serviceVariant.serviceDay5)
              : undefined,
          }
        }),
      }
      const service = await updateServiceByID(ServiceID(request.params.serviceID), serviceData)
      if (service == undefined) {
        return reply.status(404).send({ message: 'Service not found' })
      }
      reply.status(201).send({ message: 'Service Updated', data: service })
    },
  )

  fastify.get<{ Params: getServiceByIDSchemaType }>(
    '/:serviceID',
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
      const id = ServiceID(request.params.serviceID)
      const user: ServiceNoVariant | undefined = await getServiceById(id)
      if (user == null) {
        return reply.status(404).send({ message: 'user not found' })
      }
      return reply.status(200).send(user)
    },
  )
}
export default services
