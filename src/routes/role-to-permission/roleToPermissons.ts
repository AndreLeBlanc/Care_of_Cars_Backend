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

import { Either, match } from '../../utils/helper.js'

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
      const roleToPermissions: Either<string, RoleToPermissions> = await createRoleToPermissions(
        RoleID(roleID),
        PermissionID(permissionID),
      )
      match(
        roleToPermissions,
        (rolePerm: RoleToPermissions) => {
          reply.status(201).send({ message: 'Role to Permission created', data: rolePerm })
        },
        (err) => {
          return reply.status(504).send({ message: err })
        },
      )
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
      const deletedRoleToPermissions: Either<string, RoleToPermissions> =
        await deleteRoleToPermissions(RoleID(roleID), PermissionID(permissionID))
      match(
        deletedRoleToPermissions,
        (roleToPerm: RoleToPermissions) => {
          return reply.status(200).send({ message: 'Role to permissions deleted', ...roleToPerm })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )
}

export default roleToPermissions
