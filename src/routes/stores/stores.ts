import { FastifyInstance } from 'fastify'
import { PermissionTitle } from '../../services/permissionService.js'
import {
  createStore,
  deleteStore,
  Store,
  StoreName,
  StoreOrgNumber,
  StoreStatus,
  StoreEmail,
  StorePhone,
  StoreAddress,
  StoreZipCode,
  StoreCity,
  StoreCountry,
  StoreCreate,
} from '../../services/storeService.js'
import {
  CreateStoreSchema,
  CreateStoreSchemaType,
  StoreReplySchema,
  StoreDeleteSchema,
  StoreDeleteSchemaType,
} from './storesSchema..js'

export async function stores(fastify: FastifyInstance) {
  fastify.post<{ Body: CreateStoreSchemaType; Reply: object }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('create_store')
        const authorizeStatus = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        body: CreateStoreSchema,
        response: {
          201: { body: StoreReplySchema },
        },
      },
    },
    async (request, reply) => {
      const store: StoreCreate = {
        storeName: StoreName(request.body.storeName),
        storeOrgNumber: StoreOrgNumber(request.body.storeOrgNumber),
        storeStatus: StoreStatus(request.body.storeStatus),
        storeEmail: StoreEmail(request.body.storeEmail),
        storePhone: StorePhone(request.body.storePhone),
        storeAddress: StoreAddress(request.body.storeAddress),
        storeZipCode: StoreZipCode(request.body.storeZipCode),
        storeCity: StoreCity(request.body.storeCity),
        storeCountry: StoreCountry(request.body.storeCountry),
      }
      const createdStore: Store | undefined = await createStore(store)
      if (createdStore == null) {
        return reply.status(417).send({ message: "couldn't create store" })
      }
      return reply.status(201).send({ message: 'Service created', body: createdStore })
    },
  )
  fastify.delete<{ Params: StoreDeleteSchemaType }>(
    '/:storeOrgNumber',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, PermissionTitle('delete_store'))
        done()
        return reply
      },
      schema: {
        params: StoreDeleteSchema,
      },
    },
    async (request, reply) => {
      const storeOrgNumber = StoreOrgNumber(request.params.storeOrgNumber)
      const user: Store | undefined = await deleteStore(storeOrgNumber)
      if (user == undefined || user == null) {
        return reply.status(404).send({ message: "Store doesn't exist!" })
      }
      return reply.status(200).send({ message: 'Store deleted' })
    },
  )
}
