# Care of Cars

### Requirements
1. Node 20.11.1
2. Postgres 14.11

## How to install locally

1. Create `.env` at the root and fill out the actual values.

```
cp .env.sample .env
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

## Deploy with docker

To run postgres and nodejs docker continers:

`sudo docker-compose up`

Stop containers:

`sudo docker-compose up`

Stop containers and remove the database:

`sudo docker-compose down --rmi all --volumes`

To see running docker containers:

`sudo docker ps`

To access bash in one of the containers

`sudo docker exec -it CONTAINER_ID bash` replace CONTAINER_ID with the actual container ID.
