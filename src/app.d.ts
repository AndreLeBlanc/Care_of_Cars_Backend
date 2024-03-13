import { FastifyPluginCallback, FastifyInstance } from 'fastify'

interface PluginOptions {
  //...
}

// Optionally, you can add any additional exports.
// Here we are exporting the decorator we added.

declare namespace permission {
  interface permissions {
    findOffset: { (limit: number, page: number): string }
    responseMessage: { (limit: number, page: number): string }
    findNextPageUrl: {
      (requestUrl: string, totalPage: number, page: number): string
    }
    findPreviousPageUrl: {
      (requestUrl: string, totalPage: number, page: number): string
    }
  }
}

// Most importantly, use declaration merging to add the custom property to the Fastify type system
declare module 'fastify' {
  export interface FastifyInstance {
    permissions: permission.permissions
  }
}

// fastify-plugin automatically adds named export, so be sure to add also this type
// the variable name is derived from `options.name` property if `module.exports.myPlugin` is missing
export const pagination: FastifyPluginCallback<PluginOptions>
