import { Static, Type } from '@sinclair/typebox'

import { RoleID } from '../roles/roleSchema.js'
import { storeID } from '../stores/storesSchema.js'

const firstName = Type.String({ minLength: 3, maxLength: 128 })
const lastName = Type.String({ minLength: 3, maxLength: 128 })
const userEmail = Type.String({ format: 'email' })
export const userID = Type.Number()

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
export const GetUserByIDSchema = Type.Object({
  userID: userID,
})
export type GetUserByIDSchemaType = Static<typeof GetUserByIDSchema>

export const ListUserSchema = Type.Object({
  userIDs: Type.Array(userID),
})
export type ListUserSchemaType = Static<typeof ListUserSchema>

export const PatchUserSchema = Type.Object({
  firstName: firstName,
  lastName: lastName,
  email: userEmail,
})

export const PatchUserPassword = Type.Object({
  oldPassword: Type.String(),
  newPassword: Type.String(),
  userId: userID,
})
export type PatchUserPasswordType = Static<typeof PatchUserPassword>

export type PatchUserSchemaType = Static<typeof PatchUserSchema>

export type ListUserQueryParamType = Static<typeof ListUserQueryParam>
export type CreateUserType = Static<typeof CreateUser>
export type CreateUserReplyType = Static<typeof CreateUserReply>

export const StoreUserSchema = Type.Object({
  userID: userID,
  storeID: storeID,
})
export type StoreUserSchemaType = Static<typeof StoreUserSchema>

export const StoreUserResponseSchema = Type.Object({
  message: Type.String(),
})
export type StoreUserResponseSchemaType = Static<typeof StoreUserResponseSchema>
