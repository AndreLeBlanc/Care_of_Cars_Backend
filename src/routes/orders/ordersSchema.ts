import {
  CreateRentCarBookingSchema,
  CreateRentCarOrderBookingSchema,
} from '../rentCar/rentCarSchema.js'
import { Static, Type } from '@sinclair/typebox'
import { driverCarID } from '../driverCars/driverCarsSchema.js'
import { storeID } from '../stores/storesSchema.js'

import { NameSchema, ServiceIDSchema, ServiceVariantIDSchema } from '../services/serviceSchema.js'

import {
  ProductCostCurrencySchema,
  ProductCostSchema,
  ProductDescriptionSchema,
  ProductIDSchema,
} from '../product/productSchema.js'

import {
  DriverBodySchema,
  DriverID,
  EmployeeID,
  FirstName,
  LastName,
  OrderID,
} from '../../utils/helper.js'

const OrderNotesSchema = Type.String()
export const OrderStatusSchema = Type.String()
export const PickupTimeSchema = Type.String({ format: 'date-time' })
const ServiceCostNumberSchema = Type.Number()
const ServiceDay1Schema = Type.String({ format: 'date-time' })
const ServiceDay2Schema = Type.String({ format: 'date-time' })
const ServiceDay3Schema = Type.String({ format: 'date-time' })
const ServiceDay4Schema = Type.String({ format: 'date-time' })
const ServiceDay5Schema = Type.String({ format: 'date-time' })

const ServiceDay1WorkSchema = Type.String({ format: 'time' })
const ServiceDay2WorkSchema = Type.String({ format: 'time' })
const ServiceDay3WorkSchema = Type.String({ format: 'time' })
const ServiceDay4WorkSchema = Type.String({ format: 'time' })
const ServiceDay5WorkSchema = Type.String({ format: 'time' })
export const SubmissionTimeSchema = Type.String({ format: 'date-time' })
const VatFreeSchema = Type.Boolean()
const BilledSchema = Type.Boolean()
const DiscountSchema = Type.Number()
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

export const CreateOrderProductSchema = Type.Object({
  productID: ProductIDSchema,
  productDescription: ProductDescriptionSchema,
  amount: AmountSchema,
  cost: ProductCostSchema,
  currency: ProductCostCurrencySchema,
  orderProductNotes: Type.Optional(OrderNotesSchema),
})

export type CreateOrderProductSchemaType = Static<typeof CreateOrderProductSchema>

export const OrderSchema = Type.Object({
  orderID: OrderID,
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
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
})

export type OrderSchemaType = Static<typeof OrderSchema>

export const CreateOrderServicesSchema = Type.Object({
  serviceID: ServiceIDSchema,
  serviceVariantID: Type.Optional(ServiceVariantIDSchema),
  name: NameSchema,
  amount: AmountSchema,
  day1: Type.Optional(ServiceDay1Schema),
  day1Work: Type.Optional(ServiceDay1WorkSchema),
  day1Employee: Type.Optional(EmployeeID),
  day2: Type.Optional(ServiceDay2Schema),
  day2Work: Type.Optional(ServiceDay2WorkSchema),
  day2Employee: Type.Optional(EmployeeID),
  day3: Type.Optional(ServiceDay3Schema),
  day3Work: Type.Optional(ServiceDay3WorkSchema),
  day3Employee: Type.Optional(EmployeeID),
  day4: Type.Optional(ServiceDay4Schema),
  day4Work: Type.Optional(ServiceDay4WorkSchema),
  day4Employee: Type.Optional(EmployeeID),
  day5: Type.Optional(ServiceDay5WorkSchema),
  day5Work: Type.Optional(ServiceDay5Schema),
  day5Employee: Type.Optional(EmployeeID),
  cost: ServiceCostNumberSchema,
  currency: CurrencySchema,
  vatFree: VatFreeSchema,
  orderNotes: Type.Optional(OrderNotesSchema),
})

export type CreateOrderServicesSchemaType = Static<typeof CreateOrderServicesSchema>

export const CreateOrderLocalServicesSchema = Type.Object({
  serviceID: ServiceIDSchema,
  serviceVariantID: Type.Optional(ServiceVariantIDSchema),
  name: NameSchema,
  amount: AmountSchema,
  cost: ServiceCostNumberSchema,
  currency: CurrencySchema,
  vatFree: VatFreeSchema,
  orderNotes: Type.Optional(OrderNotesSchema),
  day1: Type.Optional(ServiceDay1Schema),
  day1Work: Type.Optional(ServiceDay1WorkSchema),
  day1Employee: Type.Optional(EmployeeID),
  day2: Type.Optional(ServiceDay2Schema),
  day2Work: Type.Optional(ServiceDay2WorkSchema),
  day2Employee: Type.Optional(EmployeeID),
  day3: Type.Optional(ServiceDay3Schema),
  day3Work: Type.Optional(ServiceDay3WorkSchema),
  day3Employee: Type.Optional(EmployeeID),
  day4: Type.Optional(ServiceDay4Schema),
  day4Work: Type.Optional(ServiceDay4WorkSchema),
  day4Employee: Type.Optional(EmployeeID),
  day5: Type.Optional(ServiceDay5Schema),
  day5Work: Type.Optional(ServiceDay5WorkSchema),
  day5Employee: Type.Optional(EmployeeID),
})

export type CreateOrderLocalServicesSchemaType = Static<typeof CreateOrderLocalServicesSchema>

const DeleteOrderServiceSchema = Type.Object({
  orderID: OrderID,
  serviceID: ServiceIDSchema,
})

const DeleteOrderProductSchema = Type.Object({
  orderID: OrderID,
  productID: ProductIDSchema,
})

export const CreateOrderBodySchema = Type.Composite([
  CreateOrderSchema,
  Type.Object({
    services: Type.Array(CreateOrderServicesSchema),
    products: Type.Array(CreateOrderProductSchema),
    rentCarBooking: Type.Optional(CreateRentCarOrderBookingSchema),
    deleteOrderService: Type.Array(DeleteOrderServiceSchema),
    deleteOrderProducts: Type.Array(DeleteOrderProductSchema),
  }),
])

export type CreateOrderBodySchemaType = Static<typeof CreateOrderBodySchema>

export const CreateOrderBodyReplySchema = Type.Composite([
  OrderSchema,
  Type.Object({
    message: Message,
    rentCarBooking: Type.Optional(CreateRentCarBookingSchema),
    services: Type.Array(
      Type.Composite([CreateOrderServicesSchema, Type.Object({ total: ServiceCostNumberSchema })]),
    ),
    products: Type.Array(
      Type.Composite([CreateOrderProductSchema, Type.Object({ total: ServiceCostNumberSchema })]),
    ),
  }),
])

export type CreateOrderBodyReplySchemaType = Static<typeof CreateOrderBodyReplySchema>

export const GetOrderBodyReplySchema = Type.Composite([
  OrderSchema,
  Type.Object({
    message: Message,
    rentCarBooking: Type.Optional(CreateRentCarBookingSchema),
    services: Type.Array(
      Type.Composite([CreateOrderServicesSchema, Type.Object({ total: ServiceCostNumberSchema })]),
    ),
    products: Type.Array(
      Type.Composite([CreateOrderProductSchema, Type.Object({ total: ServiceCostNumberSchema })]),
    ),
    driver: DriverBodySchema,
  }),
])

export type GetOrderBodyReplySchemaType = Static<typeof GetOrderBodyReplySchema>

export const ListOrdersQueryParamSchema = Type.Object({
  storeID: storeID,
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Integer({ minimum: 1, default: 10 })),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
  orderStatusSearch: Type.Optional(OrderStatusSchema),
  to: Type.Optional(Type.String({ format: 'date-time' })),
  from: Type.Optional(Type.String({ format: 'date-time' })),
  billingStatusSearch: Type.Optional(Type.Boolean()),
})

export type ListOrdersQueryParamSchemaType = Static<typeof ListOrdersQueryParamSchema>

export const OrdersPaginatedSchema = Type.Object({
  message: Message,
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
      currency: Type.Array(CurrencySchema),
      orderStatus: OrderStatusSchema,
      billed: BilledSchema,
    }),
  ),
})
