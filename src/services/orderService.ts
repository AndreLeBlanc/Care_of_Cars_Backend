import { db } from '../config/db-connect.js'

import { and, count, eq, getTableColumns, gte, ilike, lte, or, sql } from 'drizzle-orm'

import { Either, errorHandling, jsonAggBuildObject, left, right } from '../utils/helper.js'

import {
  PutRentCarBooking,
  RentCarBookingReply,
  RentCarBookingReplyNoBrand,
} from './rentCarService.js'

import Dinero, { Currency } from 'dinero.js'

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
  OrderProductNotes,
  OrderStatus,
  PickupTime,
  ProductCostCurrency,
  ProductCostNumber,
  ProductDescription,
  ProductID,
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
  orderProducts,
  orderStatus,
  orders,
  rentCarBookings,
} from '../schema/schema.js'
import { Driver } from './customerService.js'

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

export type OrderRowNoDineroName = {
  amount: Amount
  cost: ServiceCostNumber | ProductCostNumber
  currency: string
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
  storeID: StoreID
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
  products: CreateOrderProduct[]
} & {
  rentCarBooking?: RentCarBookingReply
}

export type OrderWithServicesAndDriver = OrderWithServices & { driver: Driver }

export type DeleteOrderService = { orderID: OrderID; serviceID: ServiceID }

export type DeleteOrderProducts = { orderID: OrderID; productID: ProductID }

export type CreateOrderProduct = {
  productID: ProductID
  productDescription: ProductDescription
  amount: Amount
  cost: ProductCostNumber
  currency: ProductCostCurrency
  orderProductNotes?: OrderProductNotes
}

export type OrderProduct = CreateOrderProduct & { orderID: OrderID; total: ProductCostNumber }

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
  storeID: StoreID
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

type CreateOrderProductNoBrand = {
  productID: ProductID
  productDescription: ProductDescription
  amount: Amount
  cost: ProductCostNumber
  currency: string
  orderProductNotes: OrderProductNotes | null
}

function brandOrder(
  newOrder: OrderNoBrand,
  newOrderServices: OrderServicesNoBrand[],
  newOrderProducts: CreateOrderProductNoBrand[],
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
      storeID: service.storeID,
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

  const productsBranded: CreateOrderProduct[] = newOrderProducts.map((prod) => ({
    productID: prod.productID,
    productDescription: prod.productDescription,
    amount: prod.amount,
    cost: prod.cost,
    total: prod.cost * prod.amount,
    currency: ProductCostCurrency(prod.currency as Currency),
    orderProductNotes: prod.orderProductNotes ?? undefined,
  }))

  const brandedBooking = newBooking
    ? {
        rentCarBookingID: newBooking.rentCarBookingID,
        orderID: newBooking.orderID,
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
    products: productsBranded,
    rentCarBooking: brandedBooking,
  }
}

export async function createOrder(
  order: CreateOrder,
  services: CreateOrderServices[],
  products: CreateOrderProduct[],
  deleteOrderService: DeleteOrderService[],
  deletedOrderProducts: DeleteOrderProducts[],
  booking?: PutRentCarBooking,
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

        const productssWithOrderID = products.map((product) => ({
          orderID: newOrder.orderID,
          ...product,
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
        if (deletedOrderProducts.length > 0) {
          await tx
            .delete(orderProducts)
            .where(
              or(
                ...deletedOrderProducts.map((orderID) =>
                  and(
                    eq(orderProducts.orderID, orderID.orderID),
                    eq(orderProducts.productID, orderID.productID),
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
                storeID: sql`"excluded"."storeID"`,
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

        let newOrderProducts: CreateOrderProductNoBrand[] = []

        if (0 < productssWithOrderID.length) {
          newOrderProducts = await tx
            .insert(orderProducts)
            .values(productssWithOrderID)
            .onConflictDoUpdate({
              target: [orderProducts.orderID, orderProducts.productID],
              set: {
                productID: sql`"excluded"."productID"`,
                productDescription: sql`"excluded"."productDescription"`,
                amount: sql`"excluded"."amount"`,
                cost: sql`"excluded"."cost"`,
                currency: sql`"excluded"."currency"`,
                orderProductNotes: sql`"excluded"."orderProductNotes"`,
              },
            })
            .returning()
        }

        if (booking != undefined) {
          const [newBooking] = await tx
            .insert(rentCarBookings)
            .values({ orderID: newOrder.orderID, ...booking })
            .onConflictDoUpdate({
              target: [rentCarBookings.rentCarBookingID, rentCarBookings.orderID],
              set: booking,
            })
            .returning()

          const branded = brandOrder(newOrder, newOrderServices, newOrderProducts, newBooking)
          return right(branded)
        } else {
          const branded = brandOrder(newOrder, newOrderServices, newOrderProducts)
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

      const deletedOrderProducts = await tx
        .delete(orderProducts)
        .where(eq(orderProducts.orderID, order))
        .returning()

      const [deletedOrder] = await tx.delete(orders).where(eq(orders.orderID, order)).returning()

      return deletedOrder
        ? right(brandOrder(deletedOrder, deletedOrderListing, deletedOrderProducts))
        : left("Couldn't find order")
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getOrder(
  order: OrderID,
): Promise<Either<string, OrderWithServicesAndDriver>> {
  try {
    const [fetchedOrders] = await db
      .select({
        order: getTableColumns(orders),
        rentCarBooking: getTableColumns(rentCarBookings),
        services: jsonAggBuildObject(getTableColumns(orderListing)),
        products: jsonAggBuildObject(getTableColumns(orderProducts)),
        driver: drivers,
      })
      .from(orders)
      .where(eq(orders.orderID, order))
      .innerJoin(drivers, eq(orders.driverID, drivers.driverID))
      .leftJoin(orderListing, eq(orderListing.orderID, orders.orderID))
      .leftJoin(orderProducts, eq(orderProducts.orderID, orders.orderID))
      .leftJoin(rentCarBookings, eq(rentCarBookings.orderID, orders.orderID))
      .groupBy(orders.orderID, rentCarBookings.rentCarBookingID, drivers.driverID)

    return fetchedOrders
      ? right({
          ...brandOrder(
            fetchedOrders.order,
            fetchedOrders.services ? fetchedOrders.services : [],
            fetchedOrders.products ? fetchedOrders.products : [],
            fetchedOrders.rentCarBooking?.bookedBy ? fetchedOrders.rentCarBooking : undefined,
          ),
          driver: {
            driverID: fetchedOrders.driver.driverID,
            customerOrgNumber: fetchedOrders.driver.customerOrgNumber ?? undefined,
            driverExternalNumber: fetchedOrders.driver.driverExternalNumber ?? undefined,
            driverGDPRAccept: fetchedOrders.driver.driverGDPRAccept,
            driverISWarrantyDriver: fetchedOrders.driver.driverISWarrantyDriver,
            driverAcceptsMarketing: fetchedOrders.driver.driverAcceptsMarketing,
            driverFirstName: fetchedOrders.driver.driverFirstName,
            driverLastName: fetchedOrders.driver.driverLastName,
            driverEmail: fetchedOrders.driver.driverEmail,
            driverPhoneNumber: fetchedOrders.driver.driverPhoneNumber,
            driverAddress: fetchedOrders.driver.driverAddress,
            driverZipCode: fetchedOrders.driver.driverZipCode,
            driverAddressCity: fetchedOrders.driver.driverAddressCity,
            driverCountry: fetchedOrders.driver.driverCountry,
            driverHasCard: fetchedOrders.driver.driverHasCard ?? undefined,
            driverCardValidTo: fetchedOrders.driver.driverCardValidTo ?? undefined,
            driverCardNumber: fetchedOrders.driver.driverCardNumber ?? undefined,
            driverKeyNumber: fetchedOrders.driver.driverKeyNumber ?? undefined,
            driverNotesShared: fetchedOrders.driver.driverNotesShared ?? undefined,
            driverNotes: fetchedOrders.driver.driverNotes ?? undefined,
            createdAt: fetchedOrders.driver.createdAt,
            updatedAt: fetchedOrders.driver.updatedAt,
          },
        })
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
  store?: StoreID,
  to?: SubmissionTimeOrder,
  from?: SubmissionTimeOrder,
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

      condition = to ? and(condition, lte(orders.submissionTime, to)) : condition
      condition = from ? and(condition, gte(orders.submissionTime, from)) : condition
      condition = store ? and(condition, eq(orders.storeID, store)) : condition
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
          services: jsonAggBuildObject({
            currency: orderListing.currency,
            cost: orderListing.cost,
            amount: orderListing.amount,
          }),
          products: jsonAggBuildObject({
            currency: orderProducts.currency,
            cost: orderProducts.cost,
            amount: orderProducts.amount,
          }),

          billed: sql<boolean>`EXISTS (
      SELECT 1 FROM ${billOrders}
      WHERE ${billOrders.orderID} = ${orders.orderID}
    )`,
        })
        .from(orders)
        .innerJoin(drivers, eq(orders.driverID, drivers.driverID))
        .leftJoin(orderListing, eq(orders.orderID, orderListing.orderID))
        .leftJoin(orderProducts, eq(orders.orderID, orderProducts.orderID))
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

      function totalPriceCalc(
        products: OrderRowNoDineroName[],
        services: OrderRowNoDineroName[],
      ): ServiceCostDinero[] {
        return [
          ...products.map((prod) =>
            ServiceCostDinero(
              Dinero({
                amount: prod.cost as ProductCostNumber,
                currency: prod.currency as Currency,
              }).multiply(prod.amount),
            ),
          ),
          ...services.map((serv) =>
            ServiceCostDinero(
              Dinero({
                amount: serv.cost as ServiceCostNumber,
                currency: serv.currency as Currency,
              }).multiply(serv.amount),
            ),
          ),
        ]
      }

      return orderList
        ? right({
            totalOrders: ResultCount(orderCount.count),
            totalPage: totalPage,
            perPage: limit,
            page: page,
            orders: orderList.map((order) => {
              const pricingInfo = totalPriceCalc(order.products, order.services)
              return {
                driverCarID: order.driverCarID,
                driverID: order.driverID,
                firstName: order.firstName,
                lastName: order.lastName,
                submissionTime: order.submissionTime,
                updatedAt: order.updatedAt,
                total: pricingInfo.map((x) => ServiceCostNumber(x.getAmount())),
                currency: pricingInfo.map((x) => ServiceCostCurrency(x.getCurrency())),
                orderStatus: order.orderStatus,
                billed: Billed(order.billed),
              }
            }),
          })
        : left('no errors found')
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}
