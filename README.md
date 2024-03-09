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
