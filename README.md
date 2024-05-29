# Care of Cars

### Requirements

1. Node 20.11.1
2. Postgres 14.11

## Deploy with docker

To run postgres and nodejs docker continers (use this when you are deploying and no code changes have been made):

`sudo docker-compose up deployapp postgres`

To run postgres and nodejs docker continers with new code (use this when changes have been made):

`docker-compose build app postgres test`

The app can be run in devmode using nodemon. This allows for hot swapping code. If you run `npm run build:ts` the code changes will be reflected without having to reload docker containers. DO NOT USE IN PROD!

`sudo docker-compose up devapp postgres`

Run Tests:

`sudo docker-compose up test postgres`

Stop containers:

`sudo docker-compose down`

Stop containers and remove the database:

`sudo docker-compose down --rmi all --volumes`

Remove all Docker images:

`sudo docker system prune -a`

To see running docker containers:

`sudo docker ps`

To access bash in one of the containers

`sudo docker exec -it CONTAINER_ID bash` replace CONTAINER_ID with the actual container ID.

To access the database in the postgres container

`psql -U username databasename`

## Testing

We are using [Node native test runner](https://nodejs.org/api/test.html)

Please write tests during development. If you add a new route, write a few tests for it. We want to maintain decent test coverage and testing is far less time consuming than manual debugging!

Try to maintain similar folder structure in the test folder as in the src folder.

## How to install locally

Avoid installing locally, this app is supposed to run in docker. Only do this if you have very good reasons to do so. If you want to interact with the app while running please log into the docker container instead. See section regarding docker.

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
import { exampleFuncSchema, exampleFuncInputSchema } from './exampleSchema'

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
import { exampleRoute } from './routes/example/example'
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

# Workflow

Checkout the latest commits on master.

Make a relatively small change, not more than a days work.

Create a new branch and commit your work.

The githooks will check the formatting of the code. Ensure that the commit hooks pass.

Create a pull request for your work. If there are merge errors fix them. Collaborating on fixing merge errors is encouraged. If your code conflicts with someone elses it is best if you help each other merge your code.

Request a review from another developer. Nobody is allowed to merge their own PRs or push changes directly to master.

# Branded types

To reduce the risk of bugs the use of [branded types](https://egghead.io/blog/using-branded-types-in-typescript) is prefered. Take the following code

```
type a = number;
type b = number;

function myFunc(myVar: a): a {
  return myVar + 1;
}

const myArg: b = 3;
myFunc(myArg);

´´´

It compiles and there are no warnings. However, there is a major risk in the code. myFunc is supposed to take an argument of type a, yet it accepts myArg which is of type b.

This is a potential source of bugs in the project as we might have multiple differennt types with similar names and function. There are many types that are numbers. For example a serviceID and a roleID might get confused if we define our types as they were defined above. We can reduce this risk by using branded types. Branded types can store the same data yet can not be mixed. Rewriting the code above using branded types we get:

```

type a = { a: number };
type b = { b: number };

function myFunc(myVar: a): a {
return { a: myVar.a + 1 };
}

const myArg: b = { b: 3 };
myFunc(myArg);
´´´

This code will not compile. The compiler realizes that we are trying to pass an argument of type b to myFunc which takes an argument of type a. Even if the two types contain the same data the compiler can tell the difference. All JavaScript variables are objects so there is no performance penalty to using branded types. It can also make code easy to read

```
function example(id: serviceID)
´´´

is easier to understand and more difficult to confuse than

```

function example(id: number)
´´´

## Deploying to dev server.

We are currently using http://141.94.70.202:3000/docs/static/index.html as our dev server.

Log in using ssh.

check out the commit you want to run.

Build the docker container and run it. See section on docker.

## Don't Panic. It's the first helpful or intelligible thing anybody's said to me all day
