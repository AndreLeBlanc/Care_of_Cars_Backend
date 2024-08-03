import { Static, Type } from '@sinclair/typebox'

import {
  CreateEmployeeSchema,
  EmployeeHourlyRateCurrencySchema,
  EmployeeHourlyRateSchema,
  EmployeeNoUserSchema,
} from '../employees/employeesSchema.js'

import { EmployeeID, FirstName, LastName, UserID } from '../../utils/helper.js'

import { RoleID } from '../roles/roleSchema.js'
import { storeID } from '../stores/storesSchema.js'

const userEmail = Type.String({ format: 'email' })
const isSuperAdmin = Type.Boolean()

export const CreateUser = Type.Object({
  firstName: FirstName,
  lastName: LastName,
  email: userEmail,
  isSuperAdmin: isSuperAdmin,
  password: Type.String(),
  roleID: RoleID,
})

export const CreatedUser = Type.Object({
  userID: UserID,
  CreateUser,
})

export const CreateUserReply = Type.Object({
  firstName: FirstName,
  lastName: LastName,
  email: userEmail,
  userID: UserID,
  roleID: RoleID,
})

export const CreateUserEmployeeSchema = Type.Object({
  user: CreateUser,
  employee: Type.Composite([
    EmployeeNoUserSchema,
    Type.Object({
      storeID: Type.Array(storeID, { minItems: 1 }),
      employeeID: Type.Optional(EmployeeID),
      employeeHourlyRateCurrency: Type.Optional(EmployeeHourlyRateCurrencySchema),
      employeeHourlyRate: Type.Optional(EmployeeHourlyRateSchema),
    }),
  ]),
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
  userID: UserID,
})
export type GetUserByIDSchemaType = Static<typeof GetUserByIDSchema>

export const ListUserSchema = Type.Object({
  userIDs: Type.Array(UserID),
})
export type ListUserSchemaType = Static<typeof ListUserSchema>

export const PatchUserSchema = Type.Object({
  firstName: FirstName,
  lastName: LastName,
  email: userEmail,
  roleID: RoleID,
})

export const PatchUserPassword = Type.Object({
  oldPassword: Type.String(),
  newPassword: Type.String(),
  userId: UserID,
})

export type PatchUserPasswordType = Static<typeof PatchUserPassword>

export type PatchUserSchemaType = Static<typeof PatchUserSchema>

export type ListUserQueryParamType = Static<typeof ListUserQueryParam>
export type CreateUserType = Static<typeof CreateUser>
export type CreateUserEmployeeSchemaType = Static<typeof CreateUserEmployeeSchema>
export type CreateUserReplyType = Static<typeof CreateUserReply>

export const StoreUserSchema = Type.Object({
  userID: UserID,
  storeID: storeID,
})
export type StoreUserSchemaType = Static<typeof StoreUserSchema>

export const StoreUserResponseSchema = Type.Object({
  message: Type.String(),
})
export type StoreUserResponseSchemaType = Static<typeof StoreUserResponseSchema>

export const CreateUserEmpReplySchema = Type.Object({
  message: Type.String(),
  user: CreatedUser,
  employee: CreateEmployeeSchema,
})

export type CreateUserEmpReplySchemaType = Static<typeof CreateUserEmpReplySchema>
