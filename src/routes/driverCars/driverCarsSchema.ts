import { Static, Type } from '@sinclair/typebox'

import { driverID } from '../customers/customerSchema.js'

import { CreatedAndUpdatedAT } from '../../utils/helper.js'

const driverCarID = Type.Integer({ minimum: 0 })
const driverCarRegistrationNumber = Type.String({ minLength: 3, maxLength: 11 })
const driverCarBrand = Type.String({ maxLength: 128 })
const driverCarModel = Type.String({ maxLength: 128 })
const driverCarColor = Type.String({ maxLength: 64 })
const driverCarYear = Type.Integer({ minimum: 1850, maximum: 2050 })
const driverCarChassiNumber = Type.String({ maxLength: 24 })
const driverCarNotes = Type.String()

export const DriverCarSchema = Type.Object({
  driverID: Type.Optional(driverID),
  driverCarID: Type.Optional(driverCarID),
  driverCarRegistrationNumber: driverCarRegistrationNumber,
  driverCarBrand: driverCarBrand,
  driverCarModel: driverCarModel,
  driverCarColor: driverCarColor,
  driverCarYear: driverCarYear,
  driverCarChassiNumber: driverCarChassiNumber,
  driverCarNotes: driverCarNotes,
})

export type DriverCarSchemaType = Static<typeof DriverCarSchema>

export const DriverCarIDSchema = Type.Object({
  driverCarID: driverCarID,
})

export type DriverCarIDSchemaType = Static<typeof DriverCarIDSchema>

export const DriverCarRegSchema = Type.Object({
  driverCarReg: driverCarRegistrationNumber,
})

export type DriverCarRegSchemaType = Static<typeof DriverCarRegSchema>

export const DriverCarDateSchema = Type.Composite([DriverCarSchema, CreatedAndUpdatedAT])

export type DriverCarDateSchemaType = Static<typeof DriverCarDateSchema>

export const DriverCarMessageSchema = Type.Object({
  message: Type.String(),
})

export type DriverCarMessageSchemaType = Static<typeof DriverCarMessageSchema>

export const ListDriverSchema = Type.Object({
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Number()),
  page: Type.Optional(Type.Number()),
  offset: Type.Optional(Type.Number()),
})

export type ListDriverSchemaType = Static<typeof ListDriverSchema>

export const ListDriverCarReplySchema = Type.Object({
  totalCars: Type.Integer(),
  totalPage: Type.Integer(),
  perPage: Type.Integer(),
  page: Type.Integer(),
  cars: Type.Array(DriverCarSchema),
})

export type ListDriverCarReplySchemaType = Static<typeof ListDriverCarReplySchema>
