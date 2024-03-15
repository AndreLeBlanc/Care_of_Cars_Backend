import { Static, Type } from '@sinclair/typebox'

export const ListServiceCategoryQueryParamSchema = Type.Object({
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Integer({ minimum: 1, default: 10 })),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
})
export type ListServiceCategoryQueryParamSchemaType = Static<
  typeof ListServiceCategoryQueryParamSchema
>

export const CreateServiceCategorySchema = Type.Object({
  name: Type.String(),
  description: Type.Optional(Type.String()),
})
export type CreateServiceCategorySchemaType = Static<typeof CreateServiceCategorySchema>

export const getServiceCategoryByIdSchema = Type.Object({
  id: Type.Number(),
})
export type getServiceCategoryByIdType = Static<typeof getServiceCategoryByIdSchema>

export const PatchServiceCategorySchema = Type.Object({
  name: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
})
export type PatchServiceCategorySchemaType = Static<typeof PatchServiceCategorySchema>
