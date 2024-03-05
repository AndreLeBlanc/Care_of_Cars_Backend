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
      let {search='', limit=10, page=1} = request.query;
      const offset = fastify.findOffset(limit, page)
      const result = await getUsersPaginate(search, limit, page, offset);
      let message: string = fastify.responseMessage("users", result.data.length)
      let nextUrl: string | null = request.protocol + '://' + request.hostname + request.url;
      let previousUrl: string | null = request.protocol + '://' + request.hostname + request.url;
      if(result.totalPage > page  && result.totalPage > 1) {
        const nextPage = page + 1
        nextUrl = nextUrl.replace(/(page=)[^\&]+/, '$1' + nextPage);
      } else {
        nextUrl = null;
      }
      if(page != 1 && result.totalPage > 1) {
        const previousPage = page - 1
        previousUrl = previousUrl.replace(/(page=)[^\&]+/, '$1' + previousPage);
      } else {
        previousUrl = null;
      }

      return { message: message, totalItems:  result.totalItems, nextUrl:nextUrl, previousUrl: previousUrl, totalPage: result.totalPage, page: page, limit: limit, result: result.data }
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
