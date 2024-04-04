import { Static, Type } from '@sinclair/typebox'

export const CreateServiceVariantsSchema = Type.Object({
  name: Type.String(),
  award: Type.Number({ minimum: 0.01 }),
  cost: Type.Number({ minimum: 0.01 }),
  day1: Type.Optional(Type.String()),
  day2: Type.Optional(Type.String()),
  day3: Type.Optional(Type.String()),
  day4: Type.Optional(Type.String()),
  day5: Type.Optional(Type.String()),
})
export type CreateServiceVariantsSchemaType = Static<typeof CreateServiceVariantsSchema>

export enum colorForService {
  LightBlue = 'LightBlue',
  Blue = 'Blue',
  DarkBlue = 'DarkBlue',
  LightGreen = 'LightGreen',
  Green = 'Green',
  DarkGreen = 'DarkGreen',
  LightYellow = 'LightYellow',
  Yellow = 'Yellow',
  DarkYellow = 'DarkYellow',
  LightPurple = 'LightPurple',
  Purple = 'Purple',
  DarkPurple = 'DarkPurple',
  LightPink = 'LightPink',
  Pink = 'Pink',
  DarkPink = 'DarkPink',
  LightTurquoise = 'LightTurquoise',
  Turquoise = 'Turquoise',
  DarkTurquoise = 'DarkTurquoise',
  Orange = 'Orange',
  Red = 'Red',
}
const colorForServiceType = Type.Enum(colorForService)
export const CreateServiceSchema = Type.Object({
  name: Type.String(),
  serviceCategoryID: Type.Integer(),
  includeInAutomaticSms: Type.Optional(Type.Boolean()),
  hidden: Type.Optional(Type.Boolean()),
  callInterval: Type.Optional(Type.Integer({ minimum: 1, maximum: 12 })),
  colorForService: Type.Optional(colorForServiceType),
  warrantyCard: Type.Optional(Type.Boolean()),
  itemNumber: Type.Optional(Type.String()),
  suppliersArticleNumber: Type.Optional(Type.String()),
  externalArticleNumber: Type.Optional(Type.String()),
  serviceVariants: Type.Optional(Type.Array(CreateServiceVariantsSchema)),
})

export type CreateServiceSchemaType = Static<typeof CreateServiceSchema>

export enum listServiceOrderByEnum {
  id = 'id',
  name = 'name',
  serviceCategoryID = 'serviceCategoryID',
}
const listServiceOrderByEnumType = Type.Enum(listServiceOrderByEnum)

export enum serviceOrderEnum {
  asc = 'asc',
  desc = 'desc',
}
const serviceOrderType = Type.Enum(serviceOrderEnum)

export const ListServiceQueryParamSchema = Type.Object({
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Integer({ minimum: 1, default: 10 })),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
  orderBy: Type.Optional(listServiceOrderByEnumType),
  order: Type.Optional(serviceOrderType),
  hidden: Type.Optional(Type.Boolean()),
})
export type ListServiceQueryParamSchemaType = Static<typeof ListServiceQueryParamSchema>

export const PatchServiceVariantsSchema = Type.Object({
  name: Type.String(),
  award: Type.Number({ minimum: 0.01 }),
  cost: Type.Number({ minimum: 0.01 }),
  day1: Type.Optional(Type.String()),
  day2: Type.Optional(Type.String()),
  day3: Type.Optional(Type.String()),
  day4: Type.Optional(Type.String()),
  day5: Type.Optional(Type.String()),
})
export type PatchServiceVariantsSchemaType = Static<typeof PatchServiceVariantsSchema>

export const PatchServiceSchema = Type.Object({
  name: Type.Optional(Type.String()),
  serviceCategoryID: Type.Optional(Type.Integer()),
  includeInAutomaticSms: Type.Optional(Type.Optional(Type.Boolean())),
  hidden: Type.Optional(Type.Boolean()),
  callInterval: Type.Optional(Type.Integer({ minimum: 1, maximum: 12 })),
  colorForService: Type.Enum(colorForService),
  warrantyCard: Type.Optional(Type.Boolean()),
  itemNumber: Type.Optional(Type.String()),
  suppliersArticleNumber: Type.Optional(Type.String()),
  externalArticleNumber: Type.Optional(Type.String()),
  serviceVariants: Type.Optional(Type.Array(PatchServiceVariantsSchema)),
})
export type PatchServiceSchemaType = Static<typeof PatchServiceSchema>

export const getServiceByIDSchema = Type.Object({
  id: Type.Number(),
})

export type getServiceByIDSchemaType = Static<typeof getServiceByIDSchema>
