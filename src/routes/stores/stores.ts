import { FastifyInstance } from 'fastify'
import { PermissionTitle } from '../../services/permissionService.js'

import {
  Limit,
  ModelName,
  NextPageUrl,
  Offset,
  Page,
  PreviousPageUrl,
  RequestUrl,
  ResponseMessage,
  ResultCount,
  Search,
} from '../../plugins/pagination.js'

import {
  Day,
  DayClose,
  DayOpen,
  FridayClose,
  FridayNote,
  FridayOpen,
  FromDate,
  MondayClose,
  MondayNote,
  MondayOpen,
  Notes,
  OpeningHours,
  SaturdayClose,
  SaturdayNote,
  SaturdayOpen,
  Store,
  StoreAddress,
  StoreAllowCarAPI,
  StoreAllowSendSMS,
  StoreBankgiro,
  StoreCity,
  StoreContactPerson,
  StoreCountry,
  StoreCreate,
  StoreDescription,
  StoreEmail,
  StoreID,
  StoreMaxUsers,
  StoreMaybePaymentOptions,
  StoreName,
  StoreOrgNumber,
  StorePaymentOptions,
  StorePaymentdays,
  StorePhone,
  StorePlusgiro,
  StoreSendSMS,
  StoreSpecialHours,
  StoreSpecialHoursCreate,
  StoreStatus,
  StoreUpdateCreate,
  StoreUsesCheckin,
  StoreUsesPIN,
  StoreWithSeparateDates,
  StoreZipCode,
  StoresPaginated,
  SundayClose,
  SundayNote,
  SundayOpen,
  ThursdayClose,
  ThursdayNote,
  ThursdayOpen,
  ToDate,
  TuesdayClose,
  TuesdayNote,
  TuesdayOpen,
  WednesdayClose,
  WednesdayNote,
  WednesdayOpen,
  Week,
  WeekNote,
  WeekOpeningHours,
  WeekOpeningHoursCreate,
  createSpecialOpeningHours,
  createStore,
  deleteSpecialOpeningHoursByDayAndStore,
  deleteStore,
  deleteWeeklyNotes,
  deleteWeeklyOpeningHours,
  getOpeningHours,
  getStoreByID,
  getStoresPaginate,
  getWeeklyNotes,
  updateSpecialOpeningHours,
  updateStoreByStoreID,
  updateWeeklyNotes,
  updateWeeklyOpeningHours,
} from '../../services/storeService.js'

import {
  CreateStoreSchema,
  CreateStoreSchemaType,
  GetOpeningHours,
  GetOpeningHoursType,
  ListStoresQueryParam,
  ListStoresQueryParamType,
  StoreIDAndDaySchema,
  StoreIDAndDaySchemaType,
  StoreIDSchema,
  StoreIDSchemaType,
  StoreIDWeekSchema,
  StoreIDWeekSchemaType,
  StoreNotes,
  StoreNotesType,
  StoreOpeningHours,
  StoreOpeningHoursCreate,
  StoreOpeningHoursCreateType,
  StoreOpeningHoursType,
  StoreOpeningHoursWithSpecial,
  StorePaginateReply,
  StoreReplySchema,
  StoreReplySchemaType,
  StoreSpecialHoursSchema,
  StoreSpecialHoursSchemaCreate,
  StoreSpecialHoursSchemaCreateType,
  StoreSpecialHoursSchemaType,
  StoreUpdateReplySchema,
  StoreUpdateReplySchemaType,
  StoreUpdateSchema,
  StoreUpdateSchemaType,
  StoreWeeklyNotes,
  StoreWeeklyNotesType,
  WeekSchema,
  WeekSchemaType,
  storeReplyMessage,
  storeReplyMessageType,
} from './storesSchema..js'

export async function stores(fastify: FastifyInstance) {
  fastify.put<{
    Body: StoreWeeklyNotesType
    Reply: { message: storeReplyMessageType; notes: StoreWeeklyNotesType } | storeReplyMessageType
  }>(
    '/weekly-notes',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('put_store_weekly_notes')
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
        body: StoreWeeklyNotes,
        response: {
          201: { storeReplyMessage, notes: StoreWeeklyNotes },
        },
      },
    },
    async (request, reply) => {
      const week: Week = Week(new Date(request.body.week))
      const notes: Notes = {
        storeID: StoreID(request.body.storeID),
        weekNote: WeekNote(request.body.weekNote),
        mondayNote: MondayNote(request.body.mondayNote),
        tuesdayNote: TuesdayNote(request.body.tuesdayNote),
        wednesdayNote: WednesdayNote(request.body.wednesdayNote),
        thursdayNote: ThursdayNote(request.body.thursdayNote),
        fridayNote: FridayNote(request.body.fridayNote),
        saturdayNote: SaturdayNote(request.body.saturdayNote),
        sundayNote: SundayNote(request.body.sundayNote),
      }

      const maybeWeekNotes: { notes: Notes; week: Week } | undefined = await updateWeeklyNotes(
        notes,
        week,
      )
      if (maybeWeekNotes != null) {
        reply.status(200).send({
          message: { message: 'weekly notes inserted' },
          notes: { week: maybeWeekNotes.week.toISOString(), ...maybeWeekNotes.notes },
        })
      }
      reply.status(417).send({ message: "Couldn't creat or update notes" })
    },
  )

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
        storeDescription: request.body.storeDescription
          ? StoreDescription(request.body.storeDescription)
          : undefined,
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

  fastify.delete<{
    Params: StoreIDWeekSchemaType
    Reply:
      | (storeReplyMessageType & { notes: StoreNotesType } & WeekSchemaType)
      | storeReplyMessageType
  }>(
    '/weekly-notes/:storeID/:week/',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.params.week)
        fastify.authorize(request, reply, PermissionTitle('delete_weekly_notes'))
        done()
        return reply
      },
      schema: {
        params: StoreIDWeekSchema,
        response: {
          200: { ...storeReplyMessage, notes: StoreNotes, ...WeekSchema },
        },
      },
    },
    async (request, reply) => {
      const storeID = StoreID(request.params.storeID)
      const week = Week(new Date(request.params.week))
      const deletedNotes: { notes: Notes; week: Week } | undefined = await deleteWeeklyNotes(
        storeID,
        week,
      )
      if (deletedNotes == null) {
        return reply.status(404).send({ message: 'notes do not exist!' })
      }
      return reply.status(200).send({
        message: 'Notes deleted',
        notes: deletedNotes.notes,
        week: deletedNotes.week.toISOString(),
      })
    },
  )

  fastify.get<{
    Params: StoreIDWeekSchemaType
    Reply:
      | (storeReplyMessageType & { notes: StoreNotesType } & WeekSchemaType)
      | storeReplyMessageType
  }>(
    '/weekly-notes/:storeID/:week',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, PermissionTitle('get_weekly_notes'))
        done()
        return reply
      },
      schema: {
        params: StoreIDWeekSchema,
        response: {
          200: { storeReplyMessage, notes: StoreNotes, WeekSchema },
        },
      },
    },
    async (request, reply) => {
      const storeID = StoreID(request.params.storeID)
      const week = Week(new Date(request.params.week))
      const getNotes: { notes: Notes; week: Week } | undefined = await getWeeklyNotes(storeID, week)
      if (getNotes == null) {
        return reply.status(404).send({ message: 'notes do not exist!' })
      }
      return reply.status(200).send({
        message: 'Notes gotten',
        notes: getNotes.notes,
        week: getNotes.week.toISOString(),
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
          200: StorePaginateReply,
        },
      },
    },
    async (request, reply) => {
      const { search = '', limit = 10, page = 1 } = request.query
      const offset: Offset = fastify.findOffset(Limit(limit), Page(page))

      const stores: StoresPaginated = await getStoresPaginate(
        Search(search),
        Limit(limit),
        Page(page),
        offset,
      )
      const message: ResponseMessage = fastify.responseMessage(
        ModelName('stores'),
        ResultCount(stores.data.length),
      )
      const requestUrl: RequestUrl = RequestUrl(
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

  fastify.post<{
    Body: StoreOpeningHoursCreateType
    Reply: StoreOpeningHoursType | storeReplyMessageType
  }>(
    '/store-opening-hours',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('set_store_opening_hours')
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
        body: StoreOpeningHoursCreate,
        response: {
          201: StoreOpeningHours,
        },
      },
    },
    async (request, reply) => {
      const storeID = StoreID(request.body.storeID)
      const store: WeekOpeningHoursCreate = {
        mondayOpen: MondayOpen(request.body.mondayOpen ? request.body.mondayOpen : null),
        mondayClose: MondayClose(request.body.mondayClose ? request.body.mondayClose : null),
        tuesdayOpen: TuesdayOpen(request.body.tuesdayOpen ? request.body.tuesdayOpen : null),
        tuesdayClose: TuesdayClose(request.body.tuesdayClose ? request.body.tuesdayClose : null),
        wednesdayOpen: WednesdayOpen(
          request.body.wednesdayOpen ? request.body.wednesdayOpen : null,
        ),
        wednesdayClose: WednesdayClose(
          request.body.wednesdayClose ? request.body.wednesdayClose : null,
        ),
        thursdayOpen: ThursdayOpen(request.body.thursdayOpen ? request.body.thursdayOpen : null),
        thursdayClose: ThursdayClose(
          request.body.thursdayClose ? request.body.thursdayClose : null,
        ),
        fridayOpen: FridayOpen(request.body.fridayOpen ? request.body.fridayOpen : null),
        fridayClose: FridayClose(request.body.fridayClose ? request.body.fridayClose : null),
        saturdayOpen: SaturdayOpen(request.body.saturdayOpen ? request.body.saturdayOpen : null),
        saturdayClose: SaturdayClose(
          request.body.saturdayClose ? request.body.saturdayClose : null,
        ),
        sundayOpen: SundayOpen(request.body.sundayOpen ? request.body.sundayOpen : null),
        sundayClose: SundayClose(request.body.sundayClose ? request.body.sundayClose : null),
      }

      const updatedHours: WeekOpeningHours | undefined = await updateWeeklyOpeningHours(
        storeID,
        store,
      )
      if (updatedHours == null) {
        return reply.status(417).send({ message: "couldn't create store opening hours" })
      }
      reply.status(201).send({ message: 'store opening hours updated', ...updatedHours })
    },
  )

  fastify.delete<{ Params: StoreIDSchemaType }>(
    '/store-opening-hours/:storeID',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, PermissionTitle('delete_store_opening_hours'))
        done()
        return reply
      },
      schema: {
        params: StoreIDSchema,
        response: {
          200: StoreOpeningHours,
        },
      },
    },
    async (request, reply) => {
      const storeID = StoreID(request.params.storeID)
      const deletedStore: WeekOpeningHours | undefined = await deleteWeeklyOpeningHours(storeID)
      if (deletedStore == undefined || deletedStore == null) {
        return reply.status(404).send({ message: "Store doesn't exist!" })
      }
      return reply.status(200).send({
        message: 'Store deleted',

        ...deletedStore,
      })
    },
  )

  fastify.post<{
    Body: StoreSpecialHoursSchemaCreateType
    Reply: StoreSpecialHoursSchemaType | storeReplyMessageType
  }>(
    '/store-special-opening-hours',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('create_store_special_opening_hours')
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
        body: StoreSpecialHoursSchemaCreate,
        response: {
          201: StoreSpecialHoursSchema,
        },
      },
    },
    async (request, reply) => {
      const storeSpecialHours: StoreSpecialHoursCreate = {
        storeID: StoreID(request.body.storeID),
        day: Day(new Date(request.body.day)),
        dayOpen: DayOpen(request.body.dayOpen),
        dayClose: DayClose(request.body.dayClose),
      }

      const updatedHours: StoreSpecialHours | undefined = await createSpecialOpeningHours(
        storeSpecialHours,
      )
      if (updatedHours == null) {
        return reply.status(417).send({ message: "couldn't create store opening hours" })
      }
      reply.status(201).send({ message: 'store opening hours created', ...updatedHours })
    },
  )

  fastify.patch<{
    Body: StoreSpecialHoursSchemaType
    Reply: StoreSpecialHoursSchemaType | storeReplyMessageType
  }>(
    '/store-special-opening-hours',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('update_store_special_opening_hours')
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
        body: StoreSpecialHoursSchema,
        response: {
          201: StoreSpecialHoursSchema,
        },
      },
    },
    async (request, reply) => {
      const storeSpecialHours: StoreSpecialHours = {
        storeID: StoreID(request.body.storeID),
        day: Day(new Date(request.body.day)),
        dayOpen: DayOpen(request.body.dayOpen),
        dayClose: DayClose(request.body.dayClose),
      }

      const updatedHours: StoreSpecialHours | undefined = await updateSpecialOpeningHours(
        storeSpecialHours,
      )
      if (updatedHours == null) {
        return reply.status(417).send({ message: "couldn't create store opening hours" })
      }
      reply.status(201).send({ message: 'store opening hours updated', ...updatedHours })
    },
  )

  fastify.delete<{
    Params: StoreIDAndDaySchemaType
    Reply: StoreSpecialHoursSchemaType | storeReplyMessageType
  }>(
    '/store-special-opening-hours/:storeID/:day',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('delete_store_special_opening_hours')
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
        params: StoreIDAndDaySchema,
        response: {
          200: StoreSpecialHoursSchema,
        },
      },
    },
    async (request, reply) => {
      const storeID: StoreID = StoreID(request.params.storeID)
      const day: Day = Day(new Date(request.params.day))

      const deletedHours: StoreSpecialHours | undefined =
        await deleteSpecialOpeningHoursByDayAndStore(day, storeID)
      if (deletedHours == null) {
        return reply.status(417).send({ message: "couldn't delete store opening hours" })
      }
      reply.status(200).send({ message: 'store opening hours deleted', ...deletedHours })
    },
  )

  fastify.get<{
    Querystring: GetOpeningHoursType
    Reply: StoreSpecialHoursSchemaType | storeReplyMessageType
  }>(
    '/store-opening-hours',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('get_store_opening_hours')
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
        querystring: GetOpeningHours,
        response: {
          200: StoreOpeningHoursWithSpecial,
        },
      },
    },
    async (request, reply) => {
      const storeID: StoreID = StoreID(request.query.storeID)
      const from: FromDate = FromDate(new Date(request.query.from))
      const to: ToDate = ToDate(new Date(request.query.to))

      const openingHours: OpeningHours | undefined = await getOpeningHours(storeID, from, to)
      if (openingHours == null) {
        return reply.status(417).send({ message: "couldn't get store opening hours" })
      }
      reply
        .status(200)
        .send({ message: 'store opening hours fetched', storeID: storeID, ...openingHours })
    },
  )
}
