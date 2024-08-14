import { Static, Type } from '@sinclair/typebox'
import { CreatedAndUpdatedAT } from '../../utils/helper.js'

export const CategoryIDSchema = Type.Number({ minimum: 1 })
export const CategoryNameSchema = Type.String({ minLength: 3 })
export const CategoryDescriptionSchema = Type.String({ minLength: 3 })
export const MessageSchema = Type.String()

export const MessageReplySchema = Type.Object({ message: MessageSchema })

export type MessageReplySchemaType = Static<typeof MessageReplySchema>

export const ListServiceCategoryQueryParamSchema = Type.Object({
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Integer({ minimum: 1, default: 10 })),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
})
export type ListServiceCategoryQueryParamSchemaType = Static<
  typeof ListServiceCategoryQueryParamSchema
>

export const CreateServiceCategorySchema = Type.Object({
  serviceCategoryName: CategoryNameSchema,
  serviceCategoryDescription: Type.Optional(CategoryDescriptionSchema),
})
export type CreateServiceCategorySchemaType = Static<typeof CreateServiceCategorySchema>

export const CreateProductCategorySchema = Type.Object({
  productCategoryName: CategoryNameSchema,
  productCategoryDescription: Type.Optional(CategoryDescriptionSchema),
})
export type CreateProductCategorySchemaType = Static<typeof CreateProductCategorySchema>

export const GetServiceCategoryByIDSchema = Type.Object({
  id: CategoryIDSchema,
})
export type GetServiceCategoryByIDSchemaType = Static<typeof GetServiceCategoryByIDSchema>

export const GetProductCategoryByIDSchema = Type.Object({
  id: CategoryIDSchema,
})
export type GetProductCategoryByIDSchemaType = Static<typeof GetProductCategoryByIDSchema>

export const PatchServiceCategorySchema = Type.Object({
  serviceCategoryName: CategoryNameSchema,
  serviceCategoryDescription: Type.Optional(CategoryDescriptionSchema),
})
export type PatchServiceCategorySchemaType = Static<typeof PatchServiceCategorySchema>

export const PatchProductCategorySchema = Type.Object({
  productCategoryName: CategoryNameSchema,
  productCategoryDescription: Type.Optional(CategoryDescriptionSchema),
})
export type PatchProductCategorySchemaType = Static<typeof PatchProductCategorySchema>

export const ServiceCategorySchema = Type.Object({
  serviceCategoryID: CategoryIDSchema,
  serviceCategoryName: CategoryNameSchema,
  serviceCategoryDescription: Type.Optional(CategoryDescriptionSchema),
})

export type ServiceCategorySchemaType = Static<typeof ServiceCategorySchema>

export const ServiceCategoryReplySchema = Type.Composite([
  ServiceCategorySchema,
  CreatedAndUpdatedAT,
])

export type ServiceCategoryReplySchemaType = Static<typeof ServiceCategoryReplySchema>

export const ServicesPaginatedSchema = Type.Object({
  message: MessageSchema,
  totalItems: Type.Number({ minimum: 0 }),
  nextUrl: Type.Optional(Type.String({ format: 'url' })),
  previousUrl: Type.Optional(Type.String({ format: 'url' })),
  totalPage: Type.Number({ minimum: 0 }),
  page: Type.Number({ minimum: 0 }),
  limit: Type.Number({ minimum: 0 }),
  data: Type.Array(ServiceCategorySchema),
})

export type ServicesPaginatedSchemaType = Static<typeof ServicesPaginatedSchema>

export const ProductCategorySchema = Type.Object({
  productCategoryID: CategoryIDSchema,
  productCategoryName: CategoryNameSchema,
  productCategoryDescription: Type.Optional(CategoryDescriptionSchema),
})

export type ProductCategorySchemaType = Static<typeof ProductCategorySchema>

export const ProductCategoryReplySchema = Type.Composite([
  ProductCategorySchema,
  CreatedAndUpdatedAT,
])

export type ProductCategoryReplySchemaType = Static<typeof ProductCategoryReplySchema>

export const ProductsPaginatedSchema = Type.Object({
  message: MessageSchema,
  totalItems: Type.Number({ minimum: 0 }),
  nextUrl: Type.Optional(Type.String({ format: 'url' })),
  previousUrl: Type.Optional(Type.String({ format: 'url' })),
  totalPage: Type.Number({ minimum: 0 }),
  page: Type.Number({ minimum: 0 }),
  limit: Type.Number({ minimum: 0 }),
  data: Type.Array(ProductCategorySchema),
})

export type ProductsPaginatedSchemaType = Static<typeof ProductsPaginatedSchema>
