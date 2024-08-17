import { FastifyInstance } from 'fastify'

import {
  CreateQualificationsGlobalSchema,
  CreateQualificationsGlobalSchemaType,
  CreateQualificationsLocalSchema,
  CreateQualificationsLocalSchemaType,
  EmployeesQualsSchema,
  EmployeesQualsSchemaType,
  GlobalQualIDSchemaType,
  GlobalQualIDSchema,
  EmployeesQualsStatusSchemaType,
  DeleteGlobalQalsSchema,
  DeleteGlobalQalsSchemaType,
  ListQualsReplySchema,
  ListQualsSchema,
  ListQualsSchemaType,
  LocalQualIDSchema,
  LocalQualIDSchemaType,
  PutEmployeeGlobalQualSchema,
  PutEmployeeGlobalQualSchemaType,
  PutEmployeeLocalQualSchema,
  PutEmployeeLocalQualSchemaType,
  QualificationMessage,
  QualificationMessageType,
  DeleteLocalQalsSchemaType,
  DeleteLocalQalsSchema,
  QualificationsGlobalSchema,
  QualificationsGlobalSchemaType,
  QualificationsLocalSchema,
  QualificationsLocalSchemaType,
} from './qualificationsSchema.js'

import {
  CreateQualificationsGlobal,
  CreateQualificationsLocal,
  EmployeeGlobalQualifications,
  EmployeeLocalQualifications,
  EmployeeQualificationsGlobal,
  EmployeeQualificationsLocal,
  QualificationsGlobal,
  QualificationsListed,
  QualificationsLocal,
  QualsByEmployeeStatus,
  deleteEmployeeGlobalQualification,
  deleteEmployeeLocalQualification,
  deleteGlobalQuals,
  deleteLocalQuals,
  getEmployeeQualifications,
  getGlobalQual,
  getLocalQual,
  getQualifcations,
  getQualificationsStatusByEmployee,
  setEmployeeGlobalQualification,
  setEmployeeLocalQualification,
  updateGlobalQuals,
  updateLocalQuals,
} from '../../services/qualificationsService.js'

import {
  EmployeeID,
  GlobalQualID,
  GlobalQualName,
  LocalQualID,
  LocalQualName,
  PermissionTitle,
  StoreID,
} from '../../schema/schema.js'

import { Search } from '../../plugins/pagination.js'

import { Either, match } from '../../utils/helper.js'
import { EmployeeIDSchemaType } from '../employees/employeesSchema.js'

export const qualificationsRoute = async (fastify: FastifyInstance) => {
  fastify.put<{
    Body: CreateQualificationsLocalSchemaType
    Reply:
      | { message: QualificationMessageType; qualifications: QualificationsLocalSchemaType }
      | { message: QualificationMessageType }
  }>(
    '/local',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('put_local_qualification'))
        done()
        return reply
      },
      schema: {
        body: CreateQualificationsLocalSchema,
        response: {
          201: { QualificationMessage, qualifications: QualificationsLocalSchema },
          504: { message: QualificationMessage },
        },
      },
    },
    async (req, rep) => {
      const {} = req.body

      const qualifications: CreateQualificationsLocal[] = req.body.map((qual) => ({
        localQualID: qual.localQualID ? LocalQualID(qual.localQualID) : undefined,
        storeID: StoreID(qual.storeID),
        localQualName: LocalQualName(qual.localQualName),
      }))

      const putQual: Either<string, QualificationsLocal[]> = await updateLocalQuals(qualifications)
      match(
        putQual,
        (qual: QualificationsLocal[]) => {
          return rep.status(201).send({
            message: 'Qualification Created/updated successfully',
            qualifications: qual.map((q) => ({
              localQualID: q.qual.localQualID,
              localQualName: q.qual.localQualName,
              storeID: q.qual.storeID,
              createdAt: q.dates.createdAt.toISOString(),
              updatedAt: q.dates.updatedAt.toISOString(),
            })),
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
      | { message: QualificationMessageType; qualifications: QualificationsGlobalSchemaType }
      | { message: QualificationMessageType }
  }>(
    '/global',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('put_global_qualification'))
        done()
        return reply
      },
      schema: {
        body: CreateQualificationsGlobalSchema,
        response: {
          201: { message: QualificationMessage, qualifications: QualificationsGlobalSchema },
          504: { message: QualificationMessage },
        },
      },
    },

    async (req, rep) => {
      const qualification = req.body.map((qual) => ({
        globalQualID: qual.globalQualID ? GlobalQualID(qual.globalQualID) : undefined,
        globalQualName: GlobalQualName(qual.globalQualName),
      }))

      const putQual: Either<string, QualificationsGlobal[]> = await updateGlobalQuals(qualification)
      match(
        putQual,
        (putQual: QualificationsGlobal[]) => {
          return rep.status(201).send({
            message: 'Qualification Created/updated successfully',
            qualifications: putQual.map((q) => ({
              globalQualID: q.qual.globalQualID,
              globalQualName: q.qual.globalQualName,
              createdAt: q.dates.createdAt.toISOString(),
              updatedAt: q.dates.updatedAt.toISOString(),
            })),
          })
        },
        (err) => {
          return rep.status(504).send({ message: err })
        },
      )
    },
  )

  //Deleted local Qualification
  fastify.delete<{ Params: DeleteLocalQalsSchemaType }>(
    '/localqualifications/:localQualID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_local_qualification')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: DeleteLocalQalsSchema,
        response: {
          200: { QualificationMessage, qualifications: QualificationsLocalSchema },
          404: { message: QualificationMessage },
        },
      },
    },
    async (request, reply) => {
      const localQualIDs = request.params.map((qual) => LocalQualID(qual.localQualID))
      const deletedLocalQualification: Either<string, QualificationsLocal[]> =
        await deleteLocalQuals(localQualIDs)
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

  fastify.delete<{ Params: DeleteGlobalQalsSchemaType }>(
    '/globalQualifications/:globalQualID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_global_qualification')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: DeleteGlobalQalsSchema,
        response: {
          200: { QualificationMessage, qualification: QualificationsGlobalSchema },
          404: { message: QualificationMessage },
        },
      },
    },
    async (request, reply) => {
      const globalQualID: GlobalQualID[] = request.params.map((qual) =>
        GlobalQualID(qual.globalQualID),
      )
      const deletedGlobalQualification: Either<string, QualificationsGlobal[]> =
        await deleteGlobalQuals(globalQualID)
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
      const localQualID = request.params.localQualID
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
      const globalQualID = request.params.globalQualID
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

  fastify.get<{
    Params: EmployeeIDSchemaType
    Reply: EmployeesQualsSchemaType | { message: QualificationMessageType }
  }>(
    '/employee:employeeID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_employees_qualification')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: GlobalQualIDSchema,
        response: {
          200: EmployeesQualsSchema,
          404: { message: QualificationMessage },
        },
      },
    },
    async (request, reply) => {
      const employeeID = request.params.employeeID
      const employeesQuals: Either<
        string,
        { localQuals: EmployeeQualificationsLocal[]; globalQuals: EmployeeQualificationsGlobal[] }
      > = await getEmployeeQualifications(EmployeeID(employeeID))
      match(
        employeesQuals,

        (quals) => {
          return reply.status(200).send({ message: 'employees qualification fetched', ...quals })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Params: EmployeeIDSchemaType
    Reply: EmployeesQualsStatusSchemaType | { message: QualificationMessageType }
  }>(
    '/employeeStatus:employeeID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle(
          'get_employees_qualification_status',
        )
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: GlobalQualIDSchema,
        response: {
          200: EmployeesQualsSchema,
          404: { message: QualificationMessage },
        },
      },
    },
    async (request, reply) => {
      const employeeID = request.params.employeeID
      const employeesQuals: Either<string, QualsByEmployeeStatus> =
        await getQualificationsStatusByEmployee(EmployeeID(employeeID))
      match(
        employeesQuals,

        (quals) => {
          return reply
            .status(200)
            .send({ message: 'employees qualification statuses fetched', ...quals })
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
            message: `Permission denied, employee doesn't have permission ${permissionName}`,
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
      const { search = '', storeID, employeeID } = request.query
      const brandedSearch = Search(search)
      let result: Either<string, QualificationsListed>
      if (employeeID == null) {
        result = storeID
          ? await getQualifcations(brandedSearch, StoreID(storeID))
          : await getQualifcations(brandedSearch)
      } else {
        result = storeID
          ? await getQualifcations(brandedSearch, StoreID(storeID), EmployeeID(employeeID))
          : await getQualifcations(brandedSearch, undefined, EmployeeID(employeeID))
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
    Body: PutEmployeeLocalQualSchemaType
    Reply:
      | { message: QualificationMessageType; qualification: PutEmployeeLocalQualSchemaType }
      | { message: QualificationMessageType }
  }>(
    '/local-qual',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('put_employee_local_qualification'))
        done()
        return reply
      },
      schema: {
        body: PutEmployeeLocalQualSchema,
        response: {
          201: { message: QualificationMessage, qualification: PutEmployeeLocalQualSchema },
          504: { message: QualificationMessage },
        },
      },
    },
    async (req, rep) => {
      const quals = req.body.map((empQual) => ({
        employeeID: EmployeeID(empQual.employeeID),
        localQualID: LocalQualID(empQual.localQualID),
      }))

      const putQual: Either<string, EmployeeLocalQualifications[]> =
        await setEmployeeLocalQualification(quals)
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
    Body: PutEmployeeGlobalQualSchemaType
    Reply:
      | { message: QualificationMessageType; qualification: PutEmployeeGlobalQualSchemaType }
      | { message: QualificationMessageType }
  }>(
    '/global-qual',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('put_employee_global_qualification'))
        done()
        return reply
      },
      schema: {
        body: PutEmployeeGlobalQualSchema,
        response: {
          201: { message: QualificationMessage, qualification: PutEmployeeGlobalQualSchema },
          504: { message: QualificationMessage },
        },
      },
    },
    async (req, rep) => {
      const quals = req.body.map((empQual) => ({
        employeeID: EmployeeID(empQual.employeeID),
        globalQualID: GlobalQualID(empQual.globalQualID),
      }))

      const putQual: Either<string, EmployeeGlobalQualifications[]> =
        await setEmployeeGlobalQualification(quals)
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
    Body: PutEmployeeLocalQualSchemaType
    Reply:
      | { message: QualificationMessageType; qualification: PutEmployeeLocalQualSchemaType }
      | { message: QualificationMessageType }
  }>(
    '/local-qual',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('delete_employee_local_qualification'))
        done()
        return reply
      },
      schema: {
        body: PutEmployeeLocalQualSchema,
        response: {
          201: { message: QualificationMessage, qualification: PutEmployeeLocalQualSchema },
          504: { message: QualificationMessage },
        },
      },
    },
    async (req, rep) => {
      const quals = req.body.map((empQual) => ({
        employeeID: EmployeeID(empQual.employeeID),
        localQualID: LocalQualID(empQual.localQualID),
      }))
      const deleteQual: Either<string, EmployeeLocalQualifications[]> =
        await deleteEmployeeLocalQualification(quals)
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
    Body: PutEmployeeGlobalQualSchemaType
    Reply:
      | { message: QualificationMessageType; qualification: PutEmployeeGlobalQualSchemaType }
      | { message: QualificationMessageType }
  }>(
    '/global-qual',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('delete_employee_global_qualification'))
        done()
        return reply
      },
      schema: {
        body: PutEmployeeGlobalQualSchema,
        response: {
          201: { message: QualificationMessage, qualification: PutEmployeeGlobalQualSchema },
          504: { message: QualificationMessage },
        },
      },
    },
    async (req, rep) => {
      const quals = req.body.map((empQual) => ({
        employeeID: EmployeeID(empQual.employeeID),
        globalQualID: GlobalQualID(empQual.globalQualID),
      }))
      const deleteQual: Either<string, EmployeeGlobalQualifications[]> =
        await deleteEmployeeGlobalQualification(quals)
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
