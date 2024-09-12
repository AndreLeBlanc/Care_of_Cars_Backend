import { FastifyInstance } from 'fastify'

import { OrderStatus, PermissionTitle, StoreID, SubmissionTimeOrder } from '../../schema/schema.js'

import { Either, isOrderStatus, match } from '../../utils/helper.js'

import {
  GetServiceStatsSchema,
  GetServiceStatsSchemaType,
  MessageReplySchema,
  MessageReplySchemaType,
  ServiceStatSchema,
  ServiceStatSchemaType,
} from './statisticsSchema.js'

import {
  //CheckinStats,
  //ProductStats,
  ServiceStats,
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
}
