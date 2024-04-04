import { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'

import {
  CreateUser,
  CreateUserType,
  CreateUserReply,
  ListUserQueryParam,
  ListUserQueryParamType,
  LoginUser,
  LoginUserType,
  PatchUserSchema,
  PatchUserSchemaType,
  getUserByIdSchema,
  getUserByIdType,
} from './userSchema.js'
import {
  createUser,
  CreatedUser,
  getUsersPaginate,
  UserID,
  UsersPaginated,
  verifyUser,
  getUserById,
  updateUserById,
  generatePasswordHash,
  isStrongPassword,
  DeleteUser,
  UserWithSuperAdmin,
  UserInfo,
  VerifyUser,
} from '../../services/userService.js'

import { getAllPermissionStatus, getRoleWithPermissions } from '../../services/roleService.js'

export async function users(fastify: FastifyInstance) {
  fastify.get<{ Querystring: ListUserQueryParamType }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = { permissionName: 'list_user' }
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
    async (request, reply) => {
      let { search = '', limit = 10, page = 1 } = request.query
      const offset = fastify.findOffset(limit, page)

      const result: UsersPaginated = await getUsersPaginate(search, limit, page, offset)
      let message: string = fastify.responseMessage('users', result.data.length)
      let requestUrl: string | undefined = request.protocol + '://' + request.hostname + request.url
      const nextUrl: string | undefined = fastify.findNextPageUrl(
        requestUrl,
        result.totalPage,
        page,
      )
      const previousUrl: string | undefined = fastify.findPreviousPageUrl(
        requestUrl,
        result.totalPage,
        page,
      )

      return {
        message: message,
        totalItems: result.totalItems,
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
        console.log(request.user)
        fastify.authorize(request, reply, { permissionName: 'create_user' })
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
      const { firstName, lastName, email, password, roleId } = request.body
      const isStrongPass: boolean = await isStrongPassword({ userPassword: password })
      if (!isStrongPass) {
        return reply.status(422).send({ message: 'Provide a strong password' })
      }
      const passwordHash: string = await generatePasswordHash({ userPassword: password })
      try {
        const createdUser: CreatedUser = await createUser(
          { userFirstName: firstName },
          { userLastName: lastName },
          { userEmail: email },
          passwordHash,
          { roleID: roleId },
        )
        return reply.status(201).send({
          message: 'User created',
          body: {
            firstName: createdUser.userFirstName,
            lastName: createdUser.userLastName,
            email: createdUser.userEmail,
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
      let userWithPassword: VerifyUser | undefined = await verifyUser({ userEmail: email })
      if (userWithPassword == undefined || userWithPassword == null) {
        return reply.status(403).send({ message: 'Login failed, incorrect email' })
      }
      const match = await bcrypt.compare(password, userWithPassword.userPassword)
      if (match) {
        const { userPassword, ...user } = userWithPassword
        const token = fastify.jwt.sign({ user })
        const rolePermissions = await getRoleWithPermissions(user.role)
        const roleFullPermissions = await getAllPermissionStatus(user.role)

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
      reply.status(403).send({ message: 'Login failed, incorrect password' })
    },
  )
  fastify.get<{ Params: getUserByIdType }>(
    '/:id',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, { permissionName: 'view_user' })
        done()
        return reply
      },

      schema: {
        params: getUserByIdSchema,
      },
    },
    async (request, reply) => {
      const id: UserID = { userID: request.params.id }
      const user: UserInfo | undefined = await getUserById(id)
      if (user == null) {
        return reply.status(404).send({ message: 'user not found' })
      }
      return reply.status(200).send(user)
    },
  )
  fastify.patch<{ Body: PatchUserSchemaType; Reply: object; Params: getUserByIdType }>(
    '/:id',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, { permissionName: 'update_user' })
        done()
        return reply
      },
      schema: {
        body: PatchUserSchema,
        params: getUserByIdSchema,
      },
    },
    async (request, reply) => {
      const userData = request.body
      if (Object.keys(userData).length == 0) {
        return reply.status(422).send({ message: 'Provide at least one column to update.' })
      }
      const id: UserID = { userID: request.params.id }
      if (userData?.password) {
        const isStrongPass: boolean = await isStrongPassword({ userPassword: userData.password })
        if (!isStrongPass) {
          return reply.status(422).send({ message: 'Provide a strong password' })
        }
        userData.password = await generatePasswordHash({ userPassword: userData.password })
      }
      const user: UserInfo = await updateUserById(id, userData)
      if (user === undefined) {
        return reply.status(404).send({ message: 'user not found' })
      }
      reply.status(201).send({ message: 'User Updated', data: user })
    },
  )
  fastify.delete<{ Params: getUserByIdType }>(
    '/:id',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, { permissionName: 'delete_user' })
        done()
        return reply
      },
      schema: {
        params: getUserByIdSchema,
      },
    },
    async (request, reply) => {
      const id: UserID = { userID: request.params.id }
      const user: UserWithSuperAdmin | undefined = await DeleteUser(id.userID)
      if (user == undefined || user == null) {
        return reply.status(404).send({ message: "User doesn't exist!" })
      }
      return reply.status(200).send({ message: 'user deleted' })
    },
  )
}

export default users
