import { Static, Type } from '@sinclair/typebox'

export const addRentBody = Type.Object({
  rentCarRegistrationNumber: Type.String(),
  rentCarModel: Type.String(),
  rentCarColor: Type.String(),
  rentCarYear: Type.Number(),
  rentCarNotes: Type.Optional(Type.String()),
  rentCarNumber: Type.Optional(Type.Number()),
})

export const ListRentCarQueryParamSchema = Type.Object({
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Integer({ minimum: 1, default: 10 })),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
})

export const deleteRentCar = Type.Object({
  regNumber: Type.String(),
})

export const patchRentCarBody = Type.Object({
  rentCarRegistrationNumber: Type.String(),
  rentCarModel: Type.String(),
  rentCarColor: Type.String(),
  rentCarYear: Type.Number(),
  rentCarNotes: Type.Optional(Type.String()),
  rentCarNumber: Type.Optional(Type.Number()),
})

export type PatchRentCarType = Static<typeof patchRentCarBody>
export type deleteRentCarType = Static<typeof deleteRentCar>
export type ListRentCarQueryParamSchemaType = Static<typeof ListRentCarQueryParamSchema>
export type AddCustomerType = Static<typeof addRentBody>
