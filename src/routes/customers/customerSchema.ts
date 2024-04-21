import { Static, Type } from '@sinclair/typebox'

export const addCustomerBody = Type.Object({
  companyOrgNumber: Type.String(),
  companyName: Type.String(),
  companyReference: Type.String(),
  companyEmail: Type.String({ format: 'email' }),
  companyPhoneNumber: Type.String({
    pattern: '^([+]?[s0-9]+)?(d{3}|[(]?[0-9]+[)])?([-]?[s]?[0-9])+$',
  }),
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
  driverPhoneNumber: Type.String({
    pattern: '^([+]?[s0-9]+)?(d{3}|[(]?[0-9]+[)])?([-]?[s]?[0-9])+$',
  }),
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
export type getCompanyByOrgNumberType = Static<typeof getCompanyByOrgNumber>
export type CreateCustomerType = Static<typeof addCustomerBody>
export type PatchCompanyType = Static<typeof patchCompanyBody>
