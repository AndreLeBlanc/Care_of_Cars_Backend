import { db } from '../config/db-connect.js'

//import { and, eq, ilike, or, sql } from 'drizzle-orm'
//
//import { Limit, Offset, Page, ResultCount, Search } from '../plugins/pagination.js'

import { Either, errorHandling, left, right } from '../utils/helper.js'

import Dinero, { Currency } from 'dinero.js'

import {
  Discount,
  DriverCarID,
  DriverID,
  EmployeeID,
  LocalServiceID,
  OrderID,
  OrderNotes,
  OrderStatus,
  PickupTime,
  ServiceCostNumber,
  ServiceDay1,
  ServiceDay2,
  ServiceDay3,
  ServiceDay4,
  ServiceDay5,
  ServiceID,
  StoreID,
  SubmissionTime,
  VatFree,
  orderLocalServices,
  orderServices,
  orders,
} from '../schema/schema.js'

type OrderBase = {
  driverCarID: DriverCarID
  driverID: DriverID
  storeID: StoreID
  orderNotes?: OrderNotes
  bookedBy?: EmployeeID
  submissionTime: SubmissionTime
  pickupTime: PickupTime
  vatFree: VatFree
  orderStatus: OrderStatus
}

export type CreateOrder = OrderBase & {
  currency: Currency
  discount: Discount
}

export type Order = OrderBase & {
  orderID: OrderID
  updatedAt: Date
  createdAt: Date
  discount: Dinero.Dinero
}

export type CreateOrderServices = {
  serviceID: ServiceID
  serviceVariantID?: ServiceID
  day1?: ServiceDay1
  day1Work?: string
  day1Employee?: EmployeeID
  day2?: ServiceDay2
  day2Work?: string
  day2Employee?: EmployeeID
  day3?: ServiceDay3
  day3Work?: string
  day3Employee?: EmployeeID
  day4?: ServiceDay4
  day4Work?: string
  day4Employee?: EmployeeID
  day5?: ServiceDay5
  day5Work?: string
  day5Employee?: EmployeeID
  cost: ServiceCostNumber
  discount: ServiceCostNumber
  vatFree: VatFree
  orderNotes?: OrderNotes
}

export type OrderServices = CreateOrderServices & {
  orderID: OrderID
}
export type CreateOrderLocalServices = {
  localServiceID: LocalServiceID
  localServiceVariantID?: LocalServiceID
  day1?: ServiceDay1
  day1Work?: string
  day1Employee?: EmployeeID
  day2?: ServiceDay2
  day2Work?: string
  day2Employee?: EmployeeID
  day3?: ServiceDay3
  day3Work?: string
  day3Employee?: EmployeeID
  day4?: ServiceDay4
  day4Work?: string
  day4Employee?: EmployeeID
  day5?: ServiceDay5
  day5Work?: string
  day5Employee?: EmployeeID
  cost: ServiceCostNumber
  discount: ServiceCostNumber
  vatFree: VatFree
  orderNotes?: OrderNotes
}

export type OrderLocalServices = CreateOrderLocalServices & {
  orderID: OrderID
}

export async function createOrder(
  order: CreateOrder,
  services: CreateOrderServices[],
  localServices: CreateOrderLocalServices[],
): Promise<
  Either<string, { order: Order; services: OrderServices[]; localServices: OrderLocalServices[] }>
> {
  try {
    return await db.transaction(async (tx) => {
      const [newOrder] = await tx
        .insert(orders)
        .values({ ...order, createdAt: new Date(), updatedAt: new Date() })
        .returning()

      if (newOrder != null) {
        const servicesWithOrderID = services.map((service) => ({
          orderID: newOrder.orderID,
          ...service,
        }))

        const newOrderServices = await tx
          .insert(orderServices)
          .values(servicesWithOrderID)
          .returning()

        const localServicesWithOrderID = localServices.map((service) => ({
          orderID: newOrder.orderID,
          ...service,
        }))

        const newOrderlocalServices = await tx
          .insert(orderLocalServices)
          .values(localServicesWithOrderID)
          .returning()

        const orderBranded: Order = {
          orderID: newOrder.orderID,
          driverCarID: newOrder.driverCarID,
          driverID: newOrder.driverID,
          storeID: newOrder.storeID,
          orderNotes: newOrder.orderNotes ?? undefined,
          bookedBy: newOrder.bookedBy ?? undefined,
          submissionTime: newOrder.submissionTime,
          pickupTime: newOrder.pickupTime,
          vatFree: newOrder.vatFree,
          orderStatus: newOrder.orderStatus,
          updatedAt: newOrder.updatedAt,
          createdAt: newOrder.createdAt,
          discount: Dinero({
            amount: newOrder.discount,
            currency: newOrder.currency as Dinero.Currency,
          }),
        }

        const serviceBranded: OrderServices[] = newOrderServices.map((service) => ({
          orderID: service.orderID,
          serviceID: service.serviceID,
          serviceServiceVariantID: service.serviceVariantID ?? undefined,
          day1: service.day1 ?? undefined,
          day1Work: service.day1Work ?? undefined,
          day1Employee: service.day1Employee ?? undefined,
          day2: service.day2 ?? undefined,
          day2Work: service.day2Work ?? undefined,
          day2Employee: service.day2Employee ?? undefined,
          day3: service.day3 ?? undefined,
          day3Work: service.day3Work ?? undefined,
          day3Employee: service.day3Employee ?? undefined,
          day4: service.day4 ?? undefined,
          day4Work: service.day4Work ?? undefined,
          day4Employee: service.day4Employee ?? undefined,
          day5: service.day5 ?? undefined,
          day5Work: service.day5Work ?? undefined,
          day5Employee: service.day5Employee ?? undefined,
          cost: service.cost,
          discount: service.discount,
          vatFree: service.vatFree,
          orderNotes: service.orderNotes ?? undefined,
        }))

        const localBranded: OrderLocalServices[] = newOrderlocalServices.map((local) => ({
          orderID: local.orderID,
          localServiceID: local.localServiceID,
          localServiceVariantID: local.serviceVariantID ?? undefined,
          day1: local.day1 ?? undefined,
          day1Work: local.day1Work ?? undefined,
          day1Employee: local.day1Employee ?? undefined,
          day2: local.day2 ?? undefined,
          day2Work: local.day2Work ?? undefined,
          day2Employee: local.day2Employee ?? undefined,
          day3: local.day3 ?? undefined,
          day3Work: local.day3Work ?? undefined,
          day3Employee: local.day3Employee ?? undefined,
          day4: local.day4 ?? undefined,
          day4Work: local.day4Work ?? undefined,
          day4Employee: local.day4Employee ?? undefined,
          day5: local.day5 ?? undefined,
          day5Work: local.day5Work ?? undefined,
          day5Employee: local.day5Employee ?? undefined,
          cost: local.cost,
          discount: local.discount,
          vatFree: local.vatFree,
          orderNotes: local.orderNotes ?? undefined,
        }))

        return right({
          order: orderBranded,
          services: serviceBranded,
          localServices: localBranded,
        })
      } else {
        return left("Couldn't place order")
      }
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}
