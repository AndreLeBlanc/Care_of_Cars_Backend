import { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'

import {
  CreateUser,
  CreateUserEmpReplySchema,
  CreateUserEmpReplySchemaType,
  CreateUserEmployeeSchemaType,
  CreateUserReply,
  CreateUserType,
  GetUserByIDSchema,
  GetUserByIDSchemaType,
  ListUserQueryParam,
  ListUserQueryParamType,
  ListUserSchema,
  ListUserSchemaType,
  LoginUser,
  LoginUserType,
  PatchUserPassword,
  PatchUserPasswordType,
  PatchUserSchema,
  PatchUserSchemaType,
  StoreUserResponseSchema,
  StoreUserResponseSchemaType,
  StoreUserSchema,
  StoreUserSchemaType,
} from './userSchema.js'

import { Either, match } from '../../utils/helper.js'

import {
  CreateUserEmployee,
  CreatedUser,
  CreatedUserEmployee,
  DeleteUser,
  UserInfo,
  UserStore,
  UserWithSuperAdmin,
  UsersPaginated,
  VerifyUser,
  assignToStore,
  createUser,
  createUserEmployee,
  deleteStoreUser,
  generatePasswordHash,
  getUserByID,
  getUsersPaginate,
  isStrongPassword,
  selectStoreUsers,
  updateUserByID,
  updateUserPasswordByID,
  userInfoPassword,
  verifyUser,
} from '../../services/userService.js'

import {
  EmployeeActive,
  EmployeeComment,
  EmployeeHourlyRate,
  EmployeeHourlyRateCurrency,
  EmployeePersonalNumber,
  EmployeePin,
  EmploymentNumber,
  IsSuperAdmin,
  PermissionTitle,
  RoleID,
  ShortUserName,
  Signature,
  StoreID,
  UserEmail,
  UserFirstName,
  UserID,
  UserLastName,
  UserPassword,
} from '../../schema/schema.js'

import { getAllPermissionStatus, getRoleWithPermissions } from '../../services/roleService.js'

import {
  Limit,
  ModelName,
  NextPageUrl,
  Offset,
  Page,
  PreviousPageUrl,
  RequestUrl,
  ResponseMessage,
  ResultCount,
  Search,
} from '../../plugins/pagination.js'
import { StoreIDSchema, StoreIDSchemaType } from '../stores/storesSchema.js'
import { Currency } from 'dinero.js'

export async function users(fastify: FastifyInstance) {
  fastify.get<{ Querystring: ListUserQueryParamType }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('list_user')
        if (!(await fastify.authorize(request, reply, permissionName))) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },

      schema: {
        querystring: ListUserQueryParam,
      },
    },
    async (request, res) => {
      const { search = '', limit = 10, page = 1 } = request.query
      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)
      const userList: Either<string, UsersPaginated> = await getUsersPaginate(
        brandedSearch,
        brandedLimit,
        brandedPage,
        offset,
      )

      match(
        userList,
        (users: UsersPaginated) => {
          const message: ResponseMessage = fastify.responseMessage(
            ModelName('users'),
            ResultCount(users.data.length),
          )
          const requestUrl: RequestUrl = RequestUrl(
            request.protocol + '://' + request.hostname + request.url,
          )
          const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
            requestUrl,
            Page(users.totalPage),
            Page(page),
          )
          const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
            requestUrl,
            Page(users.totalPage),
            Page(page),
          )

          return res.status(200).send({
            message: message,
            totalItems: users.totalUsers,
            nextUrl: nextUrl,
            previousUrl: previousUrl,
            totalPage: users.totalPage,
            page: page,
            limit: limit,
            data: users.data,
          })
        },
        (err) => {
          return res.status(504).send({ message: err })
        },
      )
    },
  )

  fastify.post<{ Body: CreateUserType; Reply: object }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('create_user'))
        done()
        return reply
      },

      schema: {
        body: CreateUser,
        response: {
          201: { body: CreateUserReply },
        },
      },
    },
    async (request, reply) => {
      const { firstName, lastName, email, password, roleID } = request.body
      const isStrongPass: boolean = await isStrongPassword(UserPassword(password))
      if (!isStrongPass) {
        return reply.status(422).send({ message: 'Provide a strong password' })
      }
      const passwordHash: string = await generatePasswordHash(UserPassword(password))
      const createdUser: Either<string, CreatedUser> = await createUser(
        UserFirstName(firstName),
        UserLastName(lastName),
        UserEmail(email),
        UserPassword(passwordHash),
        RoleID(roleID),
      )

      match(
        createdUser,
        (user: CreatedUser) => {
          return reply.status(201).send({
            message: 'User created',
            body: {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              userID: user.userID,
            },
          })
        },
        (error) => {
          return reply.status(500).send({ error: 'Promise rejected with error: ' + error })
        },
      )
    },
  )

  fastify.post<{
    Body: CreateUserEmployeeSchemaType
    Reply: CreateUserEmpReplySchemaType | StoreUserResponseSchemaType
  }>(
    '/employee',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('create_user'))
        fastify.authorize(request, reply, PermissionTitle('put_employee'))
        done()
        return reply
      },

      schema: {
        body: CreateUser,
        response: {
          201: { CreateUserEmpReplySchema },
          504: { StoreUserResponseSchema },
        },
      },
    },
    async (request, reply) => {
      const password = request.body.user.password
      const isStrongPass: boolean = await isStrongPassword(UserPassword(password))
      if (!isStrongPass) {
        return reply.status(422).send({ message: 'Provide a strong password' })
      }
      const passwordHash: string = await generatePasswordHash(UserPassword(password))

      const stores = request.body.employee.storeID.map((store) => StoreID(store))
      const userEmp: CreateUserEmployee = {
        firstName: UserFirstName(request.body.user.firstName),
        isSuperAdmin: IsSuperAdmin(false),
        lastName: UserLastName(request.body.user.lastName),
        email: UserEmail(request.body.user.email),
        passwordHash: UserPassword(passwordHash),
        roleID: RoleID(request.body.user.roleID),
        shortUserName: ShortUserName(request.body.employee.shortUserName),
        employmentNumber: EmploymentNumber(request.body.employee.employmentNumber),
        employeePersonalNumber: EmployeePersonalNumber(
          request.body.employee.employeePersonalNumber,
        ),
        signature: Signature(request.body.employee.signature),
        employeePin: EmployeePin(request.body.employee.employeePin),
        employeeActive: EmployeeActive(request.body.employee.employeeActive),
        employeeComment: EmployeeComment(request.body.employee.employeeComment),
        employeeHourlyRateCurrency: request.body.employee.employeeHourlyRateCurrency
          ? EmployeeHourlyRateCurrency(request.body.employee.employeeHourlyRateCurrency as Currency)
          : undefined,
        employeeHourlyRate: request.body.employee.employeeHourlyRate
          ? EmployeeHourlyRate(request.body.employee.employeeHourlyRate)
          : undefined,
      }
      const createdUser: Either<string, CreatedUserEmployee> = await createUserEmployee(
        userEmp,
        stores,
      )

      match(
        createdUser,
        (userEmployee: CreatedUserEmployee) => {
          return reply.status(201).send({
            message: 'User and employee created',
            ...userEmployee,
          })
        },
        (error) => {
          return reply.status(504).send({ message: 'Promise rejected with error: ' + error })
        },
      )
    },
  )

  fastify.post<{ Body: LoginUserType; Reply: object }>(
    '/login',
    {
      schema: {
        body: LoginUser,
      },
    },
    async (request, reply) => {
      const { email, password } = request.body
      const userWithPassword: Either<string, VerifyUser> = await verifyUser(UserEmail(email))

      return match(
        userWithPassword,
        async (user: VerifyUser) => {
          const match = await bcrypt.compare(password, user.userPassword)
          if (match) {
            const token = fastify.jwt.sign({ user })
            const rolePermissions = await getRoleWithPermissions(RoleID(user.role.roleID))
            const roleFullPermissions = await getAllPermissionStatus(RoleID(user.role.roleID))

            return reply.status(200).send({
              message: 'Login success',
              loginSuccess: true,
              token: token,
              user: {
                id: user.userID,
                firstName: user.userFirstName,
                lastName: user.userLastName,
                email: user.userEmail,
                isSuperAdmin: user.isSuperAdmin,
                role: {
                  id: user.role.roleID,
                  roleName: user.role.roleName,
                  rolePermissions: rolePermissions,
                  roleFullPermissions: roleFullPermissions,
                },
              },
            })
          } else {
            return reply.status(403).send({ message: 'Login failed, incorrect email or password' })
          }
        },
        (err) => {
          return reply.status(403).send({ message: err })
        },
      )
    },
  )

  fastify.get<{ Params: GetUserByIDSchemaType }>(
    '/:userID',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('view_user'))
        done()
        return reply
      },

      schema: {
        params: GetUserByIDSchema,
      },
    },
    async (request, reply) => {
      const id = UserID(request.params.userID)
      const user: Either<string, UserInfo> = await getUserByID(id)
      match(
        user,
        (userInfo: UserInfo) => {
          return reply.status(200).send(userInfo)
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.patch<{ Body: PatchUserSchemaType; Reply: object; Params: GetUserByIDSchemaType }>(
    '/:userID',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('update_user'))
        done()
        return reply
      },
      schema: {
        body: PatchUserSchema,
        params: GetUserByIDSchema,
      },
    },
    async (request, reply) => {
      const userData = request.body
      if (Object.keys(userData).length == 0) {
        return reply.status(422).send({ message: 'Provide at least one column to update.' })
      }
      const patchData = {
        firstName: UserFirstName(userData.firstName),
        lastName: UserLastName(userData.lastName),
        userID: UserID(request.params.userID),
        email: UserEmail(userData.email),
        roleID: RoleID(userData.roleID),
      }

      const user: Either<string, UserInfo> = await updateUserByID(patchData)
      match(
        user,
        (userInfo: UserInfo) => {
          return reply.status(200).send(userInfo)
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  //Update Password
  fastify.patch<{ Body: PatchUserPasswordType; Reply: object }>(
    '/update-password',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, PermissionTitle('update_user_password'))
        done()
        return reply
      },
      schema: {
        body: PatchUserPassword,
      },
    },
    async (request, reply) => {
      const userData = request.body
      const id = UserID(request.body.userId)
      const userDetails: Either<string, UserInfo> = await getUserByID(id, true)

      match(
        userDetails,
        async (user: UserInfo) => {
          const isPassword = await bcrypt.compare(
            request.body.oldPassword,
            (user as userInfoPassword).password,
          )
          if (isPassword) {
            if (userData?.newPassword) {
              const isStrongPass: boolean = await isStrongPassword(
                UserPassword(userData.newPassword),
              )
              if (!isStrongPass) {
                return reply.status(422).send({ message: 'Provide a strong password' })
              }
              const passwordHash = await generatePasswordHash(UserPassword(userData.newPassword))
              const user: Either<string, UserInfo> = await updateUserPasswordByID(id, passwordHash)
              match(
                user,
                (userInfo: UserInfo) => {
                  return reply.status(201).send({ message: 'User Updated', data: userInfo })
                },
                (err) => {
                  return reply.status(504).send({ message: err })
                },
              )
            }
          } else {
            return reply.status(400).send({ message: 'user password not matching' })
          }
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.delete<{ Params: GetUserByIDSchemaType }>(
    '/:userID',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('delete_user'))
        done()
        return reply
      },
      schema: {
        params: GetUserByIDSchema,
      },
    },
    async (request, reply) => {
      const id = UserID(request.params.userID)
      const user: Either<string, UserWithSuperAdmin> = await DeleteUser(id)
      match(
        user,
        (deletedUser: UserWithSuperAdmin) => {
          return reply.status(200).send({ message: 'user deleted', ...deletedUser })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.delete<{
    Params: StoreUserSchemaType
    Reply: (StoreUserResponseSchemaType & StoreUserSchemaType) | StoreUserResponseSchemaType
  }>(
    '/storeUser/:userID/:storeID',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('delete_user_from_store'))
        done()
        return reply
      },
      schema: {
        params: StoreUserSchema,
        response: { 200: { ...StoreUserResponseSchema, ...StoreUserSchema } },
      },
    },
    async (request, reply) => {
      const userID = UserID(request.params.userID)
      const storeID = StoreID(request.params.storeID)
      const user: Either<string, UserStore> = await deleteStoreUser(userID, storeID)
      match(
        user,
        (userStore: UserStore) => {
          return reply.status(200).send({ message: 'user deleted', ...userStore })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.post<{
    Params: StoreUserSchemaType
    Reply: (StoreUserResponseSchemaType & StoreUserSchemaType) | StoreUserResponseSchemaType
  }>(
    '/storeUser/:userID/:storeID',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('assign_user_to_store'))
        done()
        return reply
      },
      schema: {
        params: StoreUserSchema,
        response: { 200: { ...StoreUserResponseSchema, ...StoreUserSchema } },
      },
    },
    async (request, reply) => {
      const userID = UserID(request.params.userID)
      const storeID = StoreID(request.params.storeID)
      const user: Either<string, UserStore> = await assignToStore(userID, storeID)
      match(
        user,
        (userStore: UserStore) => {
          return reply.status(200).send({ message: 'user assigned', ...userStore })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Params: StoreIDSchemaType
    Reply: (StoreUserResponseSchemaType & ListUserSchemaType) | StoreUserResponseSchemaType
  }>(
    '/storeUser/:storeID',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('assign_user_to_store'))
        done()
        return reply
      },
      schema: {
        params: StoreIDSchema,
        response: { 200: { ...StoreUserResponseSchema, ...ListUserSchema } },
      },
    },
    async (request, reply) => {
      const storeID = StoreID(request.params.storeID)
      const users: Either<string, UserID[]> = await selectStoreUsers(storeID)
      match(
        users,
        (userIDs: UserID[]) => {
          return reply.status(200).send({ message: 'user assigned', userIDs: userIDs })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )
}

export default users
