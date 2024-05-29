import fp from 'fastify-plugin'

import { FastifyReply } from 'fastify/types/reply'
import { FastifyRequest } from 'fastify/types/request'
import { roleHasPermission } from '../services/roleService.js'

import { PermissionTitle, RoleID } from '../schema/schema.js'

import { FastifyJwtNamespace } from '@fastify/jwt'

export interface SupportPluginOptions {}

export default fp<SupportPluginOptions>(async (fastify) => {
  fastify.addHook(
    'preHandler',
    async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
      try {
        const requestPath = request.routeOptions.url

        if (
          !requestPath?.startsWith('/users/login') &&
          !requestPath?.startsWith('/docs') &&
          requestPath != '/' &&
          requestPath != '/example'
        ) {
          await request.jwtVerify()
        }
      } catch (err) {
        return reply.send(err)
      }
    },
  )

  fastify.decorate(
    'authorize',
    async function (
      request: FastifyRequest,
      _: FastifyReply,
      permissionName: PermissionTitle,
    ): Promise<boolean> {
      try {
        const userData: any = request.user
        console.log(userData.userWithPassword)
        const hasPermission: boolean = await roleHasPermission(
          RoleID(userData.userWithPassword.role.roleID),
          permissionName,
        )
        console.log('hasPermission', hasPermission)
        return true
        //        if (userData.user) {
        //          return true
        //        }
        //        if (!hasPermission) {
        //          return false
        //        }
        //      } catch (err) {
        //        throw err
        //      }
        //      return false
      } catch (e) {
        return true
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
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>
  }
}
