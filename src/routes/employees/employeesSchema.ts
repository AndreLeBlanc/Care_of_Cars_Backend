import { CreatedAndUpdatedAT } from '../../utils/helper.js'

import { Static, Type } from '@sinclair/typebox'
import { storeID } from '../stores/storesSchema.js'

const employeeID = Type.Integer()
const shortUserName = Type.String({ maxLength: 4 })
const employmentNumber = Type.String({ maxLength: 128 })
const employeePersonalNumber = Type.String({ maxLength: 16 })
const signature = Type.String({ maxLength: 4 })
const employeeHourlyRate = Type.Optional(Type.Number({ minimum: 0 }))
const employeePin = Type.String()
const employeeComment = Type.String()
const EmployeeHourlyRateCurrency = Type.Optional(Type.String())
const EmployeeHourlyRate = Type.Optional(Type.Number())
const employeeCheckedIn = Type.String({ format: 'date' })
const employeeCheckedOut = Type.String({ format: 'date' })
const EmployeeSchema = Type.Object({
  shortUserName: shortUserName,
  employmentNumber: employmentNumber,
  employeePersonalNumber: employeePersonalNumber,
  signature: signature,
  employeePin: employeePin,
  employeeComment: employeeComment,
})

export const EmployeeMessageSchema = Type.Object({ message: Type.String() })
export type EmployeeMessageSchemaType = Static<typeof EmployeeMessageSchema>

export const EmployeeIDSchema = Type.Object({ employeeID: Type.Number() })
export type EmployeeIDSchemaType = Static<typeof EmployeeIDSchema>

export const CreateEmployeeSchema = Type.Composite([
  EmployeeSchema,
  Type.Object({
    storeID: Type.Array(storeID, { minItems: 1 }),
    employeeID: Type.Optional(employeeID),
    EmployeeHourlyRateCurrency: Type.Optional(EmployeeHourlyRateCurrency),
    employeeHourlyRate: employeeHourlyRate,
    EmployeeHourlyRate: Type.Optional(EmployeeHourlyRate),
  }),
])

export type CreateEmployeeSchemaType = Static<typeof CreateEmployeeSchema>

export const EmployeeReplySchema = Type.Composite([
  CreateEmployeeSchema,
  Type.Object({
    storeID: Type.Array(storeID, { minItems: 1 }),
    employeeHourlyRateDinero: employeeHourlyRate,
    employeeID: employeeID,
    employeeCheckedIn: Type.Optional(employeeCheckedIn),
    employeeCheckedOut: Type.Optional(employeeCheckedOut),
  }),
])

export type EmployeeReplySchemaType = Static<typeof EmployeeReplySchema>

export const SelectedEmployeeSchema = Type.Composite([
  EmployeeSchema,
  Type.Object({
    employeeID: employeeID,
    storeIDs: Type.Array(storeID),
    EmployeeHourlyRateCurrency: EmployeeHourlyRateCurrency,
    EmployeeHourlyRateDinero: EmployeeHourlyRate,
    employeeCheckedIn: Type.Optional(employeeCheckedIn),
    employeeCheckedOut: Type.Optional(employeeCheckedOut),
  }),
  CreatedAndUpdatedAT,
])

export type SelectedEmployeeSchemaType = Static<typeof SelectedEmployeeSchema>

export const ListEmployeesReplySchema = Type.Composite([
  EmployeeMessageSchema,
  Type.Object({
    totalEmployees: Type.Integer(),
    totalPage: Type.Integer(),
    perPage: Type.Integer(),
    employees: Type.Array(
      Type.Object({
        shortUserName: shortUserName,
        employeeID: employeeID,
        employmentNumber: employmentNumber,
        employeePersonalNumber: employeePersonalNumber,
        signature: signature,
        employeeHourlyRateDinero: employeeHourlyRate,
        employeePin: employeePin,
        employeeComment: employeeComment,
        employeeCheckedIn: Type.Optional(employeeCheckedIn),
        employeeCheckedOut: Type.Optional(employeeCheckedOut),
      }),
    ),
  }),
])

export type ListEmployeesReplySchemaType = Static<typeof ListEmployeesReplySchema>

export const ListEmployeesSchema = Type.Object({
  search: Type.Optional(Type.String()),
  storeID: storeID,
  limit: Type.Optional(Type.Number()),
  page: Type.Optional(Type.Number()),
  offset: Type.Optional(Type.Number()),
})

export type ListEmployeesSchemaType = Static<typeof ListEmployeesSchema>

export const CheckInTimesSchema = Type.Object({
  employeeID: employeeID,
  employeeCheckIn: Type.Optional(employeeCheckedIn),
  employeeCheckOut: Type.Optional(employeeCheckedOut),
})

export type CheckInTimesSchemaType = Static<typeof CheckInTimesSchema>

export const EmployeeIDCheckinSchema = Type.Object({
  employeeID: employeeID,
  employeeCheckedOut: Type.Union([Type.Literal('CheckedIn'), Type.Literal('CheckedOut')]),
})

export type EmployeeIDCheckinSchemaType = Static<typeof EmployeeIDCheckinSchema>

export const ListCheckInStatusSchema = Type.Composite([
  EmployeeMessageSchema,
  Type.Object({
    statuses: Type.Array(
      Type.Object({
        employeeID: employeeID,
        time: Type.Optional(Type.String({ format: 'date' })),
        status: Type.Union([Type.Literal('CheckedIn'), Type.Literal('CheckedOut')]),
      }),
    ),
  }),
])

export type ListCheckInStatusSchemaType = Static<typeof ListCheckInStatusSchema>
