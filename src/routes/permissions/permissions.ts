import { FastifyInstance } from 'fastify'

import {
  Permission,
  PermissionDescription,
  PermissionID,
  PermissionIDDescName,
  PermissionTitle,
  PermissionsPaginate,
  createPermission,
  deletePermission,
  getPermissionByID,
  getPermissionsPaginate,
  updatePermissionByID,
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
    async function (request) {
      const { search = '', limit = 10, page = 1 } = request.query
      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)
      const result: PermissionsPaginate = await getPermissionsPaginate(
        brandedSearch,
        brandedLimit,
        brandedPage,
        offset,
      )
      const message: ResponseMessage = fastify.responseMessage(
        ModelName('Permissions'),
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
      const id: PermissionID = PermissionID(request.params.permissionID)
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
      const id: PermissionID = PermissionID(request.params.permissionID)

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
      const id: PermissionID = PermissionID(request.params.permissionID)
      const deletedPermission: Permission | undefined = await deletePermission(id)
      if (deletedPermission == null) {
        return reply.status(404).send({ message: "Permission doesn't exist!" })
      }
      return reply.status(200).send({ message: 'Permission deleted' })
    },
  )
}

export default permissions
