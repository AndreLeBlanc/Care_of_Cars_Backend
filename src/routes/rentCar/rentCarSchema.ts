import { CreatedAndUpdatedAT, EmployeeID } from '../../utils/helper.js'
import { Static, Type } from '@sinclair/typebox'
import { OrderID } from '../orders/ordersSchema.js'
import { storeID } from '../stores/storesSchema.js'

const RentCarRegistrationNumber = Type.String({ minLength: 3, maxLength: 11 })
const RentCarModel = Type.String()
const RentCarColor = Type.String()
const RentCarYear = Type.Number({ minimum: 1900, maximum: 2050 })
const RentCarNotes = Type.String()
const RentCarNumber = Type.Number({ minimum: 0 })
const RentCarBookingID = Type.Number({ minimum: 0 })
const BookingStart = Type.String({ format: 'date' })
const BookingEnd = Type.String({ format: 'date' })
const BookedBy = EmployeeID
const BookingStatus = Type.String()
const SubmissionTime = Type.String({ format: 'date' })
const Message = Type.String()

export const AddRentBodySchema = Type.Object({
  rentCarRegistrationNumber: RentCarRegistrationNumber,
  rentCarModel: RentCarModel,
  rentCarColor: RentCarColor,
  rentCarYear: RentCarYear,
  rentCarNotes: Type.Optional(RentCarNotes),
  rentCarNumber: Type.Optional(RentCarNumber),
})

export type AddCustomerType = Static<typeof AddRentBodySchema>

export const ListRentCarQueryParamSchema = Type.Object({
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Integer({ minimum: 1, default: 10 })),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
})

export type ListRentCarQueryParamSchemaType = Static<typeof ListRentCarQueryParamSchema>

export const DeleteRentCarSchema = Type.Object({
  regNumber: RentCarRegistrationNumber,
})

export type DeleteRentCarSchemaType = Static<typeof DeleteRentCarSchema>

export const PatchRentCarBodySchema = AddRentBodySchema

export type PatchRentCarBodySchemaType = Static<typeof PatchRentCarBodySchema>

export const GetRentCarQueryParamsSchema = Type.Object({
  regNumber: RentCarRegistrationNumber,
})

export type GetRentCarQueryParamsSchemaType = Static<typeof GetRentCarQueryParamsSchema>

export const CreateRentCarBookingSchema = Type.Object({
  rentCarBookingID: Type.Optional(RentCarBookingID),
  orderID: Type.Optional(OrderID),
  rentCarRegistrationNumber: RentCarRegistrationNumber,
  bookingStart: BookingStart,
  bookingEnd: BookingEnd,
  bookedBy: BookedBy,
  bookingStatus: BookingStatus,
  submissionTime: SubmissionTime,
})

export type CreateRentCarBookingSchemaType = Static<typeof CreateRentCarBookingSchema>

export const MessageSchema = Type.Object({ message: Message })

export type MessageSchemaType = Static<typeof MessageSchema>

export const CreateRentCarBookingReplySchema = Type.Composite([
  Type.Object({ message: Message }),
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
  message: Message,
  available: Type.Array(CreateRentCarBookingReplySchema),
  undefinedavailable: Type.Array(CreateRentCarBookingReplySchema),
})

export type AvailableRentCarSchemaType = Static<typeof AvailableRentCarSchema>
