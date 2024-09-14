import { db } from '../config/db-connect.js'

import { and, between, eq, isNull, or, sql } from 'drizzle-orm'
import Dinero from 'dinero.js'

import { Either, errorHandling, left, right } from '../utils/helper.js'

//import Dinero, { Currency } from 'dinero.js'

import {
  AbsoluteDifference,
  AverageRevenue,
  BillPaid,
  BookingCount,
  CashPaid,
  EmployeeCheckIn,
  EmployeeCheckOut,
  EmployeeID,
  MonthlyRevenue,
  OrderStatus,
  PercentDifference,
  PotentialMonthlyRevenue,
  ProductCostNumber,
  ProductDescription,
  ProductExpense,
  ProductID,
  ProductProfit,
  ProductSold,
  ServiceCostNumber,
  ServiceExpense,
  ServiceID,
  ServiceName,
  ServiceProfit,
  ServiceRevenuePerHour,
  ServiceSold,
  StoreID,
  SubmissionTimeOrder,
  TotalDiscount,
  TotalMonthlyRevenue,
  TotalMonthlyRevenueLastYear,
  TotalRevenue,
  TotalVat,
  UserFirstName,
  UserLastName,
  WorkedHours,
  employeeCheckin,
  employeeStore,
  employees,
  orderListing,
  orderProducts,
  orders,
  products,
  services,
  users,
} from '../schema/schema.js'

export type SalesStats = {
  totalRevenue: TotalRevenue
  totalBookings: BookingCount
  averageRevenuePerBooking: AverageRevenue
  cashPaid: CashPaid
  billPaid: BillPaid
  totalDiscounts: TotalDiscount
  totalVat: TotalVat
  year: YearStats
}

type MonthStats = {
  monthlyRevenue: MonthlyRevenue
  potentialMonthlyRevenue: PotentialMonthlyRevenue
  totalMonthlyRevenue: TotalMonthlyRevenue
  totalMonthlyRevenueLastYear: TotalMonthlyRevenueLastYear
  absoluteDifference: AbsoluteDifference
  percentDifference: PercentDifference
}

type YearStats = {
  jan: MonthStats
  feb: MonthStats
  mar: MonthStats
  apr: MonthStats
  jun: MonthStats
  jul: MonthStats
  aug: MonthStats
  sep: MonthStats
  oct: MonthStats
  nov: MonthStats
  dec: MonthStats
}

export type ServiceStats = {
  serviceID: ServiceID
  name: ServiceName
  amount: ServiceSold
  revenue: ServiceCostNumber
  cost: ServiceExpense
  profit: ServiceProfit
  workedHours: WorkedHours
  revenuePerHour: ServiceRevenuePerHour
}

export type ProductStats = {
  productID: ProductID
  productDescription: ProductDescription
  amount: ProductSold
  revenue: ProductCostNumber
  cost: ProductExpense
  profit: ProductProfit
}

export type CheckinStats = {
  employeeID: EmployeeID
  firstName: UserFirstName
  lastName: UserLastName
  employeeCheckedIn?: EmployeeCheckIn
  employeeCheckedOut?: EmployeeCheckOut
}

//export function salesStats(store?: StoreID): Promise<Either<string, SalesStats>> {
//  try {
//    const stats = db
//      .select({
//        totalRevenueService: sql`sum(${orderListing.cost})`,
//        totalVat: sql`sum(${orderListing.})`
//      })
//      .from(orderListing)
//  } catch (e) {
//    return left(errorHandling(e))
//  }
//}

export async function serviceStats(
  from: SubmissionTimeOrder,
  to: SubmissionTimeOrder,
  store?: StoreID,
  filterOrderStatus?: OrderStatus,
): Promise<Either<string, ServiceStats[]>> {
  try {
    let condition
    let orderCond = and(
      between(orders.submissionTime, from, to),
      eq(orderListing.orderID, orders.orderID),
    )

    if (store) {
      condition = or(eq(services.storeID, store), isNull(services.storeID))
      orderCond = and(orderCond, eq(orders.storeID, store))
    }
    if (filterOrderStatus) {
      condition = and(condition, eq(orders.orderStatus, filterOrderStatus))
    }
    const stats = await db
      .select({
        serviceID: services.serviceID,
        name: services.name,
        total: sql<number>`COALESCE(cast(sum(CASE WHEN ${orders.submissionTime} BETWEEN ${from} AND ${to} THEN ${orderListing.cost} * ${orderListing.amount} ELSE 0 END) as float), 0)`,
        amount: sql<number>`COALESCE(sum(CASE WHEN ${orders.submissionTime} BETWEEN ${from} AND ${to} THEN ${orderListing.amount} ELSE 0 END), 0)`,
        workedHours: sql<string>`COALESCE(sum(CASE WHEN ${orders.submissionTime} BETWEEN ${from} AND ${to} THEN
          COALESCE(${orderListing.day1Work}, INTERVAL '0') +
          COALESCE(${orderListing.day2Work}, INTERVAL '0') +
          COALESCE(${orderListing.day3Work}, INTERVAL '0') +
          COALESCE(${orderListing.day4Work}, INTERVAL '0') +
          COALESCE(${orderListing.day5Work}, INTERVAL '0')
        ELSE INTERVAL '0' END), INTERVAL '0')`,
      })
      .from(services)
      .leftJoin(orderListing, and(eq(orderListing.serviceID, services.serviceID)))
      .leftJoin(orders, orderCond)
      .where(condition)
      .groupBy(services.serviceID)

    const statsCompiled = stats.map((serv) => {
      const cost = ServiceExpense(Dinero({ amount: 0, currency: 'SEK' }))
      const workHourSplit = serv.workedHours.split(':')
      const workHoursNum = WorkedHours(Number(workHourSplit[0]) + Number(workHourSplit[1]) / 60)

      const revenueNotNull = ServiceCostNumber(serv.total ? serv.total : 0)
      return {
        serviceID: serv.serviceID,
        name: serv.name,
        amount: ServiceSold(serv.amount ? serv.amount : 0),
        revenue: revenueNotNull,
        cost: ServiceExpense(cost),
        profit: ServiceProfit(Dinero({ amount: revenueNotNull, currency: 'SEK' }).subtract(cost)),
        workedHours: WorkedHours(Math.round(workHoursNum * 2) / 2),
        revenuePerHour: ServiceRevenuePerHour(
          Dinero({ amount: revenueNotNull * 100, currency: 'SEK' }).divide(
            Math.max(100, Math.round(workHoursNum * 100)),
          ),
        ),
      }
    })

    return right(statsCompiled)
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function productStats(
  from: SubmissionTimeOrder,
  to: SubmissionTimeOrder,
  store?: StoreID,
): Promise<Either<string, ProductStats[]>> {
  try {
    let condition
    let orderCond = and(
      between(orders.submissionTime, from, to),
      eq(orderProducts.orderID, orders.orderID),
    )

    if (store) {
      condition = or(eq(products.storeID, store), isNull(products.storeID))
      orderCond = and(orderCond, eq(orders.storeID, store))
    }
    const stats = await db
      .select({
        productID: products.productID,
        productDescription: products.productDescription,
        total: sql<number>`COALESCE(cast(sum(CASE WHEN ${orders.submissionTime} BETWEEN ${from} AND ${to} THEN ${orderProducts.cost} * ${orderProducts.amount} ELSE 0 END) as float), 0)`,
        amount: sql<number>`COALESCE(sum(CASE WHEN ${orders.submissionTime} BETWEEN ${from} AND ${to} THEN ${orderProducts.amount} ELSE 0 END), 0)`,
      })
      .from(products)
      .leftJoin(orderProducts, and(eq(orderProducts.productID, products.productID)))
      .leftJoin(orders, orderCond)
      .where(condition)
      .groupBy(products.productID)

    const statsCompiled = stats.map((prod) => {
      const cost = ProductExpense(Dinero({ amount: 0, currency: 'SEK' }))
      return {
        productID: prod.productID,
        productDescription: prod.productDescription,
        revenue: ProductCostNumber(prod.total),
        cost: ProductExpense(cost),
        profit: ProductProfit(Dinero({ amount: prod.total, currency: 'SEK' }).subtract(cost)),
        amount: ProductSold(prod.amount),
      }
    })
    return right(statsCompiled)
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function checkinStats(
  from: EmployeeCheckIn,
  to: EmployeeCheckIn,
  store?: StoreID,
  employeeID?: EmployeeID,
): Promise<Either<string, CheckinStats[]>> {
  try {
    let condition
    condition = sql`${employeeCheckin.employeeCheckedIn} IS NOT NULL AND ${employeeCheckin.employeeCheckedIn} BETWEEN ${from} AND ${to}`
    if (store) {
      condition = and(condition, eq(employeeStore.storeID, store))
    }
    if (employeeID) {
      condition = and(condition, eq(employeeStore.employeeID, employeeID))
    }
    const stats = await db
      .select({
        employeeID: employeeStore.employeeID,
        employeeCheckedIn: employeeCheckin.employeeCheckedIn,
        employeeCheckedOut: employeeCheckin.employeeCheckedOut,
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(employeeStore)
      .innerJoin(employees, eq(employees.employeeID, employeeStore.employeeID))
      .innerJoin(users, eq(employees.userID, users.userID))
      .leftJoin(employeeCheckin, eq(employeeStore.employeeStoreID, employeeCheckin.employeeStoreID))
      .where(condition)

    return right(
      stats.map((check) => ({
        employeeID: check.employeeID,
        employeeCheckedIn: check.employeeCheckedIn
          ? EmployeeCheckIn(check.employeeCheckedIn.toISOString())
          : undefined,
        employeeCheckedOut: check.employeeCheckedOut
          ? EmployeeCheckOut(check.employeeCheckedOut.toISOString())
          : undefined,
        firstName: check.firstName,
        lastName: check.lastName,
      })),
    )
  } catch (e) {
    return left(errorHandling(e))
  }
}
