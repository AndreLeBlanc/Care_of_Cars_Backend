import { FastifyPluginAsync } from "fastify"
import bcrypt from "bcrypt";


import { CreateUser, CreateUserReply, CreateUserReplyType, CreateUserType, ListUserQueryParam, ListUserQueryParamType, LoginUser, LoginUserType, PatchUserSchema, PatchUserSchemaType, getUserByIdSchema, getUserByIdType } from "./schema"
import { createUser, getUsersPaginate, verifyUser, getUserById, updateUserById, generatePasswordHash, isStrongPassword } from "../../services/userService"

const users: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<{Querystring: ListUserQueryParamType}>('/',
  {
   // onRequest: [fastify.authenticate],
    schema: {
      querystring: ListUserQueryParam
      },
    },
    async (request, reply) => {
      let {search='', limit=10, page=1} = request.query;
      const offset = fastify.findOffset(limit, page)
      const result = await getUsersPaginate(search, limit, page, offset);
      let message: string = fastify.responseMessage("users", result.data.length)
      let requestUrl: string | null = request.protocol + '://' + request.hostname + request.url;
      const nextUrl: string | null = fastify.findNextPageUrl(requestUrl, result.totalPage, page);
      const previousUrl: string | null = fastify.findPreviousPageUrl(requestUrl, result.totalPage, page);

      return { 
        message: message, 
        totalItems:  result.totalItems, 
        nextUrl:nextUrl, 
        previousUrl: previousUrl, 
        totalPage: result.totalPage, 
        page: page, 
        limit: limit, 
        data: result.data 
      }
  })
  fastify.post<{ Body: CreateUserType, Reply: CreateUserReplyType }>(
    '/',
    {
      schema: {
      body: CreateUser,
        response: {
          201: CreateUserReply
        },
      }
    },
     async (request, reply) => {
      const { firstName, lastName, email, password } = request.body;
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);
      await createUser(firstName, lastName, email, passwordHash)
      reply.status(201).send(request.body);
  })

  fastify.post<{ Body: LoginUserType, Reply: object }>(
    '/login',
    {
      schema: {
      body: LoginUser,
      }
    },
     async (request, reply) => {
      const { email, password } = request.body;
      const user = await verifyUser(email);
      if(user == null) {
        return reply.status(403).send({message: "Login failed, incorrect email"});
      }
      const match = await bcrypt.compare(password, user.password);
      if(match) {
        const token = fastify.jwt.sign({ user });
        return reply.status(200).send({message: "Login success", token: token});
      }
      reply.status(403).send({message: "Login failed, incorrect password"});
  })
  fastify.get<{Params: getUserByIdType }>(
    '/:id',
    {
      schema: {
        params: getUserByIdSchema
      }
    },
     async (request, reply) => {
      const id  = request.params.id;
      const user = await getUserById(id);
      if(user == null) {
        return reply.status(404).send({message: "user not found"});
      }
      reply.status(200).send(user);
  })
  fastify.patch<{ Body: PatchUserSchemaType, Reply: object, Params: getUserByIdType }>(
    '/:id',
    {
      schema: {
        body: PatchUserSchema,
        params: getUserByIdSchema
      }
    },
     async (request, reply) => {
      const userData = request.body;
      if(Object.keys(userData).length == 0){
        return reply.status(422).send({message: "Provide at least one column to update."});
      }
      const id  = request.params.id;
      if(userData?.password) {
        const isStrongPass = await isStrongPassword(userData.password);
        if(!isStrongPass) {
          return reply.status(422).send({message: "Provide a strong password"});
        }
        userData.password = await generatePasswordHash(userData.password);
      }
      const user = await updateUserById(id, userData);
      if(user.length == 0) {
        return reply.status(404).send({message: "user not found"});
      }
      reply.status(201).send({message: "User Updated", data: user});
  })
 
}

export default users;
