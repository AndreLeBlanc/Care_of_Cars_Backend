import { Static, Type } from '@sinclair/typebox'

import { RoleID } from '../roles/roleSchema'

const firstName = Type.String({ minLength: 3, maxLength: 128 })
const lastName = Type.String({ minLength: 3, maxLength: 128 })
const userEmail = Type.String({ format: 'email' })
const userID = Type.Number()

export const CreateUser = Type.Object({
  firstName: firstName,
  lastName: lastName,
  email: userEmail,
  password: Type.String(),
  roleID: RoleID,
})
export const CreateUserReply = Type.Object({
  firstName: firstName,
  lastName: lastName,
  email: userEmail,
  userID: userID,
})

export const ListUserQueryParam = Type.Object({
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Integer({ minimum: 1, default: 10 })),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
})

export const LoginUser = Type.Object({
  email: userEmail,
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
  firstName: firstName,
  lastName: lastName,
  email: userEmail,
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
