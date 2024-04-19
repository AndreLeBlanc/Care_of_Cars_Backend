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
  driverEmail: Type.String({ format: 'email' }),
  driverPhoneNumber: Type.String(),
  driverAddress: Type.String(),
  driverZipCode: Type.String(),
  driverAddressCity: Type.String(),
  driverCountry: Type.String(),
  driverHasCard: Type.Boolean(),
  driverCardNumber: Type.String(),
  driverCardValidTo: Type.String({ format: 'date' }),
  driverKeyNumber: Type.String(),
  driverNotesShared: Type.String(),
  driverNotes: Type.String(),
})

export const patchCompanyBody = Type.Object({
  customerOrgNumber: Type.String(),
  customerCompanyName: Type.String(),
  companyAddress: Type.Optional(Type.String()),
  companyZipCode: Type.Optional(Type.String()),
  companyAddressCity: Type.Optional(Type.String()),
  companyCountry: Type.Optional(Type.String()),
})

export const getCompanyByOrgNumber = Type.Object({
  orgNumber: Type.String(),
})

export const getDriverByEmail = Type.Object({
  driverEmail: Type.String(),
})

export const patchDriverBody = Type.Object({
  driverExternalNumber: Type.Optional(Type.String()),
  driverGDPRAccept: Type.Optional(Type.Boolean()),
  driverISWarrantyDriver: Type.Optional(Type.Boolean()),
  driverAcceptsMarketing: Type.Optional(Type.Boolean()),
  driverFirstName: Type.Optional(Type.String()),
  driverLastName: Type.Optional(Type.String()),
  driverEmail: Type.String({ format: 'email' }),
  driverPhoneNumber: Type.Optional(Type.String()),
  driverAddress: Type.Optional(Type.String()),
  driverZipCode: Type.Optional(Type.String()),
  driverAddressCity: Type.Optional(Type.String()),
  driverCountry: Type.Optional(Type.String()),
  driverHasCard: Type.Optional(Type.Boolean()),
  driverCardNumber: Type.Optional(Type.String()),
  driverCardValidTo: Type.Optional(Type.String({ format: 'date' })),
  driverKeyNumber: Type.Optional(Type.String()),
  driverNotesShared: Type.Optional(Type.String()),
  driverNotes: Type.Optional(Type.String()),
})

export const addDriverBody = Type.Object({
  companyOrgNumber: Type.String(),
  driverExternalNumber: Type.String(),
  driverGDPRAccept: Type.Boolean(),
  driverISWarrantyDriver: Type.Boolean(),
  driverAcceptsMarketing: Type.Boolean(),
  driverFirstName: Type.String(),
  driverLastName: Type.String(),
  driverEmail: Type.String({ format: 'email' }),
  driverPhoneNumber: Type.String(),
  driverAddress: Type.String(),
  driverZipCode: Type.String(),
  driverAddressCity: Type.String(),
  driverCountry: Type.String(),
  driverHasCard: Type.Boolean(),
  driverCardNumber: Type.String(),
  driverCardValidTo: Type.String({ format: 'date' }),
  driverKeyNumber: Type.String(),
  driverNotesShared: Type.String(),
  driverNotes: Type.String(),
})

export type getDriverByEmailType = Static<typeof getDriverByEmail>
export type getCompanyByOrgNumberType = Static<typeof getCompanyByOrgNumber>
export type CreateCustomerType = Static<typeof addCustomerBody>
export type PatchCompanyType = Static<typeof patchCompanyBody>
export type PatchDriverType = Static<typeof patchDriverBody>
export type CreateDriverType = Static<typeof addDriverBody>
