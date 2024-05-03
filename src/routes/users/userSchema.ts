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
  roleID: Type.Integer(),
})
export const CreateUserReply = Type.Object({
  // id: Type.Number(),
  firstName: Type.String(),
  lastName: Type.String(),
  email: Type.String({ format: 'email' }),
})

export const ListUserQueryParam = Type.Object({
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Integer({ minimum: 1, default: 10 })),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
})

export const LoginUser = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String(),
})
export type LoginUserType = Static<typeof LoginUser>

/**
 * This is a common schema used by get(/:id), patch(/:id), delete(/:id)
 * If this is modified both will be affected
 */
export const getUserByIDSchema = Type.Object({
  id: Type.Number(),
})
export type getUserByIDType = Static<typeof getUserByIDSchema>

export const PatchUserSchema = Type.Object({
  firstName: Type.Optional(Type.String()),
  lastName: Type.Optional(Type.String()),
  email: Type.Optional(Type.String({ format: 'email' })),
  password: Type.Optional(Type.String()),
})

export const PatchUserPassword = Type.Object({
  oldPassword: Type.String(),
  newPassword: Type.String(),
  userId: Type.Number(),
})
export type PatchUserPasswordType = Static<typeof PatchUserPassword>

export type PatchUserSchemaType = Static<typeof PatchUserSchema>

export type ListUserQueryParamType = Static<typeof ListUserQueryParam>
export type CreateUserType = Static<typeof CreateUser>
export type CreateUserReplyType = Static<typeof CreateUserReply>
