import { FastifyInstance } from 'fastify'

import {
  BookingEnd,
  BookingStart,
  EmployeeID,
  OrderID,
  OrderStatus,
  PermissionTitle,
  RentCarBookingID,
  RentCarColor,
  RentCarModel,
  RentCarNotes,
  RentCarNumber,
  RentCarRegistrationNumber,
  RentCarYear,
  StoreID,
  SubmissionTime,
} from '../../schema/schema.js'

import {
  RentCar,
  RentCarAvailablity,
  RentCarBooking,
  RentCarBookingReply,
  RentCarsPaginate,
  availableRentCars,
  createRentCar,
  createRentCarBooking,
  deleteRentCarBooking,
  deleteRentCarByRegNumber,
  editRentCar,
  getRentCarBooking,
  getRentCarByID,
  getRentCarPaginate,
} from '../../services/rentCarService.js'

import {
  AddCustomerType,
  AddRentBodySchema,
  AvailableRentCarSchema,
  AvailableRentCarSchemaType,
  AvailableRentCarsQuerySchemaType,
  CreateRentCarBookingReplySchema,
  CreateRentCarBookingReplySchemaType,
  CreateRentCarBookingSchema,
  CreateRentCarBookingSchemaType,
  DeleteRentCarSchema,
  DeleteRentCarSchemaType,
  GetRentCarQueryParamsSchema,
  GetRentCarQueryParamsSchemaType,
  ListRentCarQueryParamSchema,
  ListRentCarQueryParamSchemaType,
  MessageSchema,
  MessageSchemaType,
  PatchRentCarBodySchema,
  PatchRentCarBodySchemaType,
  RentCarBookingIDSchemaType,
} from './rentCarSchema.js'

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

import { Either, match } from '../../utils/helper.js'

export const rentCar = async (fastify: FastifyInstance) => {
  //Create Rent Cars
  fastify.post<{ Body: AddCustomerType; Reply: object }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, PermissionTitle('create_rent_car'))
        done()
        return reply
      },
      schema: {
        body: AddRentBodySchema,
      },
    },
    async (req, rep) => {
      const {
        rentCarColor,
        rentCarModel,
        rentCarRegistrationNumber,
        rentCarYear,
        rentCarNotes,
        rentCarNumber,
      } = req.body

      //todo: Store id for rent Car
      //On Login we are not assigned any storeId, we need to check this,
      // //@ts-ignore
      //      const authKey = await req.jwtDecode()

      const rentCarDetails = {
        storeID: StoreID(1),
        rentCarColor: RentCarColor(rentCarColor),
        rentCarModel: RentCarModel(rentCarModel),
        rentCarRegistrationNumber: RentCarRegistrationNumber(rentCarRegistrationNumber),
        rentCarYear: RentCarYear(rentCarYear),
        rentCarNotes: rentCarNotes ? RentCarNotes(rentCarNotes) : undefined,
        rentCarNumber: rentCarNumber ? RentCarNumber(rentCarNumber) : undefined,
      }

      const createdRentCar: Either<string, RentCar> = await createRentCar(rentCarDetails)
      match(
        createdRentCar,
        (car: RentCar) => {
          return rep.status(201).send({
            message: 'Rent Car Created successfully',
            data: car,
          })
        },
        (err) => {
          return rep.status(404).send({
            message: err,
          })
        },
      )
    },
  )

  //Get Rent Cars
  fastify.get<{ Querystring: ListRentCarQueryParamSchemaType }>(
    '/rent-cars-list',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('list_company_drivers')
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
        querystring: ListRentCarQueryParamSchema,
      },
    },
    async function (request, reply) {
      const { search = '', limit = 10, page = 1 } = request.query
      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)
      const carsList: Either<string, RentCarsPaginate> = await getRentCarPaginate(
        brandedSearch,
        brandedLimit,
        brandedPage,
        offset,
      )
      match(
        carsList,
        (cars: RentCarsPaginate) => {
          const message: ResponseMessage = fastify.responseMessage(
            ModelName('Company Drivers'),
            ResultCount(cars.data.length),
          )
          const requestUrl: RequestUrl = RequestUrl(
            request.protocol + '://' + request.hostname + request.url,
          )
          const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
            requestUrl,
            Page(cars.totalPage),
            Page(page),
          )
          const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
            requestUrl,
            Page(cars.totalPage),
            Page(page),
          )

          return reply.status(200).send({
            message,
            totalItems: cars.totalItems,
            nextUrl: nextUrl,
            previousUrl,
            totalPage: cars.totalPage,
            page: page,
            limit: limit,
            data: cars.data,
          })
        },
        (err) => {
          return reply.status(504).send({
            message: err,
          })
        },
      )
    },
  )

  //Edit rent car
  fastify.patch<{ Body: PatchRentCarBodySchemaType; Reply: object }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('update_driver')
        fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        body: PatchRentCarBodySchema,
      },
    },
    async (request, reply) => {
      const {
        rentCarColor,
        rentCarModel,
        rentCarRegistrationNumber,
        rentCarYear,
        rentCarNotes,
        rentCarNumber,
      } = request.body

      const rentCarEditDetails = {
        rentCarColor: RentCarColor(rentCarColor),
        rentCarModel: RentCarModel(rentCarModel),
        rentCarRegistrationNumber: RentCarRegistrationNumber(rentCarRegistrationNumber),
        rentCarYear: RentCarYear(rentCarYear),
        rentCarNotes: rentCarNotes ? RentCarNotes(rentCarNotes) : undefined,
        rentCarNumber: rentCarNumber ? RentCarNumber(rentCarNumber) : undefined,
      }

      const editedRentCarDetails: Either<string, RentCar> = await editRentCar(rentCarEditDetails)

      match(
        editedRentCarDetails,
        (rentalCar: RentCar) => {
          reply.status(201).send({
            message: 'Rent Car details edited',
            rentalCar,
          })
        },
        (err) => {
          reply.status(404).send({
            message: err,
          })
        },
      )
    },
  )

  //Delete rent a car
  fastify.delete<{ Params: DeleteRentCarSchemaType }>(
    '/:regNumber',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_rent_car')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: DeleteRentCarSchema,
      },
    },
    async (request, reply) => {
      const { regNumber } = request.params
      const deletedRentCar: Either<string, RentCarRegistrationNumber> =
        await deleteRentCarByRegNumber(RentCarRegistrationNumber(regNumber))
      match(
        deletedRentCar,
        (rentCar: RentCarRegistrationNumber) => {
          return reply.status(200).send({ message: 'Rent Car deleted', deletedRegNumber: rentCar })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  //Get Rent Car by Id
  fastify.get<{ Params: GetRentCarQueryParamsSchemaType }>(
    '/:regNumber',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_rent_car')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: GetRentCarQueryParamsSchema,
      },
    },
    async (request, reply) => {
      const { regNumber } = request.params
      const rentCarDetails: Either<string, RentCar> = await getRentCarByID(
        RentCarRegistrationNumber(regNumber),
      )
      match(
        rentCarDetails,
        (rentCar: RentCar) => {
          return reply.status(200).send({ message: 'Rent Car found', rentCar })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.post<{
    Body: CreateRentCarBookingSchemaType
    Reply: CreateRentCarBookingReplySchemaType | MessageSchemaType
  }>(
    '/booking/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('create_rent_car_booking')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: CreateRentCarBookingSchema,
        response: { 201: CreateRentCarBookingReplySchema, 504: MessageSchema },
      },
    },
    async (request, reply) => {
      const newRentCarBooking: RentCarBooking = {
        rentCarBookingID: request.body.rentCarBookingID
          ? RentCarBookingID(request.body.rentCarBookingID)
          : undefined,
        orderID: request.body.orderID ? OrderID(request.body.orderID) : undefined,
        rentCarRegistrationNumber: RentCarRegistrationNumber(
          request.body.rentCarRegistrationNumber,
        ),
        bookingStart: BookingStart(new Date(request.body.bookingStart)),
        bookingEnd: BookingEnd(new Date(request.body.bookingEnd)),
        bookedBy: request.body.bookedBy ? EmployeeID(request.body.bookedBy) : undefined,
        bookingStatus: request.body.bookingStatus as OrderStatus,
        submissionTime: SubmissionTime(new Date(request.body.submissionTime)),
      }

      const bookingDetails: Either<string, RentCarBookingReply> = await createRentCarBooking(
        newRentCarBooking,
      )
      match(
        bookingDetails,
        (booking: RentCarBookingReply) => {
          return reply.status(201).send({ message: 'Rent Car booking created', ...booking })
        },
        (err) => {
          return reply.status(504).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Params: RentCarBookingIDSchemaType
    Reply: CreateRentCarBookingReplySchemaType | MessageSchemaType
  }>(
    '/booking/:bookingID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_rent_car_booking')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: GetRentCarQueryParamsSchema,
        response: { 200: CreateRentCarBookingReplySchema, 404: MessageSchema },
      },
    },
    async (request, reply) => {
      const { bookingID } = request.params
      const bookingDetails: Either<string, RentCarBookingReply> = await getRentCarBooking(
        RentCarBookingID(bookingID),
      )
      match(
        bookingDetails,
        (booking: RentCarBookingReply) => {
          return reply.status(200).send({ message: 'Rent Car booking found', ...booking })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.delete<{
    Params: RentCarBookingIDSchemaType
    Reply: CreateRentCarBookingReplySchemaType | MessageSchemaType
  }>(
    '/booking/:bookingID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_rent_car_booking')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: GetRentCarQueryParamsSchema,
        response: { 200: CreateRentCarBookingReplySchema, 404: MessageSchema },
      },
    },
    async (request, reply) => {
      const { bookingID } = request.params
      const bookingDetails: Either<string, RentCarBookingReply> = await deleteRentCarBooking(
        RentCarBookingID(bookingID),
      )
      match(
        bookingDetails,
        (booking: RentCarBookingReply) => {
          return reply.status(200).send({ message: 'Rent Car booking deleted', ...booking })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Params: AvailableRentCarsQuerySchemaType
    Reply: AvailableRentCarSchemaType | MessageSchemaType
  }>(
    '/available-rentCars/:storeID/:start/:end',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_available_rent_cars')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: GetRentCarQueryParamsSchema,
        response: { 200: AvailableRentCarSchema, 504: MessageSchema },
      },
    },
    async (request, reply) => {
      const storeID = StoreID(request.params.storeID)
      const start = BookingStart(new Date(request.params.start))
      const end = BookingEnd(new Date(request.params.end))
      const availbeCars: Either<string, RentCarAvailablity> = await availableRentCars(
        storeID,
        start,
        end,
      )
      match(
        availbeCars,
        (booking: RentCarAvailablity) => {
          return reply.status(200).send({ message: 'Rent Car booking found', ...booking })
        },
        (err) => {
          return reply.status(504).send({ message: err })
        },
      )
    },
  )
}
