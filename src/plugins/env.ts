const fastifyEnv = require('@fastify/env')
import fp from 'fastify-plugin'

  const schema = {
    type: 'object',
    required: ['DB_PASSWORD', 'DB_USERNAME'],
    properties: {
      DB_PASSWORD: {
        type: 'string'
      },
      DB_USERNAME: {
        type: 'string'
      },
      JWT_SECRET: {
        type: 'string'
      }
    }
  }

  const options = {
    confKey: 'config',
    schema,
    dotenv: true,
    data: process.env
  }
  export interface SupportPluginOptions {
    // Specify Support plugin options here
  }
  
  // The use of fastify-plugin is required to be able
  // to export the decorators to the outer scope
  export default fp<SupportPluginOptions>(async (fastify, opts) => {
    await fastify.register(fastifyEnv, options)
  })
  
  // When using .decorate you have to specify added properties for Typescript
  declare module 'fastify' {
    interface FastifyInstance {
      config: { // this should be same as the confKey in options
        // specify your typing here
        DB_USERNAME: string;
        DB_PASSWORD: string;
        JWT_SECRET: string;
      };
    }
  }