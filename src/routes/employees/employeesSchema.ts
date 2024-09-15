import {
  EmployeeID,
  FirstName,
  GlobalQualID,
  LastName,
  LocalQualID,
  UserID,
  isSuperAdmin,
  userEmail,
} from '../../utils/helper.js'
import { Static, Type } from '@sinclair/typebox'
import { storeID, storeName } from '../stores/storesSchema.js'

const AbsenceSchema = Type.Boolean()
const EmployeeSpceialHoursID = Type.Integer()
const WorkTimeDescriptionSchema = Type.String()
const workTimeSchema = Type.String({ format: 'time' })
const workDateTimeSchema = Type.String({ format: 'date-time' })
export const shortUserName = Type.String({ maxLength: 4 })
export const employmentNumber = Type.String({ maxLength: 128 })
export const employeePersonalNumber = Type.String({ maxLength: 16 })
export const signature = Type.String({ maxLength: 4 })
export const EmployeeHourlyRateSchema = Type.Optional(Type.Number({ minimum: 0 }))
const employeePin = Type.String()
export const employeeActive = Type.Boolean()
export const employeeComment = Type.String()
export const EmployeeHourlyRateCurrencySchema = Type.Optional(Type.String())
export const EmployeeCheckedInSchema = Type.String({ format: 'date-time' })
export const EmployeeCheckedOutSchema = Type.String({ format: 'date-time' })
export const EmployeeCheckinStatusSchema = Type.Boolean()
const MessageSchema = Type.String()

export const EmployeeNoUserSchema = Type.Object({
  shortUserName: shortUserName,
  employmentNumber: employmentNumber,
  employeePersonalNumber: employeePersonalNumber,
  signature: signature,
  employeePin: employeePin,
  employeeActive: employeeActive,
  employeeComment: Type.Optional(employeeComment),
})

export const EmployeeSchema = Type.Composite([
  EmployeeNoUserSchema,
  Type.Object({ userID: UserID }),
])

export const EmployeeSpceialHoursIDSchema = Type.Object({
  employeeSpceialHoursID: EmployeeSpceialHoursID,
})

export type EmployeeSpceialHoursIDSchemaType = Static<typeof EmployeeSpceialHoursIDSchema>

export const EmployeeSpceialHourByDateSchema = Type.Object({
  employeeID: Type.Optional(EmployeeID),
  storeID: Type.Optional(storeID),
  begin: Type.String({ format: 'date' }),
  end: Type.String({ format: 'date' }),
})

export type EmployeeSpceialHourByDateSchemaType = Static<typeof EmployeeSpceialHourByDateSchema>

export const ListEmployeeWorkingHoursSchema = Type.Object({
  storeID: storeID,
  startDay: Type.String({ format: 'date' }),
  quals: Type.Optional(Type.Array(LocalQualID)),
  localQuals: Type.Optional(Type.Array(GlobalQualID)),
})

export type ListEmployeeWorkingHoursSchemaType = Static<typeof ListEmployeeWorkingHoursSchema>

export const EmployeeMessageSchema = Type.Object({ message: MessageSchema })
export type EmployeeMessageSchemaType = Static<typeof EmployeeMessageSchema>

export const EmployeeIDSchema = Type.Object({ employeeID: Type.Number() })
export type EmployeeIDSchemaType = Static<typeof EmployeeIDSchema>

export const CreateEmployeeSchema = Type.Composite([
  EmployeeSchema,
  Type.Object({
    storeID: Type.Array(storeID, { minItems: 1 }),
    employeeID: Type.Optional(EmployeeID),
    employeeHourlyRateCurrency: Type.Optional(EmployeeHourlyRateCurrencySchema),
    employeeHourlyRate: Type.Optional(EmployeeHourlyRateSchema),
  }),
])

export type CreateEmployeeSchemaType = Static<typeof CreateEmployeeSchema>

export const EmployeeReplySchema = Type.Composite([
  CreateEmployeeSchema,
  Type.Object({
    storeID: Type.Array(storeID, { minItems: 1 }),
    employeeHourlyRate: EmployeeHourlyRateSchema,
    employeeID: EmployeeID,
    employeeCheckedIn: Type.Optional(EmployeeCheckedInSchema),
    employeeCheckedOut: Type.Optional(EmployeeCheckedOutSchema),
  }),
])

export type EmployeeReplySchemaType = Static<typeof EmployeeReplySchema>

export const SelectedEmployeeSchema = Type.Composite([
  EmployeeMessageSchema,
  Type.Object({
    shortUserName: shortUserName,
    userID: UserID,
    employmentNumber: employmentNumber,
    employeePersonalNumber: employeePersonalNumber,
    signature: signature,
    employeeActive: employeeActive,
    employeeComment: Type.Optional(employeeComment),
    employeeID: EmployeeID,
    storeIDs: Type.Array(Type.Object({ storeID: storeID, storeName: storeName })),
    employeeHourlyRateCurrency: EmployeeHourlyRateCurrencySchema,
    employeeHourlyRate: EmployeeHourlyRateSchema,
    employeeCheckedIn: Type.Optional(EmployeeCheckedInSchema),
    employeeCheckedOut: Type.Optional(EmployeeCheckedOutSchema),
  }),
])

export type SelectedEmployeeSchemaType = Static<typeof SelectedEmployeeSchema>

export const CreatedEmployeeUserSchema = Type.Object({
  userID: UserID,
  firstName: FirstName,
  lastName: LastName,
  email: userEmail,
  isSuperAdmin: isSuperAdmin,
  shortUserName: shortUserName,
  employmentNumber: employmentNumber,
  employeePersonalNumber: employeePersonalNumber,
  signature: signature,
  employeePin: employeePin,
  employeeActive: employeeActive,
  employeeComment: Type.Optional(employeeComment),
  employeeID: EmployeeID,
  stores: Type.Array(storeID),
  employeeHourlyRateCurrency: EmployeeHourlyRateCurrencySchema,
  employeeHourlyRate: EmployeeHourlyRateSchema,
  employeeCheckedIn: Type.Optional(EmployeeCheckedInSchema),
  employeeCheckedOut: Type.Optional(EmployeeCheckedOutSchema),
  employeeCheckinStatus: EmployeeCheckinStatusSchema,
  createdAt: Type.Any(),
  updatedAt: Type.Any(),
})

export type CreatedEmployeeUserSchemaType = Static<typeof CreatedEmployeeUserSchema>

export const ListEmployeesReplySchema = Type.Composite([
  EmployeeMessageSchema,
  Type.Object({
    totalEmployees: Type.Integer(),
    totalPage: Type.Integer(),
    perPage: Type.Integer(),
    employees: Type.Array(
      Type.Object({
        firstName: FirstName,
        lastName: LastName,
        shortUserName: shortUserName,
        employeeID: EmployeeID,
        employmentNumber: employmentNumber,
        employeePersonalNumber: employeePersonalNumber,
        signature: signature,
        employeeHourlyRate: Type.Optional(EmployeeHourlyRateSchema),
        employeeHourlyRateCurrency: Type.Optional(EmployeeHourlyRateCurrencySchema),
        employeePin: Type.Optional(employeePin),
        employeeActive: employeeActive,
        employeeComment: Type.Optional(employeeComment),
        employeeCheckedIn: Type.Optional(EmployeeCheckedInSchema),
        employeeCheckedOut: Type.Optional(EmployeeCheckedOutSchema),
        employeeCheckinStatus: EmployeeCheckinStatusSchema,
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
  message: MessageSchema,
  employeeID: EmployeeID,
  employeeCheckIn: Type.Optional(EmployeeCheckedInSchema),
  employeeCheckOut: Type.Optional(EmployeeCheckedOutSchema),
})

export type CheckInTimesSchemaType = Static<typeof CheckInTimesSchema>

export const EmployeeIDCheckinSchema = Type.Object({
  employeeID: EmployeeID,
  employeeCheckedOut: Type.Union([Type.Literal('CheckedIn'), Type.Literal('CheckedOut')]),
  storeID: storeID,
})

export type EmployeeIDCheckinSchemaType = Static<typeof EmployeeIDCheckinSchema>

export const ListCheckInStatusSchema = Type.Composite([
  EmployeeMessageSchema,
  Type.Object({
    statuses: Type.Array(
      Type.Object({
        employeeID: EmployeeID,
        shortUserName: shortUserName,
        firstName: FirstName,
        lastName: LastName,
        time: Type.Optional(Type.String({ format: 'date' })),
        status: Type.Union([Type.Literal('CheckedIn'), Type.Literal('CheckedOut')]),
      }),
    ),
  }),
])

export type ListCheckInStatusSchemaType = Static<typeof ListCheckInStatusSchema>

export const EmployeeTimeSchema = Type.Object({
  employeeID: EmployeeID,
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

export const SpecialHoursSchema = Type.Object({
  employeeSpecialHoursID: Type.Optional(EmployeeSpceialHoursID),
  employeeID: EmployeeID,
  storeID: storeID,
  start: workDateTimeSchema,
  end: workDateTimeSchema,
  description: Type.Optional(WorkTimeDescriptionSchema),
  absence: AbsenceSchema,
})

export type SpecialHoursSchemaType = Static<typeof SpecialHoursSchema>

export const SpecialWorkingHoursSchema = Type.Object({
  specialHours: Type.Array(SpecialHoursSchema),
})

export type SpecialWorkingHoursSchemaType = Static<typeof SpecialWorkingHoursSchema>

export const WorkingHoursIDTotalSchema = Type.Object({
  employeeInfo: Type.Array(
    Type.Object({ EmployeeTimeSchema, special: Type.Array(SpecialWorkingHoursSchema) }),
  ),
})

export type WorkingHoursIDTotalSchemaType = Static<typeof WorkingHoursIDTotalSchema>

export const GetEmployeeWorkingHoursSchema = Type.Object({
  employeeID: EmployeeID,
  storeID: storeID,
})

export type GetEmployeeWorkingHoursSchemaType = Static<typeof GetEmployeeWorkingHoursSchema>

export const WorkingHoursTotalSchema = Type.Object({
  employeeInfo: Type.Array(
    Type.Composite([EmployeeTimeSchema, Type.Object({ special: Type.Array(SpecialHoursSchema) })]),
  ),
  totalTimes: Type.Object({
    monday: Type.String(),
    tuesday: Type.String(),
    wednesday: Type.String(),
    thursday: Type.String(),
    friday: Type.String(),
    saturday: Type.String(),
    sunday: Type.String(),
  }),
})

export type WorkingHoursTotalSchemaType = Static<typeof WorkingHoursTotalSchema>
