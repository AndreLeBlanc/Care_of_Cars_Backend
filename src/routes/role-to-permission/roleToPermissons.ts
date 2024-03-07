import { FastifyPluginAsync } from "fastify"
import { createRoleToPermissions, deleteRoleToPermissions } from "../../services/roleToPermissionService";
import { CreateRoleToPermissionSchema, CreateRoleToPermissionSchemaType, DeleteRoleToPermissionSchema, DeleteRoleToPermissionType } from "./roleToPermissionSchema";

const roleToPermissions: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
 
  fastify.post<{ Body: CreateRoleToPermissionSchemaType, Reply: object }>(
    '/',
    {
      onRequest: [fastify.authenticate],
      schema: {
      body: CreateRoleToPermissionSchema,
        response: {
        },
      }
    },
     async (request, reply) => {
      const { roleId, permissionId } = request.body;
      const roleToPermissions = await createRoleToPermissions(roleId, permissionId);
      reply.status(201).send({message: "Role to Permission created", data: roleToPermissions});
  })
  fastify.delete<{Params: DeleteRoleToPermissionType }>(
    '/:roleId/:permissionId',
    {
      onRequest: [fastify.authenticate],
      schema: {
        params: DeleteRoleToPermissionSchema
      }
    },
     async (request, reply) => {
      const {roleId, permissionId}  = request.params;
      const deletedRoleToPermissions = await deleteRoleToPermissions(roleId, permissionId);
      if(deletedRoleToPermissions == null) {
        return reply.status(404).send({message: "Invalid role id or permission id"})
      }
      return reply.status(200).send({message: "Role to permissions deleted"});
      
  })
}

export default roleToPermissions;

