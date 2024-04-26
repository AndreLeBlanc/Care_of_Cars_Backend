import { FastifyInstance } from 'fastify'
import { PermissionTitle } from '../../services/permissionService.js'
import {
  NextPageUrl,
  PreviousPageUrl,
  ResponseMessage,
  Offset,
  Search,
  Limit,
  Page,
  ResultCount,
  RequestUrl,
  ModelName,
} from '../../plugins/pagination.js'

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
  StoreBankgiro,
  StoreMaybePaymentOptions,
  StorePlusgiro,
  StorePaymentdays,
  StoreSendSMS,
  StoreUsesCheckin,
  StoreUsesPIN,
  StoreWithSeparateDates,
  updateStoreByStoreID,
  getStoreByID,
  getStoresPaginate,
  StoresPaginated,
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
  storeReplyMessageType,
  ListStoresQueryParam,
  ListStoresQueryParamType,
  storeReplyMessage,
} from './storesSchema..js'

export async function stores(fastify: FastifyInstance) {
  fastify.post<{
    Body: CreateStoreSchemaType
    Reply: { message: storeReplyMessageType; store: StoreReplySchemaType } | storeReplyMessageType
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
          201: { storeReplyMessage, store: StoreReplySchema },
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
          200: { storeReplyMessage, store: StoreReplySchema },
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
    Reply: (storeReplyMessageType & { store: StoreUpdateReplySchemaType }) | storeReplyMessageType
  }>(
    '/:storeID',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        const permissionName = PermissionTitle('update_store')
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
          201: { storeReplyMessage, store: StoreUpdateReplySchema },
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
      const paymentPatch: StoreMaybePaymentOptions = request.body.storePaymentOptions
        ? {
            bankgiro: request.body.storePaymentOptions.bankgiro
              ? StoreBankgiro(request.body.storePaymentOptions.bankgiro)
              : undefined,
            plusgiro: request.body.storePaymentOptions.plusgiro
              ? StorePlusgiro(request.body.storePaymentOptions.plusgiro)
              : undefined,
            paymentdays: request.body.storePaymentOptions.paymentdays
              ? StorePaymentdays(request.body.storePaymentOptions.paymentdays)
              : undefined,
          }
        : undefined

      let updatedStore: StoreWithSeparateDates | undefined
      if (paymentPatch == null) {
        updatedStore = await updateStoreByStoreID(storeID, store)
      } else {
        updatedStore = await updateStoreByStoreID(storeID, store, paymentPatch)
      }
      console.log(updatedStore)

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

  fastify.get<{
    Params: StoreIDSchemaType
    Reply: (storeReplyMessageType & { store: StoreUpdateReplySchemaType }) | storeReplyMessageType
  }>(
    '/:storeID',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, PermissionTitle('view_store'))
        done()
        return reply
      },

      schema: {
        params: StoreIDSchema,
        response: {
          200: { storeReplyMessage, store: StoreUpdateReplySchema },
        },
      },
    },
    async (request, reply) => {
      const storeID: StoreID = StoreID(request.params.storeID)
      const fetchedStore: StoreWithSeparateDates = await getStoreByID(storeID)
      if (fetchedStore == null) {
        return reply.status(404).send({ message: 'store not found' })
      }
      return reply.status(200).send({
        message: 'store  found',

        store: {
          store: fetchedStore.store
            ? {
                ...fetchedStore.store.store,
                createdAt: fetchedStore.store.createdAt.toISOString(),
                updatedAt: fetchedStore.store.updatedAt.toISOString(),
              }
            : undefined,
          storePaymentOptions: fetchedStore.paymentInfo
            ? {
                ...fetchedStore.paymentInfo.storePaymentOptions,
                createdAt: fetchedStore.paymentInfo.createdAt.toISOString(),
                updatedAt: fetchedStore.paymentInfo.updatedAt.toISOString(),
              }
            : undefined,
        },
      })
    },
  )

  fastify.get<{ Querystring: ListStoresQueryParamType }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('list_stores')
        if (!(await fastify.authorize(request, reply, permissionName))) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },

      schema: {
        querystring: ListStoresQueryParam,
        response: {
          200: { storeReplyMessage, store: StoreUpdateReplySchema },
        },
      },
    },
    async (request, reply) => {
      let { search = '', limit = 10, page = 1 } = request.query
      const offset: Offset = fastify.findOffset(Limit(limit), Page(page))

      const stores: StoresPaginated = await getStoresPaginate(
        Search(search),
        Limit(limit),
        Page(page),
        offset,
      )
      let message: ResponseMessage = fastify.responseMessage(
        ModelName('stores'),
        ResultCount(stores.data.length),
      )
      let requestUrl: RequestUrl = RequestUrl(
        request.protocol + '://' + request.hostname + request.url,
      )
      const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
        requestUrl,
        Page(stores.totalPage),
        Page(page),
      )
      const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
        requestUrl,
        Page(stores.totalPage),
        Page(page),
      )

      return reply.status(200).send({
        message: message,
        totalStores: stores.totalStores,
        nextUrl: nextUrl,
        previousUrl: previousUrl,
        totalPage: stores.totalPage,
        page: page,
        limit: limit,
        data: stores.data,
      })
    },
  )
}
