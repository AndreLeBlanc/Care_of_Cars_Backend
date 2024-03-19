import { FastifyJwtNamespace } from '@fastify/jwt'
import fp from 'fastify-plugin'
import { FastifyReply } from 'fastify/types/reply'
import { FastifyRequest } from 'fastify/types/request'
import { roleHasPermission } from '../services/roleService'
export interface SupportPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
  fastify.register(require('@fastify/jwt'), {
    secret: fastify?.config?.JWT_SECRET, //"supersecret"
  })
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
        const hasPermission = await roleHasPermission(userData.user.role.id, permissionName)
        if (userData.user.isSuperAdmin) {
          return true
        }
        if (!hasPermission) {
          return false
        }
      } catch (err) {
        throw err
      }
      return true
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
    //authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>
    authorize(
      request: FastifyRequest,
      reply: FastifyReply,
      permissionName: string,
    ): Promise<boolean>
  }
}
