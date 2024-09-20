import { Static, Type } from '@sinclair/typebox'
import { CategoryIDSchema } from '../category/categorySchema.js'
import { storeID } from '../stores/storesSchema.js'

export const ProductIDSchema = Type.Number({ minimum: 0 })
export const ProductDescriptionSchema = Type.String()
export const ProductCostSchema = Type.Number({ minimum: 0 })
export const ProductCostCurrencySchema = Type.String()
const LocalProductIDSchema = Type.Number({ minimum: 0 })
const Message = Type.String()
export const ProductInventoryBalanceSchema = Type.Number({ minimum: 0 })

const ProductBaseSchema = Type.Object({
  storeID: Type.Optional(storeID),
  productItemNumber: Type.String(),
  cost: ProductCostSchema,
  productCategoryID: CategoryIDSchema,
  productDescription: ProductDescriptionSchema,
  productSupplierArticleNumber: Type.Optional(Type.String()),
  productExternalArticleNumber: Type.Optional(Type.String()),
  productUpdateRelatedData: Type.Optional(Type.Boolean()),
  award: Type.Number({ minimum: 0 }),
})

export const ProductReplyMessageSchema = Type.Object({ message: Message })

export const AddProductSchema = Type.Composite([
  Type.Object({
    type: Type.Union([Type.Literal('Local'), Type.Literal('Global')]),
    localProductID: Type.Optional(Type.Number()),
    productID: Type.Optional(Type.Number()),
    currency: ProductCostCurrencySchema,
    productInventoryBalance: Type.Optional(ProductInventoryBalanceSchema),
  }),
  ProductBaseSchema,
])

export const EditProductSchema = Type.Composite([
  Type.Object({
    type: Type.Union([Type.Literal('Local'), Type.Literal('Global')]),
    localProductID: Type.Optional(Type.Number()),
    productID: Type.Optional(Type.Number()),
    currency: ProductCostCurrencySchema,
  }),
  ProductBaseSchema,
])

export const ProductReplySchema = Type.Composite([
  Type.Object({
    message: Message,
    currency: ProductCostCurrencySchema,
    localProductID: Type.Optional(LocalProductIDSchema),
    productID: Type.Optional(ProductIDSchema),
  }),
  ProductBaseSchema,
])

export const DeleteProductReplySchema = Type.Object({
  message: Message,
  product: Type.Number(),
})

export const DeleteProductSchema = Type.Object({
  id: Type.Number(),
  type: Type.Union([Type.Literal('Local'), Type.Literal('Global')]),
})

export const GetProductSchema = Type.Object({
  storeID: storeID,
  productID: ProductIDSchema,
})

export const ListProductsQueryParamSchema = Type.Object({
  storeID: storeID,
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Integer({ minimum: 1, default: 10 })),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
})

export const ProductsPaginatedSchema = Type.Object({
  message: Message,
  totalItems: Type.Number(),
  nextUrl: Type.Optional(Type.String({ format: 'url' })),
  previousUrl: Type.Optional(Type.String({ format: 'url' })),
  totalPage: Type.Number({ minimum: 0 }),
  page: Type.Number({ minimum: 0 }),
  limit: Type.Number({ minimum: 0 }),
  products: Type.Array(
    Type.Composite([
      Type.Object({
        productID: ProductIDSchema,
        currency: ProductCostCurrencySchema,
      }),
      ProductBaseSchema,
    ]),
  ),
})

export const InventoryPatchSchema = Type.Object({
  productInventoryBalance: ProductInventoryBalanceSchema,
  storeID: storeID,
  productID: ProductIDSchema,
})

export type InventoryPatchSchemaType = Static<typeof InventoryPatchSchema>

export const InventoryPatchReplySchema = Type.Composite([
  ProductReplyMessageSchema,
  InventoryPatchSchema,
  Type.Object({
    createdAt: Type.Optional(Type.String({ format: 'date-time' })),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' })),
  }),
])

export type InventoryPatchReplySchemaType = Static<typeof InventoryPatchReplySchema>

export type ListProductsQueryParamSchemaType = Static<typeof ListProductsQueryParamSchema>
export type DeleteProductSchemaType = Static<typeof DeleteProductSchema>
export type GetProductSchemaType = Static<typeof GetProductSchema>
export type AddProductSchemaType = Static<typeof AddProductSchema>
export type EditProductSchemaType = Static<typeof EditProductSchema>
export type ProductReplySchemaType = Static<typeof ProductReplySchema>
export type ProductReplyMessageSchemaType = Static<typeof ProductReplyMessageSchema>
export type DeleteProductReplySchemaType = Static<typeof DeleteProductReplySchema>
export type ProductsPaginatedSchemaType = Static<typeof ProductsPaginatedSchema>
