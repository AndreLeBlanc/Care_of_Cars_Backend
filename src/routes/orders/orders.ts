import { FastifyInstance } from 'fastify'

import {
  Discount,
  DriverCarID,
  DriverID,
  EmployeeID,
  LocalServiceID,
  OrderID,
  OrderNotes,
  OrderStatus,
  PermissionTitle,
  PickupTime,
  ServiceCostNumber,
  ServiceDay1,
  ServiceDay2,
  ServiceDay3,
  ServiceDay4,
  ServiceDay5,
  ServiceID,
  StoreID,
  SubmissionTime,
  VatFree,
  orderStatus,
} from '../../schema/schema.js'

//import {
//  Limit,
//  NextPageUrl,
//  Offset,
//  Page,
//  PreviousPageUrl,
//  RequestUrl,
//  ResultCount,
//  Search,
//} from '../../plugins/pagination.js'

import Dinero from 'dinero.js'

import { Either, match } from '../../utils/helper.js'

import {
  CreateOrderBodyReplySchema,
  CreateOrderBodyReplySchemaType,
  CreateOrderBodySchema,
  CreateOrderBodySchemaType,
  MessageSchema,
  MessageSchemaType,
  OrderIDSchema,
  OrderIDSchemaType,
} from './ordersSchema.js'

import {
  CreateOrder,
  CreateOrderLocalServices,
  CreateOrderServices,
  OrderWithServices,
  createOrder,
  deleteOrder,
  getOrder,
} from '../../services/orderService.js'

export async function orders(fastify: FastifyInstance) {
  fastify.put<{
    Body: CreateOrderBodySchemaType
    Reply: (CreateOrderBodyReplySchemaType & MessageSchemaType) | MessageSchemaType
  }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('create_order')
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
        body: CreateOrderBodySchema,
        response: { 201: { CreateOrderBodyReplySchema }, 504: MessageSchema },
      },
    },

    async (req, reply) => {
      function isOrderStatus(value: string): value is OrderStatus {
        return value in orderStatus
      }

      const orderStatusFromBody = req.body.orderStatus

      const orderStatusValue: OrderStatus | undefined = isOrderStatus(orderStatusFromBody)
        ? orderStatusFromBody
        : undefined
      if (orderStatusValue != undefined) {
        const order: CreateOrder = {
          orderID: req.body.orderID ? OrderID(req.body.orderID) : undefined,
          driverCarID: DriverCarID(req.body.driverCarID),
          driverID: DriverID(req.body.driverID),
          storeID: StoreID(req.body.storeID),
          orderNotes: req.body.orderNotes ? OrderNotes(req.body.orderNotes) : undefined,
          bookedBy: req.body.bookedBy ? EmployeeID(req.body.bookedBy) : undefined,
          submissionTime: SubmissionTime(new Date(req.body.submissionTime)),
          pickupTime: PickupTime(new Date(req.body.pickupTime)),
          vatFree: VatFree(req.body.vatFree),
          orderStatus: orderStatusValue,
          currency: req.body.currency as Dinero.Currency,
          discount: Discount(req.body.discount),
        }

        const services: CreateOrderServices[] = req.body.services.map((service) => ({
          serviceID: ServiceID(service.serviceID),
          serviceVariantID: ServiceID(service.serviceVariantID),
          day1: service.day1 ? ServiceDay1(service.day1) : undefined,
          day1Work: service.day1Work ? service.day1Work : undefined,
          day1Employee: service.day1Employee ? EmployeeID(service.day1Employee) : undefined,
          day2: service.day2 ? ServiceDay2(service.day2) : undefined,
          day2Work: service.day2Work ? service.day2Work : undefined,
          day2Employee: service.day2Employee ? EmployeeID(service.day2Employee) : undefined,
          day3: service.day3 ? ServiceDay3(service.day3) : undefined,
          day3Work: service.day3Work ? service.day3Work : undefined,
          day3Employee: service.day3Employee ? EmployeeID(service.day3Employee) : undefined,
          day4: service.day4 ? ServiceDay4(service.day4) : undefined,
          day4Work: service.day4Work ? service.day4Work : undefined,
          day4Employee: service.day4Employee ? EmployeeID(service.day4Employee) : undefined,
          day5: service.day5 ? ServiceDay5(service.day5) : undefined,
          day5Work: service.day5Work ? service.day5Work : undefined,
          day5Employee: service.day5Employee ? EmployeeID(service.day5Employee) : undefined,
          cost: ServiceCostNumber(service.cost),
          discount: ServiceCostNumber(service.discount),
          vatFree: VatFree(service.vatFree),
          orderNotes: OrderNotes(service.orderNotes),
        }))

        const localServices: CreateOrderLocalServices[] = req.body.services.map((service) => ({
          localServiceID: LocalServiceID(service.serviceID),
          localServiceVariantID: LocalServiceID(service.serviceVariantID),
          day1: service.day1 ? ServiceDay1(service.day1) : undefined,
          day1Work: service.day1Work ? service.day1Work : undefined,
          day1Employee: service.day1Employee ? EmployeeID(service.day1Employee) : undefined,
          day2: service.day2 ? ServiceDay2(service.day2) : undefined,
          day2Work: service.day2Work ? service.day2Work : undefined,
          day2Employee: service.day2Employee ? EmployeeID(service.day2Employee) : undefined,
          day3: service.day3 ? ServiceDay3(service.day3) : undefined,
          day3Work: service.day3Work ? service.day3Work : undefined,
          day3Employee: service.day3Employee ? EmployeeID(service.day3Employee) : undefined,
          day4: service.day4 ? ServiceDay4(service.day4) : undefined,
          day4Work: service.day4Work ? service.day4Work : undefined,
          day4Employee: service.day4Employee ? EmployeeID(service.day4Employee) : undefined,
          day5: service.day5 ? ServiceDay5(service.day5) : undefined,
          day5Work: service.day5Work ? service.day5Work : undefined,
          day5Employee: service.day5Employee ? EmployeeID(service.day5Employee) : undefined,
          cost: ServiceCostNumber(service.cost),
          discount: ServiceCostNumber(service.discount),
          vatFree: VatFree(service.vatFree),
          orderNotes: OrderNotes(service.orderNotes),
        }))

        const newOrder: Either<string, OrderWithServices> = await createOrder(
          order,
          services,
          localServices,
        )
        match(
          newOrder,
          (order: OrderWithServices) => {
            return reply.status(201).send({
              message: 'Service created',
              ...order,
            })
          },
          (err) => reply.status(504).send({ message: err }),
        )
      } else {
        reply.status(504).send({ message: 'invalid order status' })
      }
    },
  )

  fastify.get<{
    Querystring: OrderIDSchemaType
    Reply: (CreateOrderBodyReplySchemaType & MessageSchemaType) | MessageSchemaType
  }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_order')
        const authorizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply.status(403).send({
            message: `Permission denied, user doesn't have permission ${permissionName}`,
          })
        }
        done()
        return reply
      },
      schema: {
        querystring: OrderIDSchema,
        response: {
          200: { ...CreateOrderBodyReplySchema, MessageSchema },
          403: MessageSchema,
        },
      },
    },
    async function (request, reply) {
      const orderID = OrderID(request.query.orderID)
      const fetchedOrder: Either<string, OrderWithServices> = await getOrder(orderID)
      match(
        fetchedOrder,
        (gottenOrder: OrderWithServices) => {
          return reply.status(200).send({ message: 'fetched order', ...gottenOrder })
        },
        (err) => {
          return reply.status(403).send({ message: err })
        },
      )
    },
  )

  fastify.delete<{
    Querystring: OrderIDSchemaType
    Reply: (CreateOrderBodyReplySchemaType & MessageSchemaType) | MessageSchemaType
  }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_order')
        const authorizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply.status(403).send({
            message: `Permission denied, user doesn't have permission ${permissionName}`,
          })
        }
        done()
        return reply
      },
      schema: {
        querystring: OrderIDSchema,
        response: {
          200: { ...CreateOrderBodyReplySchema, MessageSchema },
          403: MessageSchema,
        },
      },
    },
    async function (request, reply) {
      const orderID = OrderID(request.query.orderID)
      const deletedOrder: Either<string, OrderWithServices> = await deleteOrder(orderID)
      match(
        deletedOrder,
        (removedOrder: OrderWithServices) => {
          return reply.status(200).send({ message: 'fetched order', ...removedOrder })
        },
        (err) => {
          return reply.status(403).send({ message: err })
        },
      )
    },
  )
}
