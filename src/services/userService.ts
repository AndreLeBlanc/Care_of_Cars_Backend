import { desc, or, sql, and, eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

import { db } from '../config/db-connect.js'
import { roles, users } from '../schema/schema.js'
import { ilike } from 'drizzle-orm'
import { PatchUserSchemaType } from '../routes/users/userSchema.js'
import { RoleID, RoleIDName } from './roleService.js'

export type UserID = number
type UserPassword = string
type UserFirstName = string
type UserLastName = string
type UserEmail = string

type UserName = {
  firstName: UserFirstName
  lastName: UserLastName
  email: UserEmail
}

type UserDates = {
  createdAt: Date
  updatedAt: Date
}

type CreatedUserRole = { roleId: RoleID }

export type IsSuperAdmin = {
  isSuperAdmin: boolean | null
}

export type UserInfo = UserName & UserDates

export type UserWithSuperAdmin = IsSuperAdmin & UserInfo

export type CreatedUser = UserInfo & CreatedUserRole

export type VerifyUser = { userId: UserID } & UserName & {
    password: UserPassword
  } & IsSuperAdmin & { role: RoleIDName }

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
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: passwordHash,
      roleId: roleId,
      isSuperAdmin: isSuperAdmin,
    })
    .returning({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      roleId: users.roleId,
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

  const usersList = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
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
    .orderBy(desc(users.id))
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
      userId: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      password: users.password,
      isSuperAdmin: users.isSuperAdmin,
      role: {
        id: roles.id,
        roleName: roles.roleName,
      },
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .where(
      and(
        eq(users.email, email),
        //eq(users.password, password)
      ),
    )
  return results[0] ? results[0] : undefined
}

export async function getUserById(id: number): Promise<UserInfo | undefined> {
  const results: UserInfo[] | undefined = await db.select().from(users).where(eq(users.id, id))
  return results[0] ? results[0] : undefined
}

export async function updateUserById(id: number, user: PatchUserSchemaType): Promise<UserInfo> {
  const userWithUpdatedAt = { ...user, updatedAt: new Date() }
  const updatedUser: UserInfo[] = await db
    .update(users)
    .set(userWithUpdatedAt)
    .where(eq(users.id, id))
    .returning({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
  return updatedUser[0]
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
  const deletedUser: UserWithSuperAdmin[] | undefined = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning()
  return deletedUser[0] ? deletedUser[0] : undefined
}
