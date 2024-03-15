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
  fastify.decorate('authenticate', async (request: FastifyRequest, opts: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch (error) {
      throw fastify.httpErrors.unauthorized()
    }
  })
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
  //   fastify.decorate(
  //     'authorize',
  //     async function (
  //       request: FastifyRequest,
  //       reply: FastifyReply,
  //       permissionName: string,
  //     ): Promise<void> {
  //       try {
  //         const userData: any = request.user
  //         const hasPermission = await roleHasPermission(userData.user.role.id, permissionName)
  //         // console.log("has permission ", permissionName, " = ", hasPermission);
  //         // console.log("user is == ", userData.user.role);
  //         if (userData.user.isSuperAdmin) {
  //           console.log('super admin permissions skipping')
  //           return
  //         }
  //         if (!hasPermission) {
  //           return reply
  //             .status(403)
  //             .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
  //         }
  //       } catch (err) {
  //         return reply.send(err)
  //       }
  //     },
})
declare module 'fastify' {
  interface FastifyInstance extends FastifyJwtNamespace<{ namespace: 'security' }> {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>
    authorize(
      request: FastifyRequest,
      reply: FastifyReply,
      permissionName: string,
    ): Promise<boolean>
  }
}
