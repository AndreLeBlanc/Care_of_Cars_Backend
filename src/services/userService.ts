import { and, desc, eq, ilike, or, sql } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

import { db } from '../config/db-connect'

import { RoleID, RoleName, StoreID, roles, userBelongsToStore, users } from '../schema/schema'

import { Limit, Offset, Page, Search } from '../plugins/pagination'

import {
  IsSuperAdmin,
  UserEmail,
  UserFirstName,
  UserID,
  UserLastName,
  UserPassword,
} from '../schema/schema.js'

export type UserStore = {
  userID: UserID
  storeID: StoreID
}

export type UserInfo = {
  userID: UserID
  firstName: UserFirstName
  lastName: UserLastName
  email: UserEmail
  createdAt: Date
  updatedAt: Date
}

export type PatchUserInfo = {
  userID: UserID
  firstName: UserFirstName
  lastName: UserLastName
  email: UserEmail
}

export type userInfoPassword = UserInfo & {
  password: UserPassword
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
  totalUsers: number
  totalPage: number
  perPage: number
  data: UserInfo[]
}

export async function createUser(
  firstName: UserFirstName,
  lastName: UserLastName,
  email: UserEmail,
  passwordHash: UserPassword,
  roleID: RoleID,
  isSuperAdmin: IsSuperAdmin = IsSuperAdmin(false),
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
    .returning()
  return user
}

export async function getUsersPaginate(
  search: Search,
  limit = Limit(10),
  page = Page(1),
  offset = Offset(0),
): Promise<UsersPaginated> {
  const condition = or(
    ilike(users.firstName, '%' + search + '%'),
    ilike(users.lastName, '%' + search + '%'),
    ilike(users.email, '%' + search + '%'),
  )
  const { totalUsers, usersList } = await db.transaction(async (tx) => {
    const [totalUsers] = await tx
      .select({
        count: sql`count(*)`.mapWith(Number).as('count'),
      })
      .from(users)
      .where(condition)

    const usersList = await tx
      .select({
        userID: users.userID,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(or(condition))
      .orderBy(desc(users.userID))
      .limit(limit || 10)
      .offset(offset || 0)
    return { totalUsers: totalUsers, usersList: usersList }
  })
  const totalPage = Math.ceil(totalUsers.count / limit)

  return {
    totalUsers: totalUsers.count,
    totalPage,
    perPage: page,
    data: usersList,
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
}

export async function getUserByID(
  id: UserID,
  checkPassword?: boolean,
): Promise<UserInfo | undefined> {
  const [user] = await db
    .select({
      userID: users.userID,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      ...(checkPassword ? { password: users.password } : {}),
    })
    .from(users)
    .where(eq(users.userID, id))
  return user ?? undefined
}

export async function updateUserByID(user: PatchUserInfo): Promise<UserInfo> {
  const userWithUpdatedAt = { ...user, updatedAt: new Date() }
  const [updatedUser] = await db
    .update(users)
    .set(userWithUpdatedAt)
    .where(eq(users.userID, user.userID))
    .returning({
      userID: users.userID,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
  return updatedUser
}

export async function updateUserPasswordByID(
  id: UserID,
  password: UserPassword,
): Promise<UserInfo> {
  const userWithUpdatedAt = { password: password, updatedAt: new Date() }
  const [updatedUser] = await db
    .update(users)
    .set(userWithUpdatedAt)
    .where(eq(users.userID, id))
    .returning({
      userID: users.userID,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
  return updatedUser
}

export async function generatePasswordHash(password: UserPassword): Promise<UserPassword> {
  const salt = bcrypt.genSaltSync(10)
  return UserPassword(bcrypt.hashSync(password, salt))
}

export async function isStrongPassword(password: UserPassword): Promise<boolean> {
  // TODO: add more strict checking's
  return password.length >= 3
}

export async function DeleteUser(userID: UserID): Promise<UserWithSuperAdmin | undefined> {
  const [deletedUser] = await db.delete(users).where(eq(users.userID, userID)).returning({
    userID: users.userID,
    firstName: users.firstName,
    lastName: users.lastName,
    email: users.email,
    isSuperAdmin: users.isSuperAdmin,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
  })
  if (deletedUser.isSuperAdmin != null) {
    return deletedUser
  } else {
    return undefined
  }
}

export async function assignToStore(
  userID: UserID,
  storeID: StoreID,
): Promise<UserStore | undefined> {
  const [newUserForStore] = await db
    .insert(userBelongsToStore)
    .values({ userID: userID, storeID: storeID })
    .returning()
  return newUserForStore
    ? { storeID: StoreID(newUserForStore.storeID), userID: UserID(newUserForStore.userID) }
    : undefined
}

export async function deleteStoreUser(
  userID: UserID,
  storeID: StoreID,
): Promise<UserStore | undefined> {
  const [deletedUserForStore] = await db
    .delete(userBelongsToStore)
    .where(and(eq(userBelongsToStore.storeID, storeID), eq(userBelongsToStore.userID, userID)))
    .returning()
  return deletedUserForStore
    ? { storeID: StoreID(deletedUserForStore.storeID), userID: UserID(deletedUserForStore.userID) }
    : undefined
}

export async function selectStoreUsers(storeID: StoreID): Promise<UserID[] | undefined> {
  const usersForStore = await db
    .select({ userID: userBelongsToStore.userID })
    .from(userBelongsToStore)
    .where(eq(userBelongsToStore.storeID, storeID))

  const brandedUsersForStore: UserID[] = usersForStore.map((user) => UserID(user.userID))
  return usersForStore ? brandedUsersForStore : undefined
}
