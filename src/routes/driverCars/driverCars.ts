import { FastifyInstance } from 'fastify'

import {
  DriverCarDateSchema,
  DriverCarDateSchemaType,
  DriverCarIDSchema,
  DriverCarIDSchemaType,
  DriverCarMessageSchema,
  DriverCarMessageSchemaType,
  DriverCarSchema,
  DriverCarSchemaType,
  ListDriverCarReplySchema,
  ListDriverCarReplySchemaType,
  ListDriverSchema,
  ListDriverSchemaType,
} from './driverCarsSchema.js'

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
  getCarsPaginated,
  putCar,
} from '../../services/driverCarService.js'

import { Limit, Offset, Page, Search } from '../../plugins/pagination.js'

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

      const car: Car | undefined = await putCar(newCar, driverCarID)

      if (car != null) {
        return rep.status(201).send({
          message: 'driver car created/modified successfully',
          ...car.carInfo,
          createdAt: car.dates.createdAt.toISOString(),
          updatedAt: car.dates.updatedAt.toISOString(),
        })
      }
      return rep.status(504).send({ message: 'couldnt create or modify driver car' })
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
      const fetchedCar: Car | undefined = await getCar(DriverCarID(request.params.driverCarID))
      if (fetchedCar == null) {
        return reply.status(404).send({ message: "driver car doesn't exist!" })
      }
      return reply.status(200).send({
        message: 'car fetched',
        ...fetchedCar.carInfo,
        createdAt: fetchedCar.dates.createdAt.toISOString(),
        updatedAt: fetchedCar.dates.updatedAt.toISOString(),
      })
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
      const deletedCar: Car | undefined = await deleteCar(DriverCarID(request.params.driverCarID))
      if (deletedCar == null) {
        return reply.status(404).send({ message: "driver car doesn't exist!" })
      }
      return reply.status(200).send({
        message: 'car deleted',
        ...deletedCar.carInfo,
        createdAt: deletedCar.dates.createdAt.toISOString(),
        updatedAt: deletedCar.dates.updatedAt.toISOString(),
      })
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
      const cars: CarsPaginated | undefined = await getCarsPaginated(
        brandedSearch,
        brandedLimit,
        brandedOffset,
        brandedPage,
      )
      if (cars != null) {
        return rep.status(200).send({
          message: 'driver cars',
          ...cars,
        })
      } else {
        rep.status(403).send({ message: 'could list driver cars' })
      }
    },
  )
}
