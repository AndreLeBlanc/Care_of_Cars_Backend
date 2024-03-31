import { desc, or, sql, and, eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

import { db } from '../config/db-connect.js'
import { roles, users } from '../schema/schema.js'
import { ilike } from 'drizzle-orm'
import { PatchUserSchemaType } from '../routes/users/userSchema.js'
import { RoleID, RoleName } from './roleService.js'

export type UserID = { userID: number }
type UserPassword = { userPassword: string }
type UserFirstName = { userFirstName: string }
type UserLastName = { userLastName: string }
type UserEmail = { userEmail: string }

type UserDates = {
  createdAt: Date
  updatedAt: Date
}

export type IsSuperAdmin = {
  isSuperAdmin: boolean | null
}

export type UserInfo = UserFirstName & UserLastName & UserEmail & UserDates

export type UserWithSuperAdmin = IsSuperAdmin & UserInfo

export type CreatedUser = UserInfo & RoleID

type User = UserID & UserInfo

export type VerifyUser = UserID &
  UserFirstName &
  UserLastName &
  UserEmail &
  UserPassword &
  IsSuperAdmin & { role: RoleName & RoleID }

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
  roleId: RoleID,
  isSuperAdmin: boolean = false,
): Promise<CreatedUser> {
  const [user]: CreatedUser[] = await db
    .insert(users)
    .values({
      firstName: firstName.userFirstName,
      lastName: lastName.userLastName,
      email: email.userEmail,
      password: passwordHash,
      roleId: roleId.roleID,
      isSuperAdmin: isSuperAdmin,
    })
    .returning({
      userID: users.userID,
      userFirstName: users.firstName,
      userLastName: users.lastName,
      userEmail: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      roleID: users.roleId,
    })
  return user
}

export async function getUsersPaginate(
  search: string,
  limit = 10,
  page = 1,
  offset = 0,
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

  const usersList: User[] = await db
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
    .offset(offset || 0)
  const totalPage = Math.ceil(totalItems.count / limit)

  return {
    totalItems: totalItems.count,
    totalPage,
    perPage: page,
    data: usersList,
  }
}

export async function verifyUser(email: UserEmail): Promise<VerifyUser | undefined> {
  const results: VerifyUser[] | undefined = await db
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
    .innerJoin(roles, eq(users.roleId, roles.roleID))
    .where(
      and(
        eq(users.email, email.userEmail),
        //eq(users.password, password)
      ),
    )
  return results[0] ? results[0] : undefined
}

export async function getUserById(id: UserID): Promise<UserInfo | undefined> {
  const results: UserInfo[] | undefined = await db
    .select({
      userID: users.userID,
      userFirstName: users.firstName,
      userLastName: users.lastName,
      userEmail: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.userID, id.userID))
  return results[0] ? results[0] : undefined
}

export async function updateUserById(id: number, user: PatchUserSchemaType): Promise<UserInfo> {
  const userWithUpdatedAt = { ...user, updatedAt: new Date() }
  const updatedUser: UserInfo[] = await db
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
  return updatedUser[0]
}

export async function generatePasswordHash(password: UserPassword): Promise<string> {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password.userPassword, salt)
}

export async function isStrongPassword(password: UserPassword): Promise<boolean> {
  // TODO: add more strict checking's
  return password.userPassword.length >= 3
}

export async function DeleteUser(id: number): Promise<UserWithSuperAdmin | undefined> {
  const deletedUser: UserWithSuperAdmin[] | undefined = await db
    .delete(users)
    .where(eq(users.userID, id))
    .returning({
      userID: users.userID,
      userFirstName: users.firstName,
      userLastName: users.lastName,
      userEmail: users.email,
      isSuperAdmin: users.isSuperAdmin,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
  return deletedUser[0] ? deletedUser[0] : undefined
}
