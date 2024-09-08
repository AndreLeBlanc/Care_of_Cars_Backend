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

const BillIDSchema = Type.Number()
const IsBilledSchema = Type.Boolean()
const PaymentDateSchema = Type.String({ format: 'date' })
const PaymentDaysSchema = Type.Number()
const BillStatusSchema = Type.String()
const billingDateSchema = Type.String()

export const MessageSchema = Type.Object({ message: Type.String() })

export type MessageSchemaType = Static<typeof MessageSchema>

export const CreateBillSchema = Type.Object({
  billStatus: BillStatusSchema,
  bookedBy: Type.Optional(EmployeeID),
  billingDate: billingDateSchema,
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
    discount: Type.Number(),
    currency: Type.String(),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
    orderRows: Type.Array(OrderRowSchema),
  }),
])

export type BillSchemaType = Static<typeof BillSchema>
