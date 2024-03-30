import { FastifyInstance } from 'fastify'
import {
  createRole,
  CreatedRole,
  getRolesPaginate,
  getRoleById,
  updateRoleById,
  deleteRole,
  getRoleWithPermissions,
  Role,
  RoleID,
} from '../../services/roleService.js'
import {
  CreateRoleSchema,
  CreateRoleSchemaType,
  ListRoleQueryParamSchema,
  ListRoleQueryParamSchemaType,
  PatchRoleSchema,
  PatchRoleSchemaType,
  getRoleByIdSchema,
  getRoleByIdType,
} from './roleSchema.js'
import { PermissionTitle } from '../../services/permissionService.js'

export async function roles(fastify: FastifyInstance): Promise<void> {
  fastify.get<{ Querystring: ListRoleQueryParamSchemaType }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = 'list_role'
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
      let { search = '', limit = 10, page = 1 } = request.query
      const offset: number = fastify.findOffset(limit, page)
      const result = await getRolesPaginate(search, limit, page, offset)
      let message: string = fastify.responseMessage('roles', result.data.length)
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
  fastify.post<{ Body: CreateRoleSchemaType; Reply: object }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = 'create_role'
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
        body: CreateRoleSchema,
        response: {},
      },
    },
    async (request, reply) => {
      const { roleName, description = '' } = request.body
      const role: CreatedRole = await createRole(roleName, description)
      reply.status(201).send({ message: 'Role created', data: role })
    },
  )
  fastify.get<{ Params: getRoleByIdType }>(
    '/:id',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = 'view_role'
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
        params: getRoleByIdSchema,
      },
    },
    async (request, reply) => {
      const roleId: RoleID = request.params.id
      const role: Role | undefined = await getRoleById(roleId)
      if (role == undefined || role == null) {
        return reply.status(404).send({ message: 'role not found' })
      }
      const rolePermissions = await getRoleWithPermissions(role.id)
      reply.status(200).send({ role: role, permissions: rolePermissions })
    },
  )
  fastify.patch<{
    Body: PatchRoleSchemaType
    Reply: object
    Params: getRoleByIdType
  }>(
    '/:id',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = 'update_role'
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
        body: PatchRoleSchema,
        params: getRoleByIdSchema,
      },
    },
    async (request, reply) => {
      const roleData = request.body
      if (Object.keys(roleData).length == 0) {
        return reply.status(422).send({ message: 'Provide at least one column to update.' })
      }
      const id: RoleID = request.params.id

      const role: Role = await updateRoleById(id, roleData)
      if (role == null) {
        return reply.status(404).send({ message: 'role not found' })
      }
      reply.status(201).send({ message: 'Role Updated', data: role })
    },
  )
  fastify.delete<{ Params: getRoleByIdType }>(
    '/:id',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = 'delete_role'
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
        params: getRoleByIdSchema,
      },
    },
    async (request, reply) => {
      const roleId: RoleID = request.params.id
      const deletedRole: Role | undefined = await deleteRole(roleId)
      if (deletedRole === undefined || deletedRole === null) {
        return reply.status(404).send({ message: "Role doesn't exist!" })
      }
      return reply.status(200).send({ message: 'Role deleted' })
    },
  )
}

export default roles
