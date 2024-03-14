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
} from '../../services/roleToPermissionService.js'

export async function roleToPermissions(fastify: FastifyInstance): Promise<void> {
  fastify.post<{ Body: CreateRoleToPermissionSchemaType; Reply: object }>(
    '/createpermission',
    {
      //  onRequest: [fastify.authenticate],
      schema: {
        body: CreateRoleToPermissionSchema,
        response: {},
      },
    },
    async (request, reply) => {
      const { roleId, permissionId } = request.body
      const roleToPermissions = await createRoleToPermissions(roleId, permissionId)
      reply.status(201).send({ message: 'Role to Permission created', data: roleToPermissions })
    },
  )
  fastify.delete<{ Params: DeleteRoleToPermissionType }>(
    '/:roleId/:permissionId',
    {
      //  onRequest: [fastify.authenticate],
      schema: {
        params: DeleteRoleToPermissionSchema,
      },
    },
    async (request, reply) => {
      const { roleId, permissionId } = request.params
      const deletedRoleToPermissions = await deleteRoleToPermissions(roleId, permissionId)
      if (deletedRoleToPermissions == null) {
        return reply.status(404).send({ message: 'Invalid role id or permission id' })
      }
      return reply.status(200).send({ message: 'Role to permissions deleted' })
    },
  )
}

export default roleToPermissions
