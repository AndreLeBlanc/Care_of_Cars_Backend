import { Either, match } from '../utils/helper.js'
import { EmployeePin, PermissionTitle, RoleID, UserID } from '../schema/schema.js'
import { roleHasPermission, roleHasPermissionPin } from '../services/roleToPermissionService.js'
import { FastifyJwtNamespace } from '@fastify/jwt'
import { FastifyReply } from 'fastify/types/reply'
import { FastifyRequest } from 'fastify/types/request'
import fp from 'fastify-plugin'

type Token = {
  userID: number
  userFirstName: string
  userLastName: string
  userEmail: string
  isSuperAdmin: boolean
  role: { roleID: number; roleName: number }
  iat: number
}

export default fp(async (fastify) => {
  fastify.decorate(
    'authorize',
    async function (
      request: FastifyRequest,
      _: FastifyReply,
      permissionName: PermissionTitle,
    ): Promise<boolean> {
      try {
        const token = (await request.jwtDecode()) as Token
        if (token.isSuperAdmin) {
          return true
        }
        const hasPermission: Either<string, boolean> = await roleHasPermission(
          RoleID(token.role.roleID),
          permissionName,
        )

        return match(
          hasPermission,
          (hasPerm: boolean) => {
            return hasPerm
          },
          (err) => {
            console.error('Permission error: ', err)
            return false
          },
        )
      } catch (e) {
        console.error('Authorization error: ', e)
        return false
      }
    },
  )

  fastify.decorate(
    'authorizePin',
    async function (
      request: FastifyRequest,
      _: FastifyReply,
      permissionName: PermissionTitle,
      pin: EmployeePin,
    ): Promise<boolean> {
      try {
        const token = (await request.jwtDecode()) as Token
        const hasPermission: Either<string, boolean> = await roleHasPermissionPin(
          RoleID(token.role.roleID),
          permissionName,
          UserID(token.userID),
          pin,
        )
        return match(
          hasPermission,
          (hasPerm) => {
            return hasPerm
          },
          (err) => {
            console.error('Permission error: ', err)
            return false
          },
        )
      } catch (e) {
        console.error('Authorization error: ', e)
        return false
      }
    },
  )

  fastify.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
      try {
        await request.jwtVerify()
      } catch (err) {
        return reply.send(err)
      }
    },
  )
})

declare module 'fastify' {
  interface FastifyInstance
    extends FastifyJwtNamespace<{
      jwtDecode: 'securityJwtDecode'
      jwtSign: 'securityJwtSign'
      jwtVerify: 'securityJwtVerify'
    }> {
    authorize(
      request: FastifyRequest,
      reply: FastifyReply,
      permissionName: PermissionTitle,
    ): Promise<boolean>
    authorizePin(
      request: FastifyRequest,
      reply: FastifyReply,
      permissionName: PermissionTitle,
      pin: EmployeePin,
    ): Promise<boolean>
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>
  }
}
