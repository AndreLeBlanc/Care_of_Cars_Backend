import { db } from '../config/db-connect.js'

import { eq, sql } from 'drizzle-orm'

//import { Limit, Offset, Page, ResultCount, Search } from '../plugins/pagination.js'

import { Either, errorHandling, left, right } from '../utils/helper.js'

import {
  RentCarBooking,
  RentCarBookingReply,
  RentCarBookingReplyNoBrand,
} from './rentCarService.js'

import {
  Amount,
  Cost,
  Discount,
  DriverCarID,
  DriverID,
  EmployeeID,
  LocalServiceID,
  OrderID,
  OrderNotes,
  OrderStatus,
  PickupTime,
  ServiceCostCurrency,
  ServiceCostNumber,
  ServiceDay1,
  ServiceDay2,
  ServiceDay3,
  ServiceDay4,
  ServiceDay5,
  ServiceID,
  ServiceName,
  StoreID,
  SubmissionTime,
  VatFree,
  orderLocalServices,
  orderServices,
  orders,
  rentCarBookings,
} from '../schema/schema.js'
import { Currency } from 'dinero.js'

type OrderBase = {
  driverCarID: DriverCarID
  driverID: DriverID
  storeID: StoreID
  orderNotes?: OrderNotes
  bookedBy?: EmployeeID
  submissionTime: SubmissionTime
  pickupTime: PickupTime
  vatFree: VatFree
  discount: Discount
  currency: ServiceCostCurrency
  orderStatus: OrderStatus
}

export type CreateOrder = OrderBase & {
  orderID?: OrderID
  discount: Discount
}

export type Order = OrderBase & {
  cost: Cost
  orderID: OrderID
  updatedAt: Date
  createdAt: Date
  discount: Discount
}

export type CreateOrderServices = {
  serviceID: ServiceID
  serviceVariantID?: ServiceID
  name: ServiceName
  amount: Amount
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
  currency: ServiceCostCurrency
  vatFree: VatFree
  orderNotes?: OrderNotes
}

export type OrderServices = CreateOrderServices & {
  orderID: OrderID
}
export type CreateOrderLocalServices = {
  localServiceID: LocalServiceID
  localServiceVariantID?: LocalServiceID
  name: ServiceName
  amount: Amount
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
  currency: ServiceCostCurrency
  vatFree: VatFree
  orderNotes?: OrderNotes
}

export type OrderLocalServices = CreateOrderLocalServices & {
  orderID: OrderID
}

export type OrderWithServices = { order: Order } & { services: OrderServices[] } & {
  localServices: OrderLocalServices[]
} & { rentCarBooking?: RentCarBookingReply }

type OrderNoBrand = {
  driverCarID: DriverCarID
  driverID: DriverID
  storeID: StoreID
  orderNotes?: OrderNotes | null
  bookedBy?: EmployeeID | null
  submissionTime: SubmissionTime
  pickupTime: PickupTime
  vatFree: VatFree
  orderStatus: OrderStatus
  orderID: OrderID
  discount: Discount
  currency: string
  updatedAt: Date
  createdAt: Date
}

type OrderLocalServicesNoBrand = {
  localServiceID: LocalServiceID
  localServiceVariantID?: LocalServiceID
  amount: Amount
  name: ServiceName
  day1?: ServiceDay1 | null
  day1Work?: string | null
  day1Employee?: EmployeeID | null
  day2?: ServiceDay2 | null
  day2Work?: string | null
  day2Employee?: EmployeeID | null
  day3?: ServiceDay3 | null
  day3Work?: string | null
  day3Employee?: EmployeeID | null
  day4?: ServiceDay4 | null
  day4Work?: string | null
  day4Employee?: EmployeeID | null
  day5?: ServiceDay5 | null
  day5Work?: string | null
  day5Employee?: EmployeeID | null
  cost: ServiceCostNumber
  currency: string
  vatFree: VatFree
  orderNotes?: OrderNotes | null
  orderID: OrderID
}
type OrderServicesNoBrand = {
  serviceID: ServiceID
  ServiceVariantID?: ServiceID
  name: ServiceName
  amount: Amount
  day1?: ServiceDay1 | null
  day1Work?: string | null
  day1Employee?: EmployeeID | null
  day2?: ServiceDay2 | null
  day2Work?: string | null
  day2Employee?: EmployeeID | null
  day3?: ServiceDay3 | null
  day3Work?: string | null
  day3Employee?: EmployeeID | null
  day4?: ServiceDay4 | null
  day4Work?: string | null
  day4Employee?: EmployeeID | null
  day5?: ServiceDay5 | null
  day5Work?: string | null
  day5Employee?: EmployeeID | null
  cost: ServiceCostNumber
  currency: string
  vatFree: VatFree
  orderNotes?: OrderNotes | null
  orderID: OrderID
}

function brandOrder(
  newOrder: OrderNoBrand,
  newOrderServices: OrderServicesNoBrand[],
  newOrderlocalServices: OrderLocalServicesNoBrand[],
  newBooking?: RentCarBookingReplyNoBrand | null,
): OrderWithServices {
  const orderBranded: Omit<Order, 'cost'> = {
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
    discount: newOrder.discount,
    currency: ServiceCostCurrency(newOrder.currency as Currency),
  }

  let cost = 0
  const serviceBranded: OrderServices[] = newOrderServices.map((service) => {
    cost = cost + service.cost
    return {
      orderID: service.orderID,
      serviceID: service.serviceID,
      name: service.name,
      amount: service.amount,
      serviceServiceVariantID: service.ServiceVariantID ?? undefined,
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
      currency: ServiceCostCurrency(service.currency as Currency),
      vatFree: service.vatFree,
      orderNotes: service.orderNotes ?? undefined,
    }
  })

  const localBranded: OrderLocalServices[] = newOrderlocalServices.map((local) => {
    cost = cost + local.cost
    return {
      orderID: local.orderID,
      localServiceID: local.localServiceID,
      name: local.name,
      amount: local.amount,
      localServiceVariantID: local.localServiceVariantID ?? undefined,
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
      currency: ServiceCostCurrency(local.currency as Currency),
      vatFree: local.vatFree,
      orderNotes: local.orderNotes ?? undefined,
    }
  })

  const brandedBooking = newBooking
    ? {
        rentCarBookingID: newBooking.rentCarBookingID,
        orderID: newBooking.orderID ?? undefined,
        rentCarRegistrationNumber: newBooking.rentCarRegistrationNumber,
        bookingStart: newBooking.bookingStart,
        bookingEnd: newBooking.bookingEnd,
        bookedBy: newBooking.bookedBy ?? undefined,
        bookingStatus: newBooking.bookingStatus,
        submissionTime: newBooking.submissionTime,
        createdAt: newBooking.createdAt,
        updatedAt: newBooking.updatedAt,
      }
    : undefined
  return {
    order: { cost: Cost(cost), ...orderBranded },
    services: serviceBranded,
    localServices: localBranded,
    rentCarBooking: brandedBooking,
  }
}

export async function createOrder(
  order: CreateOrder,
  services: CreateOrderServices[],
  localServices: CreateOrderLocalServices[],
  booking: RentCarBooking,
): Promise<Either<string, OrderWithServices>> {
  try {
    return await db.transaction(async (tx) => {
      let newOrder
      if (order.orderID != null) {
        newOrder = (
          await tx
            .update(orders)
            .set({ ...order, updatedAt: new Date() })
            .where(eq(orders.orderID, order.orderID))
            .returning()
        )[0]
      } else {
        newOrder = (
          await tx
            .insert(orders)
            .values({ ...order, createdAt: new Date(), updatedAt: new Date() })
            .returning()
        )[0]
      }

      if (newOrder != null) {
        const servicesWithOrderID = services.map((service) => ({
          orderID: newOrder.orderID,
          ...service,
        }))

        const newOrderServices = await tx
          .insert(orderServices)
          .values(servicesWithOrderID)
          .onConflictDoUpdate({
            target: [orderServices.orderID, orderServices.serviceID],
            set: {
              serviceID: sql`"excluded"."serviceID"`,
              serviceVariantID: sql`"excluded"."serviceVariantID"`,
              name: sql`"excluded"."name"`,
              amount: sql`"excluded"."amount"`,
              day1: sql`"excluded"."day1"`,
              day1Work: sql`"excluded"."day1Work"`,
              day1Employee: sql`"excluded"."day1Employee"`,
              day2: sql`"excluded"."day2"`,
              day2Work: sql`"excluded"."day2Work"`,
              day2Employee: sql`"excluded"."day2Employee"`,
              day3: sql`"excluded"."day3"`,
              day3Work: sql`"excluded"."day3Work"`,
              day3Employee: sql`"excluded"."day3Employee"`,
              day4: sql`"excluded"."day4"`,
              day4Work: sql`"excluded"."day4Work"`,
              day4Employee: sql`"excluded"."day4Employee"`,
              day5: sql`"excluded"."day5"`,
              day5Work: sql`"excluded"."day5Work"`,
              day5Employee: sql`"excluded"."day5Employee"`,
              cost: sql`"excluded"."cost"`,
              currency: sql`"excluded"."currency"`,
              vatFree: sql`"excluded"."vatFree"`,
              orderNotes: sql`"excluded"."orderNotes"`,
            },
          })
          .returning()

        const localServicesWithOrderID = localServices.map((service) => ({
          orderID: newOrder.orderID,
          ...service,
        }))

        const newOrderlocalServices = await tx
          .insert(orderLocalServices)
          .values(localServicesWithOrderID)
          .onConflictDoUpdate({
            target: [orderServices.orderID, orderServices.serviceID],
            set: {
              localServiceID: sql`"excluded"."localServiceID"`,
              serviceVariantID: sql`"excluded"."serviceVariantID"`,
              name: sql`"excluded"."name"`,
              amount: sql`"excluded"."amount"`,
              day1: sql`"excluded"."day1"`,
              day1Work: sql`"excluded"."day1Work"`,
              day1Employee: sql`"excluded"."day1Employee"`,
              day2: sql`"excluded"."day2"`,
              day2Work: sql`"excluded"."day2Work"`,
              day2Employee: sql`"excluded"."day2Employee"`,
              day3: sql`"excluded"."day3"`,
              day3Work: sql`"excluded"."day3Work"`,
              day3Employee: sql`"excluded"."day3Employee"`,
              day4: sql`"excluded"."day4"`,
              day4Work: sql`"excluded"."day4Work"`,
              day4Employee: sql`"excluded"."day4Employee"`,
              day5: sql`"excluded"."day5"`,
              day5Work: sql`"excluded"."day5Work"`,
              day5Employee: sql`"excluded"."day5Employee"`,
              cost: sql`"excluded"."cost"`,
              currency: sql`"excluded"."currency"`,
              vatFree: sql`"excluded"."vatFree"`,
              orderNotes: sql`"excluded"."orderNotes"`,
            },
          })
          .returning()

        const [newBooking] = await db
          .insert(rentCarBookings)
          .values(booking)
          .onConflictDoUpdate({
            target: [rentCarBookings.rentCarBookingID, rentCarBookings.orderID],
            set: booking,
          })
          .returning()

        const branded = brandOrder(newOrder, newOrderServices, newOrderlocalServices, newBooking)
        return right(branded)
      } else {
        return left("Couldn't place order")
      }
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteOrder(order: OrderID): Promise<Either<string, OrderWithServices>> {
  try {
    return await db.transaction(async (tx) => {
      const deletedOrderServices = await tx
        .delete(orderServices)
        .where(eq(orderServices.orderID, order))
        .returning()

      const deletedOrderLocalServices = await tx
        .delete(orderLocalServices)
        .where(eq(orderLocalServices.orderID, order))
        .returning()

      const [deletedOrder] = await tx.delete(orders).where(eq(orders.orderID, order)).returning()

      return deletedOrder
        ? right(brandOrder(deletedOrder, deletedOrderServices, deletedOrderLocalServices))
        : left("Couldn't find order")
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getOrder(order: OrderID): Promise<Either<string, OrderWithServices>> {
  try {
    const fetchedOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.orderID, order))
      .leftJoin(rentCarBookings, eq(rentCarBookings.orderID, order))
      .leftJoin(orderLocalServices, eq(orderLocalServices.orderID, order))
      .leftJoin(orderServices, eq(orderServices.orderID, order))

    const serviceLists = fetchedOrders.reduce<{
      serv: OrderServicesNoBrand[]
      local: OrderLocalServicesNoBrand[]
    }>(
      (acc, order) => {
        if (order.orderServices != null) {
          acc.serv.push(order.orderServices)
        }
        return acc
      },
      { serv: [], local: [] },
    )

    return fetchedOrders[0]
      ? right(
          brandOrder(
            fetchedOrders[0].orders,
            serviceLists.serv,
            serviceLists.local,
            fetchedOrders[0].rentCarBookings,
          ),
        )
      : left("Couldn't find order")
  } catch (e) {
    return left(errorHandling(e))
  }
}

//export async function listOrders(): Promise<Either<string, Order[]>> {}
