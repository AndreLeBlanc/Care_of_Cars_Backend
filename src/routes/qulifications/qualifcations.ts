import { FastifyInstance } from 'fastify'
import { PermissionTitle } from '../../services/permissionService.js'

import {
  CreateQualificationsGlobalSchema,
  CreateQualificationsGlobalSchemaType,
  CreateQualificationsLocalSchema,
  CreateQualificationsLocalSchemaType,
  GlobalQualIDSchema,
  GlobalQualIDSchemaType,
  LocalQualIDSchema,
  LocalQualIDSchemaType,
  QualificationMessage,
  QualificationMessageType,
  QualificationsGlobalSchema,
  QualificationsGlobalSchemaType,
  QualificationsLocalSchema,
  QualificationsLocalSchemaType,
} from './qualificationsSchema.js'

import {
  CreateQualificationsGlobal,
  CreateQualificationsLocal,
  CreatedAt,
  GlobalQualID,
  GlobalQualName,
  LocalQualID,
  LocalQualName,
  QualificationsGlobal,
  QualificationsLocal,
  QualificationsPaginated,
  UpdatedAt,
  UserGlobalQualifications,
  UserLocalQualifications,
  UserQualificationsGlobal,
  UserQualificationsLocal,
  deleteGlobalQuals,
  deleteLocalQuals,
  deleteUserGlobalQualification,
  deleteUserLocalQualification,
  getGlobalQual,
  getLocalQual,
  getQualifcationsPaginate,
  getUserQualifications,
  setUserGlobalQualification,
  setUserLocalQualification,
  updateGlobalQuals,
  updateLocalQuals,
} from '../../services/qualificationsService.js'

import { StoreID } from '../../services/storeService.js'

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

export const qualificationsRoute = async (fastify: FastifyInstance) => {
  fastify.put<{
    Body: CreateQualificationsLocalSchemaType
    Reply:
      | { message: QualificationMessageType; qualification: QualificationsLocalSchemaType }
      | { message: QualificationMessageType }
  }>(
    '/local',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, PermissionTitle('put_local_qualification'))
        done()
        return reply
      },
      schema: {
        body: CreateQualificationsLocalSchema,
        response: {
          201: { QualificationMessage, qualification: QualificationsLocalSchema },
          504: QualificationMessage,
        },
      },
    },
    async (req, rep) => {
      const {} = req.body

      const qualification: CreateQualificationsLocal = {
        storeID: StoreID(req.body.storeID),
        localQualName: LocalQualName(req.body.localQualName),
      }

      const putQual: QualificationsLocal | undefined = await updateLocalQuals(qualification)
      if (putQual != null) {
        return rep.status(201).send({
          message: 'Qualification Created/updated successfully',
          qualification: {
            qual: putQual.qual,
            dates: {
              createdAt: putQual.dates.createdAt.toISOString(),
              updatedAt: putQual.dates.updatedAt.toISOString(),
            },
          },
        })
      } else {
        return rep.status(504).send({
          message: 'Fail to create or update local qualification',
        })
      }
    },
  )

  fastify.put<{
    Body: CreateQualificationsGlobalSchemaType
    Reply:
      | { message: QualificationMessageType; qualification: QualificationsGlobalSchemaType }
      | { message: QualificationMessageType }
  }>(
    '/global',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, PermissionTitle('put_global_qualification'))
        done()
        return reply
      },
      schema: {
        body: CreateQualificationsGlobalSchema,
        response: {
          201: { QualificationMessage, qualification: QualificationsGlobalSchema },
          504: QualificationMessage,
        },
      },
    },
    async (req, rep) => {
      const {} = req.body

      const qualification: CreateQualificationsGlobal = {
        globalQualName: GlobalQualName(req.body.globalQualName),
      }

      const putQual: QualificationsGlobal | undefined = await updateGlobalQuals(qualification)
      if (putQual != null) {
        return rep.status(201).send({
          message: 'Qualification Created/updated successfully',
          qualification: {
            qual: putQual.qual,
            dates: {
              createdAt: putQual.dates.createdAt.toISOString(),
              updatedAt: putQual.dates.updatedAt.toISOString(),
            },
          },
        })
      } else {
        return rep.status(504).send({
          message: 'Fail to create or update global qualification',
        })
      }
    },
  )

  //Deleted local Qualification
  fastify.delete<{ Params: LocalQualIDSchemaType }>(
    '/:localQualID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_local_qualification')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: LocalQualIDSchema,
        response: {
          200: { QualificationMessage, qualification: QualificationsLocalSchema },
          404: QualificationMessage,
        },
      },
    },
    async (request, reply) => {
      const { localQualID } = request.params
      const deletedLocalQualification: QualificationsLocal | undefined = await deleteLocalQuals(
        LocalQualID(localQualID),
      )
      if (deletedLocalQualification == null) {
        return reply.status(404).send({ message: "Qualification doesn't exist!" })
      }
      return reply
        .status(200)
        .send({ message: 'Qualification deleted', qualification: deletedLocalQualification })
    },
  )

  fastify.delete<{ Params: GlobalQualIDSchemaType }>(
    '/:globalQualification',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_global_qualification')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: GlobalQualIDSchema,
        response: {
          200: { QualificationMessage, qualification: QualificationsGlobalSchema },
          404: QualificationMessage,
        },
      },
    },
    async (request, reply) => {
      const { globalQualID } = request.params
      const deletedGlobalQualification: QualificationsGlobal | undefined = await deleteGlobalQuals(
        GlobalQualID(globalQualID),
      )
      if (deletedGlobalQualification == null) {
        return reply.status(404).send({ message: "Qualification doesn't exist!" })
      }
      return reply
        .status(200)
        .send({ message: 'Qualification deleted', qualification: deletedGlobalQualification })
    },
  )

  fastify.get<{ Params: LocalQualIDSchemaType }>(
    '/:localQualID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_local_qualification')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: LocalQualIDSchema,
        response: {
          200: { QualificationMessage, qualification: QualificationsGlobalSchema },
          404: QualificationMessage,
        },
      },
    },
    async (request, reply) => {
      const { localQualID } = request.params
      const localQual: QualificationsLocal | undefined = await getLocalQual(
        LocalQualID(localQualID),
      )
      if (localQual == null) {
        return reply.status(404).send({ message: "Local Qualification doesn't exist!" })
      }
      reply.status(200).send({ message: 'Qualification fetched', qualification: localQual })
    },
  )

  fastify.get<{ Params: GlobalQualIDSchemaType }>(
    '/:globalQualID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_global_qualification')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: GlobalQualIDSchema,
        response: {
          200: { QualificationMessage, qualification: QualificationsGlobalSchema },
          404: QualificationMessage,
        },
      },
    },
    async (request, reply) => {
      const { globalQualID } = request.params
      const globalQual: QualificationsGlobal | undefined = await getGlobalQual(
        GlobalQualID(globalQualID),
      )
      if (globalQual == null) {
        return reply.status(404).send({ message: "Global Qualification doesn't exist!" })
      }
      reply.status(200).send({ message: 'Qualification fetched', qualification: globalQual })
    },
  )

  //List products

  fastify.get<{ Querystring: ListProductsQueryParamSchemaType }>(
    '/product-list',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('list_company_drivers')
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
        querystring: ListProductsQueryParamSchema,
      },
    },
    async function (request) {
      const { search = '', limit = 10, page = 1 } = request.query
      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)
      const result: ProductsPaginate = await getProductsPaginated(
        brandedSearch,
        brandedLimit,
        brandedPage,
        offset,
      )

      const message: ResponseMessage = fastify.responseMessage(
        ModelName('Products'),
        ResultCount(result.data.length),
      )
      const requestUrl: RequestUrl = RequestUrl(
        request.protocol + '://' + request.hostname + request.url,
      )
      const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
        requestUrl,
        Page(result.totalPage),
        Page(page),
      )
      const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
        requestUrl,
        Page(result.totalPage),
        Page(page),
      )

      return {
        message,
        totalItems: result.totalItems,
        nextUrl: nextUrl,
        previousUrl,
        totalPage: result.totalPage,
        page: page,
        limit: limit,
        data: result.data,
      }
    },
  )
}
