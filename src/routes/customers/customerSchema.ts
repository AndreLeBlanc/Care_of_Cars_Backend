import { Static, Type } from '@sinclair/typebox'

import {
  DriverBodySchema,
  DriverID,
  companyAddress,
  companyAddressCity,
  companyCountry,
  companyEmail,
  companyPhone,
  companyReference,
  companyZipCode,
  customerCompanyName,
  customerOrgNumber,
  driverAcceptsMarketing,
  driverAddress,
  driverAddressCity,
  driverCardNumber,
  driverCardValidTo,
  driverCountry,
  driverEmail,
  driverExternalNumber,
  driverFirstName,
  driverGDPRAccept,
  driverHasCard,
  driverISWarrantyDriver,
  driverKeyNumber,
  driverLastName,
  driverNotes,
  driverNotesShared,
  driverPhoneNumber,
  driverZipCode,
} from '../../utils/helper.js'
import { PickupTimeSchema, SubmissionTimeSchema } from '../orders/ordersSchema.js'
import { CategoryIDSchema } from '../category/categorySchema.js'
import { ServiceIDSchema } from '../services/serviceSchema.js'

export const AddCustomerBodySchema = Type.Object({
  customerOrgNumber: customerOrgNumber,
  customerCompanyName: customerCompanyName,
  companyReference: companyReference,
  companyEmail: companyEmail,
  companyPhone: companyPhone,
  companyAddress: companyAddress,
  companyZipCode: companyZipCode,
  companyAddressCity: companyAddressCity,
  companyCountry: companyCountry,
  driverExternalNumber: driverExternalNumber,
  driverGDPRAccept: driverGDPRAccept,
  driverISWarrantyDriver: driverISWarrantyDriver,
  driverAcceptsMarketing: driverAcceptsMarketing,
  driverFirstName: driverFirstName,
  driverLastName: driverLastName,
  driverEmail: driverEmail,
  driverPhoneNumber: driverPhoneNumber,
  driverAddress: driverAddress,
  driverZipCode: driverZipCode,
  driverAddressCity: driverAddressCity,
  driverCountry: driverCountry,
  driverHasCard: driverHasCard,
  driverCardNumber: Type.Optional(driverCardNumber),
  driverCardValidTo: Type.Optional(driverCardValidTo),
  driverKeyNumber: driverKeyNumber,
  driverNotesShared: driverNotesShared,
  driverNotes: driverNotes,
})

export const PatchCompanyBodySchema = Type.Object({
  customerOrgNumber: customerOrgNumber,
  customerCompanyName: customerCompanyName,
  companyAddress: companyAddress,
  companyZipCode: companyZipCode,
  companyEmail: companyEmail,
  companyPhone: companyPhone,
  companyAddressCity: companyAddressCity,
  companyCountry: companyCountry,
})

export const GetCompanyByOrgNumberSchema = Type.Object({
  orgNumber: Type.String(),
})

export const GetDriverByIDSchema = Type.Object({
  driverID: DriverID,
})

export const PatchDriverBodySchema = Type.Composite([
  DriverBodySchema,
  Type.Object({ driverID: DriverID }),
])

export const ListCustomersQueryParamSchema = Type.Object({
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Integer({ minimum: 1, default: 10 })),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
})

export const SearchSchema = Type.Object({
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Integer({ minimum: 1, default: 10 })),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
  customerOrgNumber: Type.Optional(customerOrgNumber),
  from: Type.Optional(SubmissionTimeSchema),
  to: Type.Optional(PickupTimeSchema),
  service: Type.Optional(ServiceIDSchema),
  localService: Type.Optional(ServiceIDSchema),
  serviceCategory: Type.Optional(CategoryIDSchema),
})
export type SearchSchemaType = Static<typeof SearchSchema>

export type ListCustomersQueryParamSchemaType = Static<typeof ListCustomersQueryParamSchema>
export type GetDriverByIDSchemaType = Static<typeof GetDriverByIDSchema>
export type GetCompanyByOrgNumberSchemaType = Static<typeof GetCompanyByOrgNumberSchema>
export type CreateCustomerType = Static<typeof AddCustomerBodySchema>
export type PatchCompanyType = Static<typeof PatchCompanyBodySchema>
export type PatchDriverType = Static<typeof PatchDriverBodySchema>
export type DriverBodySchemaType = Static<typeof DriverBodySchema>
