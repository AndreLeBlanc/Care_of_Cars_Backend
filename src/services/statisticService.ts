import { db } from '../config/db-connect.js'

import { and, between, eq, sql } from 'drizzle-orm'
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
  employeeStore,
  employees,
  orderListing,
  orderProducts,
  orders,
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
  workedHours: number
  revenuePerHour: ServiceRevenuePerHour
}

export type ProductStats = {
  productID: ProductID
  productDescription: ProductDescription
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
    condition = between(orders.submissionTime, from, to)
    if (store) {
      condition = and(condition, eq(orders.storeID, store))
    }
    if (filterOrderStatus) {
      condition = and(condition, eq(orders.orderStatus, filterOrderStatus))
    }
    const stats = await db
      .select({
        serviceID: orderListing.serviceID,
        name: orderListing.name,
        total: sql<number>`cast(sum(${orderListing.cost} * ${orderListing.amount}) as float)`,
        amount: sql<number>`sum(${orderListing.amount})`,
        workDay1: sql<number>`sum(${orderListing.day1Work})`,
        workDay2: sql<number>`sum(${orderListing.day2Work})`,
        workDay3: sql<number>`sum(${orderListing.day3Work})`,
        workDay4: sql<number>`sum(${orderListing.day4Work})`,
        workDay5: sql<number>`sum(${orderListing.day5Work})`,
      })
      .from(orderListing)
      .innerJoin(orders, eq(orderListing.orderID, orders.orderID))
      .where(condition)
      .groupBy(orderListing.serviceID, orderListing.name)

    const statsCompiled = stats.map((serv) => {
      const hoursWorked =
        serv.workDay1 + serv.workDay2 + serv.workDay3 + serv.workDay4 + serv.workDay5
      const cost = ServiceExpense(Dinero({ amount: 0, currency: 'SEK' }))
      return {
        serviceID: serv.serviceID,
        name: serv.name,
        amount: ServiceSold(serv.amount),
        revenue: ServiceCostNumber(serv.total),
        cost: ServiceExpense(cost),
        profit: ServiceProfit(Dinero({ amount: serv.total, currency: 'SEK' }).subtract(cost)),
        workedHours: hoursWorked,
        revenuePerHour: ServiceRevenuePerHour(
          Dinero({ amount: serv.total, currency: 'SEK' }).divide(hoursWorked),
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
    condition = between(orders.submissionTime, from, to)
    if (store) {
      condition = and(condition, eq(orders.storeID, store))
    }
    const stats = await db
      .select({
        productID: orderProducts.productID,
        productDescription: orderProducts.productDescription,
        total: sql<number>`cast(sum(${orderProducts.cost} * ${orderProducts.amount}) as float)`,
        amount: sql<number>`sum(${orderListing.amount})`,
      })
      .from(orderProducts)
      .innerJoin(orders, eq(orderProducts.orderID, orders.orderID))
      .where(condition)
      .groupBy(orderProducts.productID, orderProducts.productDescription)

    const statsCompiled = stats.map((prod) => {
      const cost = ProductExpense(Dinero({ amount: 0, currency: 'SEK' }))
      return {
        productID: prod.productID,
        productDescription: prod.productDescription,
        revenue: ProductCostNumber(prod.total),
        cost: ProductExpense(cost),
        profit: ProductProfit(Dinero({ amount: prod.total, currency: 'SEK' }).subtract(cost)),
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
    condition = sql`${employeeStore.employeeCheckedIn} IS NOT NULL AND ${employeeStore.employeeCheckedIn} BETWEEN ${from} AND ${to}`
    if (store) {
      condition = and(condition, eq(employeeStore.storeID, store))
    }
    if (employeeID) {
      condition = and(condition, eq(employeeStore.employeeID, employeeID))
    }
    const stats = await db
      .select({
        employeeID: employeeStore.employeeID,
        employeeCheckedIn: employeeStore.employeeCheckedIn,
        employeeCheckedOut: employeeStore.employeeCheckedOut,
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(employeeStore)
      .innerJoin(employees, eq(employees.employeeID, employeeStore.employeeID))
      .innerJoin(users, eq(employees.userID, users.userID))
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
