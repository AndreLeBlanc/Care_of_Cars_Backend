import { FastifyInstance } from 'fastify'
//import fp from 'fastify-plugin'
export interface SupportPluginOptions {
  // Specify Support plugin options here
}

export function pagination(instance: FastifyInstance, options: any, done: any) {
  instance.decorate('findOffset', function (limit: number, page: number): number {
    return (page - 1) * limit
  })
  instance.decorate('findOffset', function (limit: number, page: number): number {
    return (page - 1) * limit
  })
  instance.decorate('responseMessage', function (modelName: string, resultCount: number): string {
    let message = `No ${modelName} found!`
    if (resultCount > 0) {
      message = `${resultCount} ${modelName} found`
    }
    return message
  })
  instance.decorate(
    'findNextPageUrl',
    function (requestUrl: string, totalPage: number, page: number): string | null {
      if (totalPage > page && totalPage > 1) {
        const nextPage = page + 1
        return requestUrl.replace(/(page=)[^\&]+/, '$1' + nextPage)
      }
      return null
    },
  )
  instance.decorate(
    'findPreviousPageUrl',
    function (requestUrl: string, totalPage: number, page: number): string | null {
      if (page > totalPage) {
        return null
      } else if (page != 1 && totalPage > 1) {
        const previousPage = page - 1
        return requestUrl.replace(/(page=)[^\&]+/, '$1' + previousPage)
      }
      return null
    },
    done(),
  )
}

//export default fp(pagination, {
//  fastify: '4.x',
//  name: 'pagination', // this is used by fastify-plugin to derive the property name
//})
