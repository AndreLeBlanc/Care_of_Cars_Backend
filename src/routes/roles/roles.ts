import { FastifyPluginAsync } from "fastify"
import { createRole, getRolesPaginate, getRoleById } from "../../services/roleService";
import { CreateRoleSchema, CreateRoleSchemaType, ListRoleQueryParamSchema, ListRoleQueryParamSchemaType, getRoleByIdSchema, getRoleByIdType } from "./roleSchema";

const roles: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<{Querystring: ListRoleQueryParamSchemaType}>('/', 
  {
    onRequest: [fastify.authenticate],
    schema: {
        querystring: ListRoleQueryParamSchema,
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
  fastify.post<{ Body: CreateRoleSchemaType, Reply: object }>(
    '/',
    {
      onRequest: [fastify.authenticate],
      schema: {
      body: CreateRoleSchema,
        response: {
        },
      }
    },
     async (request, reply) => {
      const { roleName, description='' } = request.body;
      const role = await createRole(roleName, description);
      reply.status(201).send({message: "Role created", data: role});
  })
  fastify.get<{Params: getRoleByIdType }>(
    '/:id',
    {
      onRequest: [fastify.authenticate],
      schema: {
        params: getRoleByIdSchema
      }
    },
     async (request, reply) => {
      const id  = request.params.id;
      const role = await getRoleById(id);
      if(role == null) {
        return reply.status(404).send({message: "role not found"});
      }
      reply.status(200).send(role);
  })
}

export default roles;

