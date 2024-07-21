import { FastifyInstance } from 'fastify'

import {
  PermissionTitle,
  RentCarColor,
  RentCarModel,
  RentCarNotes,
  RentCarNumber,
  RentCarRegistrationNumber,
  RentCarYear,
  StoreID,
} from '../../schema/schema.js'

import {
  RentCar,
  RentCarsPaginate,
  createRentCar,
  deleteRentCarByRegNumber,
  editRentCar,
  getRentCarByID,
  getRentCarPaginate,
} from '../../services/rentCarService.js'

import {
  AddCustomerType,
  ListRentCarQueryParamSchema,
  ListRentCarQueryParamSchemaType,
  PatchRentCarType,
  addRentBody,
  deleteRentCar,
  deleteRentCarType,
  getRentCarQueryParams,
  getRentCarQueryParamsType,
  patchRentCarBody,
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
        body: addRentBody,
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
  fastify.patch<{ Body: PatchRentCarType; Reply: object }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('update_driver')
        fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        body: patchRentCarBody,
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
  fastify.delete<{ Params: deleteRentCarType }>(
    '/:regNumber',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_rent_car')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: deleteRentCar,
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
  fastify.get<{ Params: getRentCarQueryParamsType }>(
    '/:regNumber',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_rent_car')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: getRentCarQueryParams,
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
}
