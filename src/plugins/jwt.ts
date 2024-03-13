import { FastifyJwtNamespace, fastifyJwt } from '@fastify/jwt'
import fp from 'fastify-plugin'
import { FastifyReply } from 'fastify/types/reply'
import { FastifyRequest } from 'fastify/types/request'
import { roleHasPermission } from '../services/roleService.js'
export interface SupportPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
  fastify.register(fastifyJwt, {
    secret: fastify?.config?.JWT_SECRET, //"supersecret"
  })
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
  fastify.decorate(
    'authorize',
    async function (
      request: FastifyRequest,
      reply: FastifyReply,
      permissionName: string,
    ): Promise<void> {
      try {
        const userData: any = request.user
        const hasPermission = await roleHasPermission(userData.user.role.id, permissionName)
        // console.log("has permission ", permissionName, " = ", hasPermission);
        // console.log("user is == ", userData.user.role);
        if (!hasPermission) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
      } catch (err) {
        return reply.send(err)
      }
    },
  )
})
declare module 'fastify' {
  interface FastifyInstance extends FastifyJwtNamespace<{ namespace: 'security' }> {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>
    authorize(request: FastifyRequest, reply: FastifyReply, permissionName: string): Promise<void>
  }
}
