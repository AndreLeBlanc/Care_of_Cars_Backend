import { FastifyPluginAsync } from "fastify"
import { CreateUser, CreateUserReply, CreateUserReplyType, CreateUserType, ListUserQueryParam, ListUserQueryParamType } from "./schema"
import { createUser, getUsersPaginate } from "../../services/userService"

const users: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<{Querystring: ListUserQueryParamType}>('/',
  {
    onRequest: [fastify.authenticate],
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
        result: result.data 
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
      //const { firstName, lastName, email, role } = request.body;
      await createUser(request.body)
      reply.status(201).send(request.body);
  })
 
}

export default users;
