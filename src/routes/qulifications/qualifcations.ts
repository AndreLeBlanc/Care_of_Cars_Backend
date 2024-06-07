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
} from './qualificationsSchema.js'

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
} from '../../services/qualificationsService.js'

import {
  GlobalQualID,
  GlobalQualName,
  LocalQualID,
  LocalQualName,
  PermissionTitle,
  StoreID,
  UserID,
} from '../../schema/schema.js'

import { Search } from '../../plugins/pagination.js'

import { Either, match } from '../../utils/helper.js'

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
          504: { message: QualificationMessage },
        },
      },
    },
    async (req, rep) => {
      const {} = req.body

      const qualification: CreateQualificationsLocal = {
        storeID: StoreID(req.body.storeID),
        localQualName: LocalQualName(req.body.localQualName),
      }

      const putQual: Either<string, QualificationsLocal> = req.body.localQualID
        ? await updateLocalQuals(qualification, LocalQualID(req.body.localQualID))
        : await updateLocalQuals(qualification)
      match(
        putQual,
        (qual: QualificationsLocal) => {
          return rep.status(201).send({
            message: 'Qualification Created/updated successfully',
            qualification: {
              qual: qual.qual,
              dates: {
                createdAt: qual.dates.createdAt.toISOString(),
                updatedAt: qual.dates.updatedAt.toISOString(),
              },
            },
          })
        },
        (err) => {
          return rep.status(504).send({ message: err })
        },
      )
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
          504: { message: QualificationMessage },
        },
      },
    },
    async (req, rep) => {
      const {} = req.body

      const qualification: CreateQualificationsGlobal = {
        globalQualName: GlobalQualName(req.body.globalQualName),
      }

      const putQual: Either<string, QualificationsGlobal> = req.body.globalQualID
        ? await updateGlobalQuals(qualification, GlobalQualID(req.body.globalQualID))
        : await updateGlobalQuals(qualification)
      match(
        putQual,
        (putQual: QualificationsGlobal) => {
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
        },
        (err) => {
          return rep.status(504).send({ message: err })
        },
      )
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
          404: { message: QualificationMessage },
        },
      },
    },
    async (request, reply) => {
      const { localQualID } = request.params
      const deletedLocalQualification: Either<string, QualificationsLocal> = await deleteLocalQuals(
        LocalQualID(localQualID),
      )
      match(
        deletedLocalQualification,
        (deleted) => {
          return reply
            .status(200)
            .send({ message: 'Qualification deleted', qualification: deleted })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
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
          404: { message: QualificationMessage },
        },
      },
    },
    async (request, reply) => {
      const { globalQualID } = request.params
      const deletedGlobalQualification: Either<string, QualificationsGlobal> =
        await deleteGlobalQuals(GlobalQualID(globalQualID))
      match(
        deletedGlobalQualification,
        (deleted) =>
          reply.status(200).send({ message: 'Qualification deleted', qualification: deleted }),
        (err) => reply.status(404).send({ message: err }),
      )
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
          404: { message: QualificationMessage },
        },
      },
    },
    async (request, reply) => {
      const { localQualID } = request.params
      const localQual: Either<string, QualificationsLocal> = await getLocalQual(
        LocalQualID(localQualID),
      )

      console.log(localQual)
      match(
        localQual,
        (qual) => {
          return reply.status(200).send({ message: 'Qualification fetched', qualification: qual })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
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
          404: { message: QualificationMessage },
        },
      },
    },
    async (request, reply) => {
      const { globalQualID } = request.params
      const globalQual: Either<string, QualificationsGlobal> = await getGlobalQual(
        GlobalQualID(globalQualID),
      )
      match(
        globalQual,

        (qual) => {
          return reply.status(200).send({ message: 'Qualification fetched', qualification: qual })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
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
        response: { 200: ListQualsReplySchema, 404: { message: QualificationMessage } },
      },
    },
    async function (request, reply) {
      const { search = '', storeID, userID } = request.query
      const brandedSearch = Search(search)
      let result: Either<string, QualificationsListed>
      if (userID == null) {
        result = storeID
          ? await getQualifcations(brandedSearch, StoreID(storeID))
          : await getQualifcations(brandedSearch)
      } else {
        result = storeID
          ? await getQualifcations(brandedSearch, StoreID(storeID), UserID(userID))
          : await getQualifcations(brandedSearch, undefined, UserID(userID))
      }

      match(
        result,
        (res) => {
          return reply.status(200).send({
            message: 'qualifications',
            totalLocalQuals: res.totalLocalQuals,
            totalGlobalQuals: res.totalGlobalQuals,
            localQuals: res.localQuals,
            globalQuals: res.globalQuals,
          })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
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
          504: { message: QualificationMessage },
        },
      },
    },
    async (req, rep) => {
      const userID = UserID(req.body.userID)
      const localQualID = LocalQualID(req.body.localQualID)

      const putQual: Either<string, UserLocalQualifications> = await setUserLocalQualification(
        userID,
        localQualID,
      )
      match(
        putQual,
        (putQual) => {
          return rep.status(201).send({
            message: 'Qualification set/updated successfully',
            qualification: putQual,
          })
        },
        (err) => {
          return rep.status(504).send({
            message: err,
          })
        },
      )
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
          504: { message: QualificationMessage },
        },
      },
    },
    async (req, rep) => {
      const userID = UserID(req.body.userID)
      const globalQualID = GlobalQualID(req.body.globalQualID)

      const putQual: Either<string, UserGlobalQualifications> = await setUserGlobalQualification(
        userID,
        globalQualID,
      )
      match(
        putQual,
        (putQual) => {
          return rep.status(201).send({
            message: 'Qualification set/updated successfully',
            qualification: putQual,
          })
        },
        (err) => {
          return rep.status(504).send({
            message: err,
          })
        },
      )
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
          504: { message: QualificationMessage },
        },
      },
    },
    async (req, rep) => {
      const userID = UserID(req.body.userID)
      const localQualID = LocalQualID(req.body.localQualID)

      const deleteQual: Either<string, UserLocalQualifications> =
        await deleteUserLocalQualification(userID, localQualID)
      match(
        deleteQual,
        (deleteQual) => {
          return rep.status(201).send({
            message: 'Qualification deleted successfully',
            qualification: deleteQual,
          })
        },
        (err) => {
          return rep.status(504).send({
            message: err,
          })
        },
      )
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
          504: { message: QualificationMessage },
        },
      },
    },
    async (req, rep) => {
      const userID = UserID(req.body.userID)
      const globalQualID = GlobalQualID(req.body.globalQualID)

      const deleteQual: Either<string, UserGlobalQualifications> =
        await deleteUserGlobalQualification(userID, globalQualID)
      match(
        deleteQual,
        (deleteQual) => {
          return rep.status(201).send({
            message: 'Qualification delete/updated successfully',
            qualification: deleteQual,
          })
        },
        (err) => {
          return rep.status(504).send({
            message: err,
          })
        },
      )
    },
  )
}
