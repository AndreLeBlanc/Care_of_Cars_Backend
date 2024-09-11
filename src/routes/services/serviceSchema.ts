import { Static, Type } from '@sinclair/typebox'

import { storeID } from '../stores/storesSchema.js'

import { LocalQualIDSchema } from '../qulifications/qualificationsSchema.js'

import { GlobalQualID, LocalQualID } from '../../utils/helper.js'

export const ServiceVariantIDSchema = Type.Number({ minimum: 0 })
export const ServiceIDSchema = Type.Number({ minimum: 0 })
export const NameSchema = Type.String()
const CostSchema = Type.Number()
const CurrencySchema = Type.String()
const ServiceCategoryIDSchema = Type.Integer()
const IncludeInAutomaticSmsSchema = Type.Boolean()
const HiddenSchema = Type.Boolean()
const CallIntervalSchema = Type.Integer({ minimum: 1, maximum: 36 })
const WarrantyCardSchema = Type.Optional(Type.Boolean({ default: false }))
const ItemNumberSchema = Type.Optional(Type.String())
const AwardSchema = Type.Number({ minimum: 0.01 })
const SuppliersArticleNumberSchema = Type.Optional(Type.String())
const ExternalArticleNumberSchema = Type.Optional(Type.String())
const Day1Schema = Type.Optional(Type.String())
const Day2Schema = Type.Optional(Type.String())
const Day3Schema = Type.Optional(Type.String())
const Day4Schema = Type.Optional(Type.String())
const Day5Schema = Type.Optional(Type.String())

export const MessageSchema = Type.Object({ message: Type.String() })

export type MessageSchemaType = Static<typeof MessageSchema>

export const ServiceVariantsSchema = Type.Object({
  serviceVariantID: Type.Optional(ServiceVariantIDSchema),
  name: NameSchema,
  serviceID: ServiceIDSchema,
  award: AwardSchema,
  cost: CostSchema,
  currency: CurrencySchema,
  day1: Day1Schema,
  day2: Day2Schema,
  day3: Day3Schema,
  day4: Day4Schema,
  day5: Day5Schema,
})
export const ServiceVariantsCreateSchema = Type.Object({
  serviceVariantID: Type.Optional(ServiceVariantIDSchema),
  name: NameSchema,
  serviceID: Type.Optional(ServiceIDSchema),
  award: AwardSchema,
  cost: CostSchema,
  currency: CurrencySchema,
  day1: Day1Schema,
  day2: Day2Schema,
  day3: Day3Schema,
  day4: Day4Schema,
  day5: Day5Schema,
})

export type ServiceVariantsSchemaType = Static<typeof ServiceVariantsSchema>

export const LocalServiceVariantsCreateSchema = Type.Object({
  serviceVariantID: Type.Optional(ServiceVariantIDSchema),
  serviceID: Type.Optional(ServiceIDSchema),
  name: NameSchema,
  award: AwardSchema,
  cost: CostSchema,
  currency: CurrencySchema,
  day1: Day1Schema,
  day2: Day2Schema,
  day3: Day3Schema,
  day4: Day4Schema,
  day5: Day5Schema,
})

export const LocalServiceVariantsSchema = Type.Object({
  serviceVariantID: Type.Optional(ServiceVariantIDSchema),
  serviceID: ServiceIDSchema,
  name: NameSchema,
  award: AwardSchema,
  cost: CostSchema,
  currency: CurrencySchema,
  day1: Day1Schema,
  day2: Day2Schema,
  day3: Day3Schema,
  day4: Day4Schema,
  day5: Day5Schema,
  createdAt: Type.Optional(Type.String({ format: 'date-time' })),
  updatedAt: Type.Optional(Type.String({ format: 'date-time' })),
})

export type LocalServiceVariantsSchemaType = Static<typeof LocalServiceVariantsSchema>

export const ServiceNoVariantSchema = Type.Object({
  serviceID: Type.Optional(ServiceIDSchema),
  storeID: Type.Optional(storeID),
  cost: CostSchema,
  currency: CurrencySchema,
  name: NameSchema,
  serviceCategoryID: ServiceCategoryIDSchema,
  includeInAutomaticSms: IncludeInAutomaticSmsSchema,
  hidden: HiddenSchema,
  callInterval: Type.Optional(CallIntervalSchema),
  colorForService: Type.String(),
  warrantyCard: WarrantyCardSchema,
  itemNumber: ItemNumberSchema,
  award: AwardSchema,
  suppliersArticleNumber: SuppliersArticleNumberSchema,
  externalArticleNumber: ExternalArticleNumberSchema,
  day1: Day1Schema,
  day2: Day2Schema,
  day3: Day3Schema,
  day4: Day4Schema,
  day5: Day5Schema,
  createdAt: Type.Optional(Type.String({ format: 'date-time' })),
  updatedAt: Type.Optional(Type.String({ format: 'date-time' })),
})

export const ServiceSchema = Type.Composite([
  Type.Object({
    colorForService: Type.String(),
    serviceVariants: Type.Array(ServiceVariantsSchema),
    localServiceVariants: Type.Array(LocalServiceVariantsSchema),
    deleteServiceVariants: Type.Array(
      Type.Object({
        serviceVariantID: ServiceVariantIDSchema,
        name: NameSchema,
      }),
    ),
  }),
  ServiceNoVariantSchema,
])
export type ServiceSchemaType = Static<typeof ServiceSchema>

export const ServiceCreateSchema = Type.Composite([
  Type.Object({
    colorForService: Type.String(),
    serviceVariants: Type.Array(ServiceVariantsCreateSchema),
    localServiceVariants: Type.Array(LocalServiceVariantsCreateSchema),
    deleteServiceVariants: Type.Optional(Type.Array(ServiceVariantIDSchema)),
  }),
  ServiceNoVariantSchema,
])
export type ServiceCreateSchemaType = Static<typeof ServiceCreateSchema>

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
  storeID: storeID,
  limit: Type.Optional(Type.Integer({ minimum: 1, default: 10 })),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
  orderBy: Type.Optional(listServiceOrderByEnumType),
  order: Type.Optional(serviceOrderType),
  hidden: Type.Optional(Type.Boolean()),
})
export type ListServiceQueryParamSchemaType = Static<typeof ListServiceQueryParamSchema>

export const getServiceByIDSchema = Type.Object({
  serviceID: ServiceIDSchema,
  type: Type.Union([Type.Literal('Local'), Type.Literal('Global')]),
})

export type getServiceByIDSchemaType = Static<typeof getServiceByIDSchema>

export const ServicesPaginatedSchema = Type.Object({
  totalServices: Type.Number({ minimum: 0 }),
  totalPage: Type.Number({ minimum: 0 }),
  perPage: Type.Number({ minimum: 0 }),
  services: Type.Array(
    Type.Composite([Type.Object({ colorForService: Type.Any() }), ServiceNoVariantSchema]),
  ),
  requestUrl: Type.String(),
  nextUrl: Type.Optional(Type.String()),
  previousUrl: Type.Optional(Type.String()),
})

export type ServicesPaginatedSchemaType = Static<typeof ServicesPaginatedSchema>

export const LocalServiceLocalQualSchema = Type.Object({
  serviceID: ServiceIDSchema,
  localQualID: LocalQualID,
})

export type LocalServiceLocalQualSchemaType = Static<typeof LocalServiceLocalQualSchema>

export const LocalServiceGlobalQualSchema = Type.Object({
  serviceID: ServiceIDSchema,
  globalQualID: GlobalQualID,
})

export type LocalServiceGlobalQualSchemaType = Static<typeof LocalServiceGlobalQualSchema>

export const ServiceLocalQualSchema = Type.Object({
  serviceID: ServiceIDSchema,
  localQualID: LocalQualID,
})

export type ServiceLocalQualSchemaType = Static<typeof ServiceLocalQualSchema>

export const ServiceGlobalQual = Type.Object({
  serviceID: ServiceIDSchema,
  globalQualID: GlobalQualID,
})

export type ServiceGlobalQualType = Static<typeof ServiceGlobalQual>

export const ServiceDeleteQual = Type.Object({
  serviceID: ServiceIDSchema,
  globalQualID: Type.Optional(GlobalQualID),
  localQualID: Type.Optional(LocalQualID),
})

export type ServiceDeleteQualType = Static<typeof ServiceDeleteQual>

export const LocalServiceDeleteQual = Type.Object({
  serviceID: ServiceIDSchema,
  globalQualID: Type.Optional(GlobalQualID),
  localQualID: Type.Optional(LocalQualID),
})

export type LocalServiceDeleteQualType = Static<typeof LocalServiceDeleteQual>

export const LocalServiceQualsSchema = Type.Object({
  localQuals: Type.Array(LocalQualIDSchema),
  globalQuals: Type.Array(GlobalQualID),
})

export type LocalServiceQualsSchemaType = Static<typeof LocalServiceQualsSchema>

export const GlobalServiceQualsSchema = Type.Object({
  localQuals: Type.Array(LocalQualIDSchema),
  globalQuals: Type.Array(GlobalQualID),
})

export type GlobalServiceQualsSchemType = Static<typeof GlobalServiceQualsSchema>

export const ServiceOrderVariantSchema = Type.Object({
  name: NameSchema,
  cost: CostSchema,
  day1: Day1Schema,
  day2: Day2Schema,
  day3: Day3Schema,
  day4: Day4Schema,
  day5: Day5Schema,
  serviceVariantID: ServiceIDSchema,
})

export const ServiceOrderSchema = Type.Object({
  // message: MessageSchema,
  services: Type.Array(
    Type.Object({
      serviceID: ServiceIDSchema,
      name: NameSchema,
      cost: CostSchema,
      serviceVariants: Type.Array(ServiceOrderVariantSchema),
    }),
  ),
})

export type ServiceOrderSchemaType = Static<typeof ServiceOrderSchema>
