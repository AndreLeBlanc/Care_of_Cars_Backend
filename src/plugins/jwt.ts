import fp from 'fastify-plugin'
import { FastifyReply } from 'fastify/types/reply'
import { FastifyRequest } from 'fastify/types/request'
import { roleHasPermission } from '../services/roleService.js'
import { PermissionTitle } from '../services/permissionService.js'
import { FastifyJwtNamespace } from '@fastify/jwt'
export interface SupportPluginOptions {}

export default fp<SupportPluginOptions>(async (fastify) => {
  fastify.addHook(
    'preHandler',
    async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
      try {
        const requestPath = request.routeOptions.url
        //console.log(requestPath, requestPath?.startsWith('/docs'))

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
        const hasPermission: boolean = await roleHasPermission(
          { roleID: userData.user.role.roleID },
          permissionName,
        )
        if (userData.user) {
          return true
        }
        if (!hasPermission) {
          return false
        }
      } catch (err) {
        throw err
      }
      return false
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
