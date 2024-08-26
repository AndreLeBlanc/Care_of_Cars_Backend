import { Static, Type } from '@sinclair/typebox'
import { CreateRentCarBookingSchema } from '../rentCar/rentCarSchema.js'
import { driverCarID } from '../driverCars/driverCarsSchema.js'
import { storeID } from '../stores/storesSchema.js'

import {
  LocalServiceIDSchema,
  LocalServicevariantIDSchema,
  NameSchema,
  ServiceIDSchema,
  ServiceVariantIDSchema,
} from '../services/serviceSchema.js'

import { CreatedAndUpdatedAT, EmployeeID, OrderID, driverID } from '../../utils/helper.js'

const OrderNotesSchema = Type.String()
const OrderStatusSchema = Type.String()
export const PickupTimeSchema = Type.String({ format: 'date' })
const ServiceCostNumberSchema = Type.Number()
const ServiceDay1Schema = Type.String({ format: 'time' })
const ServiceDay2Schema = Type.String({ format: 'time' })
const ServiceDay3Schema = Type.String({ format: 'time' })
const ServiceDay4Schema = Type.String({ format: 'time' })
const ServiceDay5Schema = Type.String({ format: 'time' })
export const SubmissionTimeSchema = Type.String({ format: 'date' })
const VatFreeSchema = Type.Boolean()
const DiscountSchema = Type.Number()
const TotalCost = Type.Number()
const CurrencySchema = Type.String()
const amount = Type.Number({ minimum: 0 })

export const MessageSchema = Type.Object({ message: Type.String() })

export type MessageSchemaType = Static<typeof MessageSchema>

export const OrderIDSchema = Type.Object({ orderID: OrderID })

export type OrderIDSchemaType = Static<typeof OrderIDSchema>

export const CreateOrderSchema = Type.Object({
  orderID: Type.Optional(OrderID),
  driverCarID: driverCarID,
  driverID: driverID,
  storeID: storeID,
  orderNotes: Type.Optional(OrderNotesSchema),
  bookedBy: Type.Optional(EmployeeID),
  submissionTime: SubmissionTimeSchema,
  pickupTime: PickupTimeSchema,
  vatFree: VatFreeSchema,
  orderStatus: OrderStatusSchema,
  currency: CurrencySchema,
  discount: DiscountSchema,
})

export type CreateOrderSchemaType = Static<typeof CreateOrderSchema>

export const OrderSchema = Type.Composite([
  CreateOrderSchema,
  Type.Object({
    order: OrderID,
    CreatedAndUpdatedAT,
  }),
])

export type OrderSchemaType = Static<typeof OrderSchema>

export const CreateOrderServicesSchema = Type.Object({
  serviceID: ServiceIDSchema,
  serviceVariantID: ServiceVariantIDSchema,
  name: NameSchema,
  amount: amount,
  day1: Type.String({ format: 'date' }),
  day1Work: ServiceDay1Schema,
  day1Employee: Type.Optional(EmployeeID),
  day2: Type.Optional(Type.String({ format: 'date' })),
  day2Work: Type.Optional(ServiceDay2Schema),
  day2Employee: Type.Optional(EmployeeID),
  day3: Type.Optional(Type.String({ format: 'date' })),
  day3Work: Type.Optional(ServiceDay3Schema),
  day3Employee: Type.Optional(EmployeeID),
  day4: Type.Optional(Type.String({ format: 'date' })),
  day4Work: Type.Optional(ServiceDay4Schema),
  day4Employee: Type.Optional(EmployeeID),
  day5: Type.Optional(Type.String({ format: 'date' })),
  day5Work: Type.Optional(ServiceDay5Schema),
  day5Employee: Type.Optional(EmployeeID),
  cost: ServiceCostNumberSchema,
  currency: CurrencySchema,
  vatFree: VatFreeSchema,
  orderNotes: OrderNotesSchema,
})

export type CreateOrderServicesSchemaType = Static<typeof CreateOrderServicesSchema>

export const CreateOrderLocalServicesSchema = Type.Object({
  localServiceID: LocalServiceIDSchema,
  serviceVariantID: LocalServicevariantIDSchema,
  name: NameSchema,
  amount: amount,
  day1: Type.String({ format: 'date' }),
  day1Work: ServiceDay1Schema,
  day1Employee: EmployeeID,
  day2: Type.String({ format: 'date' }),
  day2Work: ServiceDay2Schema,
  day2Employee: EmployeeID,
  day3: Type.String({ format: 'date' }),
  day3Work: ServiceDay3Schema,
  day3Employee: EmployeeID,
  day4: Type.String({ format: 'date' }),
  day4Work: ServiceDay4Schema,
  day4Employee: EmployeeID,
  day5: Type.String({ format: 'date' }),
  day5Work: ServiceDay5Schema,
  day5Employee: EmployeeID,
  cost: ServiceCostNumberSchema,
  currency: CurrencySchema,
  vatFree: VatFreeSchema,
  orderNotes: OrderNotesSchema,
})

export type CreateOrderLocalServicesSchemaType = Static<typeof CreateOrderLocalServicesSchema>

export const CreateOrderBodySchema = Type.Composite([
  CreateOrderSchema,
  Type.Object({
    services: Type.Array(CreateOrderServicesSchema),
    localServices: Type.Array(CreateOrderLocalServicesSchema),
    rentCarBooking: CreateRentCarBookingSchema,
  }),
])

export type CreateOrderBodySchemaType = Static<typeof CreateOrderBodySchema>

export const CreateOrderBodyReplySchema = Type.Object({
  OrderSchema,
  cost: TotalCost,
  MessageSchema,
  services: Type.Array(CreateOrderServicesSchema),
  localServices: Type.Array(CreateOrderLocalServicesSchema),
})

export type CreateOrderBodyReplySchemaType = Static<typeof CreateOrderBodyReplySchema>
