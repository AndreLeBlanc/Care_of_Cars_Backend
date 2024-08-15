import { Static, Type } from '@sinclair/typebox'

import {
  EmployeeHourlyRateCurrencySchema,
  EmployeeHourlyRateSchema,
  EmployeeNoUserSchema,
  employeeCheckedIn,
  employeeCheckedOut,
  signature,
  employeeActive,
  shortUserName,
  employmentNumber,
  employeePersonalNumber,
  employeeCheckinStatus,
  CreatedEmployeeUserSchema,
} from '../employees/employeesSchema.js'

import { PermissionIDDescNameSchema } from '../permissions/permissionSchema.js'

import { EmployeeID, FirstName, LastName, UserID } from '../../utils/helper.js'

import { RoleID, RoleName, RoleReplySchema } from '../roles/roleSchema.js'
import { storeID, storeName } from '../stores/storesSchema.js'

const userEmail = Type.String()
const message = Type.String()
const isSuperAdmin = Type.Boolean()

export const MessageSchema = Type.Object({ message: message })

export type MessageSchemaType = Static<typeof MessageSchema>

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
  message: message,
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
  message: message,
})
export type StoreUserResponseSchemaType = Static<typeof StoreUserResponseSchema>

export const CreateUserEmpReplySchema = Type.Object({
  message: message,
  user: Type.Object({
    userID: UserID,
    firstName: FirstName,
    roleID: RoleID,
    lastName: LastName,
    email: userEmail,
    isSuperAdmin: isSuperAdmin,
    createdAt: Type.Any(),
    updatedAt: Type.Any(),
  }),
  employee: CreatedEmployeeUserSchema,
})

export type CreateUserEmpReplySchemaType = Static<typeof CreateUserEmpReplySchema>

export const LoginUserEmployeeSchema = Type.Object({
  message: message,
  token: Type.String(),
  loginSuccess: Type.Boolean(),
  userID: UserID,
  firstName: FirstName,
  lastName: LastName,
  email: userEmail,
  isSuperAdmin: isSuperAdmin,
  roleID: RoleID,
  roleName: RoleName,
  employeeID: Type.Optional(EmployeeID),
  shortUserName: Type.Optional(shortUserName),
  employmentNumber: Type.Optional(employmentNumber),
  employeePersonalNumber: Type.Optional(employeePersonalNumber),
  signature: Type.Optional(signature),
  employeeActive: Type.Optional(employeeActive),
  employeeHourlyRateCurrency: Type.Optional(EmployeeHourlyRateCurrencySchema),
  employeeHourlyRate: Type.Optional(EmployeeHourlyRateSchema),
  employeeCheckedIn: Type.Optional(employeeCheckedIn),
  employeeCheckedOut: Type.Optional(employeeCheckedOut),
  employeeCheckinStatus: Type.Optional(employeeCheckinStatus),
  role: Type.Object({
    role: RoleReplySchema,
    roleHasPermission: Type.Array(PermissionIDDescNameSchema),
  }),
  stores: Type.Array(Type.Object({ storeName: storeName, storeID: storeID })),
})

export type LoginUserEmployeeSchemaType = Static<typeof LoginUserEmployeeSchema>
