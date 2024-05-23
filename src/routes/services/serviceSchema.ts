import { Static, Type } from '@sinclair/typebox'

export const ServiceVariantsSchema = Type.Object({
  name: Type.String(),
  award: Type.Number({ minimum: 0.01 }),
  cost: Type.Number({ minimum: 0.01 }),
  serviceDay1: Type.Optional(Type.String()),
  serviceDay2: Type.Optional(Type.String()),
  serviceDay3: Type.Optional(Type.String()),
  serviceDay4: Type.Optional(Type.String()),
  serviceDay5: Type.Optional(Type.String()),
})
export type CreateServiceVariantsSchemaType = Static<typeof ServiceVariantsSchema>

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
  None = 'None',
}
const colorForServiceType = Type.Enum(colorForService)
export const ServiceSchema = Type.Object({
  serviceName: Type.String(),
  serviceCategoryID: Type.Integer(),
  serviceIncludeInAutomaticSms: Type.Boolean(),
  serviceHidden: Type.Optional(Type.Boolean()),
  serviceCallInterval: Type.Integer({ minimum: 1, maximum: 12 }),
  serviceColorForService: Type.Optional(colorForServiceType),
  serviceWarrantyCard: Type.Optional(Type.Boolean({ default: false })),
  serviceItemNumber: Type.Optional(Type.String()),
  serviceSuppliersArticleNumber: Type.Optional(Type.String()),
  serviceExternalArticleNumber: Type.Optional(Type.String()),
  serviceVariants: Type.Array(ServiceVariantsSchema),
})

export type ServiceSchemaType = Static<typeof ServiceSchema>

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

export const getServiceByIDSchema = Type.Object({
  serviceID: Type.Number(),
})

export type getServiceByIDSchemaType = Static<typeof getServiceByIDSchema>
