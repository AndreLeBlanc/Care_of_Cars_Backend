import { FastifyInstance } from 'fastify'

import {
  ListServiceQueryParamSchema,
  ListServiceQueryParamSchemaType,
  LocalServiceLocalQualSchemaType,
  MessageSchema,
  MessageSchemaType,
  ServiceCreateSchema,
  ServiceCreateSchemaType,
  ServiceDeleteQual,
  ServiceDeleteQualType,
  ServiceLocalQualSchema,
  ServiceLocalQualSchemaType,
  ServiceOrderSchema,
  ServiceOrderSchemaType,
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
  Service,
  ServiceBase,
  ServiceCreate,
  ServiceGlobalQual,
  ServiceLocalQual,
  ServiceOrder,
  ServicesPaginated,
  createService,
  deleteServiceQualifications,
  deletetServiceById,
  getServiceById,
  getServiceQualifications,
  getServicesPaginate,
  getServicesWithVariants,
  setServiceLocalQual,
  setServiceQualifications,
} from '../../services/serviceService.js'

import {
  Award,
  ColorForService,
  GlobalQualID,
  LocalQualID,
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
import { StoreIDSchemaType } from '../stores/storesSchema.js'

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
      let serviceData: Either<string, Service>
      const deleteServiceVariants = request.body.deleteServiceVariants
        ? request.body.deleteServiceVariants.map(ServiceID)
        : []

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
        warrantyCard:
          request.body.warrantyCard != undefined
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
        day1: request.body.day1 ? ServiceDay1(request.body.day1) : undefined,
        day2: request.body.day2 ? ServiceDay2(request.body.day2) : undefined,
        day3: request.body.day3 ? ServiceDay3(request.body.day3) : undefined,
        day4: request.body.day4 ? ServiceDay4(request.body.day4) : undefined,
        day5: request.body.day5 ? ServiceDay5(request.body.day5) : undefined,
      }
      if (request.body.storeID != null) {
        const localService: ServiceCreate & { serviceID?: ServiceID } = {
          ...serviceBase,
          storeID: StoreID(request.body.storeID),
          serviceID: request.body.serviceID ? ServiceID(request.body.serviceID) : undefined,
          serviceVariants: request.body.localServiceVariants.map((serviceVariant) => {
            return {
              serviceVariantID: serviceVariant.serviceVariantID
                ? ServiceID(serviceVariant.serviceVariantID)
                : undefined,
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

        serviceData = await createService(localService, deleteServiceVariants)
      } else {
        const serviceNew: ServiceCreate & { serviceID?: ServiceID } = {
          ...serviceBase,
          storeID: request.body.storeID ? StoreID(request.body.storeID) : undefined,
          serviceID: request.body.serviceID ? ServiceID(request.body.serviceID) : undefined,
          serviceVariants: request.body.serviceVariants.map((serviceVariant) => {
            return {
              serviceVariantID: serviceVariant.serviceVariantID
                ? ServiceID(serviceVariant.serviceVariantID)
                : undefined,
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
        serviceData = await createService(serviceNew, deleteServiceVariants)
      }
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

          return reply.status(200).send({
            message: 'services',
            totalServices: ResultCount(services.services.length),
            totalPage: Page(services.totalPage),
            perPage: Page(services.perPage),
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
      const service: Either<string, Service> = await getServiceById(
        ServiceID(request.params.serviceID),
      )
      match(
        service,
        (fetchedService: Service) => {
          return reply.status(200).send({ ...fetchedService })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Params: StoreIDSchemaType
    Reply: ServiceOrderSchemaType | MessageSchemaType
  }>(
    '/order-list/:storeID',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('list_services_order'))
        done()
        return reply
      },

      schema: {
        params: getServiceByIDSchema,
        response: { 200: ServiceOrderSchema, 404: MessageSchema },
      },
    },
    async (request, reply) => {
      const service: Either<string, ServiceOrder[]> = await getServicesWithVariants(
        StoreID(request.params.storeID),
      )

      match(
        service,
        (fetchedService: ServiceOrder[]) => {
          return reply.status(200).send({ message: 'services for order', services: fetchedService })
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
        fastify.authorize(request, reply, PermissionTitle('view_service'))
        done()
        return reply
      },

      schema: {
        params: getServiceByIDSchema,
      },
    },
    async (request, reply) => {
      const service: Either<string, Service> = await deletetServiceById(
        ServiceID(request.params.serviceID),
      )
      match(
        service,
        (fetchedService: Service) => {
          return reply.status(200).send({ ...fetchedService })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  //TODO check store!!!!
  fastify.post<{
    Body: ServiceLocalQualSchemaType
    Reply: (MessageSchemaType & LocalServiceLocalQualSchemaType) | MessageSchemaType
  }>(
    '/LocalServiceLocalQuals',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, PermissionTitle('Set_local_quals_local_service'))
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
    Body: ServiceDeleteQualType
    Reply: (MessageSchemaType & ServiceDeleteQualType) | MessageSchemaType
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
      const service = await getServiceQualifications(ServiceID(request.params.serviceID))
      match(
        service,
        (fetchedService) => {
          return reply.status(200).send({ fetchedService })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )
}
export default services
