import { Type } from '@sinclair/typebox'
/**
 * return if email is correct, is Valid email
 * */
export function isEmail(emailAddress: string) {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return emailAddress?.match(regex)
}

export type PositiveInteger<T extends number> = `${T}` extends '0' | `-${any}` | `${any}.${any}`
  ? never
  : T

export const CreatedAndUpdatedAT = Type.Object({
  createdAt: Type.String({ format: 'date' }),
  updatedAt: Type.String({ format: 'date' }),
})
