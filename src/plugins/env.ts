import fastifyEnv from '@fastify/env'
import fp from 'fastify-plugin'

const schema = {
  type: 'object',
  required: [
    'DB_PASSWORD',
    'DB_USERNAME',
    'DB_NAME',
    'JWT_SECRET',
    'RUN_SEED',
    'SUPER_ADMIN_EMAIL',
    'SUPER_ADMIN_PASSWORD',
  ],
  properties: {
    DB_PASSWORD: {
      type: 'string',
    },
    DB_USERNAME: {
      type: 'string',
    },
    DB_NAME: {
      type: 'string',
    },
    JWT_SECRET: {
      type: 'string',
    },
    SUPER_ADMIN_EMAIL: {
      type: 'string',
    },
    SUPER_ADMIN_PASSWORD: {
      type: 'string',
    },
    RUN_SEED: {
      type: 'boolean',
    },
  },
}

const options = {
  confKey: 'config',
  schema,
  dotenv: true,
  data: process.env,
}
export interface SupportPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify) => {
  await fastify.register(fastifyEnv, options)
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  interface FastifyInstance {
    config: {
      // this should be same as the confKey in options
      // specify your typing here
      DB_USERNAME: string
      DB_PASSWORD: string
      JWT_SECRET: string
      RUN_SEED: boolean
      SUPER_ADMIN_EMAIL: string
      SUPER_ADMIN_PASSWORD: string
    }
  }
}
