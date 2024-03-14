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

export async function permissions(fastify: FastifyInstance): Promise<void> {
  fastify.get<{ Querystring: ListPermissionQueryParamSchemaType }>(
    '/permissions',
    {
      //   onRequest: [fastify.authenticate],
      schema: {
        querystring: ListPermissionQueryParamSchema,
      },
    },
    async function (request, reply) {
      let { search = '', limit = 10, page = 1 } = request.query
      const offset = fastify.findOffset(limit, page)
      const result = await getPermissionsPaginate(search, limit, page, offset)
      let message: string = fastify.responseMessage('Permissions', result.data.length)
      let requestUrl: string | null = request.protocol + '://' + request.hostname + request.url
      const nextUrl: string | null = fastify.findNextPageUrl(requestUrl, result.totalPage, page)
      const previousUrl: string | null = fastify.findPreviousPageUrl(
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
    '/createPermission',
    {
      //      onRequest: [fastify.authenticate],
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
    '/getperm:id',
    {
      //      onRequest: [fastify.authenticate],
      schema: {
        params: getPermissionByIdSchema,
      },
    },
    async (request, reply) => {
      const id = request.params.id
      const Permission = await getPermissionById(id)
      if (Permission == null) {
        return reply.status(404).send({ message: 'Permission not found' })
      }
      reply.status(200).send(Permission)
    },
  )
  fastify.patch<{ Body: PatchPermissionSchemaType; Reply: object; Params: getPermissionByIdType }>(
    '/:id',
    {
      //      onRequest: [fastify.authenticate],
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
    '/permissions:id',
    {
      //      onRequest: [fastify.authenticate],
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
