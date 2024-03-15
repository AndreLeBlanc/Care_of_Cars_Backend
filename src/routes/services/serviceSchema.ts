import { Static, Type } from '@sinclair/typebox'

export const CreateServiceVariantsSchema = Type.Object({
  description: Type.String(),
  award: Type.Number({ minimum: 0.01 }),
  cost: Type.Number({ minimum: 0.01 }),
  day1: Type.Optional(Type.String()),
  day2: Type.Optional(Type.String()),
  day3: Type.Optional(Type.String()),
  day4: Type.Optional(Type.String()),
  day5: Type.Optional(Type.String()),
})
export type CreateServiceVariantsSchemaType = Static<typeof CreateServiceVariantsSchema>

enum colorOnDutyEnum {
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
const colorOnDutyEnumType = Type.Enum(colorOnDutyEnum)
export const CreateServiceSchema = Type.Object({
  description: Type.String(),
  serviceCategoryId: Type.Integer(),
  includeInAutomaticSms: Type.Optional(Type.Boolean()),
  hidden: Type.Optional(Type.Boolean()),
  callInterval: Type.Optional(Type.Integer({ minimum: 1, maximum: 12 })),
  colorOnDuty: Type.Optional(colorOnDutyEnumType),
  warantyCard: Type.Optional(Type.Boolean()),
  itermNumber: Type.Optional(Type.String()),
  suppliersArticleNumber: Type.Optional(Type.String()),
  externalArticleNumber: Type.Optional(Type.String()),
  serviceVariants: Type.Optional(Type.Array(CreateServiceVariantsSchema)),
})

export type CreateServiceSchemaType = Static<typeof CreateServiceSchema>
