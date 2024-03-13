import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'
import { FastifyReply, FastifyRequest } from 'fastify'

import { roleHasPermission } from '../services/roleService.js'

export interface SupportPluginOptions {
  // Specify Support plugin options here
}

const supportPlugin = fp<SupportPluginOptions>(async (fastify, opts) => {
  await fastify.register(fastifyJwt, {
    //////////////////TODO
    //////////////////TODO
    //////////////////TODO
    //////////////////TODO
    //////////////////TODO
    secret: 'supersecret',
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

export default supportPlugin
