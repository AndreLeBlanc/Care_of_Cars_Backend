import { Static, Type } from "@sinclair/typebox";

export const ListRoleQueryParam = Type.Object({
    search: Type.Optional(Type.String()),
    limit: Type.Optional(Type.Integer( {minimum:1, default: 10} )),
    page: Type.Optional(Type.Integer( {minimum:1, default:1} ))
})
export type ListRoleQueryParamType = Static<typeof ListRoleQueryParam>
