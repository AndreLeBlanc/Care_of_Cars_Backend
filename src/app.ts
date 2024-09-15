import { fastifyJwt } from '@fastify/jwt'

import fs from 'node:fs'

import * as dotenv from 'dotenv'
import { FastifyInstance, fastify } from 'fastify'
import cors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import jwt from './plugins/jwt.js'
import pagination from './plugins/pagination.js'

import { billing } from './routes/billing/billing.js'
import { customers } from './routes/customers/customers.js'
import { driverCars } from './routes/driverCars/driverCars.js'
import { employees } from './routes/employees/employees.js'
import { orders } from './routes/orders/orders.js'
import { permissions } from './routes/permissions/permissions.js'
import { productsRoute } from './routes/product/products.js'
import { qualificationsRoute } from './routes/qulifications/qualifcations.js'
import { rentCar } from './routes/rentCar/rentCars.js'
import { roleToPermissions } from './routes/role-to-permission/roleToPermissons.js'
import { roles } from './routes/roles/roles.js'
import { root } from './routes/root.js'
import seedSuperAdmin from './plugins/seed.js'
import { serviceCategory } from './routes/category/category.js'
import { services } from './routes/services/services.js'
import { statistics } from './routes/statistics/statistics.js'
import { stores } from './routes/stores/stores.js'
import { users } from './routes/users/users.js'

const defaultOptions = {
  logger: true,
  ignoreTrailingSlash: true,
}
dotenv.config()
// Pass --options via CLI arguments in command to enable these options.

const isHttps =
  fs.existsSync('/etc/letsencrypt/live/xn--rdamlen-hxa3m.se/privkey.pem') &&
  fs.existsSync('/etc/letsencrypt/live/xn--rdamlen-hxa3m.se/fullchain.pem')

export async function buildApp(options: Partial<typeof defaultOptions> = {}) {
  const app: FastifyInstance = fastify({
    ...defaultOptions,
    ...options,
    ...(isHttps
      ? {
          https: {
            key: fs.readFileSync('/etc/letsencrypt/live/xn--rdamlen-hxa3m.se/privkey.pem'),
            cert: fs.readFileSync('/etc/letsencrypt/live/xn--rdamlen-hxa3m.se/fullchain.pem'),
          },
        }
      : null),
  })

  // Place here your custom code!

  await app.register(cors, {
    origin: true, //we can replace this later with our fe domain
    allowedHeaders: ['Content-Type', 'authorization', 'x-journey-mode'],
    credentials: true,
    methods: ['GET', 'PATCH', 'POST', 'DELETE', 'PUT'],
  })
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

  app.register(orders, { prefix: '/orders' })
  app.register(permissions, { prefix: '/permissions' })
  app.register(billing, { prefix: '/billing' })
  app.register(roleToPermissions, { prefix: '/roleToPermissions' })
  app.register(roles, { prefix: '/roles' })
  app.register(serviceCategory, { prefix: '/category' })
  app.register(stores, { prefix: 'stores' })
  app.register(services, { prefix: 'services' })
  app.register(users, { prefix: '/users' })
  app.register(statistics, { prefix: '/statistics' })
  app.register(employees, { prefix: '/employees' })
  app.register(root, { prefix: '/' })
  app.register(customers, { prefix: '/customer' })
  app.register(rentCar, { prefix: '/rent-car' })
  app.register(driverCars, { prefix: '/driver-car' })
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
