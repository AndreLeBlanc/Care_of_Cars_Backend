import { Static, Type } from '@sinclair/typebox'

export const addProductBody = Type.Object({
  productCategoryID: Type.Number(),
  productItemNumber: Type.String(),
  productAward: Type.Number({ minimum: 1 }),
  productCost: Type.Number({ minimum: 1 }),
  productDescription: Type.Optional(Type.String()),
  productExternalArticleNumber: Type.Optional(Type.String()),
  productInventoryBalance: Type.Number({ minimum: 1 }),
  productSupplierArticleNumber: Type.Optional(Type.String()),
  productUpdateRelatedData: Type.Optional(Type.Boolean()),
})

export const deleteProduct = Type.Object({
  itemCodeNumber: Type.String(),
})

export const ListProductsQueryParamSchema = Type.Object({
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Integer({ minimum: 1, default: 10 })),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
})
export type ListProductsQueryParamSchemaType = Static<typeof ListProductsQueryParamSchema>
export type deleteProductType = Static<typeof deleteProduct>
export type AddProductType = Static<typeof addProductBody>
