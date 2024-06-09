import { FastifyInstance } from 'fastify'

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
  MondayClose,
  MondayNote,
  MondayOpen,
  PermissionTitle,
  SaturdayClose,
  SaturdayNote,
  SaturdayOpen,
  StoreAddress,
  StoreAllowCarAPI,
  StoreAllowSendSMS,
  StoreBankgiro,
  StoreCity,
  StoreContactPerson,
  StoreCountry,
  StoreDescription,
  StoreEmail,
  StoreFSkatt,
  StoreID,
  StoreMaxUsers,
  StoreName,
  StoreOrgNumber,
  StorePaymentdays,
  StorePhone,
  StorePlusgiro,
  StoreSendSMS,
  StoreStatus,
  StoreUsesCheckin,
  StoreUsesPIN,
  StoreVatNumber,
  StoreWebSite,
  StoreZipCode,
  SundayClose,
  SundayNote,
  SundayOpen,
  ThursdayClose,
  ThursdayNote,
  ThursdayOpen,
  TuesdayClose,
  TuesdayNote,
  TuesdayOpen,
  WednesdayClose,
  WednesdayNote,
  WednesdayOpen,
  Week,
  WeekNote,
} from '../../schema/schema.js'

import {
  Notes,
  OpeningHours,
  Store,
  StoreCreate,
  StoreMaybePaymentOptions,
  StorePaymentOptions,
  StoreSpecialHours,
  StoreSpecialHoursCreate,
  StoreUpdateCreate,
  StoreWithSeparateDates,
  StoresPaginated,
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
  StorePaginateReplyType,
  StoreReplyMessage,
  StoreReplyMessageType,
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
} from './storesSchema..js'

import { Either, match } from '../../utils/helper.js'

export async function stores(fastify: FastifyInstance) {
  fastify.put<{
    Body: StoreWeeklyNotesType
    Reply: { message: StoreReplyMessageType; notes: StoreWeeklyNotesType } | StoreReplyMessageType
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
          201: { StoreReplyMessage, notes: StoreWeeklyNotes },
        },
      },
    },
    async (request, reply) => {
      const week: Week = Week(new Date(request.body.week))
      const notes: Notes = {
        storeID: StoreID(request.body.storeID),
        weekNote: request.body.weekNote ? WeekNote(request.body.weekNote) : undefined,
        mondayNote: request.body.mondayNote ? MondayNote(request.body.mondayNote) : undefined,
        tuesdayNote: request.body.tuesdayNote ? TuesdayNote(request.body.tuesdayNote) : undefined,
        wednesdayNote: request.body.wednesdayNote
          ? WednesdayNote(request.body.wednesdayNote)
          : undefined,
        thursdayNote: request.body.thursdayNote
          ? ThursdayNote(request.body.thursdayNote)
          : undefined,
        fridayNote: request.body.fridayNote ? FridayNote(request.body.fridayNote) : undefined,
        saturdayNote: request.body.saturdayNote
          ? SaturdayNote(request.body.saturdayNote)
          : undefined,
        sundayNote: request.body.sundayNote ? SundayNote(request.body.sundayNote) : undefined,
      }

      const maybeWeekNotes: Either<
        string,
        {
          notes: Notes
          week: Week
        }
      > = await updateWeeklyNotes(notes, week)
      match(
        maybeWeekNotes,
        (notes) => {
          reply.status(200).send({
            message: { message: 'weekly notes inserted' },
            notes: { week: notes.week.toISOString(), ...notes.notes },
          })
        },
        (err) => reply.status(417).send({ message: err }),
      )
    },
  )

  fastify.post<{
    Body: CreateStoreSchemaType
    Reply: (StoreReplyMessageType & { store: StoreReplySchemaType }) | StoreReplyMessageType
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
          201: { StoreReplyMessage, store: StoreReplySchema },
          417: StoreReplyMessage,
        },
      },
    },
    async (request, reply) => {
      const store: StoreCreate = {
        storeWebSite: request.body.storeWebSite
          ? StoreWebSite(request.body.storeWebSite)
          : undefined,
        storeVatNumber: request.body.storeVatNumber
          ? StoreVatNumber(request.body.storeVatNumber)
          : undefined,
        storeFSkatt: StoreFSkatt(request.body.storeFSkatt),
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
      const createdStore: Either<
        string,
        {
          store: Store
          paymentInfo: StorePaymentOptions | undefined
          updatedAt: Date
          createdAt: Date
        }
      > = await createStore(store)

      match(
        createdStore,

        (newStore) => {
          return reply.status(201).send({
            message: 'store created',
            store: {
              ...newStore.store,
              createdAt: newStore.createdAt.toISOString(),
              updatedAt: newStore.updatedAt.toISOString(),
              storePaymentOptions: newStore.paymentInfo,
            },
          })
        },
        (err) => {
          return reply.status(417).send({ message: err })
        },
      )
    },
  )

  fastify.delete<{ Params: StoreIDSchemaType }>(
    '/:storeID',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('delete_store'))
        done()
        return reply
      },
      schema: {
        params: StoreIDSchema,
        response: {
          200: { StoreReplyMessage, store: StoreReplySchema },
          404: StoreReplyMessage,
        },
      },
    },
    async (request, reply) => {
      const storeID = StoreID(request.params.storeID)
      const deletedStore: Either<
        string,
        {
          store: Store
          createdAt: Date
          updatedAt: Date
        }
      > = await deleteStore(storeID)
      if (deletedStore == undefined || deletedStore == null) {
        return reply.status(404).send({ message: "Store doesn't exist!" })
      }
      match(
        deletedStore,
        (store) => {
          return reply.status(200).send({
            message: 'Store deleted',
            store: {
              ...store.store,
              createdAt: store.createdAt.toISOString(),
              updatedAt: store.updatedAt.toISOString(),
            },
          })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.delete<{
    Params: StoreIDWeekSchemaType
    Reply:
      | (StoreReplyMessageType & { notes: StoreNotesType } & WeekSchemaType)
      | StoreReplyMessageType
  }>(
    '/weekly-notes/:storeID/:week/',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('delete_weekly_notes'))
        done()
        return reply
      },
      schema: {
        params: StoreIDWeekSchema,
        response: {
          200: { ...StoreReplyMessage, notes: StoreNotes, ...WeekSchema },
          404: StoreReplyMessage,
        },
      },
    },
    async (request, reply) => {
      const storeID = StoreID(request.params.storeID)
      const week = Week(new Date(request.params.week))
      const deletedNotes: Either<string, { notes: Notes; week: Week }> = await deleteWeeklyNotes(
        storeID,
        week,
      )
      match(
        deletedNotes,
        (notes) => {
          return reply.status(200).send({
            message: 'Notes deleted',
            notes: notes.notes,
            week: notes.week.toISOString(),
          })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Params: StoreIDWeekSchemaType
    Reply:
      | (StoreReplyMessageType & { notes: StoreNotesType } & WeekSchemaType)
      | StoreReplyMessageType
  }>(
    '/weekly-notes/:storeID/:week',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('get_weekly_notes'))
        done()
        return reply
      },
      schema: {
        params: StoreIDWeekSchema,
        response: {
          200: { StoreReplyMessage, notes: StoreNotes, WeekSchema },
          404: StoreReplyMessage,
        },
      },
    },
    async (request, reply) => {
      const storeID = StoreID(request.params.storeID)
      const week = Week(new Date(request.params.week))
      const getNotes: Either<string, { notes: Notes; week: Week }> = await getWeeklyNotes(
        storeID,
        week,
      )
      match(
        getNotes,
        (weeklyNotes) => {
          return reply.status(200).send({
            message: 'Notes gotten',
            notes: weeklyNotes.notes,
            week: weeklyNotes.week.toISOString(),
          })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.patch<{
    Params: StoreIDSchemaType
    Body: StoreUpdateSchemaType
    Reply: (StoreReplyMessageType & { store: StoreUpdateReplySchemaType }) | StoreReplyMessageType
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
          201: { StoreReplyMessage, store: StoreUpdateReplySchema },
          404: StoreReplyMessage,
        },
      },
    },

    async (request, reply) => {
      const storeID: StoreID = StoreID(request.params.storeID)
      const store: StoreUpdateCreate = {
        storeName: StoreName(request.body.storeName),
        storeWebSite: request.body.storeWebSite
          ? StoreWebSite(request.body.storeWebSite)
          : undefined,
        storeVatNumber: request.body.storeVatNumber
          ? StoreVatNumber(request.body.storeVatNumber)
          : undefined,
        storeFSkatt: StoreFSkatt(request.body.storeFSkatt),
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

      let updatedStore: Either<string, StoreWithSeparateDates>
      if (paymentPatch == null) {
        updatedStore = await updateStoreByStoreID(storeID, store)
      } else {
        updatedStore = await updateStoreByStoreID(storeID, store, paymentPatch)
      }

      match(
        updatedStore,
        (store) => {
          return reply.status(201).send({
            message: 'Store_updated',
            store: {
              store: store.store
                ? {
                    ...store.store.store,
                    createdAt: store.store.createdAt.toISOString(),
                    updatedAt: store.store.updatedAt.toISOString(),
                  }
                : undefined,
              storePaymentOptions: store.paymentInfo
                ? {
                    ...store.paymentInfo.storePaymentOptions,
                    createdAt: store.paymentInfo.createdAt.toISOString(),git 
                    updatedAt: store.paymentInfo.updatedAt.toISOString(),
                  }
                : undefined,
            },
          })
        },

        (err) => {
          return reply.status(417).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Params: StoreIDSchemaType
    Reply: (StoreReplyMessageType & { store: StoreUpdateReplySchemaType }) | StoreReplyMessageType
  }>(
    '/:storeID',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('view_store'))
        done()
        return reply
      },

      schema: {
        params: StoreIDSchema,
        response: {
          200: { StoreReplyMessage, store: StoreUpdateReplySchema },
          404: StoreReplyMessage,
        },
      },
    },
    async (request, reply) => {
      const storeID: StoreID = StoreID(request.params.storeID)
      const fetchedStore: Either<string, StoreWithSeparateDates> = await getStoreByID(storeID)
      match(
        fetchedStore,
        (fetchedStore) => {
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
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Querystring: ListStoresQueryParamType
    Reply: StorePaginateReplyType | StoreReplyMessageType
  }>(
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
          404: StoreReplyMessage,
        },
      },
    },
    async (request, reply) => {
      const { search = '', limit = 10, page = 1 } = request.query
      const offset: Offset = fastify.findOffset(Limit(limit), Page(page))

      const stores: Either<string, StoresPaginated> = await getStoresPaginate(
        Search(search),
        Limit(limit),
        Page(page),
        offset,
      )
      match(
        stores,
        (stores) => {
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
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.post<{
    Body: StoreOpeningHoursCreateType
    Reply: StoreOpeningHoursType | StoreReplyMessageType
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
          404: StoreReplyMessage,
        },
      },
    },
    async (request, reply) => {
      const storeID = StoreID(request.body.storeID)
      const store: WeekOpeningHoursCreate = {
        mondayOpen: request.body.mondayOpen ? MondayOpen(request.body.mondayOpen) : undefined,
        mondayClose: request.body.mondayClose ? MondayClose(request.body.mondayClose) : undefined,
        tuesdayOpen: request.body.tuesdayOpen ? TuesdayOpen(request.body.tuesdayOpen) : undefined,
        tuesdayClose: request.body.tuesdayClose
          ? TuesdayClose(request.body.tuesdayClose)
          : undefined,
        wednesdayOpen: request.body.wednesdayOpen
          ? WednesdayOpen(request.body.wednesdayOpen)
          : undefined,
        wednesdayClose: request.body.wednesdayClose
          ? WednesdayClose(request.body.wednesdayClose)
          : undefined,
        thursdayOpen: request.body.thursdayOpen
          ? ThursdayOpen(request.body.thursdayOpen)
          : undefined,
        thursdayClose: request.body.thursdayClose
          ? ThursdayClose(request.body.thursdayClose)
          : undefined,
        fridayOpen: request.body.fridayOpen ? FridayOpen(request.body.fridayOpen) : undefined,
        fridayClose: request.body.fridayClose ? FridayClose(request.body.fridayClose) : undefined,
        saturdayOpen: request.body.saturdayOpen
          ? SaturdayOpen(request.body.saturdayOpen)
          : undefined,
        saturdayClose: request.body.saturdayClose
          ? SaturdayClose(request.body.saturdayClose)
          : undefined,
        sundayOpen: request.body.sundayOpen ? SundayOpen(request.body.sundayOpen) : undefined,
        sundayClose: request.body.sundayClose ? SundayClose(request.body.sundayClose) : undefined,
      }

      const updatedHours: Either<string, WeekOpeningHours> = await updateWeeklyOpeningHours(
        storeID,
        store,
      )

      match(
        updatedHours,
        (updatedHours: WeekOpeningHours) => {
          return reply.status(201).send({ message: 'store opening hours updated', ...updatedHours })
        },

        (err) => {
          return reply.status(417).send({ message: err })
        },
      )
    },
  )

  fastify.delete<{
    Params: StoreIDSchemaType
    Reply: (StoreOpeningHoursCreateType & StoreReplyMessageType) | StoreReplyMessageType
  }>(
    '/store-opening-hours/:storeID',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('delete_store_opening_hours'))
        done()
        return reply
      },
      schema: {
        params: StoreIDSchema,
        response: {
          200: StoreOpeningHours,
          404: StoreReplyMessage,
        },
      },
    },
    async (request, reply) => {
      const storeID = StoreID(request.params.storeID)
      const deletedStore: Either<string, WeekOpeningHours> = await deleteWeeklyOpeningHours(storeID)
      match(
        deletedStore,
        (deletedStore: WeekOpeningHours) => {
          return reply.status(200).send({
            message: 'Store deleted',

            ...deletedStore,
          })
        },

        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.post<{
    Body: StoreSpecialHoursSchemaCreateType
    Reply: StoreSpecialHoursSchemaType | StoreReplyMessageType
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
          404: StoreReplyMessage,
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

      const updatedHours: Either<string, StoreSpecialHours> = await createSpecialOpeningHours(
        storeSpecialHours,
      )
      match(
        updatedHours,
        (newOpeningHours: StoreSpecialHours) => {
          return reply
            .status(201)
            .send({ message: 'store opening hours created', ...newOpeningHours })
        },

        (err) => {
          return reply.status(417).send({ message: err })
        },
      )
    },
  )

  fastify.patch<{
    Body: StoreSpecialHoursSchemaType
    Reply: StoreSpecialHoursSchemaType | StoreReplyMessageType
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
          404: StoreReplyMessage,
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

      const updatedHours: Either<string, StoreSpecialHours> = await updateSpecialOpeningHours(
        storeSpecialHours,
      )
      match(
        updatedHours,
        (updatedHours) => {
          return reply.status(201).send({ message: 'store opening hours updated', ...updatedHours })
        },
        (err) => {
          return reply.status(417).send({ message: err })
        },
      )
    },
  )

  fastify.delete<{
    Params: StoreIDAndDaySchemaType
    Reply: StoreSpecialHoursSchemaType | StoreReplyMessageType
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
          404: StoreReplyMessage,
        },
      },
    },
    async (request, reply) => {
      const storeID: StoreID = StoreID(request.params.storeID)
      const day: Day = Day(new Date(request.params.day))

      const deletedHours: Either<string, StoreSpecialHours> =
        await deleteSpecialOpeningHoursByDayAndStore(day, storeID)
      match(
        deletedHours,
        () => {
          return reply.status(200).send({ message: 'store opening hours deleted', ...deletedHours })
        },

        (err) => {
          return reply.status(417).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Querystring: GetOpeningHoursType
    Reply: StoreSpecialHoursSchemaType | StoreReplyMessageType
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
          404: StoreReplyMessage,
        },
      },
    },
    async (request, reply) => {
      const storeID: StoreID = StoreID(request.query.storeID)
      const from: Day = Day(new Date(request.query.from))
      const to: Day = Day(new Date(request.query.to))

      const openingHours: Either<string, OpeningHours> = await getOpeningHours(storeID, from, to)
      match(
        openingHours,

        (openingHours: OpeningHours) => {
          return reply
            .status(200)
            .send({ message: 'store opening hours fetched', storeID: storeID, ...openingHours })
        },

        (err) => {
          return reply.status(417).send({ message: err })
        },
      )
    },
  )
}
