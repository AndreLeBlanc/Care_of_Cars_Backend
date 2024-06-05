import { Static, Type } from '@sinclair/typebox'

import { driverID } from '../customers/customerSchema'

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
  driverCarID: driverCarID,
  driverCarRegistrationNumber: driverCarRegistrationNumber,
  driverCarBrand: driverCarBrand,
  driverCarModel: driverCarModel,
  driverCarColor: driverCarColor,
  driverCarYear: driverCarYear,
  driverCarChassiNumber: driverCarChassiNumber,
  driverCarNotes: driverCarNotes,
})

export type DriverCarSchemaType = Static<typeof DriverCarSchema>

export const CarByDriverIDSchema = Type.Object({
  driverID: driverID,
})

export type CarByDriverIDSchemaType = Static<typeof CarByDriverIDSchema>

export const DriverCarDateSchema = Type.Composite([
  DriverCarSchema,
  Type.Object({ createdAt: Type.Date(), updatedAt: Type.Date() }),
])
