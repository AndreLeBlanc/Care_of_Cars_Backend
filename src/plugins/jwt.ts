import fp from 'fastify-plugin'
import { FastifyReply } from 'fastify/types/reply'
import { FastifyRequest } from 'fastify/types/request'
import { roleHasPermission } from '../services/roleService.js'
import { FastifyJwtNamespace } from '@fastify/jwt'
export interface SupportPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, reply) => {
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
      reply: FastifyReply,
      permissionName: string,
    ): Promise<boolean> {
      try {
        const userData: any = request.user
        const hasPermission: boolean = await roleHasPermission(
          userData.user.role.id,
          permissionName,
        )
        if (userData.user.isSuperAdmin) {
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
      permissionName: string,
    ): Promise<boolean>
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>
  }
}
