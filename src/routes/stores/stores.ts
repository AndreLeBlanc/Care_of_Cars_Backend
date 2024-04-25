import { FastifyInstance } from 'fastify'
import { PermissionTitle } from '../../services/permissionService.js'
import {
  createStore,
  deleteStore,
  Store,
  StoreName,
  StoreID,
  StorePaymentOptions,
  StoreOrgNumber,
  StoreStatus,
  StoreEmail,
  StorePhone,
  StoreAddress,
  StoreZipCode,
  StoreCity,
  StoreCountry,
  StoreCreate,
  StoreUpdateCreate,
  StoreDescription,
  StoreContactPerson,
  StoreMaxUsers,
  StoreAllowCarAPI,
  StoreAllowSendSMS,
  StoreSendSMS,
  StoreUsesCheckin,
  StoreUsesPIN,
  updateStoreByStoreID,
} from '../../services/storeService.js'
import {
  CreateStoreSchema,
  CreateStoreSchemaType,
  StoreReplySchema,
  StoreUpdateSchema,
  StoreUpdateSchemaType,
  StoreIDSchema,
  StoreIDSchemaType,
  StoreReplySchemaType,
  StoreUpdateReplySchema,
  StoreUpdateReplySchemaType,
} from './storesSchema..js'

export async function stores(fastify: FastifyInstance) {
  fastify.post<{
    Body: CreateStoreSchemaType
    Reply: { message: string; store: StoreReplySchemaType } | { message: string }
  }>(
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
          201: { message: String, store: StoreReplySchema },
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
      const createdStore:
        | {
            store: Store
            paymentInfo: StorePaymentOptions | undefined
            updatedAt: Date
            createdAt: Date
          }
        | undefined = await createStore(store)
      if (createdStore == null) {
        return reply.status(417).send({ message: "couldn't create store" })
      }

      return reply.status(201).send({
        message: 'store_created',
        store: {
          ...createdStore.store,
          createdAt: createdStore.createdAt.toISOString(),
          updatedAt: createdStore.updatedAt.toISOString(),
          storePaymentOptions: createdStore.paymentInfo,
        },
      })
    },
  )

  fastify.delete<{ Params: StoreIDSchemaType }>(
    '/:storeID',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, PermissionTitle('delete_store'))
        done()
        return reply
      },
      schema: {
        params: StoreIDSchema,
        response: {
          200: { message: String, store: StoreReplySchema },
        },
      },
    },
    async (request, reply) => {
      const storeID = StoreID(request.params.storeID)
      const deletedStore: { store: Store; createdAt: Date; updatedAt: Date } | undefined =
        await deleteStore(storeID)
      if (deletedStore == undefined || deletedStore == null) {
        return reply.status(404).send({ message: "Store doesn't exist!" })
      }
      return reply.status(200).send({
        message: 'Store deleted',
        store: {
          ...deletedStore.store,
          createdAt: deletedStore.createdAt.toISOString(),
          updatedAt: deletedStore.updatedAt.toISOString(),
        },
      })
    },
  )

  fastify.patch<{
    Params: StoreIDSchemaType
    Body: StoreUpdateSchemaType
    Reply: { message: string; store: StoreUpdateReplySchemaType } | { message: String }
  }>(
    '/:storeID',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        const permissionName = PermissionTitle('update_service_category')
        const authorizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        params: StoreIDSchema,
        body: StoreUpdateSchema,
        response: {
          201: { message: String, StoreUpdateReplySchema },
        },
      },
    },

    async (request, reply) => {
      const storeID: StoreID = StoreID(request.params.storeID)
      const store: StoreUpdateCreate = {
        storeName: StoreName(request.body.storeName),
        storeOrgNumber: StoreOrgNumber(request.body.storeOrgNumber),
        storeStatus: StoreStatus(request.body.storeStatus),
        storeEmail: StoreEmail(request.body.storeEmail),
        storePhone: StorePhone(request.body.storePhone),
        storeAddress: StoreAddress(request.body.storeAddress),
        storeZipCode: StoreZipCode(request.body.storeZipCode),
        storeCity: StoreCity(request.body.storeCity),
        storeCountry: StoreCountry(request.body.storeCountry),
        storeDescription: request.body.storeDescription
          ? StoreDescription(request.body.storeDescription)
          : undefined,
        storeContactPerson: request.body.storeContactPerson
          ? StoreContactPerson(request.body.storeContactPerson)
          : undefined,
        storeMaxUsers: request.body.storeMaxUsers
          ? StoreMaxUsers(request.body.storeMaxUsers)
          : undefined,
        storeAllowCarAPI: request.body.storeAllowCarAPI
          ? StoreAllowCarAPI(request.body.storeAllowCarAPI)
          : undefined,
        storeAllowSendSMS: request.body.storeAllowSendSMS
          ? StoreAllowSendSMS(request.body.storeAllowSendSMS)
          : undefined,
        storeSendSMS: request.body.storeSendSMS
          ? StoreSendSMS(request.body.storeSendSMS)
          : undefined,
        storeUsesCheckin: request.body.storeUsesCheckin
          ? StoreUsesCheckin(request.body.storeUsesCheckin)
          : undefined,
        storeUsesPIN: request.body.storeUsesPIN
          ? StoreUsesPIN(request.body.storeUsesPIN)
          : undefined,
      }
      const updatedStore:
        | {
            store: { store: Store; createdAt: Date; updatedAt: Date } | undefined
            paymentInfo:
              | { storePaymentOptions: StorePaymentOptions; createdAt: Date; updatedAt: Date }
              | undefined
          }
        | undefined = await updateStoreByStoreID(storeID, store)
      if (updatedStore == null) {
        return reply.status(417).send({ message: "couldn't create store" })
      }
      return reply.status(201).send({
        message: 'Store_updated',
        store: {
          store: updatedStore.store
            ? {
                ...updatedStore.store.store,
                createdAt: updatedStore.store.createdAt.toISOString(),
                updatedAt: updatedStore.store.updatedAt.toISOString(),
              }
            : undefined,
          storePaymentOptions: updatedStore.paymentInfo
            ? {
                ...updatedStore.paymentInfo.storePaymentOptions,
                createdAt: updatedStore.paymentInfo.createdAt.toISOString(),
                updatedAt: updatedStore.paymentInfo.updatedAt.toISOString(),
              }
            : undefined,
        },
      })
    },
  )
}
