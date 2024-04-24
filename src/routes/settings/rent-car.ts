import { FastifyInstance } from 'fastify'
import {
  AddCustomerType,
  ListRentCarQueryParamSchema,
  ListRentCarQueryParamSchemaType,
  PatchRentCarType,
  addRentBody,
  deleteRentCar,
  deleteRentCarType,
  patchRentCarBody,
} from './schemas/rentCarSchema.js'
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
  createRentCar,
  deleteRentCarByRegNumber,
  editRentCar,
  getRentCarPaginate,
} from '../../services/rentCarService.js'
import { NextPageUrl, Offset, PreviousPageUrl, ResponseMessage } from '../../plugins/pagination.js'

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

      const rentCarDetails = {
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
    '/',
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
    async function (request, _) {
      let { search = '', limit = 10, page = 1 } = request.query
      const offset: Offset = fastify.findOffset(limit, page)
      const result: RentCarsPaginate = await getRentCarPaginate(search, limit, page, offset)
      let message: ResponseMessage = fastify.responseMessage('Rent Cars', result.data.length)
      let requestUrl: string | undefined = request.protocol + '://' + request.hostname + request.url
      const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
        requestUrl,
        result.totalPage,
        page,
      )
      const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
        requestUrl,
        result.totalPage,
        page,
      )

      return {
        message: message.responseMessage,
        totalItems: result.totalItems,
        nextUrl: nextUrl,
        previousUrl: previousUrl?.previousPageUrl,
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
}
