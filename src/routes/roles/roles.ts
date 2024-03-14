import { FastifyInstance } from 'fastify'
import {
  createRole,
  getRolesPaginate,
  getRoleById,
  updateRoleById,
  deleteRole,
  getRoleWithPermissions,
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

export async function roles(fastify: FastifyInstance): Promise<void> {
  fastify.get<{ Querystring: ListRoleQueryParamSchemaType }>(
    '/roles',
    {
      onRequest: (request, reply) => fastify.authenticate(request, reply), // no bind
      schema: {
        querystring: ListRoleQueryParamSchema,
      },
    },
    async function (request, reply) {
      let { search = '', limit = 10, page = 1 } = request.query
      const offset = fastify.findOffset(limit, page)
      const result = await getRolesPaginate(search, limit, page, offset)
      let message: string = fastify.responseMessage('roles', result.data.length)
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
  fastify.post<{ Body: CreateRoleSchemaType; Reply: object }>(
    '/createRole',
    {
      //  onRequest: (request, reply) => fastify.authenticate(request, reply), // no bind
      schema: {
        body: CreateRoleSchema,
        response: {},
      },
    },
    async (request, reply) => {
      const { roleName, description = '' } = request.body
      const role = await createRole(roleName, description)
      reply.status(201).send({ message: 'Role created', data: role })
    },
  )
  fastify.get<{ Params: getRoleByIdType }>(
    '/roles:id',
    {
      onRequest: (request, reply) => fastify.authenticate(request, reply), // no bind
      schema: {
        params: getRoleByIdSchema,
      },
    },
    async (request, reply) => {
      const id = request.params.id
      const role = await getRoleById(id)
      if (role == null) {
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
    '/roles:id',
    {
      onRequest: (request, reply) => fastify.authenticate(request, reply), // no bind
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
      const id = request.params.id

      const role = await updateRoleById(id, roleData)
      if (role.length == 0) {
        return reply.status(404).send({ message: 'role not found' })
      }
      reply.status(201).send({ message: 'Role Updated', data: role })
    },
  )
  fastify.delete<{ Params: getRoleByIdType }>(
    '/roles:id',
    {
      // //onRequest: [fastify.authenticate],
      schema: {
        params: getRoleByIdSchema,
      },
    },
    async (request, reply) => {
      const id = request.params.id
      const deletedRole = await deleteRole(id)
      if (deletedRole == null) {
        return reply.status(404).send({ message: "Role doesn't exist!" })
      }
      return reply.status(200).send({ message: 'Role deleted' })
    },
  )
}

export default roles
