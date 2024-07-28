import { Static, Type } from '@sinclair/typebox'
import { CreatedAndUpdatedAT } from '../../utils/helper.js'
import { EmployeeIDSchema } from '../employees/employeesSchema.js'
import { OrderID } from '../orders/ordersSchema.js'
import { storeID } from '../stores/storesSchema.js'

const rentCarRegistrationNumber = Type.String({ minLength: 3, maxLength: 11 })
const rentCarModel = Type.String()
const rentCarColor = Type.String()
const rentCarYear = Type.Number({ minimum: 1900, maximum: 2050 })
const rentCarNotes = Type.String()
const rentCarNumber = Type.Number({ minimum: 0 })
const RentCarBookingID = Type.Number({ minimum: 0 })
const BookingStart = Type.Date()
const BookingEnd = Type.Date()
const BookedBy = EmployeeIDSchema
const BookingStatus = Type.String()
const SubmissionTime = Type.Date()

export const AddRentBodySchema = Type.Object({
  rentCarRegistrationNumber: rentCarRegistrationNumber,
  rentCarModel: rentCarModel,
  rentCarColor: rentCarColor,
  rentCarYear: rentCarYear,
  rentCarNotes: Type.Optional(rentCarNotes),
  rentCarNumber: Type.Optional(rentCarNumber),
})

export type AddCustomerType = Static<typeof AddRentBodySchema>

export const ListRentCarQueryParamSchema = Type.Object({
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Integer({ minimum: 1, default: 10 })),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
})

export type ListRentCarQueryParamSchemaType = Static<typeof ListRentCarQueryParamSchema>

export const DeleteRentCarSchema = Type.Object({
  regNumber: rentCarRegistrationNumber,
})

export type DeleteRentCarSchemaType = Static<typeof DeleteRentCarSchema>

export const PatchRentCarBodySchema = AddRentBodySchema

export type PatchRentCarBodySchemaType = Static<typeof PatchRentCarBodySchema>

export const GetRentCarQueryParamsSchema = Type.Object({
  regNumber: rentCarRegistrationNumber,
})

export type GetRentCarQueryParamsSchemaType = Static<typeof GetRentCarQueryParamsSchema>

export const CreateRentCarBookingSchema = Type.Object({
  rentCarBookingID: Type.Optional(RentCarBookingID),
  orderID: Type.Optional(OrderID),
  bookingStart: BookingStart,
  bookingEnd: BookingEnd,
  bookedBy: BookedBy,
  bookingStatus: BookingStatus,
  submissionTime: SubmissionTime,
})

export type CreateRentCarBookingSchemaType = Static<typeof CreateRentCarBookingSchema>

export const CreateRentCarBookingReplySchema = Type.Composite([
  CreateRentCarBookingSchema,
  CreatedAndUpdatedAT,
])

export type CreateRentCarBookingReplySchemaType = Static<typeof CreateRentCarBookingReplySchema>

export const RentCarBookingIDSchema = Type.Object({ bookingID: RentCarBookingID })

export type RentCarBookingIDSchemaType = Static<typeof RentCarBookingIDSchema>

export const AvailableRentCarsQuerySchema = Type.Object({
  storeID: storeID,
  start: BookingStart,
  end: BookingEnd,
})

export type AvailableRentCarsQuerySchemaType = Static<typeof AvailableRentCarsQuerySchema>

export const AvailableRentCarSchema = Type.Object({
  available: Type.Array(CreateRentCarBookingReplySchema),
  undefinedavailable: Type.Array(CreateRentCarBookingReplySchema),
})

export type AvailableRentCarSchemaType = Static<typeof AvailableRentCarSchema>
