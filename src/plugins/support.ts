import fp from 'fastify-plugin'

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp(async (fastify) => {
  fastify.decorate('someSupport', function () {
    return 'hugs'
  })
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    someSupport(): string
  }
}
