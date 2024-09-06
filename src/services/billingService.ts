import {
  Amount,
  BillAmount,
  BillID,
  BillStatus,
  BilledAmount,
  BillingDate,
  CompanyReference,
  CustomerCardNumber,
  CustomerOrgNumber,
  DriverAddress,
  DriverAddressCity,
  DriverCardValidTo,
  DriverCountry,
  DriverEmail,
  DriverExternalNumber,
  DriverFirstName,
  DriverHasCard,
  DriverID,
  DriverKeyNumber,
  DriverLastName,
  DriverPhoneNumber,
  DriverZipCode,
  EmployeeID,
  OrderID,
  PaymentDate,
  PaymentDays,
  ProductCostNumber,
  ProductDescription,
  ServiceCostCurrency,
  ServiceCostDinero,
  ServiceCostNumber,
  ServiceName,
  StoreID,
  billOrders,
  bills,
  orderListing,
  orderProducts,
  orders,
} from '../schema/schema.js'

import { Limit, Offset, Page, ResultCount, Search } from '../plugins/pagination.js'

import { db } from '../config/db-connect.js'

import Dinero, { Currency } from 'dinero.js'

import { and, count, eq, gte, ilike, lte, or, sql } from 'drizzle-orm'

import { Either, errorHandling, jsonAggBuildObject, left, right } from '../utils/helper.js'

export type CreateBill = {
  billStatus: BillStatus
  storeID: StoreID
  billedAmount: BilledAmount
  currency: string
  bookedBy?: EmployeeID
  billingDate: BillingDate
  paymentDate: PaymentDate
  paymentDays: PaymentDays
  driverID: DriverID
  customerOrgNumber?: CustomerOrgNumber
  driverExternalNumber?: DriverExternalNumber
  companyReference?: CompanyReference
  driverFirstName: DriverFirstName
  driverLastName: DriverLastName
  driverEmail: DriverEmail
  driverPhoneNumber: DriverPhoneNumber
  driverAddress: DriverAddress
  driverZipCode: DriverZipCode
  driverAddressCity: DriverAddressCity
  driverCountry: DriverCountry
  driverHasCard?: DriverHasCard
  driverCardValidTo?: DriverCardValidTo
  driverCardNumber?: CustomerCardNumber
  driverKeyNumber?: DriverKeyNumber
}

type OrderRow = {
  name: ServiceName | ProductDescription
  amount: Amount
  cost: ServiceCostDinero
  total: ServiceCostDinero
}

export type OrderRowNoDineroName =
  | {
      amount: Amount
      cost: ServiceCostNumber
      currency: string
      name: ServiceName
    }
  | {
      amount: Amount
      cost: ProductCostNumber
      currency: string
      productDescription: ProductDescription
    }

export type Bill = CreateBill & {
  billID: BillID
  discount: Dinero.Dinero[]
  orders: OrderID[]
  createdAt: Date
  updatedAt: Date
  orderRows: OrderRow[]
}

type ListedBills = {
  billID: BillID
  driverID: DriverID
  driverFirstName: DriverFirstName
  driverLastName: DriverLastName
  billingDate: BillingDate
  paymentDate: PaymentDate
  billStatus: BillStatus
  billed: BillAmount
}

export type BillsPaginated = {
  totalBills: ResultCount
  totalPage: Page
  perPage: Limit
  page: Page
  bills: ListedBills[]
}
function orderRowPricing(row: OrderRowNoDineroName): OrderRow {
  const nameOrDescription = 'name' in row ? row.name : row.productDescription

  return {
    name: nameOrDescription,
    amount: row.amount,
    cost: ServiceCostDinero(Dinero({ amount: row.cost, currency: row.currency as Currency })),
    total: ServiceCostDinero(
      Dinero({
        amount: row.cost,
        currency: row.currency as Currency,
      }).multiply(row.amount),
    ),
  }
}

export async function newBill(bill: CreateBill, order: OrderID[]): Promise<Either<string, Bill>> {
  try {
    const createBill = await db.transaction(async (tx) => {
      const [newBill] = await tx.insert(bills).values(bill).returning()
      const zipOrderBill = order.map((order) => ({ billID: newBill.billID, orderID: order }))
      const CreatedBillOrders = await tx.insert(billOrders).values(zipOrderBill).returning()

      const [orderInfo] = await tx
        .select({
          billOrders: sql<
            { orderID: OrderID; discount: ServiceCostNumber; currency: ServiceCostCurrency }[]
          >`json_agg(json_build_object( 'orderID',${orders.orderID} 'discount', ${orders.discount},
        'currency', ${orders.currency},))`.as('tagname'),
          products: jsonAggBuildObject({
            productDescription: orderProducts.productDescription,
            currency: orderProducts.currency,
            cost: orderProducts.cost,
            amount: orderProducts.amount,
          }),
          services: jsonAggBuildObject({
            name: orderListing.name,
            currency: orderListing.currency,
            cost: orderListing.cost,
            amount: orderListing.amount,
          }),
        })
        .from(orders)
        .where(or(...order.map((orderID) => eq(orders.orderID, orderID))))
        .leftJoin(orderListing, eq(orders.orderID, orderListing.orderID))
        .leftJoin(orderProducts, eq(orders.orderID, orderProducts.orderID))

      return {
        billID: newBill.billID,
        storeID: newBill.storeID,
        billedAmount: newBill.billedAmount,
        currency: newBill.currency,
        billStatus: newBill.billStatus,
        bookedBy: newBill.bookedBy ?? undefined,
        billingDate: newBill.billingDate,
        paymentDate: newBill.paymentDate,
        paymentDays: newBill.paymentDays,
        driverID: newBill.driverID,
        customerOrgNumber: newBill.customerOrgNumber ?? undefined,
        driverExternalNumber: newBill.driverExternalNumber ?? undefined,
        companyReference: newBill.companyReference ?? undefined,
        driverFirstName: newBill.driverFirstName,
        driverLastName: newBill.driverLastName,
        driverEmail: newBill.driverEmail,
        driverPhoneNumber: newBill.driverPhoneNumber,
        driverAddress: newBill.driverAddress,
        driverZipCode: newBill.driverZipCode,
        driverAddressCity: newBill.driverAddressCity,
        driverCountry: newBill.driverCountry,
        driverHasCard: newBill.driverHasCard ?? undefined,
        driverCardValidTo: newBill.driverCardValidTo ?? undefined,
        driverCardNumber: newBill.driverCardNumber ?? undefined,
        driverKeyNumber: newBill.driverKeyNumber ?? undefined,
        discount: orderInfo.billOrders.map((discount) =>
          Dinero({ amount: discount.discount, currency: discount.currency as Currency }),
        ),
        orders: CreatedBillOrders.map((bo) => bo.orderID),
        createdAt: newBill.createdAt,
        updatedAt: newBill.updatedAt,
        orderRows: orderInfo.services
          .map(orderRowPricing)
          .concat(orderInfo.products.map(orderRowPricing)),
      }
    })
    return right(createBill)
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getBill(bill: BillID): Promise<Either<string, Bill>> {
  try {
    const [billedOrders] = await db
      .select({
        bill: bills,
        billOrders: sql<
          { orderID: OrderID; discount: ServiceCostNumber; currency: ServiceCostCurrency }[]
        >`json_agg(json_build_object( 'orderID',${orders.orderID} 'discount', ${orders.discount},
        'currency', ${orders.currency},))`.as('tagname'),

        products: jsonAggBuildObject({
          productDescription: orderProducts.productDescription,
          currency: orderProducts.currency,
          cost: orderProducts.cost,
          amount: orderProducts.amount,
        }),
        services: jsonAggBuildObject({
          name: orderListing.name,
          currency: orderListing.currency,
          cost: orderListing.cost,
          amount: orderListing.amount,
        }),
      })
      .from(bills)
      .where(eq(bills.billID, bill))
      .leftJoin(billOrders, eq(billOrders.billID, bills.billID))
      .leftJoin(orders, eq(billOrders.orderID, orders.orderID))
      .leftJoin(orderListing, eq(orders.orderID, orderListing.orderID))

    return right({
      billID: bill,
      storeID: billedOrders.bill.storeID,
      billedAmount: billedOrders.bill.billedAmount,
      currency: billedOrders.bill.currency,
      billStatus: billedOrders.bill.billStatus,
      bookedBy: billedOrders.bill.bookedBy ?? undefined,
      billingDate: billedOrders.bill.billingDate,
      paymentDate: billedOrders.bill.paymentDate,
      paymentDays: billedOrders.bill.paymentDays,
      driverID: billedOrders.bill.driverID,
      customerOrgNumber: billedOrders.bill.customerOrgNumber ?? undefined,
      driverExternalNumber: billedOrders.bill.driverExternalNumber ?? undefined,
      companyReference: billedOrders.bill.companyReference ?? undefined,
      driverFirstName: billedOrders.bill.driverFirstName,
      driverLastName: billedOrders.bill.driverLastName,
      driverEmail: billedOrders.bill.driverEmail,
      driverPhoneNumber: billedOrders.bill.driverPhoneNumber,
      driverAddress: billedOrders.bill.driverAddress,
      driverZipCode: billedOrders.bill.driverZipCode,
      driverAddressCity: billedOrders.bill.driverAddressCity,
      driverCountry: billedOrders.bill.driverCountry,
      driverHasCard: billedOrders.bill.driverHasCard ?? undefined,
      driverCardValidTo: billedOrders.bill.driverCardValidTo ?? undefined,
      driverCardNumber: billedOrders.bill.driverCardNumber ?? undefined,
      driverKeyNumber: billedOrders.bill.driverKeyNumber ?? undefined,
      discount: billedOrders.billOrders.map((bo) =>
        Dinero({
          amount: bo.discount,
          currency: bo.currency as Currency,
        }),
      ),
      orders: billedOrders.billOrders.map((bo) => bo.orderID),
      createdAt: billedOrders.bill.createdAt,
      updatedAt: billedOrders.bill.updatedAt,
      orderRows: billedOrders.services
        .map(orderRowPricing)
        .concat(billedOrders.products.map(orderRowPricing)),
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function listBill(
  search: Search,
  limit = Limit(10),
  page = Page(1),
  offset = Offset(0),
  store?: StoreID,
  to?: BillingDate,
  from?: BillingDate,
  orderStatusSearch?: BillStatus,
): Promise<Either<string, BillsPaginated>> {
  let condition
  if (Object.values(bills.billStatus).includes(search as BillStatus)) {
    ilike(bills.billStatus, search)
  } else {
    condition = and(
      or(
        sql`CAST(${bills.billingDate} AS TEXT) ILIKE ${'%' + search + '%'}`,
        sql`CAST(${bills.paymentDate} AS TEXT) ILIKE ${'%' + search + '%'}`,
        ilike(bills.driverFirstName, '%' + search + '%'),
        ilike(bills.driverLastName, '%' + search + '%'),
      ),
    )
  }
  if (orderStatusSearch != null) {
    condition = or(condition, ilike(orders.orderStatus, '%' + orderStatusSearch + '%'))
  }

  condition = to ? and(condition, lte(bills.billingDate, to)) : condition
  condition = from ? and(condition, gte(bills.billingDate, from)) : condition
  condition = store ? and(condition, eq(orders.storeID, store)) : condition

  try {
    return await db.transaction(async (tx) => {
      const billList = await db
        .select({
          billID: bills.billID,
          driverID: bills.driverID,
          driverFirstName: bills.driverFirstName,
          driverLastName: bills.driverLastName,
          billingDate: bills.billingDate,
          paymentDate: bills.paymentDate,
          billStatus: bills.billStatus,
          billedAmount: bills.billedAmount,
          currency: bills.currency,
        })
        .from(bills)
        .where(condition)
        .limit(limit || 10)
        .offset(offset || 0)

      const [billCount] = await tx.select({ count: count() }).from(bills).where(condition)
      const totalPage = Page(Math.ceil(billCount.count / limit))

      return right({
        totalBills: ResultCount(billCount.count),
        totalPage: totalPage,
        perPage: limit,
        page: page,
        bills: billList.map((bill) => ({
          billID: bill.billID,
          driverID: bill.driverID,
          driverFirstName: bill.driverFirstName,
          driverLastName: bill.driverLastName,
          billingDate: bill.billingDate,
          paymentDate: bill.paymentDate,
          billStatus: bill.billStatus,
          billed: BillAmount(
            Dinero({ amount: bill.billedAmount, currency: bill.currency as Currency }),
          ),
        })),
      })
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}
