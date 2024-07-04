import { CreatedAndUpdatedAT } from '../../utils/helper.js'

import { Static, Type } from '@sinclair/typebox'
import { storeID } from '../stores/storesSchema.js'

import { employeeID, globalQualID, localQualID } from '../../utils/helper.js'

const AbsenceSchema = Type.Boolean()
const EmployeeSpceialHoursID = Type.Integer()
const WorkTimeDescriptionSchema = Type.String()
const workTimeSchema = Type.String({ format: 'time' })
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

export const EmployeeSpceialHoursIDSchema = Type.Object({
  employeeSpceialHoursID: EmployeeSpceialHoursID,
})
export type EmployeeSpceialHoursIDSchemaType = Static<typeof EmployeeSpceialHoursIDSchema>

export const EmployeeSpceialHourByDateSchema = Type.Object({
  employeeID: employeeID,
  storeID: storeID,
  begin: Type.String({ format: 'date' }),
  end: Type.String({ format: 'date' }),
})

export type EmployeeSpceialHourByDateSchemaType = Static<typeof EmployeeSpceialHourByDateSchema>

export const ListEmployeeWorkingHoursSchema = Type.Object({
  storeID: storeID,
  startDay: Type.String({ format: 'date' }),
  quals: Type.Array(localQualID),
  localQuals: Type.Array(globalQualID),
})

export type ListEmployeeWorkingHoursSchemaType = Static<typeof ListEmployeeWorkingHoursSchema>

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

export const EmployeeTimeSchema = Type.Object({
  employeeID: employeeID,
  storeID: storeID,
  mondayStart: Type.Optional(workTimeSchema),
  mondayStop: Type.Optional(workTimeSchema),
  mondayBreak: Type.Optional(workTimeSchema),
  tuesdayStart: Type.Optional(workTimeSchema),
  tuesdayStop: Type.Optional(workTimeSchema),
  tuesdayBreak: Type.Optional(workTimeSchema),
  wednesdayStart: Type.Optional(workTimeSchema),
  wednesdayStop: Type.Optional(workTimeSchema),
  wednesdayBreak: Type.Optional(workTimeSchema),
  thursdayStart: Type.Optional(workTimeSchema),
  thursdayStop: Type.Optional(workTimeSchema),
  thursdayBreak: Type.Optional(workTimeSchema),
  fridayStart: Type.Optional(workTimeSchema),
  fridayStop: Type.Optional(workTimeSchema),
  fridayBreak: Type.Optional(workTimeSchema),
  saturdayStart: Type.Optional(workTimeSchema),
  saturdayStop: Type.Optional(workTimeSchema),
  saturdayBreak: Type.Optional(workTimeSchema),
  sundayStart: Type.Optional(workTimeSchema),
  sundayStop: Type.Optional(workTimeSchema),
  sundayBreak: Type.Optional(workTimeSchema),
})

export type EmployeeTimeSchemaType = Static<typeof EmployeeTimeSchema>

export const SpecialWorkingHoursSchema = Type.Object({
  employeeSpecialHoursID: Type.Optional(EmployeeSpceialHoursID),
  employeeID: employeeID,
  storeID: storeID,
  start: workTimeSchema,
  end: workTimeSchema,
  description: Type.Optional(WorkTimeDescriptionSchema),
  absence: AbsenceSchema,
})

export type SpecialWorkingHoursSchemaType = Static<typeof SpecialWorkingHoursSchema>

export const WorkingHoursIDTotalSchema = Type.Object({
  employeeInfo: Type.Array(
    Type.Object({ EmployeeTimeSchema, special: Type.Array(SpecialWorkingHoursSchema) }),
  ),
})

export type WorkingHoursIDTotalSchemaType = Static<typeof WorkingHoursIDTotalSchema>

export const GetEmployeeWorkingHoursSchema = Type.Object({
  employeeID: employeeID,
  storeID: storeID,
})

export type GetEmployeeWorkingHoursSchemaType = Static<typeof GetEmployeeWorkingHoursSchema>

export const WorkingHoursTotalSchema = Type.Object({
  employeeInfo: Type.Array(
    Type.Composite([EmployeeTimeSchema, Type.Object({ special: SpecialWorkingHoursSchema })]),
  ),
  totalTimes: Type.Object({
    monday: Type.String({ format: 'time' }),
    tuesday: Type.String({ format: 'time' }),
    wednesday: Type.String({ format: 'time' }),
    thursday: Type.String({ format: 'time' }),
    friday: Type.String({ format: 'time' }),
    saturday: Type.String({ format: 'time' }),
    sunday: Type.String({ format: 'time' }),
  }),
})
