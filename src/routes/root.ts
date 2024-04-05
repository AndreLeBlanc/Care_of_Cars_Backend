import { FastifyInstance } from 'fastify'

export async function root(fastify: FastifyInstance) {
  fastify.get('', async function (_) {
    return { root: true }
  })
}
