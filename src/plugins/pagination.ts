import fp from 'fastify-plugin'
export interface SupportPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
  fastify.decorate('findOffset', function (limit: number, page: number): number {
    return (page - 1) * limit
  })
  fastify.decorate('responseMessage', function (modelName: string, resultCount: number): string {
    if (resultCount > 0) {
      return `${resultCount} ${modelName} found`
    }
    return `No ${modelName} found!`
  })
  fastify.decorate(
    'findNextPageUrl',
    function (requestUrl: string, totalPage: number, page: number): string | undefined {
      if (totalPage > page && totalPage > 1) {
        const nextPage = page + 1
        return requestUrl.replace(/(page=)[^\&]+/, '$1' + nextPage)
      }
      return undefined
    },
  )
  fastify.decorate(
    'findPreviousPageUrl',
    function (requestUrl: string, totalPage: number, page: number): string | undefined {
      if (page != 1 && totalPage > 1 && page <= totalPage) {
        const previousPage = page - 1
        return requestUrl.replace(/(page=)[^\&]+/, '$1' + previousPage)
      }
      return undefined
    },
  )
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    findOffset(limit: number, page: number): number
    responseMessage(modelName: string, resultCount: number): string
    findNextPageUrl(requestUrl: string, totalPage: number, page: number): string | undefined
    findPreviousPageUrl(requestUrl: string, totalPage: number, page: number): string | undefined
  }
}
