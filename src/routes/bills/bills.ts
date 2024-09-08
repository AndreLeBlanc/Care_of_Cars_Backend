import { FastifyInstance } from 'fastify'

import {
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
  PermissionTitle,
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
  MessageSchema,
  MessageSchemaType,
} from './billSchema.js'

import { Bill, CreateBill, newBill } from '../../services/billingService.js'

export async function bills(fastify: FastifyInstance) {
  fastify.put<{
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
        bookedBy: req.body.bookedBy ? EmployeeID(req.body.bookedBy) : undefined,
        billingDate: req.body.billingDate,
        paymentDate: req.body.paymentDate,
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
          const { currency, ...rest } = billRet
          return reply.status(201).send(billRet)
        },
        (err) => {
          return reply.status(504).send({ message: err })
        },
      )
    },
  )
}
