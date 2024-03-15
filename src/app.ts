import { fastifyJwt } from '@fastify/jwt'
import * as dotenv from 'dotenv'
import { AutoloadPluginOptions } from '@fastify/autoload'
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify'
import { initDrizzle } from './config/db-connect.js'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import pagination from './plugins/pagination.js'
import { permissions } from './routes/permissions/permissions.js'
import { roleToPermissions } from './routes/role-to-permission/roleToPermissons.js'
import { roles } from './routes/roles/roles.js'
import { users } from './routes/users/users.js'

dotenv.config()
export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {}

const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  // Place here your custom code!

  initDrizzle()
  fastify.register(fastifySwagger, {
    // https://community.smartbear.com/discussions/swaggerostools/how-to-show-authorize-button-on-oas-3-swagger-in-javascript/234650
    openapi: {
      security: [
        {
          bearerAuth: [],
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
          },
        },
      },
    },
    swagger: {
      // properties...
      securityDefinitions: {
        Authorization: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
      // security: [
      //   {
      //     authorization: []
      //   }
      // ]
    },
  })
  await fastify.register(fastifySwaggerUI, { routePrefix: '/docs' })

  await void fastify.register(permissions, { routePrefix: '/permissions' })
  await void fastify.register(roleToPermissions, { routePrefix: '/roleToPermissions' })
  await void fastify.register(roles, { routePrefix: '/roles' })
  await void fastify.register(users, { routePrefix: '/users' })

  // This loads all plugins defined in routes
  // define your routes in one of these
  await void fastify.register(pagination)
  if (typeof process.env.JWT_SECRET === 'string') {
    fastify.register(fastifyJwt, {
      secret: process.env.JWT_SECRET,
    })
  } else {
    console.log('can not find JWT_SECRET')
  }
}

export default app
export { app, options }
