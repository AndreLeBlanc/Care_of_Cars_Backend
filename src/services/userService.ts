import { desc, or, sql, and, eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

import { db } from '../config/db-connect.js'
import { roles, users } from '../schema/schema.js'
import { ilike } from 'drizzle-orm'
import { PatchUserSchemaType } from '../routes/users/userSchema.js'
import { RoleID, RoleName } from './roleService.js'
import { Offset } from '../plugins/pagination.js'
import { Brand, make } from 'ts-brand'

export type UserID = Brand<number, 'userID'>
export const UserID = make<UserID>()
export type UserPassword = Brand<string, ' userPassword'>
export const UserPassword = make<UserPassword>()
export type UserFirstName = Brand<string, ' userFirstName'>
export const UserFirstName = make<UserFirstName>()
export type UserLastName = Brand<string, ' userLastName'>
export const UserLastName = make<UserLastName>()
export type UserEmail = Brand<string, ' userEmail'>
export const UserEmail = make<UserEmail>()

createdAt: Date
updatedAt: Date

type IsSuperAdmin = Brand<boolean | null, 'isSuperAdmin'>
const IsSuperAdmin = make<IsSuperAdmin>()

export type UserInfo = {
  userID: UserID
  userFirstName: UserFirstName
  userLastName: UserLastName
  userEmail: UserEmail
  createdAt: Date
  updatedAt: Date
}
export type UserWithSuperAdmin = { isSuperAdmin: IsSuperAdmin } & UserInfo

export type CreatedUser = UserInfo & { roleID: RoleID }

export type VerifyUser = {
  userID: UserID
  userFirstName: UserFirstName
  userLastName: UserLastName
  userEmail: UserEmail
  userPassword: UserPassword
  isSuperAdmin: IsSuperAdmin
  role: { roleID: RoleID; roleName: RoleName }
}

export type UsersPaginated = {
  totalItems: number
  totalPage: number
  perPage: number
  data: UserInfo[]
}

export async function createUser(
  firstName: UserFirstName,
  lastName: UserLastName,
  email: UserEmail,
  passwordHash: string,
  roleID: RoleID,
  isSuperAdmin: boolean = false,
): Promise<CreatedUser> {
  const [user] = await db
    .insert(users)
    .values({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: passwordHash,
      roleID: roleID,
      isSuperAdmin: isSuperAdmin,
    })
    .returning({
      userID: users.userID,
      userFirstName: users.firstName,
      userLastName: users.lastName,
      userEmail: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      roleID: users.roleID,
    })
  return {
    userID: UserID(user.userID),
    userFirstName: UserFirstName(user.userFirstName),
    userLastName: UserLastName(user.userLastName),
    userEmail: UserEmail(user.userEmail),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    roleID: RoleID(user.roleID),
  }
}

export async function getUsersPaginate(
  search: string,
  limit = 10,
  page = 1,
  offset: Offset = { offset: 0 },
): Promise<UsersPaginated> {
  const condition = or(
    ilike(users.firstName, '%' + search + '%'),
    ilike(users.lastName, '%' + search + '%'),
    ilike(users.email, '%' + search + '%'),
  )

  const [totalItems] = await db
    .select({
      count: sql`count(*)`.mapWith(Number).as('count'),
    })
    .from(users)
    .where(condition)

  const usersList = await db
    .select({
      userID: users.userID,
      userFirstName: users.firstName,
      userLastName: users.lastName,
      userEmail: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(
      or(
        ilike(users.firstName, '%' + search + '%'),
        ilike(users.lastName, '%' + search + '%'),
        ilike(users.email, '%' + search + '%'),
      ),
    )
    .orderBy(desc(users.userID))
    .limit(limit || 10)
    .offset(offset.offset || 0)
  const totalPage = Math.ceil(totalItems.count / limit)

  const brandedUserList = usersList.map((user) => {
    return {
      userID: UserID(user.userID),
      userFirstName: UserFirstName(user.userFirstName),
      userLastName: UserLastName(user.userLastName),
      userEmail: UserEmail(user.userEmail),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  })
  return {
    totalItems: totalItems.count,
    totalPage,
    perPage: page,
    data: brandedUserList,
  }
}

export async function verifyUser(email: UserEmail): Promise<VerifyUser | undefined> {
  const [results] = await db
    .select({
      userID: users.userID,
      userFirstName: users.firstName,
      userLastName: users.lastName,
      userEmail: users.email,
      userPassword: users.password,
      isSuperAdmin: users.isSuperAdmin,
      role: {
        roleID: roles.roleID,
        roleName: roles.roleName,
      },
    })
    .from(users)
    .innerJoin(roles, eq(users.roleID, roles.roleID))
    .where(and(eq(users.email, email)))
  return results
    ? {
        userID: UserID(results.userID),
        userFirstName: UserFirstName(results.userFirstName),
        userLastName: UserLastName(results.userLastName),
        userEmail: UserEmail(results.userEmail),
        userPassword: UserPassword(results.userPassword),
        isSuperAdmin: IsSuperAdmin(results.isSuperAdmin),
        role: {
          roleID: RoleID(results.role.roleID),
          roleName: RoleName(results.role.roleName),
        },
      }
    : undefined
}

export async function getUserByID(id: UserID): Promise<UserInfo | undefined> {
  const [user] = await db
    .select({
      userID: users.userID,
      userFirstName: users.firstName,
      userLastName: users.lastName,
      userEmail: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.userID, id))
  return user
    ? {
        userID: UserID(user.userID),
        userFirstName: UserFirstName(user.userFirstName),
        userLastName: UserLastName(user.userLastName),
        userEmail: UserEmail(user.userEmail),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    : undefined
}

export async function updateUserByID(id: UserID, user: PatchUserSchemaType): Promise<UserInfo> {
  const userWithUpdatedAt = { ...user, updatedAt: new Date() }
  const [updatedUser] = await db
    .update(users)
    .set(userWithUpdatedAt)
    .where(eq(users.userID, id))
    .returning({
      userID: users.userID,
      userFirstName: users.firstName,
      userLastName: users.lastName,
      userEmail: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
  return {
    userID: UserID(updatedUser.userID),
    userFirstName: UserFirstName(updatedUser.userFirstName),
    userLastName: UserLastName(updatedUser.userLastName),
    userEmail: UserEmail(updatedUser.userEmail),
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  }
}

export async function generatePasswordHash(password: UserPassword): Promise<string> {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

export async function isStrongPassword(password: UserPassword): Promise<boolean> {
  // TODO: add more strict checking's
  return password.length >= 3
}

export async function DeleteUser(id: number): Promise<UserWithSuperAdmin | undefined> {
  const [deletedUser] = await db.delete(users).where(eq(users.userID, id)).returning({
    userID: users.userID,
    userFirstName: users.firstName,
    userLastName: users.lastName,
    userEmail: users.email,
    isSuperAdmin: users.isSuperAdmin,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
  })
  return deletedUser
    ? {
        userID: UserID(deletedUser.userID),
        userFirstName: UserFirstName(deletedUser.userFirstName),
        userLastName: UserLastName(deletedUser.userLastName),
        userEmail: UserEmail(deletedUser.userEmail),
        isSuperAdmin: IsSuperAdmin(deletedUser.isSuperAdmin),
        createdAt: deletedUser.createdAt,
        updatedAt: deletedUser.updatedAt,
      }
    : undefined
}
