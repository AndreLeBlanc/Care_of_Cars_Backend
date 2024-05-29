import { FastifyInstance } from 'fastify'

import {
  CreateRoleToPermissionSchema,
  CreateRoleToPermissionSchemaType,
  DeleteRoleToPermissionSchema,
  DeleteRoleToPermissionType,
} from './roleToPermissionSchema.js'
import {
  RoleToPermissions,
  createRoleToPermissions,
  deleteRoleToPermissions,
} from '../../services/roleToPermissionService.js'

import { PermissionID, PermissionTitle, RoleID } from '../../schema/schema.js'

export async function roleToPermissions(fastify: FastifyInstance): Promise<void> {
  fastify.post<{ Body: CreateRoleToPermissionSchemaType; Reply: object }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('create_role_to_permission')
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
        body: CreateRoleToPermissionSchema,
        response: {},
      },
    },
    async (request, reply) => {
      const { roleID, permissionID } = request.body
      const roleToPermissions: RoleToPermissions = await createRoleToPermissions(
        RoleID(roleID),
        PermissionID(permissionID),
      )
      reply.status(201).send({ message: 'Role to Permission created', data: roleToPermissions })
    },
  )
  fastify.delete<{ Params: DeleteRoleToPermissionType }>(
    '/:roleID/:permissionID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_role_to_permission')
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
        params: DeleteRoleToPermissionSchema,
      },
    },
    async (request, reply) => {
      const { roleID, permissionID } = request.params
      const deletedRoleToPermissions: RoleToPermissions | undefined = await deleteRoleToPermissions(
        RoleID(roleID),
        PermissionID(permissionID),
      )
      if (deletedRoleToPermissions === undefined || deletedRoleToPermissions === null) {
        return reply.status(404).send({ message: 'Invalid role id or permission id' })
      }
      return reply.status(200).send({ message: 'Role to permissions deleted' })
    },
  )
}

export default roleToPermissions
