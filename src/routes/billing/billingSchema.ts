import {
  DriverID,
  EmployeeID,
  FirstName,
  LastName,
  OrderID,
  companyReference,
  customerOrgNumber,
  driverAddress,
  driverAddressCity,
  driverCardNumber,
  driverCardValidTo,
  driverCountry,
  driverEmail,
  driverExternalNumber,
  driverHasCard,
  driverKeyNumber,
  driverPhoneNumber,
  driverZipCode,
} from '../../utils/helper.js'
import { Static, Type } from '@sinclair/typebox'
import { storeID } from '../stores/storesSchema.js'

const BillIDSchema = Type.Number()
const BilledAmountSchema = Type.Number()
const PaymentDateSchema = Type.String({ format: 'date' })
const PaymentDaysSchema = Type.Number()
const BillStatusSchema = Type.String()
const BillingDateSchema = Type.String()
const BillingStatusSearchSchema = Type.String()
const CurrencySchema = Type.String()
export const MessageSchema = Type.Object({ message: Type.String() })

export type MessageSchemaType = Static<typeof MessageSchema>

export const CreateBillSchema = Type.Object({
  billStatus: BillStatusSchema,
  storeID: storeID,
  billedAmount: BilledAmountSchema,
  currency: CurrencySchema,
  bookedBy: Type.Optional(EmployeeID),
  billingDate: BillingDateSchema,
  paymentDate: PaymentDateSchema,
  paymentDays: PaymentDaysSchema,
  driverID: DriverID,
  customerOrgNumber: Type.Optional(customerOrgNumber),
  driverExternalNumber: Type.Optional(driverExternalNumber),
  companyReference: Type.Optional(companyReference),
  driverFirstName: FirstName,
  driverLastName: LastName,
  driverEmail: driverEmail,
  driverPhoneNumber: driverPhoneNumber,
  driverAddress: driverAddress,
  driverZipCode: driverZipCode,
  driverAddressCity: driverAddressCity,
  driverCountry: driverCountry,
  driverHasCard: Type.Optional(driverHasCard),
  driverCardValidTo: Type.Optional(driverCardValidTo),
  driverCardNumber: Type.Optional(driverCardNumber),
  driverKeyNumber: Type.Optional(driverKeyNumber),
  orders: Type.Array(OrderID),
})

export type CreateBillSchemaType = Static<typeof CreateBillSchema>

const OrderRowSchema = Type.Object({
  name: Type.String(),
  amount: Type.Number(),
  cost: Type.Number(),
  currency: Type.String(),
  total: Type.Number(),
})

export const BillSchema = Type.Composite([
  CreateBillSchema,
  Type.Object({
    billID: BillIDSchema,
    currency: Type.String(),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
    orderRows: Type.Array(OrderRowSchema),
  }),
])

export type BillSchemaType = Static<typeof BillSchema>

export const GetBillSchema = Type.Object({
  billID: BillIDSchema,
})

export type GetBillSchemaType = Static<typeof GetBillSchema>

export const ListBillsQueryParamSchema = Type.Object({
  storeID: Type.Optional(storeID),
  search: Type.Optional(Type.String()),
  offset: Type.Optional(Type.Number()),
  limit: Type.Optional(Type.Integer({ minimum: 1, default: 10 })),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
  to: Type.Optional(Type.String({ format: 'date-time' })),
  from: Type.Optional(Type.String({ format: 'date-time' })),
  billingStatusSearch: Type.Optional(BillingStatusSearchSchema),
})

export type ListBillsQueryParamSchemaType = Static<typeof ListBillsQueryParamSchema>

export const ListedBillSchema = Type.Object({
  totalBills: Type.Number(),
  totalPage: Type.Number(),
  perPage: Type.Number(),
  page: Type.Number(),
  bills: Type.Array(
    Type.Object({
      billID: BillIDSchema,
      driverID: DriverID,
      driverFirstName: FirstName,
      driverLastName: LastName,
      billingDate: Type.String({ format: 'date-time' }),
      paymentDate: Type.String({ format: 'date-time' }),
      billStatus: Type.String(),
      billed: Type.Number(),
      billedCurrency: CurrencySchema,
    }),
  ),
})

export type ListedBillSchemaType = Static<typeof ListedBillSchema>
