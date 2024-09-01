import { db } from '../config/db-connect.js'

import { and, count, eq, ilike, or, sql } from 'drizzle-orm'

import { Either, errorHandling, left, right } from '../utils/helper.js'

import {
  RentCarBooking,
  RentCarBookingReply,
  RentCarBookingReplyNoBrand,
} from './rentCarService.js'

import Dinero, { Currency } from 'dinero.js'

import { OrderRowNoDineroName } from './billingService.js'

import { Limit, Offset, Page, ResultCount, Search } from '../plugins/pagination.js'

import {
  Amount,
  Billed,
  Discount,
  DriverCarID,
  DriverFirstName,
  DriverID,
  DriverLastName,
  EmployeeID,
  IsBilled,
  OrderID,
  OrderNotes,
  OrderStatus,
  PickupTime,
  ServiceCostCurrency,
  ServiceCostDinero,
  ServiceCostNumber,
  ServiceID,
  ServiceName,
  StoreID,
  SubmissionTimeOrder,
  VatFree,
  WorkDay1,
  WorkDay2,
  WorkDay3,
  WorkDay4,
  WorkDay5,
  billOrders,
  drivers,
  orderListing,
  orderStatus,
  orders,
  rentCarBookings,
} from '../schema/schema.js'

export type OrdersPaginated = {
  totalOrders: ResultCount
  totalPage: Page
  perPage: Limit
  page: Page
  orders: {
    driverCarID: DriverCarID
    driverID: DriverID
    firstName: DriverFirstName
    lastName: DriverLastName
    submissionTime: SubmissionTimeOrder
    updatedAt: string
    total: ServiceCostNumber[]
    currency: ServiceCostCurrency[]
    orderStatus: OrderStatus
    billed: Billed
  }[]
}

type OrderBase = {
  driverCarID: DriverCarID
  driverID: DriverID
  storeID: StoreID
  orderNotes?: OrderNotes
  bookedBy?: EmployeeID
  submissionTime: SubmissionTimeOrder
  pickupTime: PickupTime
  vatFree: VatFree
  discount: Discount
  currency: ServiceCostCurrency
  orderStatus: OrderStatus
}

export type CreateOrder = OrderBase & {
  orderID?: OrderID
}

export type Order = OrderBase & {
  orderID: OrderID
  updatedAt: string
  createdAt: string
}

export type CreateOrderServices = {
  serviceID: ServiceID
  serviceVariantID?: ServiceID
  name: ServiceName
  amount: Amount
  day1?: WorkDay1
  day1Work?: string
  day1Employee?: EmployeeID
  day2?: WorkDay2
  day2Work?: string
  day2Employee?: EmployeeID
  day3?: WorkDay3
  day3Work?: string
  day3Employee?: EmployeeID
  day4?: WorkDay4
  day4Work?: string
  day4Employee?: EmployeeID
  day5?: WorkDay5
  day5Work?: string
  day5Employee?: EmployeeID
  cost: ServiceCostNumber
  currency: ServiceCostCurrency
  vatFree: VatFree
  orderNotes?: OrderNotes
}

export type OrderServices = CreateOrderServices & {
  orderID: OrderID
  total: ServiceCostNumber
}

export type OrderWithServices = Order & { services: OrderServices[] } & {
  rentCarBooking?: RentCarBookingReply
}

export type DeleteOrderService = { orderID: OrderID; serviceID: ServiceID }

type OrderNoBrand = {
  driverCarID: DriverCarID
  driverID: DriverID
  storeID: StoreID
  orderNotes?: OrderNotes | null
  bookedBy?: EmployeeID | null
  submissionTime: SubmissionTimeOrder
  pickupTime: PickupTime
  vatFree: VatFree
  orderStatus: OrderStatus
  orderID: OrderID
  discount: Discount
  currency: string
  updatedAt: string
  createdAt: string
}

type OrderServicesNoBrand = {
  serviceID: ServiceID
  ServiceVariantID?: ServiceID
  name: ServiceName
  amount: Amount
  day1?: WorkDay1 | null
  day1Work?: string | null
  day1Employee?: EmployeeID | null
  day2?: WorkDay2 | null
  day2Work?: string | null
  day2Employee?: EmployeeID | null
  day3?: WorkDay3 | null
  day3Work?: string | null
  day3Employee?: EmployeeID | null
  day4?: WorkDay4 | null
  day4Work?: string | null
  day4Employee?: EmployeeID | null
  day5?: WorkDay5 | null
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
      total: ServiceCostNumber(service.cost * service.amount),
      currency: ServiceCostCurrency(service.currency as Currency),
      vatFree: service.vatFree,
      orderNotes: service.orderNotes ?? undefined,
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
    ...orderBranded,
    services: serviceBranded,
    rentCarBooking: brandedBooking,
  }
}

export async function createOrder(
  order: CreateOrder,
  services: CreateOrderServices[],
  deleteOrderService: DeleteOrderService[],
  booking?: RentCarBooking,
): Promise<Either<string, OrderWithServices>> {
  try {
    return await db.transaction(async (tx) => {
      let newOrder
      if (order.orderID != null) {
        newOrder = (
          await tx
            .update(orders)
            .set({ ...order, updatedAt: new Date().toISOString() })
            .where(eq(orders.orderID, order.orderID))
            .returning()
        )[0]
      } else {
        newOrder = (
          await tx
            .insert(orders)
            .values({
              ...order,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
            .returning()
        )[0]
      }

      if (newOrder != null) {
        const servicesWithOrderID = services.map((service) => ({
          orderID: newOrder.orderID,
          ...service,
        }))

        if (deleteOrderService.length > 0) {
          await tx
            .delete(orderListing)
            .where(
              or(
                ...deleteOrderService.map((orderID) =>
                  and(
                    eq(orderListing.orderID, orderID.orderID),
                    eq(orderListing.serviceID, orderID.serviceID),
                  ),
                ),
              ),
            )
        }

        let newOrderServices: OrderServicesNoBrand[] = []

        if (0 < servicesWithOrderID.length) {
          newOrderServices = await tx
            .insert(orderListing)
            .values(servicesWithOrderID)
            .onConflictDoUpdate({
              target: [orderListing.orderID, orderListing.serviceID],
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
        }

        if (booking != undefined) {
          const [newBooking] = await db
            .insert(rentCarBookings)
            .values(booking)
            .onConflictDoUpdate({
              target: [rentCarBookings.rentCarBookingID, rentCarBookings.orderID],
              set: booking,
            })
            .returning()
          const branded = brandOrder(newOrder, newOrderServices, newBooking)
          return right(branded)
        } else {
          const branded = brandOrder(newOrder, newOrderServices)
          return right(branded)
        }
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
      const deletedOrderListing = await tx
        .delete(orderListing)
        .where(eq(orderListing.orderID, order))
        .returning()

      const [deletedOrder] = await tx.delete(orders).where(eq(orders.orderID, order)).returning()

      return deletedOrder
        ? right(brandOrder(deletedOrder, deletedOrderListing))
        : left("Couldn't find order")
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getOrder(order: OrderID): Promise<Either<string, OrderWithServices>> {
  try {
    const [fetchedOrders] = await db
      .select({
        order: orders,
        rentCarBooking: rentCarBookings,
        orderServices: sql<OrderServicesNoBrand[]>`
        COALESCE(
          JSONB_AGG(
            CASE WHEN ${orderListing.serviceID} IS NOT NULL THEN
              jsonb_build_object(
                'orderID', ${orderListing.orderID},
                'serviceID', ${orderListing.serviceID},
                'name', ${orderListing.name},
                'amount', ${orderListing.amount},
                'serviceVariantID', ${orderListing.serviceVariantID},
                'day1', ${orderListing.day1},
                'day1Work', ${orderListing.day1Work},
                'day1Employee', ${orderListing.day1Employee},
                'day2', ${orderListing.day2},
                'day2Work', ${orderListing.day2Work},
                'day2Employee', ${orderListing.day2Employee},
                'day3', ${orderListing.day3},
                'day3Work', ${orderListing.day3Work},
                'day3Employee', ${orderListing.day3Employee},
                'day4', ${orderListing.day4},
                'day4Work', ${orderListing.day4Work},
                'day4Employee', ${orderListing.day4Employee},
                'day5', ${orderListing.day5},
                'day5Work', ${orderListing.day5Work},
                'day5Employee', ${orderListing.day5Employee},
                'cost', ${orderListing.cost},
                'currency', ${orderListing.currency},
                'vatFree', ${orderListing.vatFree},
                'orderNotes', ${orderListing.orderNotes}
              )
            ELSE NULL END
          ) FILTER (WHERE ${orderListing.serviceID} IS NOT NULL),
          '[]'::jsonb
        )
      `.as('orderServices'),
      })
      .from(orders)
      .where(eq(orders.orderID, order))
      .leftJoin(orderListing, eq(orderListing.orderID, orders.orderID))
      .leftJoin(rentCarBookings, eq(rentCarBookings.orderID, orders.orderID))
      .groupBy(orders.orderID, rentCarBookings.rentCarBookingID)

    return fetchedOrders
      ? right(
          brandOrder(
            fetchedOrders.order,
            fetchedOrders.orderServices ? fetchedOrders.orderServices : [],
            fetchedOrders.rentCarBooking?.bookedBy ? fetchedOrders.rentCarBooking : undefined,
          ),
        )
      : left("Couldn't find order")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function listOrders(
  search: Search,
  limit = Limit(10),
  page = Page(1),
  offset = Offset(0),
  store: StoreID,
  orderStatusSearch?: OrderStatus,
  billingStatusSearch?: IsBilled,
): Promise<Either<string, OrdersPaginated>> {
  try {
    return await db.transaction(async (tx) => {
      let condition
      if (Object.values(orderStatus).includes(search as OrderStatus)) {
        ilike(orders.orderStatus, search)
      } else {
        condition = and(
          eq(orders.storeID, store),
          or(
            sql`CAST(${orders.createdAt} AS TEXT) ILIKE ${'%' + search + '%'}`,
            sql`CAST(${orders.updatedAt} AS TEXT) ILIKE ${'%' + search + '%'}`,
            sql`CAST(${orders.submissionTime} AS TEXT) ILIKE ${'%' + search + '%'}`,
            ilike(drivers.driverFirstName, '%' + search + '%'),
            ilike(drivers.driverLastName, '%' + search + '%'),
          ),
        )
      }
      if (orderStatusSearch != null) {
        condition = or(condition, ilike(orders.orderStatus, '%' + orderStatusSearch + '%'))
      }
      if (billingStatusSearch != null) {
        if (billingStatusSearch) {
          condition = or(
            condition,
            sql<boolean>`EXISTS (
            SELECT 1 FROM ${billOrders}
            WHERE ${billOrders.orderID} = ${orders.orderID}
          )`,
          )
        } else {
          condition = or(
            condition,
            sql<boolean>`NOT EXISTS (
            SELECT 1 FROM ${billOrders}
            WHERE ${billOrders.orderID} = ${orders.orderID}
          )`,
          )
        }
      }

      const orderList = await tx
        .select({
          orderID: orders.orderID,
          driverCarID: orders.driverCarID,
          driverID: orders.driverID,
          firstName: drivers.driverFirstName,
          lastName: drivers.driverLastName,
          submissionTime: orders.submissionTime,
          updatedAt: orders.updatedAt,
          orderStatus: orders.orderStatus,
          services: sql<OrderRowNoDineroName[]>`
        COALESCE(
          JSONB_AGG(
            CASE WHEN ${orderListing.orderID} IS NOT NULL THEN
              jsonb_build_object(
             'currency',${orderListing.currency},
             'cost',${orderListing.cost},
             'amount',${orderListing.amount}
            )
            ELSE NULL END
          ) FILTER (WHERE ${orderListing.orderID} IS NOT NULL),
          '[]'::jsonb
        )
      `.as('orderServices'),

          billed: sql<boolean>`EXISTS (
      SELECT 1 FROM ${billOrders}
      WHERE ${billOrders.orderID} = ${orders.orderID}
    )`,
        })
        .from(orders)
        .innerJoin(drivers, eq(orders.driverID, drivers.driverID))
        .leftJoin(orderListing, eq(orders.orderID, orderListing.orderID))
        .where(condition)
        .groupBy(orders.orderID, drivers.driverFirstName, drivers.driverLastName)
        .limit(limit || 10)
        .offset(offset || 0)

      const [orderCount] = await tx
        .select({ count: count() })
        .from(orders)
        .innerJoin(drivers, eq(orders.driverID, drivers.driverID))
        .where(condition)

      const totalPage = Page(Math.ceil(orderCount.count / limit))

      function totalPriceCalc(services: OrderRowNoDineroName[]): ServiceCostDinero[] {
        return services.map((serv) =>
          ServiceCostDinero(
            Dinero({
              amount: serv.cost,
              currency: serv.currency as Currency,
            }).multiply(serv.amount),
          ),
        )
      }
      return orderList
        ? right({
            totalOrders: ResultCount(orderCount.count),
            totalPage: totalPage,
            perPage: limit,
            page: page,
            orders: orderList.map((order) => ({
              driverCarID: order.driverCarID,
              driverID: order.driverID,
              firstName: order.firstName,
              lastName: order.lastName,
              submissionTime: order.submissionTime,
              updatedAt: order.updatedAt,
              total: totalPriceCalc(order.services).map((x) => ServiceCostNumber(x.getAmount())),
              currency: totalPriceCalc(order.services).map((x) =>
                ServiceCostCurrency(x.getCurrency()),
              ),
              orderStatus: order.orderStatus,
              billed: Billed(order.billed),
            })),
          })
        : left('no errors found')
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}
