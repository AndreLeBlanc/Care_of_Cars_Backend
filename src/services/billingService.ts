import {
  Amount,
  BillID,
  BillStatus,
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
  PaymentDays,
  ServiceCostDinero,
  ServiceCostNumber,
  ServiceName,
  billOrders,
  bills,
  localServices,
  orderLocalServices,
  orderServices,
  orders,
  services,
} from '../schema/schema.js'

import { db } from '../config/db-connect.js'

import Dinero, { Currency } from 'dinero.js'

import { eq, or } from 'drizzle-orm'

import { Either, errorHandling, left, right } from '../utils/helper.js'

export type CreateBill = {
  billStatus: BillStatus
  bookedBy?: EmployeeID
  billingDate: string
  paymentDate: string
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
  name: ServiceName
  amount: Amount
  cost: ServiceCostDinero
  total: ServiceCostDinero
}

export type Bill = CreateBill & {
  billID: BillID
  discount: Dinero.Dinero[]
  orders: OrderID[]
  createdAt: Date
  updatedAt: Date
  orderRows: OrderRow[]
}

export async function newBill(bill: CreateBill, order: OrderID[]): Promise<Either<string, Bill>> {
  try {
    const createBill = await db.transaction(async (tx) => {
      const [newBill] = await tx.insert(bills).values(bill).returning()
      const zipOrderBill = order.map((order) => ({ billID: newBill.billID, orderID: order }))
      const CreatedBillOrders = await tx.insert(billOrders).values(zipOrderBill).returning()
      let orderInfoLocal = await tx
        .select({
          name: orderLocalServices.name,
          currency: localServices.currency,
          cost: orderLocalServices.cost,
          amount: orderLocalServices.amount,
        })
        .from(orderLocalServices)
        .where(or(...order.map((orderID) => eq(orderLocalServices.orderID, orderID))))

      const orderInfoService = await tx
        .select({
          name: orderServices.name,
          currency: services.currency,
          cost: orderServices.cost,
          amount: orderServices.amount,
        })
        .from(orderServices)
        .where(or(...order.map((orderID) => eq(orderServices.orderID, orderID))))

      const discounts = await tx
        .select({
          discount: orders.discount,
          currency: orders.currency,
        })
        .from(orders)
        .where(or(...order.map((orderID) => eq(orders.orderID, orderID))))

      orderInfoLocal = orderInfoLocal.concat(orderInfoService)

      return {
        billID: newBill.billID,
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
        discount: discounts.map((discount) =>
          Dinero({ amount: discount.discount, currency: discount.currency as Currency }),
        ),
        orders: CreatedBillOrders.map((bo) => bo.orderID),
        createdAt: newBill.createdAt,
        updatedAt: newBill.updatedAt,
        orderRows: orderInfoLocal.map((serv) => ({
          name: serv.name,
          amount: serv.amount,
          cost: ServiceCostDinero(
            Dinero({ amount: serv.cost, currency: serv.currency as Currency }),
          ),
          total: ServiceCostDinero(
            Dinero({
              amount: serv.cost,
              currency: serv.currency as Currency,
            }).multiply(serv.amount),
          ),
        })),
      }
    })
    return right(createBill)
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getBill(bill: BillID): Promise<Either<string, Bill>> {
  try {
    const billedOrders = await db
      .select({
        bill: bills,
        orderID: billOrders.orderID,
        discount: orders.discount,
        currency: orders.currency,
        services: {
          name: orderServices.name,
          currency: orderServices.currency,
          cost: orderServices.cost,
          amount: orderServices.amount,
        },
        localServices: {
          name: orderLocalServices.name,
          currency: orderLocalServices.currency,
          cost: orderLocalServices.cost,
          amount: orderLocalServices.amount,
        },
      })
      .from(bills)
      .where(eq(bills.billID, bill))
      .innerJoin(billOrders, eq(billOrders.billID, bills.billID))
      .innerJoin(orders, eq(billOrders.orderID, orders.orderID))
      .leftJoin(orderServices, eq(orders.orderID, orderServices.orderID))
      .leftJoin(orderLocalServices, eq(orders.orderID, orderLocalServices.orderID))
    const orderInfoLocal = billedOrders.reduce<
      {
        name: ServiceName
        currency: string
        cost: ServiceCostNumber
        amount: Amount
      }[]
    >((acc, el) => {
      if (el.services != null) {
        acc.push(el.services)
      }
      if (el.localServices != null) {
        acc.push(el.localServices)
      }
      return acc
    }, [])

    return right({
      billID: bill,
      billStatus: billedOrders[0].bill.billStatus,
      bookedBy: billedOrders[0].bill.bookedBy ?? undefined,
      billingDate: billedOrders[0].bill.billingDate,
      paymentDate: billedOrders[0].bill.paymentDate,
      paymentDays: billedOrders[0].bill.paymentDays,
      driverID: billedOrders[0].bill.driverID,
      customerOrgNumber: billedOrders[0].bill.customerOrgNumber ?? undefined,
      driverExternalNumber: billedOrders[0].bill.driverExternalNumber ?? undefined,
      companyReference: billedOrders[0].bill.companyReference ?? undefined,
      driverFirstName: billedOrders[0].bill.driverFirstName,
      driverLastName: billedOrders[0].bill.driverLastName,
      driverEmail: billedOrders[0].bill.driverEmail,
      driverPhoneNumber: billedOrders[0].bill.driverPhoneNumber,
      driverAddress: billedOrders[0].bill.driverAddress,
      driverZipCode: billedOrders[0].bill.driverZipCode,
      driverAddressCity: billedOrders[0].bill.driverAddressCity,
      driverCountry: billedOrders[0].bill.driverCountry,
      driverHasCard: billedOrders[0].bill.driverHasCard ?? undefined,
      driverCardValidTo: billedOrders[0].bill.driverCardValidTo ?? undefined,
      driverCardNumber: billedOrders[0].bill.driverCardNumber ?? undefined,
      driverKeyNumber: billedOrders[0].bill.driverKeyNumber ?? undefined,
      discount: billedOrders.map((discount) =>
        Dinero({ amount: discount.discount, currency: discount.currency as Currency }),
      ),
      orders: billedOrders.map((bo) => bo.orderID),
      createdAt: billedOrders[0].bill.createdAt,
      updatedAt: billedOrders[0].bill.updatedAt,
      orderRows: orderInfoLocal.map((serv) => ({
        name: serv.name,
        amount: serv.amount,
        cost: ServiceCostDinero(Dinero({ amount: serv.cost, currency: serv.currency as Currency })),
        total: ServiceCostDinero(
          Dinero({
            amount: serv.cost,
            currency: serv.currency as Currency,
          }).multiply(serv.amount),
        ),
      })),
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}
