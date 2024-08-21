import { FastifyInstance } from 'fastify'

import {
  ListServiceQueryParamSchema,
  ListServiceQueryParamSchemaType,
  LocalServiceDeleteQualType,
  LocalServiceGlobalQualSchema,
  LocalServiceGlobalQualSchemaType,
  LocalServiceLocalQualSchema,
  LocalServiceLocalQualSchemaType,
  LocalServiceQualsSchema,
  LocalServiceQualsSchemaType,
  MessageSchema,
  MessageSchemaType,
  ServiceCreateSchema,
  ServiceCreateSchemaType,
  ServiceDeleteQual,
  ServiceDeleteQualType,
  ServiceLocalQualSchema,
  ServiceLocalQualSchemaType,
  ServiceSchemaType,
  ServicesPaginatedSchema,
  ServicesPaginatedSchemaType,
  getServiceByIDSchema,
  getServiceByIDSchemaType,
  listServiceOrderByEnum,
  serviceOrderEnum,
} from './serviceSchema.js'

import {
  GlobalServiceQuals,
  LocalService,
  LocalServiceCreate,
  LocalServiceGlobalQual,
  LocalServiceLocalQual,
  Service,
  ServiceBase,
  ServiceCreate,
  ServiceGlobalQual,
  ServiceLocalQual,
  ServicesPaginated,
  createService,
  deleteLocalServiceQualifications,
  deleteServiceQualifications,
  deletetServiceById,
  getLocalServiceQualifications,
  getServiceById,
  getServiceQualifications,
  getServicesPaginate,
  setLocalServiceLocalQual,
  setLocalServiceQualifications,
  setServiceLocalQual,
  setServiceQualifications,
} from '../../services/serviceService.js'

import {
  Award,
  ColorForService,
  GlobalQualID,
  LocalQualID,
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
    Body: ServiceCreateSchemaType
    Reply: (ServiceSchemaType & MessageSchemaType) | MessageSchemaType
  }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('create_service')
        console.log(permissionName, request.body)
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
        body: ServiceCreateSchema,
        //   response: { 201: { ...ServiceCreateSchema, ...MessageSchema }, 504: MessageSchema },
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
          localServiceID: request.body.localServiceID
            ? LocalServiceID(request.body.localServiceID)
            : undefined,
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
          serviceID: request.body.serviceID ? ServiceID(request.body.serviceID) : undefined,
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
      console.log('service Data', serviceData)
      match(
        serviceData,
        (serv) => {
          const { cost, ...rest } = serv

          return reply.status(201).send({
            message: 'Service created',
            ...{ ...rest, cost: cost.getAmount(), currency: cost.getCurrency() },
          })
        },
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
        //    params: getServiceByIDSchema,
        //  response: {},
      },
    },
    async (request, reply) => {
      let id: ServiceID | LocalServiceID
      if (request.params.type === 'Global') {
        id = ServiceID(request.params.serviceID)
      } else {
        id = LocalServiceID(request.params.serviceID)
      }
      const service: Either<string, Service | LocalService> = await getServiceById({
        type: request.params.type,
        id: id,
      })
      console.log(service)
      match(
        service,
        (fetchedService: Service | LocalService) => {
          return reply.status(200).send({ ...fetchedService })
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
        //        fastify.authorize(request, reply, PermissionTitle('view_service'))
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
      const service: Either<string, Service | LocalService> = await deletetServiceById({
        type: request.params.type,
        id: id,
      })
      match(
        service,
        (fetchedService: Service | LocalService) => {
          return reply.status(200).send({ ...fetchedService })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.post<{
    Body: LocalServiceGlobalQualSchemaType
    Reply: (MessageSchemaType & LocalServiceGlobalQualSchemaType) | MessageSchemaType
  }>(
    '/LocalServiceGlobalQuals',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        //        fastify.authorize(request, reply, PermissionTitle('Set_global_quals_local_service'))
        done()
        return reply
      },

      schema: {
        body: LocalServiceGlobalQualSchema,
        response: {
          200: { ...MessageSchema, ...LocalServiceGlobalQualSchema },
          504: MessageSchema,
        },
      },
    },
    async (request, reply) => {
      const serviceQual = {
        localServiceID: LocalServiceID(request.body.localServiceID),
        globalQualID: GlobalQualID(request.body.globalQualID),
      }
      const service: Either<string, LocalServiceGlobalQual> =
        await setLocalServiceQualifications(serviceQual)
      match(
        service,
        (servQual: LocalServiceGlobalQual) => {
          return reply.status(200).send({ message: 'set quals for service', ...servQual })
        },
        (err) => {
          return reply.status(504).send({ message: err })
        },
      )
    },
  )

  fastify.post<{
    Body: LocalServiceLocalQualSchemaType
    Reply: (MessageSchemaType & LocalServiceLocalQualSchemaType) | MessageSchemaType
  }>(
    '/LocalServiceLocalQuals',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        //        fastify.authorize(request, reply, PermissionTitle('Set_local_quals_local_service'))
        done()
        return reply
      },

      schema: {
        body: LocalServiceLocalQualSchema,
        response: {
          201: { ...MessageSchema, ...LocalServiceLocalQualSchema },
          504: MessageSchema,
        },
      },
    },
    async (request, reply) => {
      const serviceQual = {
        localServiceID: LocalServiceID(request.body.localServiceID),
        localQualID: LocalQualID(request.body.localQualID),
      }
      const service: Either<string, LocalServiceLocalQual> =
        await setLocalServiceLocalQual(serviceQual)
      match(
        service,
        (servQual: LocalServiceLocalQual) => {
          return reply.status(201).send({ message: 'set quals for service', ...servQual })
        },
        (err) => {
          return reply.status(504).send({ message: err })
        },
      )
    },
  )

  fastify.post<{
    Body: ServiceLocalQualSchemaType
    Reply: (MessageSchemaType & ServiceLocalQualSchemaType) | MessageSchemaType
  }>(
    '/serviceGlobalQuals',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        //        fastify.authorize(request, reply, PermissionTitle('Set_global_quals_global_service'))
        done()
        return reply
      },

      schema: {
        body: ServiceLocalQualSchema,
        response: {
          201: { ...MessageSchema, ...ServiceLocalQualSchema },
          504: MessageSchema,
        },
      },
    },
    async (request, reply) => {
      const serviceQual = {
        serviceID: ServiceID(request.body.serviceID),
        globalQualID: GlobalQualID(request.body.localQualID),
      }
      const service: Either<string, ServiceGlobalQual> = await setServiceQualifications(serviceQual)
      match(
        service,
        (servQual: ServiceGlobalQual) => {
          return reply.status(201).send({ message: 'set quals for service', ...servQual })
        },
        (err) => {
          return reply.status(504).send({ message: err })
        },
      )
    },
  )

  fastify.post<{
    Body: ServiceLocalQualSchemaType
    Reply: (MessageSchemaType & ServiceLocalQualSchemaType) | MessageSchemaType
  }>(
    '/GlobalServiceLocalQuals',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        //        fastify.authorize(request, reply, PermissionTitle('Set_local_quals_global_service'))
        done()
        return reply
      },

      schema: {
        body: ServiceLocalQualSchema,
        response: {
          201: { ...MessageSchema, ...ServiceLocalQualSchema },
          504: MessageSchema,
        },
      },
    },
    async (request, reply) => {
      const serviceQual = {
        serviceID: ServiceID(request.body.serviceID),
        localQualID: LocalQualID(request.body.localQualID),
      }
      const service: Either<string, ServiceLocalQual> = await setServiceLocalQual(serviceQual)
      match(
        service,
        (servQual: ServiceLocalQual) => {
          return reply.status(201).send({ message: 'set local quals for service', ...servQual })
        },
        (err) => {
          return reply.status(504).send({ message: err })
        },
      )
    },
  )

  fastify.delete<{
    Body: ServiceDeleteQualType
    Reply: (MessageSchemaType & ServiceDeleteQualType) | MessageSchemaType
  }>(
    '/serviceQualifications',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.body)
        //        fastify.authorize(request, reply, PermissionTitle('delete_service_quals'))
        done()
        return reply
      },

      schema: {
        params: getServiceByIDSchema,
        response: {
          200: { ...MessageSchema, ...ServiceDeleteQual },
          404: MessageSchema,
        },
      },
    },
    async (request, reply) => {
      const localQual = request.body.localQualID ? LocalQualID(request.body.localQualID) : undefined
      const globalQual = request.body.globalQualID
        ? GlobalQualID(request.body.globalQualID)
        : undefined
      let service: Either<string, GlobalServiceQuals>
      if (localQual != null) {
        service = await deleteServiceQualifications(
          ServiceID(request.body.serviceID),
          localQual,
          globalQual,
        )
      } else {
        service = await deleteServiceQualifications(
          ServiceID(request.body.serviceID),
          undefined,
          globalQual,
        )
      }
      match(
        service,
        (deletedServiceQuals: GlobalServiceQuals) => {
          return reply.status(200).send({ message: 'deleted quals ', ...deletedServiceQuals })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.delete<{
    Body: LocalServiceDeleteQualType
    Reply: (MessageSchemaType & LocalServiceQualsSchemaType) | MessageSchemaType
  }>(
    '/localServiceQualifications',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.body)
        //        fastify.authorize(request, reply, PermissionTitle('delete_local_service_quals'))
        done()
        return reply
      },

      schema: {
        body: getServiceByIDSchema,
        response: {
          200: { ...MessageSchema, ...LocalServiceQualsSchema },
          404: MessageSchema,
        },
      },
    },
    async (request, reply) => {
      const localQual = request.body.localQualID ? LocalQualID(request.body.localQualID) : undefined
      const globalQual = request.body.globalQualID
        ? GlobalQualID(request.body.globalQualID)
        : undefined
      let service: Either<string, GlobalServiceQuals>
      if (localQual != null) {
        service = await deleteLocalServiceQualifications(
          LocalServiceID(request.body.localServiceID),
          localQual,
          globalQual,
        )
      } else {
        service = await deleteLocalServiceQualifications(
          LocalServiceID(request.body.localServiceID),
          undefined,
          globalQual,
        )
      }
      match(
        service,
        (deletedServiceQuals: GlobalServiceQuals) => {
          return reply
            .status(200)
            .send({ message: 'deleted quals from service', ...deletedServiceQuals })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Params: getServiceByIDSchemaType
    // Reply: (ServiceSchemaType & MessageSchemaType) | MessageSchemaType
  }>(
    '/serviceQualifications/:serviceID/:type',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, PermissionTitle('get_service_quals'))
        done()
        return reply
      },

      schema: {
        params: getServiceByIDSchema,
        response: {},
      },
    },
    async (request, reply) => {
      let service
      if (request.params.type === 'Global') {
        service = await getServiceQualifications(ServiceID(request.params.serviceID))
      } else {
        service = await getLocalServiceQualifications(LocalServiceID(request.params.serviceID))
      }
      console.log(service)
      match(
        service,
        (fetchedService) => {
          return reply.status(200).send({ ...fetchedService })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )
}
export default services
