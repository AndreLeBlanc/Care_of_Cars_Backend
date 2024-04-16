import { Static, Type } from '@sinclair/typebox'

export const addCustomerBody = Type.Object({
  companyOrgNumber: Type.String(),
  companyName: Type.String(),
  companyReference: Type.String(),
  companyEmail: Type.String({ format: 'email' }),
  companyPhoneNumber: Type.String(),
  companyAddress: Type.String(),
  companyZipCode: Type.String(),
  companyAddressCity: Type.String(),
  companyCountry: Type.String(),
  driverExternalNumber: Type.String(),
  driverGDPRAccept: Type.Boolean(),
  driverISWarrantyDriver: Type.Boolean(),
  driverAcceptsMarketing: Type.Boolean(),
  driverFirstName: Type.String(),
  driverLastName: Type.String(),
  driverEmail: Type.String(),
  driverPhoneNumber: Type.String(),
  driverAddress: Type.String(),
  driverZipCode: Type.String(),
  driverAddressCity: Type.String(),
  driverCountry: Type.String(),
  driverHasCard: Type.Boolean(),
  driverCardNumber: Type.String(),
  driverCardValidTo: Type.Date(),
  driverKeyNumber: Type.String(),
  driverNotesShared: Type.String(),
  driverNotes: Type.String(),
})

export const patchCompanyBody = Type.Object({
  companyOrgNumber: Type.String(),
  companyName: Type.Optional(Type.String()),
  companyReference: Type.Optional(Type.String()),
  companyEmail: Type.Optional(Type.String({ format: 'email' })),
  companyPhoneNumber: Type.Optional(Type.String()),
  companyAddress: Type.Optional(Type.String()),
  companyZipCode: Type.Optional(Type.String()),
  companyAddressCity: Type.Optional(Type.String()),
  companyCountry: Type.Optional(Type.String()),
})

export type CreateCustomerType = Static<typeof addCustomerBody>
export type PatchCompanyType = Static<typeof patchCompanyBody>
