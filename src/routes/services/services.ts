import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { CreateServiceSchema, CreateServiceSchemaType } from './serviceSchema'
import { createService } from '../../services/serviceService'

const services: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  fastify.post<{ Body: CreateServiceSchemaType; Reply: object }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = 'create_service'
        const authrosieStatus = await fastify.authorize(request, reply, permissionName)
        if (!authrosieStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        body: CreateServiceSchema,
        response: {},
      },
    },
    async (request, reply) => {
      const service = request.body
      const serviceData = await createService(service)
      reply.status(201).send({ message: 'Service created', data: serviceData })
    },
  )
}
export default services
