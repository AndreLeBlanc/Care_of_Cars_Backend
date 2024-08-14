import { Static, Type } from '@sinclair/typebox'

import { LocalServiceIDSchema, ServiceIDSchema } from '../services/serviceSchema.js'
import { PickupTimeSchema, SubmissionTimeSchema } from '../orders/ordersSchema.js'
import { CategoryIDSchema } from '../category/categorySchema.js'
import { driverID } from '../../utils/helper.js'
const companyOrgNumber = Type.String({ maxLength: 11 })
const companyName = Type.String({ maxLength: 255 })
const companyReference = Type.String({ maxLength: 255 })
const companyEmail = Type.String({ format: 'email' })
const companyPhoneNumber = Type.String({
  pattern: '^([+]?[s0-9]+)?(d{3}|[(]?[0-9]+[)])?([-]?[s]?[0-9])+$',
})
const companyAddress = Type.String({ maxLength: 255 })
const companyZipCode = Type.String({ maxLength: 16 })
const companyAddressCity = Type.String({ maxLength: 255 })
const companyCountry = Type.String({ maxLength: 255 })
const driverExternalNumber = Type.String({ maxLength: 255 })
const driverGDPRAccept = Type.Boolean()
const driverISWarrantyDriver = Type.Boolean()
const driverAcceptsMarketing = Type.Boolean()
const driverFirstName = Type.String({ maxLength: 128 })
const driverLastName = Type.String({ maxLength: 128 })
const driverEmail = Type.String({ format: 'email' })
const driverPhoneNumber = Type.String({
  pattern: '^([+]?[s0-9]+)?(d{3}|[(]?[0-9]+[)])?([-]?[s]?[0-9])+$',
})
const driverAddress = Type.String({ maxLength: 255 })
const driverZipCode = Type.String({ maxLength: 16 })
const driverAddressCity = Type.String({ maxLength: 255 })
const driverCountry = Type.String({ maxLength: 255 })
const customerCompanyName = Type.String({ maxLength: 255 })
const driverHasCard = Type.Boolean()
const driverCardNumber = Type.String({ maxLength: 255 })
const driverCardValidTo = Type.String({ format: 'date' })
const driverKeyNumber = Type.String({ maxLength: 255 })
const driverNotesShared = Type.String()
const driverNotes = Type.String()

export const AddCustomerBodySchema = Type.Object({
  companyOrgNumber: companyOrgNumber,
  companyName: companyName,
  companyReference: companyReference,
  companyEmail: companyEmail,
  companyPhoneNumber: companyPhoneNumber,
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
  driverCardNumber: driverCardNumber,
  driverCardValidTo: driverCardValidTo,
  driverKeyNumber: driverKeyNumber,
  driverNotesShared: driverNotesShared,
  driverNotes: driverNotes,
})

export const PatchCompanyBodySchema = Type.Object({
  customerOrgNumber: companyOrgNumber,
  customerCompanyName: customerCompanyName,
  companyAddress: companyAddress,
  companyZipCode: companyZipCode,
  companyAddressCity: companyAddressCity,
  companyCountry: companyCountry,
})

export const GetCompanyByOrgNumberSchema = Type.Object({
  orgNumber: Type.String(),
})

export const GetDriverByIDSchema = Type.Object({
  driverID: driverID,
})

const DriverBodySchema = Type.Object({
  driverExternalNumber: Type.Optional(driverExternalNumber),
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
  driverKeyNumber: Type.Optional(driverKeyNumber),
  driverNotesShared: Type.Optional(driverNotesShared),
  driverNotes: driverNotes,
})

export const PatchDriverBodySchema = Type.Composite([
  DriverBodySchema,
  Type.Object({ driverID: driverID }),
])

export const CreateDriverBodySchema = Type.Composite([
  DriverBodySchema,
  Type.Object({ companyOrgNumber: Type.Optional(companyOrgNumber) }),
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
  companyOrg: Type.Optional(companyOrgNumber),
  from: Type.Optional(SubmissionTimeSchema),
  to: Type.Optional(PickupTimeSchema),
  service: Type.Optional(ServiceIDSchema),
  localService: Type.Optional(LocalServiceIDSchema),
  serviceCategory: Type.Optional(CategoryIDSchema),
})
export type SearchSchemaType = Static<typeof SearchSchema>

export type ListCustomersQueryParamSchemaType = Static<typeof ListCustomersQueryParamSchema>
export type GetDriverByIDSchemaType = Static<typeof GetDriverByIDSchema>
export type GetCompanyByOrgNumberSchemaType = Static<typeof GetCompanyByOrgNumberSchema>
export type CreateCustomerType = Static<typeof AddCustomerBodySchema>
export type PatchCompanyType = Static<typeof PatchCompanyBodySchema>
export type PatchDriverType = Static<typeof PatchDriverBodySchema>
export type CreateDriverType = Static<typeof CreateDriverBodySchema>
