import { FastifyPluginAsync } from "fastify"
import { getRolesPaginate } from "../../services/roleService";
import { ListRoleQueryParam, ListRoleQueryParamType } from "./roleSchema";

const roles: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<{Querystring: ListRoleQueryParamType}>('/', 
  {
    schema: {
        querystring: ListRoleQueryParam,
        },
  },
  async function (request, reply) {
    let {search='', limit=10, page=1} = request.query;
    const offset = fastify.findOffset(limit, page)
    const result = await getRolesPaginate(search, limit, page, offset);
    let message: string = fastify.responseMessage("roles", result.data.length)
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
}

export default roles;
