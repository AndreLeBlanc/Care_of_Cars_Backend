import { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'

import {
  CreateUser,
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
import {
  CreatedUser,
  DeleteUser,
  UserEmail,
  UserFirstName,
  UserID,
  UserInfo,
  UserLastName,
  UserPassword,
  UserStore,
  UserWithSuperAdmin,
  UsersPaginated,
  VerifyUser,
  assignToStore,
  createUser,
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
import { RoleID } from '../../services/roleService.js'
import { StoreID } from '../../services/storeService.js'

import { PermissionTitle } from '../../services/permissionService.js'

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
import { StoreIDSchema, StoreIDSchemaType } from '../stores/storesSchema..js'

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
    async (request) => {
      const { search = '', limit = 10, page = 1 } = request.query
      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)
      const result: UsersPaginated = await getUsersPaginate(
        brandedSearch,
        brandedLimit,
        brandedPage,
        offset,
      )
      const message: ResponseMessage = fastify.responseMessage(
        ModelName('users'),
        ResultCount(result.data.length),
      )
      const requestUrl: RequestUrl = RequestUrl(
        request.protocol + '://' + request.hostname + request.url,
      )
      const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
        requestUrl,
        Page(result.totalPage),
        Page(page),
      )
      const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
        requestUrl,
        Page(result.totalPage),
        Page(page),
      )

      return {
        message: message,
        totalItems: result.totalUsers,
        nextUrl: nextUrl,
        previousUrl: previousUrl,
        totalPage: result.totalPage,
        page: page,
        limit: limit,
        data: result.data,
      }
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
      try {
        const createdUser: CreatedUser = await createUser(
          UserFirstName(firstName),
          UserLastName(lastName),
          UserEmail(email),
          UserPassword(passwordHash),
          RoleID(roleID),
        )
        return reply.status(201).send({
          message: 'User created',
          body: {
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            email: createdUser.email,
            userID: createdUser.userID,
          },
        })
      } catch (error) {
        return reply.status(500).send({ error: 'Promise rejected with error: ' + error })
      }
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
      const userWithPassword: VerifyUser | undefined = await verifyUser(UserEmail(email))
      if (userWithPassword == undefined || userWithPassword == null) {
        return reply.status(403).send({ message: 'Login failed, incorrect email or password' })
      }
      const match = await bcrypt.compare(password, userWithPassword.userPassword)
      if (match) {
        const { userPassword, ...user } = userWithPassword
        const token = fastify.jwt.sign({ user })
        const rolePermissions = await getRoleWithPermissions(RoleID(user.role.roleID))
        const roleFullPermissions = await getAllPermissionStatus(RoleID(user.role.roleID))
        return reply.status(200).send({
          message: 'Login success',
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
      }
      reply.status(403).send({ message: 'Login failed, incorrect email or password' })
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
      const user: UserInfo | undefined = await getUserByID(id)
      if (user == null) {
        return reply.status(404).send({ message: 'user not found' })
      }
      return reply.status(200).send(user)
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
      const id = UserID(request.params.userID)
      if (userData?.password) {
        const isStrongPass: boolean = await isStrongPassword(UserPassword(userData.password))
        if (!isStrongPass) {
          return reply.status(422).send({ message: 'Provide a strong password' })
        }
        userData.password = await generatePasswordHash(UserPassword(userData.password))
      }
      const patchData = {
        firstName: UserFirstName(userData.firstName),
        lastName: UserLastName(userData.lastName),
        userID: id,
        email: UserEmail(userData.email),
      }

      const user: UserInfo = await updateUserByID(id, patchData)
      if (user === undefined) {
        return reply.status(404).send({ message: 'user not found' })
      }
      reply.status(201).send({ message: 'User Updated', data: user })
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
      const userDetails = await getUserByID(id, true)

      if (userDetails !== undefined) {
        const isPassword = await bcrypt.compare(
          request.body.oldPassword,
          (userDetails as userInfoPassword).password,
        )
        if (isPassword) {
          if (userData?.newPassword) {
            const isStrongPass: boolean = await isStrongPassword(UserPassword(userData.newPassword))
            if (!isStrongPass) {
              return reply.status(422).send({ message: 'Provide a strong password' })
            }
            const passwordHash = await generatePasswordHash(UserPassword(userData.newPassword))
            const user: UserInfo = await updateUserPasswordByID(id, passwordHash)
            reply.status(201).send({ message: 'User Updated', data: user })
          }
        } else {
          return reply.status(400).send({ message: 'user password not matching' })
        }
      } else {
        return reply.status(404).send({ message: 'user not found' })
      }
    },
  )

  fastify.delete<{ Params: GetUserByIDSchemaType }>(
    '/:id',
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
      const user: UserWithSuperAdmin | undefined = await DeleteUser(id)
      if (user == undefined || user == null) {
        return reply.status(404).send({ message: "User doesn't exist!" })
      }
      return reply.status(200).send({ message: 'user deleted' })
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
      const user: UserStore | undefined = await deleteStoreUser(userID, storeID)
      if (user == undefined || user == null) {
        return reply.status(404).send({ message: "User doesn't exist!" })
      }
      return reply.status(200).send({ message: 'user deleted', ...user })
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
      const user: UserStore | undefined = await assignToStore(userID, storeID)
      if (user == undefined || user == null) {
        return reply.status(404).send({ message: "User couldn't be assigned" })
      }
      return reply.status(200).send({ message: 'user assigned', ...user })
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
      const users: UserID[] | undefined = await selectStoreUsers(storeID)
      if (users == null) {
        return reply.status(404).send({ message: "Users couldn't be found" })
      }
      return reply.status(200).send({ message: 'user assigned', userIDs: users })
    },
  )
}

export default users
