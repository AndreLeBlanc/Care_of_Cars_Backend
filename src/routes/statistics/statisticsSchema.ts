import { EmployeeCheckedInSchema, EmployeeCheckedOutSchema } from '../employees/employeesSchema.js'
import { EmployeeID, FirstName, LastName } from '../../utils/helper.js'
import { NameSchema, ServiceIDSchema } from '../services/serviceSchema.js'
import { OrderStatusSchema, SubmissionTimeSchema } from '../orders/ordersSchema.js'
import {
  ProductCostSchema,
  ProductDescriptionSchema,
  ProductIDSchema,
} from '../product/productSchema.js'
import { Static, Type } from '@sinclair/typebox'
import { storeID } from '../stores/storesSchema.js'

const MessageSchema = Type.String()

const ProductExpenseSchema = Type.Number()
const RevenuePerHourSchema = Type.Number()
const AmountSoldSchema = Type.Number()
const ProductProfitSchema = Type.Number()
const WorkedHoursSchema = Type.Number()
const StatisticsDateSchema = Type.String({ format: 'date-time' })
const EmployeesCountSchema = Type.Number()
const ServicesCountSchema = Type.Number()
const CustomersCountSchema = Type.Number()
const BilledCountSchema = Type.Number()
const MonthlyRevenue = Type.Number()
const PotentialMonthlyRevenue = Type.Number()
const TotalMonthlyRevenue = Type.Number()
const TotalMonthlyRevenueLastYear = Type.Number()
const AbsoluteDifference = Type.Number()
const PercentDifference = Type.Number()
const TotalRevenueSchema = Type.Number()
const BookingCountSchema = Type.Number()
const AverageRevenueSchema = Type.Number()
const CashPaidSchema = Type.Number()
const BillPaidSchema = Type.Number()
const TotalDiscountSchema = Type.Number()

export const MessageReplySchema = Type.Object({
  message: MessageSchema,
})
export type MessageReplySchemaType = Static<typeof MessageReplySchema>

export const GetCheckinStatsSchema = Type.Object({
  from: SubmissionTimeSchema,
  to: SubmissionTimeSchema,
  store: Type.Optional(storeID),
  employeeID: Type.Optional(EmployeeID),
})

export type GetCheckinStatsSchemaType = Static<typeof GetCheckinStatsSchema>

export const CheckedInStatSchema = Type.Object({
  message: MessageSchema,
  store: Type.Optional(storeID),
  stats: Type.Array(
    Type.Object({
      employeeID: EmployeeID,
      firstName: FirstName,
      lastName: LastName,
      employeeCheckedIn: Type.Optional(EmployeeCheckedInSchema),
      employeeCheckedOut: Type.Optional(EmployeeCheckedOutSchema),
    }),
  ),
})

export type CheckedInStatSchemaType = Static<typeof CheckedInStatSchema>

export const ProductStatSchema = Type.Object({
  message: MessageSchema,
  store: Type.Optional(storeID),
  stats: Type.Array(
    Type.Object({
      productID: ProductIDSchema,
      productDescription: ProductDescriptionSchema,
      amount: AmountSoldSchema,
      revenue: ProductCostSchema,
      cost: ProductExpenseSchema,
      profit: ProductProfitSchema,
    }),
  ),
})

export type ProductStatSchemaType = Static<typeof ProductStatSchema>

export const GetProductStatsSchema = Type.Object({
  from: SubmissionTimeSchema,
  to: SubmissionTimeSchema,
  store: Type.Optional(storeID),
})

export type GetProductStatSchemaType = Static<typeof GetProductStatsSchema>

export const GetServiceStatsSchema = Type.Object({
  from: SubmissionTimeSchema,
  to: SubmissionTimeSchema,
  store: Type.Optional(storeID),
  filterOrderStatus: Type.Optional(OrderStatusSchema),
})

export type GetServiceStatsSchemaType = Static<typeof GetServiceStatsSchema>

export const ServiceStatSchema = Type.Object({
  message: MessageSchema,
  store: Type.Optional(storeID),
  stats: Type.Array(
    Type.Object({
      serviceID: ServiceIDSchema,
      name: NameSchema,
      amount: AmountSoldSchema,
      revenue: ProductCostSchema,
      cost: ProductExpenseSchema,
      profit: ProductProfitSchema,
      workedHours: WorkedHoursSchema,
      revenuePerHour: RevenuePerHourSchema,
    }),
  ),
})

export type ServiceStatSchemaType = Static<typeof ServiceStatSchema>

export const GetDashboardSchema = Type.Object({
  from: Type.Optional(StatisticsDateSchema),
  storeID: Type.Optional(storeID),
})

export type GetDashboardSchemaType = Static<typeof GetDashboardSchema>

export const DashboardSchema = Type.Object({
  message: MessageSchema,
  storeID: Type.Optional(storeID),
  employees: EmployeesCountSchema,
  services: ServicesCountSchema,
  customers: CustomersCountSchema,
  billed: BilledCountSchema,
})

export type DashboardSchemaType = Static<typeof DashboardSchema>

export const GetRevenueSchema = Type.Object({
  from: StatisticsDateSchema,
  storeID: Type.Optional(storeID),
})

export type GetRevenueSchemaType = Static<typeof GetRevenueSchema>

const MonthStatsSchema = Type.Object({
  monthlyRevenue: MonthlyRevenue,
  potentialMonthlyRevenue: PotentialMonthlyRevenue,
  totalMonthlyRevenue: TotalMonthlyRevenue,
  totalMonthlyRevenueLastYear: TotalMonthlyRevenueLastYear,
  absoluteDifference: AbsoluteDifference,
  percentDifference: PercentDifference,
})

const YearStatsSchema = Type.Object({
  jan: MonthStatsSchema,
  feb: MonthStatsSchema,
  mar: MonthStatsSchema,
  apr: MonthStatsSchema,
  may: MonthStatsSchema,
  jun: MonthStatsSchema,
  jul: MonthStatsSchema,
  aug: MonthStatsSchema,
  sep: MonthStatsSchema,
  oct: MonthStatsSchema,
  nov: MonthStatsSchema,
  dec: MonthStatsSchema,
})

export const SalesStatsSchema = Type.Object({
  message: MessageSchema,
  totalRevenue: TotalRevenueSchema,
  totalBookings: BookingCountSchema,
  averageRevenuePerBooking: AverageRevenueSchema,
  cashPaid: CashPaidSchema,
  billPaid: BillPaidSchema,
  totalDiscounts: TotalDiscountSchema,
  year: YearStatsSchema,
})

export type SalesStatsSchemaType = Static<typeof SalesStatsSchema>
