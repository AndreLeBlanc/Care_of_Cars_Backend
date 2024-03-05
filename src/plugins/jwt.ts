import { FastifyJwtNamespace } from '@fastify/jwt'
import fp from 'fastify-plugin'
import { FastifyReply } from 'fastify/types/reply'
import { FastifyRequest } from 'fastify/types/request'
export interface SupportPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
    fastify.register(require("@fastify/jwt"), {
        secret: fastify?.config?.JWT_SECRET//"supersecret"
    })
    fastify.decorate("authenticate", async function(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            await request.jwtVerify()
        } catch (err) {
            reply.send(err)
        }
    })
})
declare module 'fastify' {
    interface FastifyInstance extends 
    FastifyJwtNamespace<{namespace: 'security'}> {
        authenticate(request: FastifyRequest, reply: FastifyReply):  Promise<void>;
    }
}