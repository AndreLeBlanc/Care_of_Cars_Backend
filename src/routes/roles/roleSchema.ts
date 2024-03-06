import { Static, Type } from "@sinclair/typebox";

export const ListRoleQueryParamSchema = Type.Object({
    search: Type.Optional(Type.String()),
    limit: Type.Optional(Type.Integer( {minimum:1, default: 10} )),
    page: Type.Optional(Type.Integer( {minimum:1, default:1} ))
})
export type ListRoleQueryParamSchemaType = Static<typeof ListRoleQueryParamSchema>

export const CreateRoleSchema = Type.Object({
    roleName: Type.String(),
    description: Type.Optional(Type.String()),
})
export type CreateRoleSchemaType = Static<typeof CreateRoleSchema>

export const getRoleByIdSchema = Type.Object({
    id: Type.Number(),
})
export type getRoleByIdType = Static<typeof getRoleByIdSchema>