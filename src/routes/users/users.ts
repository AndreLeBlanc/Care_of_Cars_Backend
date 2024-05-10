import { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'

import {
  CreateUser,
  CreateUserReply,
  CreateUserType,
  ListUserQueryParam,
  ListUserQueryParamType,
  LoginUser,
  LoginUserType,
  PatchUserSchema,
  PatchUserSchemaType,
  getUserByIDSchema,
  getUserByIDType,
  PatchUserPasswordType,
  PatchUserPassword,
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
  UserWithSuperAdmin,
  UsersPaginated,
  VerifyUser,
  createUser,
  generatePasswordHash,
  getUserByID,
  getUsersPaginate,
  isStrongPassword,
  updateUserByID,
  verifyUser,
  userInfoPassword,
} from '../../services/userService.js'
import { RoleID } from '../../services/roleService.js'

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
          passwordHash,
          RoleID(roleID),
        )
        return reply.status(201).send({
          message: 'User created',
          body: {
            firstName: createdUser.userFirstName,
            lastName: createdUser.userLastName,
            email: createdUser.userEmail,
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
      }
      reply.status(403).send({ message: 'Login failed, incorrect email or password' })
    },
  )

  fastify.get<{ Params: getUserByIDType }>(
    '/:id',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('view_user'))
        done()
        return reply
      },

      schema: {
        params: getUserByIDSchema,
      },
    },
    async (request, reply) => {
      const id = UserID(request.params.id)
      const user: UserInfo | undefined = await getUserByID(id)
      if (user == null) {
        return reply.status(404).send({ message: 'user not found' })
      }
      return reply.status(200).send(user)
    },
  )

  fastify.patch<{ Body: PatchUserSchemaType; Reply: object; Params: getUserByIDType }>(
    '/:id',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('update_user'))
        done()
        return reply
      },
      schema: {
        body: PatchUserSchema,
        params: getUserByIDSchema,
      },
    },
    async (request, reply) => {
      const userData = request.body
      if (Object.keys(userData).length == 0) {
        return reply.status(422).send({ message: 'Provide at least one column to update.' })
      }
      const id = UserID(request.params.id)
      if (userData?.password) {
        const isStrongPass: boolean = await isStrongPassword(UserPassword(userData.password))
        if (!isStrongPass) {
          return reply.status(422).send({ message: 'Provide a strong password' })
        }
        userData.password = await generatePasswordHash(UserPassword(userData.password))
      }
      const user: UserInfo = await updateUserByID(id, userData)
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
            const user: UserInfo = await updateUserByID(id, { password: passwordHash })
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

  fastify.delete<{ Params: getUserByIDType }>(
    '/:id',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('delete_user'))
        done()
        return reply
      },
      schema: {
        params: getUserByIDSchema,
      },
    },
    async (request, reply) => {
      const id = UserID(request.params.id)
      const user: UserWithSuperAdmin | undefined = await DeleteUser(id)
      if (user == undefined || user == null) {
        return reply.status(404).send({ message: "User doesn't exist!" })
      }
      return reply.status(200).send({ message: 'user deleted' })
    },
  )
}

export default users
