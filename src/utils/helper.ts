import { Type } from '@sinclair/typebox'
/**
 * return if email is correct, is Valid email
 * */
export function isEmail(emailAddress: string) {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return emailAddress?.match(regex)
}

//@ts-ignore
export type PositiveInteger<T extends number> = `${T}` extends '0' | `-${any}` | `${any}.${any}`
  ? never
  : T

export const CreatedAndUpdatedAT = Type.Object({
  createdAt: Type.String({ format: 'date' }),
  updatedAt: Type.String({ format: 'date' }),
})

export interface Left<E> {
  readonly _tag: 'Left'
  readonly left: E
}

/**
 * @category model
 * @since 2.0.0
 */
export interface Right<A> {
  readonly _tag: 'Right'
  readonly right: A
}

export function errorHandling(e: unknown): string {
  if (e instanceof Error && e.message.startsWith('duplicate key')) {
    return ''
  }
  return 'error'
}

/**
 * @category model
 * @since 2.0.0
 */
export type Either<E, A> = Left<E> | Right<A>

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
 * structure.
 *
 * @category constructors
 * @since 2.0.0
 */

export const left = <E = never, A = never>(e: E): Either<E, A> => ({
  _tag: 'Left',
  left: e,
})

/**
 * Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
 * of this structure.
 *
 * @category constructors
 * @since 2.0.0
 */

export const right = <E = never, A = never>(a: A): Either<E, A> => ({
  _tag: 'Right',
  right: a,
})

/**
 * Returns `true` if the either is an instance of `Left`, `false` otherwise.
 *
 * @category refinements
 * @since 2.0.0
 */

export const isLeft = <E>(ma: Either<E, unknown>): ma is Left<E> => {
  return ma._tag === 'Left'
}

/**
 * Returns `true` if the either is an instance of `Right`, `false` otherwise.
 *
 * @category refinements
 * @since 2.0.0
 */

export const isRight = <A>(ma: Either<unknown, A>): ma is Right<A> => {
  return ma._tag === 'Right'
}
export const match = <E, A, B, C>(
  ma: Either<E, A>,
  onRight: (a: A) => B,
  onLeft: (e: E) => C,
): B | C => {
  if (isLeft(ma)) {
    return onLeft(ma.left)
  } else {
    return onRight(ma.right)
  }
}
