import { Static, Type } from '@sinclair/typebox'
import { CategoryIDSchema } from '../category/categorySchema.js'
import { storeID } from '../stores/storesSchema.js'

export const ProductIDSchema = Type.Number({ minimum: 0 })
export const ProductDescriptionSchema = Type.String()
export const ProductCostSchema = Type.Number({ minimum: 0 })
export const ProductCostCurrencySchema = Type.String()
const LocalProductIDSchema = Type.Number({ minimum: 0 })
const Message = Type.String()

const ProductBaseSchema = Type.Object({
  storeID: Type.Optional(storeID),
  productItemNumber: Type.String(),
  cost: ProductCostSchema,
  productCategoryID: CategoryIDSchema,
  productDescription: Type.Optional(ProductDescriptionSchema),
  productSupplierArticleNumber: Type.Optional(Type.String()),
  productExternalArticleNumber: Type.Optional(Type.String()),
  productUpdateRelatedData: Type.Optional(Type.Boolean()),
  award: Type.Number({ minimum: 0 }),
  productInventoryBalance: Type.Optional(Type.Number({ minimum: 1 })),
})

export const ProductReplyMessageSchema = Type.Object({ message: Message })

export const AddProductSchema = Type.Composite([
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

export const DeleteLocalProduct = Type.Object({
  localProductID: LocalProductIDSchema,
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
  localProducts: Type.Array(
    Type.Composite([
      Type.Object({
        localProductID: LocalProductIDSchema,
        currency: ProductCostCurrencySchema,
      }),
      ProductBaseSchema,
    ]),
  ),
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

export type ListProductsQueryParamSchemaType = Static<typeof ListProductsQueryParamSchema>
export type DeleteProductSchemaType = Static<typeof DeleteProductSchema>
export type AddProductSchemaType = Static<typeof AddProductSchema>
export type ProductReplySchemaType = Static<typeof ProductReplySchema>
export type ProductReplyMessageSchemaType = Static<typeof ProductReplyMessageSchema>
export type DeleteProductReplySchemaType = Static<typeof DeleteProductReplySchema>
export type ProductsPaginatedSchemaType = Static<typeof ProductsPaginatedSchema>
