import { FastifyInstance } from 'fastify'

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

import { PermissionTitle } from '../../services/permissionService.js'

import {
  RentCar,
  RentCarColor,
  RentCarModel,
  RentCarNotes,
  RentCarNumber,
  RentCarRegistrationNumber,
  RentCarYear,
  RentCarsPaginate,
  StoreID,
  createRentCar,
  deleteRentCarByRegNumber,
  editRentCar,
  getRentCarById,
  getRentCarPaginate,
} from '../../services/rentCarService.js'

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
        storeId: StoreID(1),
        rentCarColor: RentCarColor(rentCarColor),
        rentCarModel: RentCarModel(rentCarModel),
        rentCarRegistrationNumber: RentCarRegistrationNumber(rentCarRegistrationNumber),
        rentCarYear: RentCarYear(rentCarYear),
        rentCarNotes: rentCarNotes ? RentCarNotes(rentCarNotes) : undefined,
        rentCarNumber: rentCarNumber ? RentCarNumber(rentCarNumber) : undefined,
      }

      const createdRentCar: RentCar | undefined = await createRentCar(rentCarDetails)
      if (createdRentCar !== undefined) {
        return rep.status(201).send({
          message: 'Rent Car Created successfully',
          data: createdRentCar,
        })
      } else {
        return rep.status(201).send({
          message: 'Rent car already exist',
          existingData: true,
        })
      }
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
    async function (request) {
      const { search = '', limit = 10, page = 1 } = request.query
      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)
      const result: RentCarsPaginate = await getRentCarPaginate(
        brandedSearch,
        brandedLimit,
        brandedPage,
        offset,
      )

      const message: ResponseMessage = fastify.responseMessage(
        ModelName('Company Drivers'),
        ResultCount(result.data.length),
      )
      const requestUrl: RequestUrl = RequestUrl(
        request.protocol + '://' + request.hostname + request.url,
      )
      const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
        requestUrl,
        Page(result.totalPage),
        Page(page),
      )
      const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
        requestUrl,
        Page(result.totalPage),
        Page(page),
      )

      return {
        message,
        totalItems: result.totalItems,
        nextUrl: nextUrl,
        previousUrl,
        totalPage: result.totalPage,
        page: page,
        limit: limit,
        data: result.data,
      }
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

      const editedRentCarDetails: RentCar | undefined = await editRentCar(rentCarEditDetails)

      if (editedRentCarDetails) {
        reply.status(201).send({
          message: 'Rent Car details edited',
          editedRentCarDetails,
        })
      } else {
        reply.status(201).send({
          message: 'Failed to edit Rent Car details',
          editedRentCarDetails,
        })
      }
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
      const deletedRentCar: RentCarRegistrationNumber | undefined = await deleteRentCarByRegNumber(
        RentCarRegistrationNumber(regNumber),
      )
      if (deletedRentCar == null) {
        return reply.status(404).send({ message: "Rent Car doesn't exist!" })
      }
      return reply
        .status(200)
        .send({ message: 'Rent Car deleted', deletedRegNumber: deletedRentCar })
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
      const rentCarDetails: RentCar | undefined = await getRentCarById(
        RentCarRegistrationNumber(regNumber),
      )
      if (rentCarDetails == null) {
        return reply.status(404).send({ message: "Rent Car doesn't exist!" })
      }
      return reply.status(200).send({ message: 'Rent Car found', rentCarDetails })
    },
  )
}
