import { fastifyJwt } from '@fastify/jwt'

import * as dotenv from 'dotenv'
import { FastifyInstance, FastifyServerOptions, fastify } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import pagination from './plugins/pagination'

import jwt from './plugins/jwt'
import { permissions } from './routes/permissions/permissions'
import { roleToPermissions } from './routes/role-to-permission/roleToPermissons'
import { roles } from './routes/roles/roles'
import { serviceCategory } from './routes/category/category'
import { services } from './routes/services/services'
import { users } from './routes/users/users'

import { stores } from './routes/stores/stores'

import { root } from './routes/root'
import seedSuperAdmin from './plugins/seed'

import { customers } from './routes/customers/customers'
import { rentCar } from './routes/rentCar/rent-car'

import { productsRoute } from './routes/product/products'
import { qualificationsRoute } from './routes/qulifications/qualifcations'

const defaultOptions = {
  logger: true,
  ignoreTrailingSlash: true,
}
dotenv.config()
export interface AppOptions extends FastifyServerOptions {}
// Pass --options via CLI arguments in command to enable these options.

export async function buildApp(options: Partial<typeof defaultOptions> = {}) {
  const app: FastifyInstance = fastify({ ...defaultOptions, ...options })

  // Place here your custom code!

  app.register(fastifySwagger, {
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
  app.register(seedSuperAdmin)
  app.register(fastifySwaggerUI, { prefix: '/docs' })

  app.register(permissions, { prefix: '/permissions' })
  app.register(roleToPermissions, { prefix: '/roleToPermissions' })
  app.register(roles, { prefix: '/roles' })
  app.register(serviceCategory, { prefix: '/category' })
  app.register(stores, { prefix: 'stores' })
  app.register(services, { prefix: 'services' })
  app.register(users, { prefix: '/users' })
  app.register(root, { prefix: '/' })
  app.register(customers, { prefix: '/customer' })
  //settings
  app.register(rentCar, { prefix: '/rent-car' })
  app.register(productsRoute, { prefix: '/product' })
  app.register(qualificationsRoute, { prefix: '/qualifications' })

  app.register(pagination)
  if (typeof process.env.JWT_SECRET === 'string') {
    app.register(fastifyJwt, {
      secret: process.env.JWT_SECRET,
    })
  } else {
    console.log('can not find JWT_SECRET')
  }
  app.register(jwt)
  return app
}
