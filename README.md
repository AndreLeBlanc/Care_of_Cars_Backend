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
