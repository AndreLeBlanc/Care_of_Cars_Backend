# Care of Cars

### Requirements

1. Node 20.11.1
2. Postgres 14.11

## Deploy with docker

To run postgres and nodejs docker continers (use this when you are deploying and no code changes have been made):

`sudo docker-compose up`

To run postgres and nodejs docker continers with new code (use this when changes have been made):

`sudo docker-compose up --build`

Stop containers:

`sudo docker-compose down`

Stop containers and remove the database:

`sudo docker-compose down --rmi all --volumes`

Remove all docker images:

`docker image prune -a`

To see running docker containers:

`sudo docker ps`

To access bash in one of the containers

`sudo docker exec -it CONTAINER_ID bash` replace CONTAINER_ID with the actual container ID.

## How to install locally

1. Create `.env` at the root and fill out the actual values.

```
cp .env.sample .env
```

```
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=dbname
POSTGRES_HOST=localhost
JWT_SECRET=mysecret
SUPER_ADMIN_EMAIL=superadmin@test.com
SUPER_ADMIN_PASSWORD=admin123
RUN_SEED=false
TEST_DB_NAME=dbname_test
NODE_ENV=dev | test
```

2. To start the server in dev(All the pending DB migrations will run automatically when you start the server)
   on port 3000

```
npm run dev
```

4. To view the swagger url:

http://localhost:3000/docs

5. To generate the migration file after you have changes on `schema/schema.ts`

```
npm run generate
```

6. To create Super admin enable seeding of super admin. set the below env's

```
RUN_SEED=true
SUPER_ADMIN_EMAIL=
SUPER_ADMIN_PASSWORD=
```

then run

```
npm run dev
```

seed will be executed and superadmin will be created. Once created make sure to set `RUN_SEED=false`

# Getting Started with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli)

This project was bootstrapped with Fastify-CLI.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm start`

For production mode

### `npm run test`

Run the test cases.

## Learn More

To learn Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).

## Adding Routes and Plugins

Create a new file in the `src/plugins` folder with the name `nameOfThePlugin.ts`.

Add the following boilerplate:

```
import fp from 'fastify-plugin'
import { FastifyReply } from 'fastify/types/reply'
import { FastifyRequest } from 'fastify/types/request'
export interface SupportPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, reply) => {
  fastify.decorate(
    'exampleFunction',
    function (request: FastifyRequest, reply: FastifyReply): returnType {
      try {
        console.log('run example plugin')
      } catch (err) {
        throw err
      }
      return true
    },
  )
})

declare module 'fastify' {
  export interface FastifyInstance {
    exampleFunction(request: FastifyRequest, reply: FastifyReply): returnType
  }
}

```

###Add a route:

in `src/routes/` add a folder with the name of your route. Add two files in the folder: one called `nameOfRoute.ts` and one called `nameOfRouteSchema.ts`. Add a schema to validate the response in the schema file. In the file containing the route use the boilerplate:

```
import { FastifyInstance } from 'fastify'
import { exampleFuncSchema, exampleFuncInputSchema } from './exampleSchema.js'

export async function exampleRoute(fastify: FastifyInstance) {
  fastify.get<{ Querystring: exampleFuncInputSchema }>(
    '/',
    {
      preHandler: async (request, reply, done) => {

         //Your code goes here
        done()
        return reply
      },
      schema: {
        querystring: exampleFuncSchema,
      },
    },
    async function (request, reply) {
      const str: boolean = await fastify.exampleFunction(request, reply)
      return {
        message: 'hello care of cars developer! ' + str,
      }
    },
  )
}

export default exampleRoute

```

in `src/app.ts` import:

```
import { exampleRoute } from './routes/example/example.js'
import exampleFunction from './plugins/example.js

```

Add the plugin and route:

```
  await void fastify.register(exampleFunction)
  await void fastify.register(exampleRoute, { prefix: '/exampleRoute' })
```

Please ensure that your functions have a return type.

Null is broken in typescript so other return types than null are recommended:

https://hamednourhani.gitbooks.io/typescript-book/content/docs/tips/null.html
