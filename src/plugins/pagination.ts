import fp from 'fastify-plugin'
import { Url } from 'url'

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
  fastify.decorate('findNextPageUrl', function (requestUrl:string, totalPage:number, page:number): string | null {
    if(totalPage > page  && totalPage > 1) {
      const nextPage = page + 1
      return requestUrl.replace(/(page=)[^\&]+/, '$1' + nextPage);
    } 
    return null;
    
  })
  fastify.decorate('findPreviousPageUrl', function (requestUrl:string, totalPage:number, page:number): string | null {
    if(page > totalPage) {
      return null;
    } else if(page != 1 && totalPage > 1) {
      const previousPage = page - 1
      return requestUrl.replace(/(page=)[^\&]+/, '$1' + previousPage);
    } 
    return null;
  })
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    findOffset(limit:number, page: number): number;
    responseMessage(modelName: string, resultCount: number): string;
    findNextPageUrl(requestUrl: string, totalPage:number, page:number): string | null;
    findPreviousPageUrl(requestUrl: string, totalPage:number, page:number): string | null;
  }
}
