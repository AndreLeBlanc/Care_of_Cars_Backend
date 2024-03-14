import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify'
import { initDrizzle } from './config/db-connect.js'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { join } from 'path'
import path from 'path'
import { fileURLToPath } from 'url'
import pagination from './plugins/pagination.js'
import { permissions } from './routes/permissions/permissions.js'
import { roleToPermissions } from './routes/role-to-permission/roleToPermissons.js'
import { roles } from './routes/roles/roles.js'
import { users } from './routes/users/users.js'
const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)
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
      // securityDefinitions: {
      //   Authorization: {
      //     type: 'apiKey',
      //     name: 'Authorization',
      //     in: 'header',
      //   },
      // },
      // security: [
      //   {
      //     authorization: []
      //   }
      // ]
    },
  })
  await fastify.register(fastifySwaggerUI, { routePrefix: '/docs' })
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  // await void fastify.register(AutoLoad, {
  //   dir: join(__dirname, 'routes/permissions'),
  //   options: opts,
  // })
  // await void fastify.register(AutoLoad, {
  //   dir: join(__dirname, 'routes/role-to-permission'),
  //   options: opts,
  // })
  // await void fastify.register(AutoLoad, {
  //   dir: join(__dirname, 'routes/roles'),
  //   options: opts,
  // })
  await void fastify.register(permissions)
  await void fastify.register(roleToPermissions)
  await void fastify.register(roles)
  await void fastify.register(users)

  // This loads all plugins defined in routes
  // define your routes in one of these
  await void fastify.register(pagination)
}

export default app
export { app, options }
