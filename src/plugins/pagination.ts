import fp from 'fastify-plugin'

export interface SupportPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
  fastify.decorate('findOffset', function (limit:number, page: number): number {
    return (page - 1) * limit 
  })
  fastify.decorate('responseMessage', function (modelName: string, resultCount: number): string {
    let message = `No ${modelName} found!`
    if(resultCount > 0) {
      message = `${resultCount} ${modelName} found`
    }
    return message
  })
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    findOffset(limit:number, page: number): number;
    responseMessage(modelName: string, resultCount: number): string;
  }
}
