import fp from 'fastify-plugin'
export interface SupportPluginOptions {
  // Specify Support plugin options here
}

export type NextPageUrl = { nextPageUrl: string }
export type PreviousPageUrl = { previousPageUrl: string }
export type ResponseMessage = { responseMessage: string }
export type Offset = { offset: number }

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, _) => {
  fastify.decorate('findOffset', function (limit: number, page: number): Offset {
    return { offset: (page - 1) * limit }
  })

  fastify.decorate(
    'responseMessage',
    function (modelName: string, resultCount: number): ResponseMessage {
      if (resultCount > 0) {
        return { responseMessage: `${resultCount} ${modelName} found` }
      }
      return { responseMessage: `No ${modelName} found!` }
    },
  )
  fastify.decorate(
    'findNextPageUrl',
    function (requestUrl: string, totalPage: number, page: number): NextPageUrl | undefined {
      if (totalPage > page && totalPage > 1) {
        const nextPage = page + 1
        return { nextPageUrl: requestUrl.replace(/(page=)[^\&]+/, '$1' + nextPage) }
      }
      return undefined
    },
  )
  fastify.decorate(
    'findPreviousPageUrl',
    function (requestUrl: string, totalPage: number, page: number): PreviousPageUrl | undefined {
      if (page != 1 && totalPage > 1 && page <= totalPage) {
        const previousPage = page - 1
        return { previousPageUrl: requestUrl.replace(/(page=)[^\&]+/, '$1' + previousPage) }
      }
      return undefined
    },
  )
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    findOffset(limit: number, page: number): Offset
    responseMessage(modelName: string, resultCount: number): ResponseMessage
    findNextPageUrl(requestUrl: string, totalPage: number, page: number): NextPageUrl | undefined
    findPreviousPageUrl(
      requestUrl: string,
      totalPage: number,
      page: number,
    ): PreviousPageUrl | undefined
  }
}
