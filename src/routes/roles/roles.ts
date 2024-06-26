import { FastifyInstance } from 'fastify'

import {
  CreatedRole,
  Role,
  createRole,
  deleteRole,
  getRoleByID,
  getRoleWithPermissions,
  getRolesPaginate,
  updateRoleByID,
} from '../../services/roleService.js'
import {
  ListRoleQueryParamSchema,
  ListRoleQueryParamSchemaType,
  RoleSchema,
  RoleSchemaType,
  getRoleByIDSchema,
  getRoleByIDType,
} from './roleSchema.js'
import { PermissionTitle, RoleDescription, RoleID, RoleName } from '../../schema/schema.js'
import { RolesPaginated } from '../../services/roleService.js'

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
export async function roles(fastify: FastifyInstance): Promise<void> {
  fastify.get<{ Querystring: ListRoleQueryParamSchemaType }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('list_role')
        const authorizeStatus = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        querystring: ListRoleQueryParamSchema,
      },
    },
    async function (request) {
      const { search = '', limit = 10, page = 1 } = request.query
      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)
      const rolePaginated: RolesPaginated = await getRolesPaginate(
        brandedSearch,
        brandedLimit,
        brandedPage,
        offset,
      )
      const message: ResponseMessage = fastify.responseMessage(
        ModelName('roles'),
        ResultCount(rolePaginated.data.length),
      )
      const requestUrl: RequestUrl = RequestUrl(
        request.protocol + '://' + request.hostname + request.url,
      )
      const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
        requestUrl,
        Page(rolePaginated.totalPage),
        Page(page),
      )
      const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
        requestUrl,
        Page(rolePaginated.totalPage),
        Page(page),
      )

      return {
        message: message,
        totalItems: rolePaginated.totalItems,
        nextUrl: nextUrl,
        previousUrl: previousUrl,
        totalPage: rolePaginated.totalPage,
        page: page,
        limit: limit,
        data: rolePaginated.data,
      }
    },
  )
  fastify.post<{ Body: RoleSchemaType; Reply: object }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('create_role')
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
        body: RoleSchema,
        response: {},
      },
    },
    async (request, reply) => {
      const { roleName, description = '' } = request.body
      const role: CreatedRole = await createRole(RoleName(roleName), RoleDescription(description))
      reply.status(201).send({ message: 'Role created', data: role })
    },
  )
  fastify.get<{ Params: getRoleByIDType }>(
    '/:roleID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('view_role')
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
        params: getRoleByIDSchema,
      },
    },
    async (request, reply) => {
      const roleID: RoleID = RoleID(request.params.roleID)
      const role: Role | undefined = await getRoleByID(roleID)
      if (role == undefined || role == null) {
        return reply.status(404).send({ message: 'role not found' })
      }
      const rolePermissions = await getRoleWithPermissions(roleID)
      reply.status(200).send({ role: role, permissions: rolePermissions })
    },
  )
  fastify.patch<{
    Body: RoleSchemaType
    Reply: object
    Params: getRoleByIDType
  }>(
    '/:roleID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('update_role')
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
        body: RoleSchema,
        params: getRoleByIDSchema,
      },
    },
    async (request, reply) => {
      if (Object.keys(request.body).length == 0) {
        return reply.status(422).send({ message: 'Provide at least one column to update.' })
      }
      const role: Role = await updateRoleByID({
        roleID: RoleID(request.params.roleID),
        roleDescription: request.body.description
          ? RoleDescription(request.body.description)
          : null,
        roleName: RoleName(request.body.roleName),
      })

      if (role == null) {
        return reply.status(404).send({ message: 'role not found' })
      }
      reply.status(201).send({ message: 'Role Updated', data: role })
    },
  )
  fastify.delete<{ Params: getRoleByIDType }>(
    '/:roleID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_role')
        const authorizeStatus = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        params: getRoleByIDSchema,
      },
    },
    async (request, reply) => {
      const roleID: RoleID = RoleID(request.params.roleID)
      const deletedRole: Role | undefined = await deleteRole(roleID)
      if (deletedRole === undefined || deletedRole === null) {
        return reply.status(404).send({ message: "Role doesn't exist!" })
      }
      return reply.status(200).send({ message: 'Role deleted' })
    },
  )
}

export default roles
