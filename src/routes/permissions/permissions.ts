import { FastifyInstance } from 'fastify'

import {
  Permission,
  PermissionIDDescName,
  PermissionsPaginate,
  createPermission,
  deletePermission,
  getPermissionByID,
  getPermissionsPaginate,
  updatePermissionByID,
} from '../../services/permissionService.js'

import { PermissionDescription, PermissionID, PermissionTitle } from '../../schema/schema.js'

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

import { Either, match } from '../../utils/helper.js'

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
    async function (request, res) {
      const { search = '', limit = 10, page = 1 } = request.query
      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)
      const permissionList: Either<string, PermissionsPaginate> = await getPermissionsPaginate(
        brandedSearch,
        brandedLimit,
        brandedPage,
        offset,
      )
      match(
        permissionList,
        (perms: PermissionsPaginate) => {
          const message: ResponseMessage = fastify.responseMessage(
            ModelName('Permissions'),
            ResultCount(perms.data.length),
          )
          const requestUrl: RequestUrl = RequestUrl(
            request.protocol + '://' + request.hostname + request.url,
          )
          const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
            requestUrl,
            Page(perms.totalPage),
            Page(page),
          )
          const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
            requestUrl,
            Page(perms.totalPage),
            Page(page),
          )

          return res.status(200).send({
            message: message,
            totalItems: perms.totalItems,
            nextUrl: nextUrl,
            previousUrl: previousUrl,
            totalPage: perms.totalPage,
            page: page,
            limit: limit,
            data: perms.data,
          })
        },
        (err) => {
          return res.status(404).send({ message: err })
        },
      )
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
      const { permissionTitle, description = '' } = request.body
      const permission: Either<string, PermissionIDDescName> = await createPermission(
        PermissionTitle(permissionTitle),
        PermissionDescription(description),
      )
      match(
        permission,
        (perm: PermissionIDDescName) => {
          return reply.status(201).send({ message: 'Permission created', data: perm })
        },
        (err) => {
          return reply.status(504).send({ message: err })
        },
      )
    },
  )

  fastify.get<{ Params: getPermissionByIDType }>(
    '/:permissionID',
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
      console.log('request: ', request)
      const id: PermissionID = PermissionID(request.params.permissionID)
      const permission: Either<string, Permission> = await getPermissionByID(id)
      match(
        permission,
        (perm: Permission) => {
          reply.status(200).send(perm)
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.patch<{ Body: PatchPermissionSchemaType; Reply: object; Params: getPermissionByIDType }>(
    '/:permissionID',
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

      const permission: Either<string, Permission> = await updatePermissionByID({
        permissionID: PermissionID(request.params.permissionID),
        permissionTitle: PermissionTitle(request.body.permissionTitle),
        description: request.body.description
          ? PermissionDescription(request.body.description)
          : undefined,
      })
      match(
        permission,
        (perm: Permission) => {
          reply.status(201).send(perm)
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.delete<{ Params: getPermissionByIDType }>(
    '/:permissionID',
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
      const deletedPermission: Either<string, Permission> = await deletePermission(id)
      match(
        deletedPermission,
        (perm: Permission) => {
          return reply.status(200).send({ message: 'Permission deleted', ...perm })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )
}

export default permissions
