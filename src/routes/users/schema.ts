import { Static, Type } from '@sinclair/typebox'

// enum RoleEnum {
//     Admin = "admin",
//     Customer = "customer",
// }
export const CreateUser = Type.Object({
  firstName: Type.String(),
  lastName: Type.String(),
  email: Type.String({ format: 'email' }),
  password: Type.String(),
  
})
export const CreateUserReply = Type.Object({
 // id: Type.Number(),
  firstName: Type.String(),
  lastName: Type.String(),
  email: Type.String({ format: 'email' }),
})

export const ListUserQueryParam = Type.Object({
    search: Type.Optional(Type.String()),
    limit: Type.Optional(Type.Integer( {minimum:1, default: 10} )),
    page: Type.Optional(Type.Integer( {minimum:1, default:1} ))
})
export type ListUserQueryParamType = Static<typeof ListUserQueryParam>
export type CreateUserType = Static<typeof CreateUser>
export type CreateUserReplyType = Static<typeof CreateUserReply>