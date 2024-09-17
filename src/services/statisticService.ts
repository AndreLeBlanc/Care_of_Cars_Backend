import { db } from '../config/db-connect.js'

import { and, between, eq, gte, isNull, or, sql } from 'drizzle-orm'

import Dinero from 'dinero.js'

import { Either, errorHandling, left, right } from '../utils/helper.js'

//import Dinero, { Currency } from 'dinero.js'

import {
  AbsoluteDifference,
  AverageRevenue,
  BillPaid,
  BilledCount,
  BillingDate,
  BookingCount,
  CashPaid,
  CustomersCount,
  EmployeeCheckIn,
  EmployeeCheckOut,
  EmployeeID,
  EmployeesCount,
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
  ServicesCount,
  StatisticsDate,
  StoreID,
  SubmissionTimeOrder,
  TotalDiscount,
  TotalMonthlyRevenue,
  TotalMonthlyRevenueLastYear,
  TotalRevenue,
  UserFirstName,
  UserLastName,
  WorkedHours,
  billOrders,
  bills,
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
  may: MonthStats
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

export type Dashboard = {
  employees: EmployeesCount
  services: ServicesCount
  customers: CustomersCount
  billed: BilledCount
  storeID?: StoreID
}

function calculateMonthStats(input: {
  lastYear: { month: SubmissionTimeOrder; revenue: number }[]
  thisYear: {
    month: SubmissionTimeOrder
    revenue: number
    discount: number
    preliminary: number
    bookings: number
  }[]
}): YearStats {
  const months = [
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
  ]

  // Helper function to calculate percentage difference
  const calculatePercentDifference = (current: number, last: number): number => {
    if (last === 0) return 0
    return ((current - last) / last) * 100
  }

  // Create a map for quick lookup
  const lastYearMap = new Map(
    input.lastYear.map((item) => [new Date(item.month).getMonth(), item.revenue]),
  )
  const thisYearMap = new Map(input.thisYear.map((item) => [new Date(item.month).getMonth(), item]))

  // Initialize YearStats with empty MonthStats for each month
  const yearStats: YearStats = {
    jan: {
      monthlyRevenue: MonthlyRevenue(0),
      potentialMonthlyRevenue: PotentialMonthlyRevenue(0),
      totalMonthlyRevenue: TotalMonthlyRevenue(0),
      totalMonthlyRevenueLastYear: TotalMonthlyRevenueLastYear(0),
      absoluteDifference: AbsoluteDifference(0),
      percentDifference: PercentDifference(0),
    },
    feb: {
      monthlyRevenue: MonthlyRevenue(0),
      potentialMonthlyRevenue: PotentialMonthlyRevenue(0),
      totalMonthlyRevenue: TotalMonthlyRevenue(0),
      totalMonthlyRevenueLastYear: TotalMonthlyRevenueLastYear(0),
      absoluteDifference: AbsoluteDifference(0),
      percentDifference: PercentDifference(0),
    },
    mar: {
      monthlyRevenue: MonthlyRevenue(0),
      potentialMonthlyRevenue: PotentialMonthlyRevenue(0),
      totalMonthlyRevenue: TotalMonthlyRevenue(0),
      totalMonthlyRevenueLastYear: TotalMonthlyRevenueLastYear(0),
      absoluteDifference: AbsoluteDifference(0),
      percentDifference: PercentDifference(0),
    },
    apr: {
      monthlyRevenue: MonthlyRevenue(0),
      potentialMonthlyRevenue: PotentialMonthlyRevenue(0),
      totalMonthlyRevenue: TotalMonthlyRevenue(0),
      totalMonthlyRevenueLastYear: TotalMonthlyRevenueLastYear(0),
      absoluteDifference: AbsoluteDifference(0),
      percentDifference: PercentDifference(0),
    },
    may: {
      monthlyRevenue: MonthlyRevenue(0),
      potentialMonthlyRevenue: PotentialMonthlyRevenue(0),
      totalMonthlyRevenue: TotalMonthlyRevenue(0),
      totalMonthlyRevenueLastYear: TotalMonthlyRevenueLastYear(0),
      absoluteDifference: AbsoluteDifference(0),
      percentDifference: PercentDifference(0),
    },
    jun: {
      monthlyRevenue: MonthlyRevenue(0),
      potentialMonthlyRevenue: PotentialMonthlyRevenue(0),
      totalMonthlyRevenue: TotalMonthlyRevenue(0),
      totalMonthlyRevenueLastYear: TotalMonthlyRevenueLastYear(0),
      absoluteDifference: AbsoluteDifference(0),
      percentDifference: PercentDifference(0),
    },
    jul: {
      monthlyRevenue: MonthlyRevenue(0),
      potentialMonthlyRevenue: PotentialMonthlyRevenue(0),
      totalMonthlyRevenue: TotalMonthlyRevenue(0),
      totalMonthlyRevenueLastYear: TotalMonthlyRevenueLastYear(0),
      absoluteDifference: AbsoluteDifference(0),
      percentDifference: PercentDifference(0),
    },
    aug: {
      monthlyRevenue: MonthlyRevenue(0),
      potentialMonthlyRevenue: PotentialMonthlyRevenue(0),
      totalMonthlyRevenue: TotalMonthlyRevenue(0),
      totalMonthlyRevenueLastYear: TotalMonthlyRevenueLastYear(0),
      absoluteDifference: AbsoluteDifference(0),
      percentDifference: PercentDifference(0),
    },
    sep: {
      monthlyRevenue: MonthlyRevenue(0),
      potentialMonthlyRevenue: PotentialMonthlyRevenue(0),
      totalMonthlyRevenue: TotalMonthlyRevenue(0),
      totalMonthlyRevenueLastYear: TotalMonthlyRevenueLastYear(0),
      absoluteDifference: AbsoluteDifference(0),
      percentDifference: PercentDifference(0),
    },
    oct: {
      monthlyRevenue: MonthlyRevenue(0),
      potentialMonthlyRevenue: PotentialMonthlyRevenue(0),
      totalMonthlyRevenue: TotalMonthlyRevenue(0),
      totalMonthlyRevenueLastYear: TotalMonthlyRevenueLastYear(0),
      absoluteDifference: AbsoluteDifference(0),
      percentDifference: PercentDifference(0),
    },
    nov: {
      monthlyRevenue: MonthlyRevenue(0),
      potentialMonthlyRevenue: PotentialMonthlyRevenue(0),
      totalMonthlyRevenue: TotalMonthlyRevenue(0),
      totalMonthlyRevenueLastYear: TotalMonthlyRevenueLastYear(0),
      absoluteDifference: AbsoluteDifference(0),
      percentDifference: PercentDifference(0),
    },
    dec: {
      monthlyRevenue: MonthlyRevenue(0),
      potentialMonthlyRevenue: PotentialMonthlyRevenue(0),
      totalMonthlyRevenue: TotalMonthlyRevenue(0),
      totalMonthlyRevenueLastYear: TotalMonthlyRevenueLastYear(0),
      absoluteDifference: AbsoluteDifference(0),
      percentDifference: PercentDifference(0),
    },
  }

  months.forEach((monthName, index) => {
    const thisYearData = thisYearMap.get(index)
    const lastYearRevenue = lastYearMap.get(index) || 0

    // Set default values when data is missing for a month
    const monthlyRevenue = MonthlyRevenue(thisYearData ? thisYearData.revenue : 0)
    const potentialMonthlyRevenue = PotentialMonthlyRevenue(
      thisYearData ? thisYearData.preliminary : 0,
    )
    const totalMonthlyRevenue = TotalMonthlyRevenue(
      thisYearData ? monthlyRevenue + (thisYearData.discount || 0) : 0,
    )
    const absoluteDifference = AbsoluteDifference(monthlyRevenue - lastYearRevenue)
    const percentDifference = PercentDifference(
      calculatePercentDifference(monthlyRevenue, lastYearRevenue),
    )

    // Assign MonthStats for each month
    yearStats[monthName as keyof YearStats] = {
      monthlyRevenue,
      potentialMonthlyRevenue,
      totalMonthlyRevenue,
      totalMonthlyRevenueLastYear: TotalMonthlyRevenueLastYear(lastYearRevenue),
      absoluteDifference,
      percentDifference,
    }
  })

  return yearStats
}
export async function salesStats(
  submissionTime: StatisticsDate,
  store?: StoreID,
): Promise<Either<string, SalesStats>> {
  submissionTime.setMonth(0)
  submissionTime.setHours(0, 0, 0, 0)
  submissionTime.setDate(1)
  const newYearString = submissionTime.toISOString()
  submissionTime.setFullYear(submissionTime.getFullYear() - 1)
  let cond
  cond = gte(orders.submissionTime, SubmissionTimeOrder(submissionTime.toISOString()))
  if (store) {
    cond = and(cond, eq(orders.storeID, store))
  }
  try {
    const servs = db
      .select({
        month: sql<SubmissionTimeOrder>`DATE_TRUNC('month', ${orders.submissionTime})`.as(
          'order_month',
        ),
        revenue:
          sql<number>`COALESCE(SUM(CASE WHEN ${orders.orderStatus} = 'avslutad' THEN CAST(${orderListing.cost} * ${orderListing.amount} AS FLOAT) ELSE 0 END), 0)`.as(
            'revenue',
          ),
        discounts:
          sql<number>`COALESCE(SUM(CASE WHEN ${orders.orderStatus} = 'avslutad' THEN ${orders.discount}  ELSE 0 END), 0)`.as(
            'discounts',
          ),
        preliminary:
          sql<number>`COALESCE(SUM(CASE WHEN ${orders.orderStatus} != 'avslutad' THEN CAST(${orderListing.cost} * ${orderListing.amount} AS FLOAT) ELSE 0 END), 0)`.as(
            'preliminary',
          ),
        bookings: sql<number>`COUNT(DISTINCT ${orders.orderID})`.as('bookings'),
      })
      .from(orders)
      .innerJoin(orderListing, eq(orderListing.orderID, orders.orderID))
      .where(cond)
      .groupBy(sql`DATE_TRUNC('month', ${orders.submissionTime})`)
      .orderBy(sql`DATE_TRUNC('month', ${orders.submissionTime})`)
      .as('servs')

    const prods = db
      .select({
        month: sql<SubmissionTimeOrder>`DATE_TRUNC('month', ${orders.submissionTime})`.as(
          'order_months',
        ),
        revenue:
          sql<number>`COALESCE(SUM(CASE WHEN ${orders.orderStatus} = 'avslutad' THEN CAST(${orderProducts.cost} * ${orderProducts.amount} AS FLOAT) ELSE 0 END), 0)`.as(
            'revenues',
          ),
        preliminary:
          sql<number>`COALESCE(SUM(CASE WHEN ${orders.orderStatus} != 'avslutad' THEN CAST(${orderProducts.cost} * ${orderProducts.amount} AS FLOAT) ELSE 0 END), 0)`.as(
            'preliminarys',
          ),
      })
      .from(orders)
      .innerJoin(orderProducts, eq(orderProducts.orderID, orders.orderID))
      .where(cond)
      .groupBy(sql`DATE_TRUNC('month', ${orders.submissionTime})`)
      .orderBy(sql`DATE_TRUNC('month', ${orders.submissionTime})`)
      .as('prods')

    const stats = await db.transaction(async (tx) => {
      const revStats = await tx.select().from(servs).fullJoin(prods, eq(prods.month, servs.month))

      const [billedStat] = await tx
        .select({
          billed:
            sql<number>`COUNT(DISTINCT CASE WHEN ${bills.billStatus} = 'bill' THEN ${orders.orderID} END)`.as(
              'billed_bookings',
            ),
          cash: sql<number>`COUNT(DISTINCT CASE WHEN ${bills.billStatus} = 'cashBill' THEN ${orders.orderID} END)`.as(
            'cash_bookings',
          ),
        })
        .from(orders)
        .innerJoin(billOrders, eq(billOrders.orderID, orders.orderID))
        .innerJoin(bills, eq(billOrders.billID, bills.billID))
        .groupBy(orders.orderID)

      return { revStats: revStats, billedStat: billedStat }
    })
    const compiledMonths = stats.revStats.reduce<{
      lastYear: { month: SubmissionTimeOrder; revenue: number }[]
      thisYear: {
        month: SubmissionTimeOrder
        revenue: number
        discount: number
        preliminary: number
        bookings: number
      }[]
      totalRevenue: number
      totalBookings: number
      totalDiscounts: number
    }>(
      (acc, month) => {
        let currMonth = undefined
        if (month.prods?.month != null) {
          currMonth = month.prods.month
        } else if (month.servs?.month != null) {
          currMonth = month.servs.month
        }
        if (currMonth === undefined) {
          return acc
        }
        const revServ = month.servs ? month.servs.revenue : 0
        const revProd = month.prods ? month.prods.revenue : 0
        const discount = month.servs ? month.servs.discounts : 0

        if (currMonth.substring(0, 10) < newYearString.substring(0, 10)) {
          acc.lastYear.push({ month: currMonth, revenue: revServ + revProd - discount })
        } else {
          const preliminary = month.servs ? month.servs.preliminary : 0
          const bookings = month.servs ? month.servs.bookings : 0

          acc.thisYear.push({
            month: currMonth,
            revenue: revServ + revProd,
            discount: discount,
            preliminary: preliminary,
            bookings: bookings,
          })
          acc.totalRevenue = acc.totalRevenue + revServ + revProd
          acc.totalBookings = acc.totalBookings + bookings
          acc.totalDiscounts = acc.totalDiscounts + discount
        }

        return acc
      },
      {
        lastYear: [],
        thisYear: [],
        totalRevenue: 0,
        totalBookings: 0,
        totalDiscounts: 0,
      },
    )

    const year = calculateMonthStats({
      lastYear: compiledMonths.lastYear,
      thisYear: compiledMonths.thisYear,
    })

    return right({
      totalRevenue: TotalRevenue(compiledMonths.totalRevenue),
      totalBookings: BookingCount(compiledMonths.totalBookings),
      averageRevenuePerBooking: AverageRevenue(
        compiledMonths.totalRevenue / compiledMonths.totalBookings,
      ),
      cashPaid: CashPaid(stats.billedStat && stats.billedStat.cash ? stats.billedStat.cash : 0),
      billPaid: BillPaid(stats.billedStat && stats.billedStat.billed ? stats.billedStat.billed : 0),
      totalDiscounts: TotalDiscount(compiledMonths.totalDiscounts),
      year: year,
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}

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

export async function dashboard(
  storeID?: StoreID,
  from?: StatisticsDate,
): Promise<Either<string, Dashboard>> {
  let empCond
  let serviceCond
  let customerCond
  let billsCond
  if (storeID) {
    empCond = eq(employeeStore.storeID, storeID)
    serviceCond = or(eq(services.storeID, storeID), isNull(services.storeID))
    customerCond = eq(orders.storeID, storeID)
    billsCond = eq(bills.storeID, storeID)
  }

  if (from) {
    customerCond = and(
      customerCond,
      gte(orders.submissionTime, SubmissionTimeOrder(from.toISOString())),
    )
    billsCond = and(billsCond, gte(bills.billingDate, BillingDate(from.toISOString())))
  }
  const employeeWithStore = db
    .select({ employees: sql<number>`count(${employeeStore.employeeID})`.as('employees') })
    .from(employeeStore)
    .where(empCond)
    .as('employeeWithStore')

  const servicesWithStore = db
    .select({ services: sql<number>`count(${services.serviceID})`.as('services') })
    .from(services)
    .where(serviceCond)
    .as('servicesWithStore')

  const customer = db
    .select({ customers: sql<number>`count(distinct ${orders.driverID})`.as('customers') })
    .from(orders)
    .where(customerCond)
    .as('customer')

  const billed = db
    .select({ billed: sql<number>`sum(${bills.billedAmount})`.as('billed') })
    .from(bills)
    .where(billsCond)
    .as('billedQ')

  const [dash] = await db
    .select()
    .from(employeeWithStore)
    .innerJoin(servicesWithStore, sql`1=1`)
    .innerJoin(customer, sql`1=1`)
    .innerJoin(billed, sql`1=1`)
  return dash
    ? right({
        employees: EmployeesCount(dash.employeeWithStore.employees),
        services: ServicesCount(dash.servicesWithStore.services),
        customers: CustomersCount(dash.customer.customers),
        billed: BilledCount(dash.billedQ.billed),
        storeID: storeID,
      })
    : left('could not create statistics')
}
