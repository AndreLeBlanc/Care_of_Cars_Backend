import { FastifyInstance } from 'fastify'

import {
  DriverCarDateSchema,
  DriverCarDateSchemaType,
  DriverCarIDSchema,
  DriverCarIDSchemaType,
  DriverCarMessageSchema,
  DriverCarMessageSchemaType,
  DriverCarRegSchema,
  DriverCarRegSchemaType,
  DriverCarSchema,
  DriverCarSchemaType,
  ListDriverCarReplySchema,
  ListDriverCarReplySchemaType,
  ListDriverSchema,
  ListDriverSchemaType,
} from './driverCarsSchema.js'

import { GetDriverByIDSchema, GetDriverByIDSchemaType } from '../customers/customerSchema.js'

import {
  DriverCarBrand,
  DriverCarChassiNumber,
  DriverCarColor,
  DriverCarID,
  DriverCarModel,
  DriverCarNotes,
  DriverCarRegistrationNumber,
  DriverCarYear,
  DriverID,
  PermissionTitle,
} from '../../schema/schema.js'

import {
  Car,
  CarsPaginated,
  CreateCar,
  deleteCar,
  getCar,
  getCarByDriverID,
  getCarByReg,
  getCarsPaginated,
  putCar,
} from '../../services/driverCarService.js'

import { Limit, Offset, Page, Search } from '../../plugins/pagination.js'

import { Either, match } from '../../utils/helper.js'

export const driverCars = async (fastify: FastifyInstance) => {
  fastify.put<{
    Body: DriverCarSchemaType
    Reply: (DriverCarMessageSchemaType & DriverCarDateSchemaType) | DriverCarMessageSchemaType
  }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('put_driver_car'))
        done()
        return reply
      },
      schema: {
        body: DriverCarSchema,
        response: {
          201: { ...DriverCarMessageSchema, ...DriverCarDateSchema },
          504: DriverCarMessageSchema,
        },
      },
    },
    async (req, rep) => {
      const driverCarID = req.body.driverCarID ? DriverCarID(req.body.driverCarID) : undefined
      const newCar: CreateCar = {
        driverID: req.body.driverID ? DriverID(req.body.driverID) : undefined,
        driverCarRegistrationNumber: DriverCarRegistrationNumber(
          req.body.driverCarRegistrationNumber,
        ),
        driverCarBrand: DriverCarBrand(req.body.driverCarBrand),
        driverCarModel: DriverCarModel(req.body.driverCarModel),
        driverCarColor: DriverCarColor(req.body.driverCarColor),
        driverCarYear: DriverCarYear(req.body.driverCarYear),
        driverCarChassiNumber: DriverCarChassiNumber(req.body.driverCarChassiNumber),
        driverCarNotes: DriverCarNotes(req.body.driverCarNotes),
      }

      const car: Either<string, Car> = await putCar(newCar, driverCarID)

      match(
        car,
        (newCar: Car) => {
          return rep.status(201).send({
            message: 'driver car created/modified successfully',
            ...newCar.carInfo,
            createdAt: newCar.dates.createdAt.toISOString(),
            updatedAt: newCar.dates.updatedAt.toISOString(),
          })
        },
        (err) => {
          return rep.status(504).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Params: DriverCarIDSchemaType
    Reply: (DriverCarMessageSchemaType & DriverCarDateSchemaType) | DriverCarMessageSchemaType
  }>(
    '/:driverCarID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_driver_car')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: DriverCarIDSchema,
        response: {
          201: { DriverCarMessageSchema, ...DriverCarDateSchema },
          404: DriverCarMessageSchema,
        },
      },
    },
    async (request, reply) => {
      const fetchedCar: Either<string, Car> = await getCar(DriverCarID(request.params.driverCarID))
      match(
        fetchedCar,
        (car: Car) => {
          return reply.status(200).send({
            message: 'car fetched',
            ...car.carInfo,
            createdAt: car.dates.createdAt.toISOString(),
            updatedAt: car.dates.updatedAt.toISOString(),
          })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Params: DriverCarRegSchemaType
    Reply: (DriverCarMessageSchemaType & DriverCarDateSchemaType) | DriverCarMessageSchemaType
  }>(
    '/regNumber/:driverCarReg',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_driver_car')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: DriverCarRegSchema,
        response: {
          201: { DriverCarMessageSchema, ...DriverCarDateSchema },
          404: DriverCarMessageSchema,
        },
      },
    },
    async (request, reply) => {
      const fetchedCar: Either<string, Car> = await getCarByReg(
        DriverCarRegistrationNumber(request.params.driverCarReg),
      )
      match(
        fetchedCar,
        (car: Car) => {
          return reply.status(200).send({
            message: 'car fetched',
            ...car.carInfo,
            createdAt: car.dates.createdAt.toISOString(),
            updatedAt: car.dates.updatedAt.toISOString(),
          })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Params: GetDriverByIDSchemaType
    Reply: (DriverCarMessageSchemaType & DriverCarDateSchemaType) | DriverCarMessageSchemaType
  }>(
    '/driverID/:driverID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_driver_car')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: GetDriverByIDSchema,
        response: {
          201: { DriverCarMessageSchema, ...DriverCarDateSchema },
          404: DriverCarMessageSchema,
        },
      },
    },
    async (request, reply) => {
      const fetchedCar: Either<string, Car> = await getCarByDriverID(
        DriverID(request.params.driverID),
      )
      match(
        fetchedCar,
        (car: Car) => {
          return reply.status(200).send({
            message: 'car fetched',
            ...car.carInfo,
            createdAt: car.dates.createdAt.toISOString(),
            updatedAt: car.dates.updatedAt.toISOString(),
          })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.delete<{
    Params: DriverCarIDSchemaType
    Reply: (DriverCarMessageSchemaType & DriverCarDateSchemaType) | DriverCarMessageSchemaType
  }>(
    '/:driverCarID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_driver_car')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: DriverCarIDSchema,
        response: {
          201: { DriverCarMessageSchema, ...DriverCarDateSchema },
          404: DriverCarMessageSchema,
        },
      },
    },
    async (request, reply) => {
      const deletedCar: Either<string, Car> = await deleteCar(
        DriverCarID(request.params.driverCarID),
      )
      match(
        deletedCar,
        (car: Car) => {
          return reply.status(200).send({
            message: 'car fetched',
            ...car.carInfo,
            createdAt: car.dates.createdAt.toISOString(),
            updatedAt: car.dates.updatedAt.toISOString(),
          })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Querystring: ListDriverSchemaType
    Reply: ListDriverCarReplySchemaType | DriverCarMessageSchemaType
  }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('list_driver_cars')
        const authorizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply.status(403).send({
            message: `Permission denied, user doesn't have permission ${permissionName}`,
          })
        }
        done()
        return reply
      },
      schema: {
        querystring: ListDriverSchema,
        response: { 200: ListDriverCarReplySchema, 403: DriverCarMessageSchema },
      },
    },
    async function (request, rep) {
      const { search = '', limit, page, offset } = request.query
      const brandedSearch = Search(search)
      const brandedLimit = limit ? Limit(limit) : undefined
      const brandedPage = page ? Page(page) : undefined
      const brandedOffset = offset ? Offset(offset) : undefined
      const cars: Either<string, CarsPaginated> = await getCarsPaginated(
        brandedSearch,
        brandedLimit,
        brandedOffset,
        brandedPage,
      )
      match(
        cars,
        (carsList: CarsPaginated) => {
          return rep.status(200).send({
            message: 'driver cars',
            ...carsList,
          })
        },
        (err) => {
          rep.status(403).send({ message: err })
        },
      )
    },
  )
}
