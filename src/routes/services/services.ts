import { FastifyInstance } from 'fastify'

import {
  ListServiceQueryParamSchema,
  ListServiceQueryParamSchemaType,
  MessageSchema,
  MessageSchemaType,
  ServiceSchema,
  ServiceSchemaType,
  ServicesPaginatedSchema,
  ServicesPaginatedSchemaType,
  getServiceByIDSchema,
  getServiceByIDSchemaType,
  listServiceOrderByEnum,
  serviceOrderEnum,
} from './serviceSchema.js'

import {
  LocalService,
  LocalServiceCreate,
  Service,
  ServiceBase,
  ServiceCreate,
  ServicesPaginated,
  createService,
  getServiceById,
  getServicesPaginate,
} from '../../services/serviceService.js'

import {
  Award,
  ColorForService,
  LocalServiceID,
  PermissionTitle,
  ServiceCallInterval,
  ServiceCategoryID,
  ServiceCostDinero,
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
  StoreID,
} from '../../schema/schema.js'

import {
  Limit,
  NextPageUrl,
  Offset,
  Page,
  PreviousPageUrl,
  RequestUrl,
  ResultCount,
  Search,
} from '../../plugins/pagination.js'

import Dinero from 'dinero.js'

import { Either, match } from '../../utils/helper.js'

export async function services(fastify: FastifyInstance) {
  fastify.put<{
    Body: ServiceSchemaType
    Reply: (ServiceSchemaType & MessageSchemaType) | MessageSchemaType
  }>(
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
        response: { 201: { ...ServiceSchema, ...MessageSchema }, 504: MessageSchema },
      },
    },

    async (request, reply) => {
      let serviceData: Either<string, Service | LocalService>
      const serviceBase: ServiceBase = {
        name: ServiceName(request.body.name),
        cost: ServiceCostDinero(
          Dinero({ amount: request.body.cost, currency: request.body.currency as Dinero.Currency }),
        ),
        award: Award(request.body.award),
        serviceCategoryID: ServiceCategoryID(request.body.serviceCategoryID),
        includeInAutomaticSms: ServiceIncludeInAutomaticSms(request.body.includeInAutomaticSms),
        hidden: ServiceHidden(request.body.hidden),
        callInterval: request.body.callInterval
          ? ServiceCallInterval(request.body.callInterval)
          : undefined,
        colorForService: request.body.colorForService as ColorForService,
        warrantyCard: request.body.warrantyCard
          ? ServiceWarrantyCard(request.body.warrantyCard)
          : undefined,
        itemNumber: request.body.itemNumber
          ? ServiceItemNumber(request.body.itemNumber)
          : undefined,
        suppliersArticleNumber: request.body.suppliersArticleNumber
          ? ServiceSuppliersArticleNumber(request.body.suppliersArticleNumber)
          : undefined,
        externalArticleNumber: request.body.externalArticleNumber
          ? ServiceExternalArticleNumber(request.body.externalArticleNumber)
          : undefined,
      }
      if (request.body.storeID != null) {
        const localService: LocalServiceCreate & { localServiceID?: LocalServiceID } = {
          ...serviceBase,
          storeID: StoreID(request.body.storeID),
          localServiceVariants: request.body.localServiceVariants.map((serviceVariant) => {
            return {
              localServicevariantID: serviceVariant.localServicevariantID ?? undefined,
              localServiceID: serviceVariant.localServiceID
                ? LocalServiceID(serviceVariant.localServiceID)
                : undefined,
              name: ServiceName(serviceVariant.name),
              award: Award(serviceVariant.award),
              cost: ServiceCostDinero(
                Dinero({
                  amount: serviceVariant.cost,
                  currency: serviceVariant.currency as Dinero.Currency,
                }),
              ),
              day1: serviceVariant.day1 ? ServiceDay1(serviceVariant.day1) : undefined,
              day2: serviceVariant.day2 ? ServiceDay2(serviceVariant.day2) : undefined,
              day3: serviceVariant.day3 ? ServiceDay3(serviceVariant.day3) : undefined,
              day4: serviceVariant.day4 ? ServiceDay4(serviceVariant.day4) : undefined,
              day5: serviceVariant.day5 ? ServiceDay5(serviceVariant.day5) : undefined,
            }
          }),
        }
        serviceData = await createService(localService)
      } else {
        const serviceNew: ServiceCreate & { serviceID?: ServiceID } = {
          ...serviceBase,
          serviceVariants: request.body.serviceVariants.map((serviceVariant) => {
            return {
              servicevariantID: serviceVariant.servicevariantID ?? undefined,
              serviceID: serviceVariant.serviceID ? ServiceID(serviceVariant.serviceID) : undefined,
              name: ServiceName(serviceVariant.name),
              award: Award(serviceVariant.award),
              cost: ServiceCostDinero(
                Dinero({
                  amount: serviceVariant.cost,
                  currency: serviceVariant.currency as Dinero.Currency,
                }),
              ),
              day1: serviceVariant.day1 ? ServiceDay1(serviceVariant.day1) : undefined,
              day2: serviceVariant.day2 ? ServiceDay2(serviceVariant.day2) : undefined,
              day3: serviceVariant.day3 ? ServiceDay3(serviceVariant.day3) : undefined,
              day4: serviceVariant.day4 ? ServiceDay4(serviceVariant.day4) : undefined,
              day5: serviceVariant.day5 ? ServiceDay5(serviceVariant.day5) : undefined,
            }
          }),
        }
        serviceData = await createService(serviceNew)
      }
      match(
        serviceData,
        () => reply.status(201).send({ message: 'Service created', ...serviceData }),
        (err) => reply.status(504).send({ message: err }),
      )
    },
  )

  fastify.get<{
    Querystring: ListServiceQueryParamSchemaType
    Reply: (MessageSchemaType & ServicesPaginatedSchemaType) | MessageSchemaType
  }>(
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
        response: { 200: { ...MessageSchema, ...ServicesPaginatedSchema }, 504: MessageSchema },
      },
    },
    async function (request, reply) {
      const {
        storeID,
        search = '',
        limit = 10,
        page = 1,
        orderBy = listServiceOrderByEnum.id,
        order = serviceOrderEnum.desc,
        hidden = false,
      } = request.query

      const brandedStoreID = StoreID(storeID)
      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const brandedHidden = ServiceHidden(hidden)
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)
      const servicesPaginated: Either<string, ServicesPaginated> = await getServicesPaginate(
        brandedStoreID,
        brandedSearch,
        brandedLimit,
        brandedPage,
        offset,
        orderBy,
        order,
        brandedHidden,
      )
      match(
        servicesPaginated,
        (services: ServicesPaginated) => {
          const requestUrl: RequestUrl = RequestUrl(
            request.protocol + '://' + request.hostname + request.url,
          )
          const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
            requestUrl,
            Page(services.totalPage),
            brandedPage,
          )
          const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
            requestUrl,
            Page(services.totalPage),
            brandedPage,
          )
          const servicesWithCost = services.services.map((serv) => {
            const { cost, ...service } = serv
            return {
              ...service,
              cost: cost.getAmount(),
              currency: cost.getCurrency(),
            }
          })

          const localServicesWithCost = services.localServices.map((serv) => {
            const { cost, ...service } = serv
            return {
              ...service,
              cost: cost.getAmount(),
              currency: cost.getCurrency(),
            }
          })

          return reply.status(200).send({
            message: 'services',
            totalServices: ResultCount(services.services.length),
            totalLocalServices: ResultCount(services.localServices.length),
            totalPage: Page(services.totalPage),
            perPage: Page(services.perPage),
            localServices: localServicesWithCost,
            services: servicesWithCost,
            requestUrl: requestUrl,
            nextUrl: nextUrl,
            previousUrl: previousUrl,
          })
        },
        (err) => {
          return reply.status(504).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Params: getServiceByIDSchemaType
    // Reply: (ServiceSchemaType & MessageSchemaType) | MessageSchemaType
  }>(
    '/:serviceID/:type',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, PermissionTitle('view_user'))
        done()
        return reply
      },

      schema: {
        params: getServiceByIDSchema,
        response: {},
      },
    },
    async (request, reply) => {
      let id: ServiceID | LocalServiceID
      if (request.params.type === 'Global') {
        id = ServiceID(request.params.serviceID)
      } else {
        id = LocalServiceID(request.params.serviceID)
      }
      const user: Either<string, Service | LocalService> = await getServiceById(id)
      console.log(user)
      match(
        user,
        (fetchedUser: Service | LocalService) => {
          return reply.status(200).send(fetchedUser)
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.delete<{ Params: getServiceByIDSchemaType }>(
    '/:serviceID/:type',
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
      let id: ServiceID | LocalServiceID
      if (request.params.type === 'Global') {
        id = ServiceID(request.params.serviceID)
      } else {
        id = LocalServiceID(request.params.serviceID)
      }
      const user: Either<string, Service | LocalService> = await getServiceById(id)
      match(
        user,
        (fetchedUser: Service | LocalService) => {
          return reply.status(200).send({ fetchedUser })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )
}
export default services
