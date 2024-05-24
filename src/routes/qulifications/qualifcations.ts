import { FastifyInstance } from 'fastify'

import {
  CreateQualificationsGlobalSchema,
  CreateQualificationsGlobalSchemaType,
  CreateQualificationsLocalSchema,
  CreateQualificationsLocalSchemaType,
  GlobalQualIDSchema,
  GlobalQualIDSchemaType,
  ListQualsReplySchema,
  ListQualsSchema,
  ListQualsSchemaType,
  LocalQualIDSchema,
  LocalQualIDSchemaType,
  PutUserGlobalQualSchema,
  PutUserGlobalQualSchemaType,
  PutUserLocalQualSchema,
  PutUserLocalQualSchemaType,
  QualificationMessage,
  QualificationMessageType,
  QualificationsGlobalSchema,
  QualificationsGlobalSchemaType,
  QualificationsLocalSchema,
  QualificationsLocalSchemaType,
} from './qualificationsSchema'

import {
  CreateQualificationsGlobal,
  CreateQualificationsLocal,
  QualificationsGlobal,
  QualificationsListed,
  QualificationsLocal,
  UserGlobalQualifications,
  UserLocalQualifications,
  deleteGlobalQuals,
  deleteLocalQuals,
  deleteUserGlobalQualification,
  deleteUserLocalQualification,
  getGlobalQual,
  getLocalQual,
  getQualifcations,
  setUserGlobalQualification,
  setUserLocalQualification,
  updateGlobalQuals,
  updateLocalQuals,
} from '../../services/qualificationsService'

import {
  GlobalQualID,
  GlobalQualName,
  LocalQualID,
  LocalQualName,
  PermissionTitle,
  StoreID,
  UserID,
} from '../../schema/schema'

import { Search } from '../../plugins/pagination'

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

      const putQual: QualificationsLocal | undefined = req.body.localQualID
        ? await updateLocalQuals(qualification, LocalQualID(req.body.localQualID))
        : await updateLocalQuals(qualification)
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

      const putQual: QualificationsGlobal | undefined = req.body.globalQualID
        ? await updateGlobalQuals(qualification, GlobalQualID(req.body.globalQualID))
        : await updateGlobalQuals(qualification)
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
    '/localqualifications/:localQualID',
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
    '/globalQualifications/:globalQualID',
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
    '/localQualifications/:localQualID',
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
          200: { QualificationMessage, qualification: QualificationsLocalSchema },
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
    '/globalQualifications:globalQualID',
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

  fastify.get<{ Querystring: ListQualsSchemaType }>(
    '/qualifications-list',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('list_qualifications')
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
        querystring: ListQualsSchema,
        response: { 200: ListQualsReplySchema },
      },
    },
    async function (request) {
      const { search = '', storeID, userID } = request.query
      const brandedSearch = Search(search)
      let result: QualificationsListed
      if (userID == null) {
        result = storeID
          ? await getQualifcations(brandedSearch, StoreID(storeID))
          : await getQualifcations(brandedSearch)
      } else {
        result = storeID
          ? await getQualifcations(brandedSearch, StoreID(storeID), UserID(userID))
          : await getQualifcations(brandedSearch, undefined, UserID(userID))
      }

      return {
        message: 'qualifications',
        totalLocalQuals: result.totalLocalQuals,
        totalGlobalQuals: result.totalGlobalQuals,
        localQuals: result.localQuals,
        globalQuals: result.globalQuals,
      }
    },
  )

  fastify.post<{
    Body: PutUserLocalQualSchemaType
    Reply:
      | { message: QualificationMessageType; qualification: PutUserLocalQualSchemaType }
      | { message: QualificationMessageType }
  }>(
    '/local-qual',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, PermissionTitle('put_user_local_qualification'))
        done()
        return reply
      },
      schema: {
        body: PutUserLocalQualSchema,
        response: {
          201: { message: QualificationMessage, qualification: PutUserLocalQualSchema },
          504: QualificationMessage,
        },
      },
    },
    async (req, rep) => {
      const userID = UserID(req.body.userID)
      const localQualID = LocalQualID(req.body.localQualID)

      const putQual: UserLocalQualifications | undefined = await setUserLocalQualification(
        userID,
        localQualID,
      )
      if (putQual != null) {
        return rep.status(201).send({
          message: 'Qualification set/updated successfully',
          qualification: putQual,
        })
      } else {
        return rep.status(504).send({
          message: 'Fail to set local qualification',
        })
      }
    },
  )

  fastify.post<{
    Body: PutUserGlobalQualSchemaType
    Reply:
      | { message: QualificationMessageType; qualification: PutUserGlobalQualSchemaType }
      | { message: QualificationMessageType }
  }>(
    '/global-qual',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, PermissionTitle('put_user_global_qualification'))
        done()
        return reply
      },
      schema: {
        body: PutUserGlobalQualSchema,
        response: {
          201: { message: QualificationMessage, qualification: PutUserGlobalQualSchema },
          504: QualificationMessage,
        },
      },
    },
    async (req, rep) => {
      const userID = UserID(req.body.userID)
      const globalQualID = GlobalQualID(req.body.globalQualID)

      const putQual: UserGlobalQualifications | undefined = await setUserGlobalQualification(
        userID,
        globalQualID,
      )
      if (putQual != null) {
        return rep.status(201).send({
          message: 'Qualification set/updated successfully',
          qualification: putQual,
        })
      } else {
        return rep.status(504).send({
          message: 'Fail to set global qualification',
        })
      }
    },
  )

  fastify.delete<{
    Body: PutUserLocalQualSchemaType
    Reply:
      | { message: QualificationMessageType; qualification: PutUserLocalQualSchemaType }
      | { message: QualificationMessageType }
  }>(
    '/local-qual',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, PermissionTitle('delete_user_local_qualification'))
        done()
        return reply
      },
      schema: {
        body: PutUserLocalQualSchema,
        response: {
          201: { message: QualificationMessage, qualification: PutUserLocalQualSchema },
          504: QualificationMessage,
        },
      },
    },
    async (req, rep) => {
      const userID = UserID(req.body.userID)
      const localQualID = LocalQualID(req.body.localQualID)

      const deleteQual: UserLocalQualifications | undefined = await deleteUserLocalQualification(
        userID,
        localQualID,
      )
      if (deleteQual != null) {
        return rep.status(201).send({
          message: 'Qualification deleted successfully',
          qualification: deleteQual,
        })
      } else {
        return rep.status(504).send({
          message: 'Fail to delete qualification',
        })
      }
    },
  )

  fastify.delete<{
    Body: PutUserGlobalQualSchemaType
    Reply:
      | { message: QualificationMessageType; qualification: PutUserGlobalQualSchemaType }
      | { message: QualificationMessageType }
  }>(
    '/global-qual',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, PermissionTitle('delete_user_global_qualification'))
        done()
        return reply
      },
      schema: {
        body: PutUserGlobalQualSchema,
        response: {
          201: { message: QualificationMessage, qualification: PutUserGlobalQualSchema },
          504: QualificationMessage,
        },
      },
    },
    async (req, rep) => {
      const userID = UserID(req.body.userID)
      const globalQualID = GlobalQualID(req.body.globalQualID)

      const deleteQual: UserGlobalQualifications | undefined = await deleteUserGlobalQualification(
        userID,
        globalQualID,
      )
      if (deleteQual != null) {
        return rep.status(201).send({
          message: 'Qualification delete/updated successfully',
          qualification: deleteQual,
        })
      } else {
        return rep.status(504).send({
          message: 'Fail to delete global qualification',
        })
      }
    },
  )
}
