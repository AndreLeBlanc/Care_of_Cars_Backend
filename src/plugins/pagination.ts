import fp from 'fastify-plugin'

import { Brand, make } from 'ts-brand'

export interface SupportPluginOptions {
  // Specify Support plugin options here
}

export type NextPageUrl = Brand<string, 'nextPageUrl'>
export const NextPageUrl = make<NextPageUrl>()
export type PreviousPageUrl = Brand<string, 'previousPageUrl'>
export const PreviousPageUrl = make<PreviousPageUrl>()
export type ResponseMessage = Brand<string, 'responseMessage'>
export const ResponseMessage = make<ResponseMessage>()
export type Offset = Brand<number, 'offset'>
export const Offset = make<Offset>()
export type Limit = Brand<number, 'limit'>
export const Limit = make<Limit>()
export type Page = Brand<number, 'Page'>
export const Page = make<Page>()
export type Search = Brand<string, 'Search'>
export const Search = make<Search>()
export type ResultCount = Brand<number, 'resultCount'>
export const ResultCount = make<ResultCount>()
export type ModelName = Brand<string, 'modelName'>
export const ModelName = make<ModelName>()
export type RequestUrl = Brand<string, 'requestUrl'>
export const RequestUrl = make<RequestUrl>()

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify) => {
  fastify.decorate('findOffset', function (limit: Limit, page: Page): Offset {
    return Offset((page - 1) * limit)
  })

  fastify.decorate(
    'responseMessage',
    function (modelName: ModelName, resultCount: ResultCount): ResponseMessage {
      if (resultCount > 0) {
        return ResponseMessage(`${resultCount} ${modelName} found`)
      }
      return ResponseMessage(`No ${modelName} found!`)
    },
  )
  fastify.decorate('findNextPageUrl', function (requestUrl: string, totalPage: Page, page: Page):
    | NextPageUrl
    | undefined {
    if (totalPage > page && totalPage > 1) {
      const nextPage = page + 1
      return NextPageUrl(requestUrl.replace(/(page=)[^\&]+/, '$1' + nextPage))
    }
    return undefined
  })
  fastify.decorate(
    'findPreviousPageUrl',
    function (requestUrl: string, totalPage: Page, page: Page): PreviousPageUrl | undefined {
      if (page != 1 && totalPage > 1 && page <= totalPage) {
        const previousPage = page - 1
        return PreviousPageUrl(requestUrl.replace(/(page=)[^\&]+/, '$1' + previousPage))
      }
      return undefined
    },
  )
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    findOffset(limit: Limit, page: Page): Offset
    responseMessage(modelName: ModelName, resultCount: ResultCount): ResponseMessage
    findNextPageUrl(requestUrl: RequestUrl, totalPage: Page, page: Page): NextPageUrl | undefined
    findPreviousPageUrl(
      requestUrl: RequestUrl,
      totalPage: Page,
      page: Page,
    ): PreviousPageUrl | undefined
  }
}
