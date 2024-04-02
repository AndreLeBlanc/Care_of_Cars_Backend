import { FastifyInstance } from 'fastify'

import {
  createPermission,
  getPermissionsPaginate,
  getPermissionById,
  updatePermissionById,
  deletePermission,
  Permission,
  PermissionsPaginate,
  PermissionIDDescName,
  PermissionID,
  PermissionTitle,
} from '../../services/permissionService.js'
import {
  CreatePermissionSchema,
  CreatePermissionSchemaType,
  ListPermissionQueryParamSchema,
  ListPermissionQueryParamSchemaType,
  PatchPermissionSchema,
  PatchPermissionSchemaType,
  getPermissionByIdSchema,
  getPermissionByIdType,
} from './permissionSchema.js'

export async function permissions(fastify: FastifyInstance) {
  fastify.get<{ Querystring: ListPermissionQueryParamSchemaType }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = { permissionName: 'list_permission' }
        const authorizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        querystring: ListPermissionQueryParamSchema,
      },
    },
    async function (request, reply) {
      let { search = '', limit = 10, page = 1 } = request.query
      const offset: number = fastify.findOffset(limit, page)
      const result: PermissionsPaginate = await getPermissionsPaginate(search, limit, page, offset)
      let message: string = fastify.responseMessage('Permissions', result.data.length)
      let requestUrl: string | undefined = request.protocol + '://' + request.hostname + request.url
      const nextUrl: string | undefined = fastify.findNextPageUrl(
        requestUrl,
        result.totalPage,
        page,
      )
      const previousUrl: string | undefined = fastify.findPreviousPageUrl(
        requestUrl,
        result.totalPage,
        page,
      )

      return {
        message: message,
        totalItems: result.totalItems,
        nextUrl: nextUrl,
        previousUrl: previousUrl,
        totalPage: result.totalPage,
        page: page,
        limit: limit,
        data: result.data,
      }
    },
  )
  fastify.post<{ Body: CreatePermissionSchemaType; Reply: object }>(
    '/',

    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = { permissionName: 'create_permission' }
        const authorizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        body: CreatePermissionSchema,
        response: {},
      },
    },
    async (request, reply) => {
      const { PermissionName, description = '' } = request.body
      const Permission: PermissionIDDescName = await createPermission(
        { permissionName: PermissionName },
        { permissionDesc: description },
      )
      reply.status(201).send({ message: 'Permission created', data: Permission })
    },
  )
  fastify.get<{ Params: getPermissionByIdType }>(
    '/:id',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = { permissionName: 'view_permission' }
        const authroizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authroizeStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        params: getPermissionByIdSchema,
      },
    },
    async (request, reply) => {
      const id: PermissionID = { permissionID: request.params.id }
      const Permission: Permission | undefined = await getPermissionById(id)
      if (Permission == null || Permission === undefined) {
        return reply.status(404).send({ message: 'Permission not found' })
      }
      reply.status(200).send(Permission)
    },
  )
  fastify.patch<{ Body: PatchPermissionSchemaType; Reply: object; Params: getPermissionByIdType }>(
    '/:id',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = { permissionName: 'update_permission' }
        const authroizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authroizeStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        body: PatchPermissionSchema,
        params: getPermissionByIdSchema,
      },
    },
    async (request, reply) => {
      const PermissionData = request.body
      if (Object.keys(PermissionData).length == 0) {
        return reply.status(422).send({ message: 'Provide at least one column to update.' })
      }
      const id: PermissionID = { permissionID: request.params.id }

      const Permission: Permission = await updatePermissionById(id, PermissionData)
      if (Permission === undefined || Permission === null) {
        return reply.status(404).send({ message: 'Permission not found' })
      }
      reply.status(201).send({ message: 'Permission Updated', data: Permission })
    },
  )
  fastify.delete<{ Params: getPermissionByIdType }>(
    '/:id',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = { permissionName: 'delete_permission' }
        const authorize = await fastify.authorize(request, reply, permissionName)
        if (!authorize) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        params: getPermissionByIdSchema,
      },
    },
    async (request, reply) => {
      const id: PermissionID = { permissionID: request.params.id }
      const deletedPermission: Permission | undefined = await deletePermission(id)
      if (deletedPermission == null) {
        return reply.status(404).send({ message: "Permission doesn't exist!" })
      }
      return reply.status(200).send({ message: 'Permission deleted' })
    },
  )
}

export default permissions
