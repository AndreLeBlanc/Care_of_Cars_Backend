import { FastifyPluginAsync } from "fastify"
import { CreateUser, CreateUserReply, CreateUserReplyType, CreateUserType, ListUserQueryParam, ListUserQueryParamType } from "./schema"
import { createUser, getUsersPaginate } from "../../services/userService"

const users: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<{Querystring: ListUserQueryParamType}>('/',
  {
    schema: {
      querystring: ListUserQueryParam
      },
    },
    async (request, reply) => {
      const {search, limit, currentPage} = request.query;
      const result = await getUsersPaginate(search || '', limit, currentPage);
      let message = 'No users found!'
      if(result.data.length > 0) {
        message = result.data.length + ' users found'
      }

      return { message: message, totalItems:  result.totalItems, totalPage: result.totalPage, currentPage: currentPage, limit: limit, result: result.data }
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
      //const { firstName, lastName, email, role } = request.body;
      await createUser(request.body)
      reply.status(201).send(request.body);
  })
 
}

export default users;
