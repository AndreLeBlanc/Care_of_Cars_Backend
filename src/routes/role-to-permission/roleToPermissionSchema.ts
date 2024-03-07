import { Static, Type } from "@sinclair/typebox";

export const CreateRoleToPermissionSchema = Type.Object({
    roleId: Type.Integer(),
    permissionId: Type.Integer(),
})
export type CreateRoleToPermissionSchemaType = Static<typeof CreateRoleToPermissionSchema>

export const DeleteRoleToPermissionSchema = Type.Object({
    roleId: Type.Integer(),
    permissionId: Type.Integer(),
})
export type DeleteRoleToPermissionType = Static<typeof DeleteRoleToPermissionSchema>