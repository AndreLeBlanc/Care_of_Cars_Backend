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

import { DriverID, EmployeeID, FirstName, LastName, OrderID } from '../../utils/helper.js'

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
const BilledSchema = Type.Boolean()
const DiscountSchema = Type.Number()
const TotalCostSchema = Type.Number()
const CurrencySchema = Type.String()
const AmountSchema = Type.Number({ minimum: 0 })
const Message = Type.String()

export const MessageSchema = Type.Object({ message: Message })

export type MessageSchemaType = Static<typeof MessageSchema>

export const OrderIDSchema = Type.Object({ orderID: OrderID })

export type OrderIDSchemaType = Static<typeof OrderIDSchema>

export const CreateOrderSchema = Type.Object({
  orderID: Type.Optional(OrderID),
  driverCarID: driverCarID,
  driverID: DriverID,
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
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
  }),
])

export type OrderSchemaType = Static<typeof OrderSchema>

export const CreateOrderServicesSchema = Type.Object({
  serviceID: ServiceIDSchema,
  serviceVariantID: ServiceVariantIDSchema,
  name: NameSchema,
  amount: AmountSchema,
  day1: Type.String({ format: 'time' }),
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
  amount: AmountSchema,
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

const DeleteOrderServiceSchema = Type.Object({
  orderID: OrderID,
  serviceID: ServiceIDSchema,
})

const DeleteOrderLocalServiceSchema = Type.Object({
  orderID: OrderID,
  localServiceID: LocalServiceIDSchema,
})

export const CreateOrderBodySchema = Type.Composite([
  CreateOrderSchema,
  Type.Object({
    services: Type.Array(CreateOrderServicesSchema),
    localServices: Type.Array(CreateOrderLocalServicesSchema),
    rentCarBooking: CreateRentCarBookingSchema,
    deleteOrderService: Type.Array(DeleteOrderServiceSchema),
    deleteOrderLocalService: Type.Array(DeleteOrderLocalServiceSchema),
  }),
])

export type CreateOrderBodySchemaType = Static<typeof CreateOrderBodySchema>

export const CreateOrderBodyReplySchema = Type.Object({
  message: Message,
  OrderSchema,
  cost: TotalCostSchema,
  services: Type.Array(CreateOrderServicesSchema),
  localServices: Type.Array(CreateOrderLocalServicesSchema),
})

export type CreateOrderBodyReplySchemaType = Static<typeof CreateOrderBodyReplySchema>

export const ListOrdersQueryParamSchema = Type.Object({
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Integer({ minimum: 1, default: 10 })),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
  orderStatusSearch: Type.Optional(OrderStatusSchema),
  billingStatusSearch: Type.Optional(Type.Boolean()),
})

export type ListOrdersQueryParamSchemaType = Static<typeof ListOrdersQueryParamSchema>

export const OrdersPaginatedSchema = Type.Object({
  totalOrders: Type.Integer(),
  totalPage: Type.Integer(),
  perPage: Type.Integer(),
  nextUrl: Type.Optional(Type.String({ format: 'url' })),
  previousUrl: Type.Optional(Type.String({ format: 'url' })),
  orders: Type.Array(
    Type.Object({
      driverCarID: driverCarID,
      driverID: DriverID,
      firstName: FirstName,
      lastName: LastName,
      submissionTime: SubmissionTimeSchema,
      updatedAt: Type.String({ format: 'date-time' }),
      total: Type.Array(ServiceCostNumberSchema),
      orderStatus: OrderStatusSchema,
      billed: BilledSchema,
    }),
  ),
})
