import { FastifyInstance } from 'fastify'
import {
  CreateRoleToPermissionSchema,
  CreateRoleToPermissionSchemaType,
  DeleteRoleToPermissionSchema,
  DeleteRoleToPermissionType,
} from './roleToPermissionSchema.js'
import {
  createRoleToPermissions,
  deleteRoleToPermissions,
  RoleToPermissions,
} from '../../services/roleToPermissionService.js'
import { PermissionTitle } from '../../services/permissionService.js'

export async function roleToPermissions(fastify: FastifyInstance): Promise<void> {
  fastify.post<{ Body: CreateRoleToPermissionSchemaType; Reply: object }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = 'create_role_to_permission'
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
      const { roleId, permissionId } = request.body
      const roleToPermissions: RoleToPermissions = await createRoleToPermissions(
        roleId,
        permissionId,
      )
      reply.status(201).send({ message: 'Role to Permission created', data: roleToPermissions })
    },
  )
  fastify.delete<{ Params: DeleteRoleToPermissionType }>(
    '/:roleId/:permissionId',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = 'delete_role_to_permission'
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
      const { roleId, permissionId } = request.params
      const deletedRoleToPermissions: RoleToPermissions | undefined = await deleteRoleToPermissions(
        roleId,
        permissionId,
      )
      if (deletedRoleToPermissions === undefined || deletedRoleToPermissions === null) {
        return reply.status(404).send({ message: 'Invalid role id or permission id' })
      }
      return reply.status(200).send({ message: 'Role to permissions deleted' })
    },
  )
}

export default roleToPermissions
