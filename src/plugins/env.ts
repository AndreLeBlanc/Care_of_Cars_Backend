import fastifyEnv from '@fastify/env'
import fp from 'fastify-plugin'

const schema = {
  type: 'object',
  required: ['DB_PASSWORD', 'DB_USERNAME', 'DB_NAME', 'JWT_SECRET'],
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
export default fp<SupportPluginOptions>(async (fastify, opts) => {
  await fastify.register(fastifyEnv, options)
})
