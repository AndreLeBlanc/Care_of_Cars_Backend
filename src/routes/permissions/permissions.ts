import { FastifyInstance } from 'fastify'

import {
  createPermission,
  getPermissionsPaginate,
  getPermissionByID,
  updatePermissionByID,
  deletePermission,
  Permission,
  PermissionsPaginate,
  PermissionIDDescName,
  PermissionID,
  PermissionTitle,
  PermissionDescription,
} from '../../services/permissionService.js'
import {
  CreatePermissionSchema,
  CreatePermissionSchemaType,
  ListPermissionQueryParamSchema,
  ListPermissionQueryParamSchemaType,
  PatchPermissionSchema,
  PatchPermissionSchemaType,
  getPermissionByIDSchema,
  getPermissionByIDType,
} from './permissionSchema.js'
import { ResponseMessage, Offset, NextPageUrl, PreviousPageUrl } from '../../plugins/pagination.js'

export async function permissions(fastify: FastifyInstance) {
  fastify.get<{ Querystring: ListPermissionQueryParamSchemaType }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('list_permission')
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
    async function (request, _) {
      let { search = '', limit = 10, page = 1 } = request.query
      const offset: Offset = fastify.findOffset(limit, page)
      const result: PermissionsPaginate = await getPermissionsPaginate(search, limit, page, offset)
      let message: ResponseMessage = fastify.responseMessage('Permissions', result.data.length)
      let requestUrl: string | undefined = request.protocol + '://' + request.hostname + request.url
      const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
        requestUrl,
        result.totalPage,
        page,
      )
      const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
        requestUrl,
        result.totalPage,
        page,
      )

      return {
        message: message.responseMessage,
        totalItems: result.totalItems,
        nextUrl: nextUrl,
        previousUrl: previousUrl?.previousPageUrl,
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
        const permissionName: PermissionTitle = PermissionTitle('create_permission')
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
        PermissionTitle(PermissionName),
        PermissionDescription(description),
      )
      reply.status(201).send({ message: 'Permission created', data: Permission })
    },
  )
  fastify.get<{ Params: getPermissionByIDType }>(
    '/:id',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('view_permission')
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
        params: getPermissionByIDSchema,
      },
    },
    async (request, reply) => {
      const id: PermissionID = PermissionID(request.params.id)
      const Permission: Permission | undefined = await getPermissionByID(id)
      if (Permission == null || Permission === undefined) {
        return reply.status(404).send({ message: 'Permission not found' })
      }
      reply.status(200).send(Permission)
    },
  )
  fastify.patch<{ Body: PatchPermissionSchemaType; Reply: object; Params: getPermissionByIDType }>(
    '/:id',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('update_permission')
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
        params: getPermissionByIDSchema,
      },
    },
    async (request, reply) => {
      const PermissionData = request.body
      if (Object.keys(PermissionData).length == 0) {
        return reply.status(422).send({ message: 'Provide at least one column to update.' })
      }
      const id: PermissionID = PermissionID(request.params.id)

      const Permission: Permission = await updatePermissionByID(id, PermissionData)
      if (Permission === undefined || Permission === null) {
        return reply.status(404).send({ message: 'Permission not found' })
      }
      reply.status(201).send({ message: 'Permission Updated', data: Permission })
    },
  )
  fastify.delete<{ Params: getPermissionByIDType }>(
    '/:id',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_permission')
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
        params: getPermissionByIDSchema,
      },
    },
    async (request, reply) => {
      const id: PermissionID = PermissionID(request.params.id)
      const deletedPermission: Permission | undefined = await deletePermission(id)
      if (deletedPermission == null) {
        return reply.status(404).send({ message: "Permission doesn't exist!" })
      }
      return reply.status(200).send({ message: 'Permission deleted' })
    },
  )
}

export default permissions
