import { FastifyInstance } from 'fastify'

import {
  EmployeeCheckIn,
  EmployeeID,
  OrderStatus,
  PermissionTitle,
  StatisticsDate,
  StoreID,
  SubmissionTimeOrder,
} from '../../schema/schema.js'

import { Either, isOrderStatus, match } from '../../utils/helper.js'

import {
  CheckedInStatSchema,
  CheckedInStatSchemaType,
  DashboardSchema,
  DashboardSchemaType,
  GetCheckinStatsSchema,
  GetCheckinStatsSchemaType,
  GetDashboardSchema,
  GetDashboardSchemaType,
  GetProductStatSchemaType,
  GetRevenueSchema,
  GetRevenueSchemaType,
  GetServiceStatsSchema,
  GetServiceStatsSchemaType,
  MessageReplySchema,
  MessageReplySchemaType,
  ProductStatSchema,
  ProductStatSchemaType,
  SalesStatsSchema,
  SalesStatsSchemaType,
  ServiceStatSchema,
  ServiceStatSchemaType,
} from './statisticsSchema.js'

import {
  CheckinStats,
  Dashboard,
  ProductStats,
  SalesStats,
  ServiceStats,
  checkinStats,
  dashboard,
  productStats,
  salesStats,
  serviceStats,
} from '../../services/statisticService.js'

export async function statistics(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: GetServiceStatsSchemaType
    Reply: ServiceStatSchemaType | MessageReplySchemaType
  }>(
    '/services',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_service_stats')
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
        querystring: GetServiceStatsSchema,
        response: {
          200: ServiceStatSchema,
          403: MessageReplySchema,
        },
      },
    },
    async function (request, reply) {
      const from = SubmissionTimeOrder(request.query.from)
      const to = SubmissionTimeOrder(request.query.to)
      const store = request.query.store ? StoreID(request.query.store) : undefined

      const maybeOrderStatus = request.query.filterOrderStatus
      const orderStatusValue: OrderStatus | undefined =
        maybeOrderStatus && isOrderStatus(maybeOrderStatus) ? maybeOrderStatus : undefined

      const serviceStatistics: Either<string, ServiceStats[]> = await serviceStats(
        from,
        to,
        store,
        orderStatusValue,
      )

      match(
        serviceStatistics,
        (stats: ServiceStats[]) => {
          const statsNum = stats.map((stat) => {
            const { cost, profit, revenuePerHour, ...rest } = stat
            return {
              cost: cost.getAmount(),
              profit: profit.getAmount(),
              revenuePerHour: Math.round(revenuePerHour.getAmount()),
              ...rest,
            }
          })
          return reply.status(200).send({ message: 'service statstics', store, stats: statsNum })
        },
        (err) => {
          return reply.status(403).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Querystring: GetProductStatSchemaType
    Reply: ProductStatSchemaType | MessageReplySchemaType
  }>(
    '/products',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_product_stats')
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
        querystring: GetServiceStatsSchema,
        response: {
          200: ProductStatSchema,
          403: MessageReplySchema,
        },
      },
    },
    async function (request, reply) {
      const from = SubmissionTimeOrder(request.query.from)
      const to = SubmissionTimeOrder(request.query.to)
      const store = request.query.store ? StoreID(request.query.store) : undefined

      const prodStatistics: Either<string, ProductStats[]> = await productStats(from, to, store)

      match(
        prodStatistics,
        (stats: ProductStats[]) => {
          const statsNum = stats.map((stat) => {
            const { cost, profit, ...rest } = stat
            return {
              cost: cost.getAmount(),
              profit: profit.getAmount(),
              ...rest,
            }
          })
          return reply.status(200).send({ message: 'product statstics', store, stats: statsNum })
        },
        (err) => {
          return reply.status(403).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Querystring: GetCheckinStatsSchemaType
    Reply: CheckedInStatSchemaType | MessageReplySchemaType
  }>(
    '/checkins',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_checkin_stats')
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
        querystring: GetCheckinStatsSchema,
        response: {
          200: CheckedInStatSchema,
          403: MessageReplySchema,
        },
      },
    },
    async function (request, reply) {
      const from = EmployeeCheckIn(request.query.from)
      const to = EmployeeCheckIn(request.query.to)
      const store = request.query.store ? StoreID(request.query.store) : undefined
      const employeeID = request.query.employeeID ? EmployeeID(request.query.employeeID) : undefined

      const prodStatistics: Either<string, CheckinStats[]> = await checkinStats(
        from,
        to,
        store,
        employeeID,
      )

      match(
        prodStatistics,
        (stats: CheckinStats[]) => {
          return reply.status(200).send({ message: 'checkin statstics', store, stats: stats })
        },
        (err) => {
          return reply.status(403).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Querystring: GetDashboardSchemaType
    Reply: DashboardSchemaType | MessageReplySchemaType
  }>(
    '/dashboard',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_dashboard')
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
        querystring: GetDashboardSchema,
        response: {
          200: DashboardSchema,
          403: MessageReplySchema,
        },
      },
    },
    async function (request, reply) {
      const from = request.query.from ? StatisticsDate(new Date(request.query.from)) : undefined
      const store = request.query.storeID ? StoreID(request.query.storeID) : undefined

      const dashboardStats: Either<string, Dashboard> = await dashboard(store, from)
      match(
        dashboardStats,
        (stats: Dashboard) => {
          return reply.status(200).send({ message: 'dashboard statistics', ...stats })
        },
        (err) => {
          return reply.status(403).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Querystring: GetRevenueSchemaType
    Reply: SalesStatsSchemaType | MessageReplySchemaType
  }>(
    '/revenue',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_revenue_stats')
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
        querystring: GetRevenueSchema,
        response: {
          200: SalesStatsSchema,
          403: MessageReplySchema,
        },
      },
    },
    async function (request, reply) {
      const from = StatisticsDate(new Date(request.query.from))
      const store = request.query.storeID ? StoreID(request.query.storeID) : undefined

      console.log(from, store)
      const dashboardStats: Either<string, SalesStats> = await salesStats(from, store)
      match(
        dashboardStats,
        (stats: SalesStats) => {
          return reply.status(200).send({ message: 'revenue statistics', ...stats })
        },
        (err) => {
          return reply.status(403).send({ message: err })
        },
      )
    },
  )
}
//////////////////////////////////////////////////////////////////////////////////
//////// for worktime statistics see getEmployeeSpecialWorkingHoursByDates ///////
//////////////////////////////////////////////////////////////////////////////////
