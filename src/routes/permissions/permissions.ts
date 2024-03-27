import { FastifyInstance } from 'fastify'

import {
  createPermission,
  getPermissionsPaginate,
  getPermissionById,
  updatePermissionById,
  deletePermission,
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
        const permissionName = 'list_permission'
        const authrosieStatus = await fastify.authorize(request, reply, permissionName)
        if (!authrosieStatus) {
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
      const offset = fastify.findOffset(limit, page)
      const result = await getPermissionsPaginate(search, limit, page, offset)
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
        const permissionName = 'create_permission'
        const authrosieStatus = await fastify.authorize(request, reply, permissionName)
        if (!authrosieStatus) {
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
      const Permission = await createPermission(PermissionName, description)
      reply.status(201).send({ message: 'Permission created', data: Permission })
    },
  )
  fastify.get<{ Params: getPermissionByIdType }>(
    '/:id',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = 'view_permission'
        const authrosieStatus = await fastify.authorize(request, reply, permissionName)
        if (!authrosieStatus) {
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
      const id = request.params.id
      const Permission = await getPermissionById(id)
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
        const permissionName = 'update_permission'
        const authrosieStatus = await fastify.authorize(request, reply, permissionName)
        if (!authrosieStatus) {
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
      const id = request.params.id

      const Permission = await updatePermissionById(id, PermissionData)
      if (Permission.length == 0) {
        return reply.status(404).send({ message: 'Permission not found' })
      }
      reply.status(201).send({ message: 'Permission Updated', data: Permission })
    },
  )
  fastify.delete<{ Params: getPermissionByIdType }>(
    '/:id',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = 'delete_permission'
        const authrosieStatus = await fastify.authorize(request, reply, permissionName)
        if (!authrosieStatus) {
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
      const id = request.params.id
      const deletedPermission = await deletePermission(id)
      if (deletedPermission == null) {
        return reply.status(404).send({ message: "Permission doesn't exist!" })
      }
      return reply.status(200).send({ message: 'Permission deleted' })
    },
  )
}

export default permissions
