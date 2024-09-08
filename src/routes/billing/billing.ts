import { FastifyInstance } from 'fastify'

import {
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
  PermissionTitle,
  StoreID,
} from '../../schema/schema.js'

import {
  Limit,
  NextPageUrl,
  Offset,
  Page,
  PreviousPageUrl,
  RequestUrl,
  Search,
} from '../../plugins/pagination.js'

import { Either, match } from '../../utils/helper.js'

import {
  BillSchema,
  BillSchemaType,
  CreateBillSchema,
  CreateBillSchemaType,
  GetBillSchema,
  GetBillSchemaType,
  ListBillsQueryParamSchema,
  ListBillsQueryParamSchemaType,
  ListedBillSchema,
  ListedBillSchemaType,
  MessageSchema,
  MessageSchemaType,
} from './billingSchema.js'

import {
  Bill,
  BillsPaginated,
  CreateBill,
  getBill,
  listBill,
  newBill,
} from '../../services/billingService.js'

export async function billing(fastify: FastifyInstance) {
  fastify.post<{
    Body: CreateBillSchemaType
    Reply: BillSchemaType | MessageSchemaType
  }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName = PermissionTitle('create_bill')
        const authorizeStatus = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        body: CreateBillSchema,
        response: { 201: BillSchema, 504: MessageSchema },
      },
    },

    async (req, reply) => {
      const bill: CreateBill = {
        billStatus: req.body.billStatus as BillStatus,
        storeID: StoreID(req.body.storeID),
        billedAmount: BilledAmount(req.body.billedAmount),
        currency: req.body.currency,
        bookedBy: req.body.bookedBy ? EmployeeID(req.body.bookedBy) : undefined,
        billingDate: BillingDate(req.body.billingDate),
        paymentDate: PaymentDate(req.body.paymentDate),
        paymentDays: PaymentDays(req.body.paymentDays),
        driverID: DriverID(req.body.driverID),
        customerOrgNumber: req.body.customerOrgNumber
          ? CustomerOrgNumber(req.body.customerOrgNumber)
          : undefined,
        driverExternalNumber: req.body.driverExternalNumber
          ? DriverExternalNumber(req.body.driverExternalNumber)
          : undefined,
        companyReference: req.body.companyReference
          ? CompanyReference(req.body.companyReference)
          : undefined,
        driverFirstName: DriverFirstName(req.body.driverFirstName),
        driverLastName: DriverLastName(req.body.driverLastName),
        driverEmail: DriverEmail(req.body.driverEmail),
        driverPhoneNumber: DriverPhoneNumber(req.body.driverPhoneNumber),
        driverAddress: DriverAddress(req.body.driverAddress),
        driverZipCode: DriverZipCode(req.body.driverZipCode),
        driverAddressCity: DriverAddressCity(req.body.driverAddressCity),
        driverCountry: DriverCountry(req.body.driverCountry),
        driverHasCard: req.body.driverHasCard ? DriverHasCard(req.body.driverHasCard) : undefined,
        driverCardValidTo: req.body.driverCardValidTo
          ? DriverCardValidTo(new Date(req.body.driverCardValidTo))
          : undefined,
        driverCardNumber: req.body.driverCardNumber
          ? CustomerCardNumber(req.body.driverCardNumber)
          : undefined,
        driverKeyNumber: req.body.driverKeyNumber
          ? DriverKeyNumber(req.body.driverKeyNumber)
          : undefined,
      }
      const orders = req.body.orders.map(OrderID)
      const createdBill: Either<string, Bill> = await newBill(bill, orders)
      match(
        createdBill,
        (billRet) => {
          const { orderRows, ...rest } = billRet
          const orderRowNum = orderRows.map((row) => ({
            name: row.name,
            amount: row.amount,
            cost: row.cost.getAmount(),
            currency: row.cost.getCurrency(),
            total: row.total.getAmount(),
          }))
          return reply.status(201).send({ orderRows: orderRowNum, ...rest })
        },
        (err) => {
          return reply.status(504).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Params: GetBillSchemaType
    Reply: BillSchemaType | MessageSchemaType
  }>(
    '/:billID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_bill')
        const authorizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply.status(403).send({
            message: `Permission denied, user doesn't have permission ${permissionName}`,
          })
        }
        done()
        return reply
      },
      schema: {
        params: GetBillSchema,
        response: { 200: BillSchema, 404: MessageSchema },
      },
    },
    async function (request, reply) {
      const orderID = BillID(request.params.billID)
      const fetchedBill: Either<string, Bill> = await getBill(orderID)

      match(
        fetchedBill,
        (billRet) => {
          const { orderRows, ...rest } = billRet
          const orderRowNum = orderRows.map((row) => ({
            name: row.name,
            amount: row.amount,
            cost: row.cost.getAmount(),
            currency: row.cost.getCurrency(),
            total: row.total.getAmount(),
          }))
          return reply.status(200).send({ orderRows: orderRowNum, ...rest })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Querystring: ListBillsQueryParamSchemaType
    Response: ListedBillSchemaType | MessageSchemaType
  }>(
    '/list-orders/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('list_orders')
        const authorizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply.status(403).send({
            message: `Permission denied, user doesn't have permission ${permissionName}`,
          })
        }
        done()
        return reply
      },
      schema: {
        querystring: ListBillsQueryParamSchema,
        response: {
          200: ListedBillSchema,
          403: MessageSchema,
        },
      },
    },
    async function (req, reply) {
      const {
        search = '',
        limit = 10,
        page = 1,
        storeID,
        to,
        from,
        billingStatusSearch,
      } = req.query
      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const store = storeID ? StoreID(storeID) : undefined
      const brandedTo = to ? BillingDate(to) : undefined
      const brandedFrom = from ? BillingDate(from) : undefined
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)
      const brandedOrderStatusSearch = billingStatusSearch as BillStatus
      const listedOrder: Either<string, BillsPaginated> = await listBill(
        brandedSearch,
        brandedLimit,
        brandedPage,
        offset,
        store,
        brandedTo,
        brandedFrom,
        brandedOrderStatusSearch,
      )

      match(
        listedOrder,
        (billsPag: BillsPaginated) => {
          const requestUrl: RequestUrl = RequestUrl(req.protocol + '://' + req.hostname + req.url)
          const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
            requestUrl,
            Page(billsPag.totalPage),
            Page(billsPag.page),
          )
          const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
            requestUrl,
            Page(billsPag.totalPage),
            Page(billsPag.page),
          )

          const { bills, ...rest } = billsPag

          return reply.status(200).send({
            message: 'fetched bills',
            bills: bills.map((bill) => ({
              billID: bill.billID,
              driverID: bill.driverID,
              driverFirstName: bill.driverFirstName,
              driverLastName: bill.driverLastName,
              billingDate: bill.billingDate,
              paymentDate: bill.paymentDate,
              billStatus: bill.billStatus,
              billed: bill.billed.getAmount(),
              billedCurrency: bill.billed.getCurrency(),
            })),
            ...rest,
            previousUrl: previousUrl,
            nextUrl: nextUrl,
          })
        },
        (err) => {
          return reply.status(403).send({ message: err })
        },
      )
    },
  )
}
