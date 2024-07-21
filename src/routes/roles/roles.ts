import { FastifyInstance } from 'fastify'

import {
  CreatedRole,
  PermissionStatus,
  Role,
  createRole,
  deleteRole,
  getAllPermissionStatus,
  getRoleByID,
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

import { Either, match } from '../../utils/helper.js'

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
    async function (request, reply) {
      const { search = '', limit = 10, page = 1 } = request.query
      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)
      const rolePaginated: Either<string, RolesPaginated> = await getRolesPaginate(
        brandedSearch,
        brandedLimit,
        brandedPage,
        offset,
      )
      match(
        rolePaginated,
        (roles: RolesPaginated) => {
          const message: ResponseMessage = fastify.responseMessage(
            ModelName('roles'),
            ResultCount(roles.data.length),
          )
          const requestUrl: RequestUrl = RequestUrl(
            request.protocol + '://' + request.hostname + request.url,
          )
          const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
            requestUrl,
            Page(roles.totalPage),
            Page(page),
          )
          const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
            requestUrl,
            Page(roles.totalPage),
            Page(page),
          )

          return {
            message: message,
            totalItems: roles.totalItems,
            nextUrl: nextUrl,
            previousUrl: previousUrl,
            totalPage: roles.totalPage,
            page: page,
            limit: limit,
            data: roles.data,
          }
        },
        (err) => {
          reply.status(504).send({ message: err })
        },
      )
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
      const role: Either<string, CreatedRole> = await createRole(
        RoleName(roleName),
        RoleDescription(description),
      )
      match(
        role,
        (fetchedRole) => {
          return reply.status(201).send({ message: 'Role created', data: fetchedRole })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
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
      const role: Either<string, Role> = await getRoleByID(roleID)
      match(
        role,
        (fetchedRole: Role) => {
          return reply.status(200).send({ message: 'Role:', role: fetchedRole })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
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
      const role: Either<string, Role> = await updateRoleByID({
        roleID: RoleID(request.params.roleID),
        roleDescription: request.body.description
          ? RoleDescription(request.body.description)
          : null,
        roleName: RoleName(request.body.roleName),
      })

      match(
        role,
        (rolePatch) => {
          return reply.status(201).send({ message: 'Role Updated', data: rolePatch })
        },

        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
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
      const deletedRole: Either<string, Role> = await deleteRole(roleID)
      match(
        deletedRole,
        (role) => {
          return reply.status(200).send({ message: 'Role deleted', ...role })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.get<{ Params: getRoleByIDType }>(
    '/roleWithPermissions/:roleID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_role_with_permissions')
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
      const role: Either<
        string,
        {
          role: Role
          allPermissionsWithStatus: PermissionStatus[]
        }
      > = await getAllPermissionStatus(roleID)
      match(
        role,
        (roleToPerm) => {
          reply.status(200).send({ message: 'Role with permissions', ...roleToPerm })
        },
        (err) => {
          reply.status(404).send({ message: err })
        },
      )
    },
  )
}

export default roles
