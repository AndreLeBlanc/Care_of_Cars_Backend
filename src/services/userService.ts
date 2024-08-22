import { and, desc, eq, ilike, or, sql } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

import { db } from '../config/db-connect.js'

import {
  EmployeeActive,
  RoleID,
  RoleName,
  StoreID,
  roles,
  userBelongsToStore,
  users,
} from '../schema/schema.js'

import { Limit, Offset, Page, Search } from '../plugins/pagination.js'

import { Either, errorHandling, left, right } from '../utils/helper.js'

import { EmployeeStoreID, dineroDBReturn, isCheckedIn } from './employeeService.js'
import { StoreIDName } from './storeService.js'

import {
  EmployeeCheckIn,
  EmployeeCheckOut,
  EmployeeComment,
  EmployeeHourlyRate,
  EmployeeHourlyRateCurrency,
  EmployeeHourlyRateDinero,
  EmployeeID,
  EmployeePersonalNumber,
  EmployeePin,
  EmploymentNumber,
  IsSuperAdmin,
  ShortUserName,
  Signature,
  UserEmail,
  UserFirstName,
  UserID,
  UserLastName,
  UserPassword,
  employeeStore,
  employees,
  stores,
} from '../schema/schema.js'

export type UserStore = {
  userID: UserID
  storeID: StoreID
}

export type UserInfo = {
  userID: UserID
  firstName: UserFirstName
  roleID: RoleID
  lastName: UserLastName
  email: UserEmail
  isSuperAdmin: IsSuperAdmin
  createdAt: Date
  updatedAt: Date
}

export type PatchUserInfo = {
  userID: UserID
  firstName: UserFirstName
  lastName: UserLastName
  email: UserEmail
  roleID: RoleID
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

export type CreateUserEmployee = {
  firstName: UserFirstName
  lastName: UserLastName
  email: UserEmail
  passwordHash: UserPassword
  roleID: RoleID
  isSuperAdmin: IsSuperAdmin
  shortUserName: ShortUserName
  employmentNumber: EmploymentNumber
  employeePersonalNumber: EmployeePersonalNumber
  signature: Signature
  employeePin: EmployeePin
  employeeActive: EmployeeActive
  employeeComment?: EmployeeComment
  employeeHourlyRateCurrency?: EmployeeHourlyRateCurrency
  employeeHourlyRate?: EmployeeHourlyRate
}

export type CreatedUserEmployee = {
  user: CreatedUser
  employee: EmployeeStoreID
}

export type LoginEmployee = {
  password: UserPassword
  user: {
    userID: UserID
    firstName: UserFirstName
    lastName: UserLastName
    email: UserEmail
    isSuperAdmin: IsSuperAdmin
    roleID: RoleID
    roleName: RoleName
    employeeID?: EmployeeID
    shortUserName?: ShortUserName
    employmentNumber?: EmploymentNumber
    employeePersonalNumber?: EmployeePersonalNumber
    signature?: Signature
    employeeHourlyRate?: EmployeeHourlyRateDinero
    employeePin?: EmployeePin
    employeeActive?: EmployeeActive
    employeeComment?: EmployeeComment
    employeeCheckedIn?: EmployeeCheckIn
    employeeCheckedOut?: EmployeeCheckOut
    stores: StoreIDName[]
  }
}

export async function createUser(
  firstName: UserFirstName,
  lastName: UserLastName,
  email: UserEmail,
  passwordHash: UserPassword,
  roleID: RoleID,
  isSuperAdmin: IsSuperAdmin = IsSuperAdmin(false),
): Promise<Either<string, CreatedUser>> {
  try {
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
    return user ? right(user) : left('no user created')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function createUserEmployee(
  userEmp: CreateUserEmployee,
  stores: StoreID[],
): Promise<Either<string, CreatedUserEmployee>> {
  if (stores.length < 1) {
    return left('no store given')
  }
  try {
    const userEmployee = await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          firstName: userEmp.firstName,
          lastName: userEmp.lastName,
          email: userEmp.email,
          password: userEmp.passwordHash,
          roleID: userEmp.roleID,
          isSuperAdmin: userEmp.isSuperAdmin,
        })
        .returning()

      const [createdEmployee] = await tx
        .insert(employees)
        .values({
          userID: user.userID,
          shortUserName: userEmp.shortUserName,
          employmentNumber: userEmp.employmentNumber,
          employeePersonalNumber: userEmp.employeePersonalNumber,
          signature: userEmp.signature,
          employeePin: userEmp.employeePin,
          employeeActive: userEmp.employeeActive,
          employeeComment: userEmp.employeeComment,
          employeeHourlyRateCurrency: userEmp.employeeHourlyRateCurrency,
          employeeHourlyRate: userEmp.employeeHourlyRate,
        })
        .returning()

      const employeeIDStoreID = stores.map((store) => {
        return { storeID: store, employeeID: createdEmployee.employeeID }
      })

      const employeeStores = await tx
        .insert(employeeStore)
        .values(employeeIDStoreID)
        .onConflictDoNothing()
        .returning({ storeID: employeeStore.storeID })

      const createdEmployeeWithUndefined = {
        userID: createdEmployee.userID,
        employeeID: createdEmployee.employeeID,
        shortUserName: createdEmployee.shortUserName,
        employmentNumber: createdEmployee.employmentNumber,
        employeePersonalNumber: createdEmployee.employeePersonalNumber,
        signature: createdEmployee.signature,
        employeeHourlyRateDinero: dineroDBReturn(
          createdEmployee.employeeHourlyRate,
          createdEmployee.employeeHourlyRateCurrency,
        ),
        employeePin: createdEmployee.employeePin,
        employeeActive: createdEmployee.employeeActive,
        employeeComment: createdEmployee.employeeComment ?? undefined,
        createdAt: createdEmployee.createdAt,
        updatedAt: createdEmployee.updatedAt,
      }
      return {
        user: user,
        employee: {
          ...createdEmployeeWithUndefined,
          storeIDs: employeeStores.map((row) => row.storeID),
        },
      }
    })
    return userEmployee ? right(userEmployee) : left('no user created')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getUsersPaginate(
  search: Search,
  limit = Limit(10),
  page = Page(1),
  offset = Offset(0),
): Promise<Either<string, UsersPaginated>> {
  const condition = or(
    ilike(users.firstName, '%' + search + '%'),
    ilike(users.lastName, '%' + search + '%'),
    ilike(users.email, '%' + search + '%'),
  )
  try {
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
          roleID: users.roleID,
          isSuperAdmin: users.isSuperAdmin,
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

    return right({
      totalUsers: totalUsers.count,
      totalPage,
      perPage: page,
      data: usersList,
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function verifyUser(email: UserEmail): Promise<Either<string, VerifyUser>> {
  try {
    const [verifiedUser] = await db
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
      .limit(1)
    return verifiedUser ? right(verifiedUser) : left('Login failed, incorrect email or password')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function verifyEmployee(email: UserEmail): Promise<Either<string, LoginEmployee>> {
  try {
    const [verifiedUser] = await db
      .select({
        password: users.password,
        user: {
          userID: users.userID,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          isSuperAdmin: users.isSuperAdmin,
          roleID: roles.roleID,
          roleName: roles.roleName,
          employeeID: employees.employeeID,
          shortUserName: employees.shortUserName,
          employmentNumber: employees.employmentNumber,
          employeePersonalNumber: employees.employeePersonalNumber,
          signature: employees.signature,
          EmployeeActive: employees.employeeActive,
          employeeHourlyRate: employees.employeeHourlyRate,
          employeeHourlyRateCurrency: employees.employeeHourlyRateCurrency,
          employeeActive: employees.employeeActive,
          employeeComment: employees.employeeComment,
          employeeCheckedIn: employeeStore.employeeCheckedIn,
          employeeCheckedOut: employeeStore.employeeCheckedOut,
          stores: sql<
            StoreIDName[]
          >`json_agg(json_build_object('storeID', ${stores.storeID}, 'storeName', ${stores.storeName}))`.as(
            'tagname',
          ),
        },
      })
      .from(users)
      .where(and(eq(users.email, email)))
      .innerJoin(roles, eq(users.roleID, roles.roleID))
      .leftJoin(employees, eq(users.userID, employees.userID))
      .leftJoin(employeeStore, eq(employeeStore.employeeID, employees.employeeID))
      .leftJoin(stores, eq(stores.storeID, employeeStore.storeID))
      .groupBy(
        users.userID,
        roles.roleID,
        employees.employeeID,
        employeeStore.employeeCheckedIn,
        employeeStore.employeeCheckedOut,
      )

    return verifiedUser
      ? right({
          password: verifiedUser.password,
          user: {
            userID: verifiedUser.user.userID,
            firstName: verifiedUser.user.firstName,
            lastName: verifiedUser.user.lastName,
            email: verifiedUser.user.email,
            isSuperAdmin: verifiedUser.user.isSuperAdmin,
            roleID: verifiedUser.user.roleID,
            roleName: verifiedUser.user.roleName,
            employeeID: verifiedUser.user.employeeID ?? undefined,
            shortUserName: verifiedUser.user.shortUserName ?? undefined,
            employmentNumber: verifiedUser.user.employmentNumber ?? undefined,
            employeePersonalNumber: verifiedUser.user.employeePersonalNumber ?? undefined,
            signature: verifiedUser.user.signature ?? undefined,
            employeeHourlyRate: dineroDBReturn(
              verifiedUser.user.employeeHourlyRate,
              verifiedUser.user.employeeHourlyRateCurrency,
            ),
            employeeActive: verifiedUser.user.employeeActive ?? undefined,
            employeeCheckedIn: verifiedUser.user.employeeCheckedIn
              ? EmployeeCheckIn(verifiedUser.user.employeeCheckedIn.toISOString())
              : undefined,
            employeeCheckedOut: verifiedUser.user.employeeCheckedOut
              ? EmployeeCheckOut(verifiedUser.user.employeeCheckedOut?.toISOString())
              : undefined,
            employeeCheckinStatus: isCheckedIn(
              verifiedUser.user.employeeCheckedIn,
              verifiedUser.user.employeeCheckedOut,
            ),
            stores: verifiedUser.user.stores,
          },
        })
      : left('Login failed, incorrect email or password')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getUserByID(
  id: UserID,
  checkPassword?: boolean,
): Promise<Either<string, UserInfo>> {
  try {
    const [user] = await db
      .select({
        userID: users.userID,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        roleID: users.roleID,
        isSuperAdmin: users.isSuperAdmin,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        ...(checkPassword ? { password: users.password } : {}),
      })
      .from(users)
      .where(eq(users.userID, id))
    return user ? right(user) : left('user not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function updateUserByID(user: PatchUserInfo): Promise<Either<string, UserInfo>> {
  const userWithUpdatedAt = { ...user, updatedAt: new Date() }
  try {
    const [updatedUser] = await db
      .update(users)
      .set(userWithUpdatedAt)
      .where(eq(users.userID, user.userID))
      .returning({
        userID: users.userID,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        isSuperAdmin: users.isSuperAdmin,
        roleID: users.roleID,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
    return updatedUser ? right(updatedUser) : left('user not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function updateUserPasswordByID(
  id: UserID,
  password: UserPassword,
): Promise<Either<string, UserInfo>> {
  try {
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
        isSuperAdmin: users.isSuperAdmin,
        roleID: users.roleID,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
    return updatedUser ? right(updatedUser) : left('user not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function generatePasswordHash(password: UserPassword): Promise<UserPassword> {
  const salt = bcrypt.genSaltSync(10)
  return UserPassword(bcrypt.hashSync(password, salt))
}

export async function isStrongPassword(password: UserPassword): Promise<boolean> {
  // TODO: add more strict checking's
  return password.length >= 8
}

export async function DeleteUser(userID: UserID): Promise<Either<string, UserWithSuperAdmin>> {
  try {
    const [deletedUser] = await db.delete(users).where(eq(users.userID, userID)).returning({
      userID: users.userID,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      roleID: users.roleID,
      isSuperAdmin: users.isSuperAdmin,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    return deletedUser ? right(deletedUser) : left('user not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function assignToStore(
  userID: UserID,
  storeID: StoreID,
): Promise<Either<string, UserStore>> {
  try {
    const [newUserForStore] = await db
      .insert(userBelongsToStore)
      .values({ userID: userID, storeID: storeID })
      .returning()
    return newUserForStore
      ? right({ storeID: StoreID(newUserForStore.storeID), userID: UserID(newUserForStore.userID) })
      : left('store or user not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteStoreUser(
  userID: UserID,
  storeID: StoreID,
): Promise<Either<string, UserStore>> {
  try {
    const [deletedUserForStore] = await db
      .delete(userBelongsToStore)
      .where(and(eq(userBelongsToStore.storeID, storeID), eq(userBelongsToStore.userID, userID)))
      .returning()
    return deletedUserForStore
      ? right({
          storeID: StoreID(deletedUserForStore.storeID),
          userID: UserID(deletedUserForStore.userID),
        })
      : left('store or user not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function selectStoreUsers(storeID: StoreID): Promise<Either<string, UserID[]>> {
  try {
    const usersForStore = await db
      .select({ userID: userBelongsToStore.userID })
      .from(userBelongsToStore)
      .where(eq(userBelongsToStore.storeID, storeID))

    const brandedUsersForStore: UserID[] = usersForStore.map((user) => UserID(user.userID))
    return usersForStore ? right(brandedUsersForStore) : left('no users found')
  } catch (e) {
    return left(errorHandling(e))
  }
}
