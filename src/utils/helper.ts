import { AnyColumn, SQL, inArray, is, sql } from 'drizzle-orm'
import { OrderStatus, orderStatus } from '../schema/schema.js'
import { PgTimestampString, SelectedFields } from 'drizzle-orm/pg-core'
import { TObject, Type } from '@sinclair/typebox'
import { type SelectResultFields } from 'drizzle-orm/query-builders/select.types'
import { TypeCompiler } from '@sinclair/typebox/compiler'

/**
 * return if email is correct, is Valid email
 * */
export function isEmail(emailAddress: string) {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return emailAddress?.match(regex)
}

export const DriverID = Type.Integer({ minimum: 0 })
export const EmployeeID = Type.Integer({ minimum: 0 })
export const LocalQualID = Type.Integer({ minimum: 0 })
export const GlobalQualID = Type.Integer({ minimum: 0 })
export const UserID = Type.Integer({ minimum: 0 })
export const FirstName = Type.String({ minLength: 3, maxLength: 128 })
export const LastName = Type.String({ minLength: 3, maxLength: 128 })
export const OrderID = Type.Integer({ minimum: 0 })
export const userEmail = Type.String()
export const isSuperAdmin = Type.Boolean()
export const customerOrgNumber = Type.String({ maxLength: 11 })
export const driverExternalNumber = Type.String({ maxLength: 255 })
export const driverEmail = Type.String({ format: 'email' })
export const driverPhoneNumber = Type.String({
  pattern: '^([+]?[s0-9]+)?(d{3}|[(]?[0-9]+[)])?([-]?[s]?[0-9])+$',
})
export const companyReference = Type.String({ maxLength: 255 })
export const driverAddress = Type.String({ maxLength: 255 })
export const driverZipCode = Type.String({ maxLength: 16 })
export const driverAddressCity = Type.String({ maxLength: 255 })
export const driverCountry = Type.String({ maxLength: 255 })
export const driverHasCard = Type.Boolean()
export const driverCardNumber = Type.String({ maxLength: 255 })
export const driverCardValidTo = Type.String({ format: 'date' })
export const driverKeyNumber = Type.String({ maxLength: 255 })

export const customerCompanyName = Type.String({ maxLength: 255 })
export const companyEmail = Type.String({ format: 'email' })
export const companyPhone = Type.String({
  pattern: '^([+]?[s0-9]+)?(d{3}|[(]?[0-9]+[)])?([-]?[s]?[0-9])+$',
})
export const companyAddress = Type.String({ maxLength: 255 })
export const companyZipCode = Type.String({ maxLength: 16 })
export const companyAddressCity = Type.String({ maxLength: 255 })
export const companyCountry = Type.String({ maxLength: 255 })
export const driverGDPRAccept = Type.Boolean()
export const driverISWarrantyDriver = Type.Boolean()
export const driverAcceptsMarketing = Type.Boolean()
export const driverFirstName = Type.String({ maxLength: 128 })
export const driverLastName = Type.String({ maxLength: 128 })
export const driverNotesShared = Type.String()
export const driverNotes = Type.String()

export const DriverBodySchema = Type.Object({
  customerOrgNumber: Type.Optional(customerOrgNumber),
  driverExternalNumber: Type.Optional(driverExternalNumber),
  driverGDPRAccept: driverGDPRAccept,
  driverISWarrantyDriver: driverISWarrantyDriver,
  driverAcceptsMarketing: driverAcceptsMarketing,
  driverFirstName: driverFirstName,
  driverLastName: driverLastName,
  driverEmail: driverEmail,
  driverPhoneNumber: driverPhoneNumber,
  driverAddress: driverAddress,
  driverZipCode: driverZipCode,
  driverAddressCity: driverAddressCity,
  driverCountry: driverCountry,
  driverHasCard: driverHasCard,
  driverCardNumber: Type.Optional(driverCardNumber),
  driverCardValidTo: Type.Optional(driverCardValidTo),
  driverKeyNumber: Type.Optional(driverKeyNumber),
  driverNotesShared: Type.Optional(driverNotesShared),
  driverNotes: driverNotes,
})

export function isOrderStatus(status: string): status is OrderStatus {
  return orderStatus.includes(status as OrderStatus)
}

export function jsonBuildObject<T extends SelectedFields>(shape: T): SQL<SelectResultFields<T>> {
  const chunks: SQL[] = Object.entries(shape).flatMap(([key, value], index) => {
    const keyValueChunk = [
      sql.raw(`'${key}',`),
      is(value, PgTimestampString) ? sql`timezone('UTC', ${value})` : sql`${value}`,
    ]
    return index > 0 ? [sql.raw(','), ...keyValueChunk] : keyValueChunk
  })

  return sql`coalesce(json_build_object(${sql.join(chunks)}), '{}')`
}

export function jsonAggBuildObject<T extends SelectedFields, Column extends AnyColumn>(
  shape: T,
  options?: { orderBy?: { colName: Column; direction: 'ASC' | 'DESC' } },
) {
  return sql<SelectResultFields<T>[]>`coalesce(
    json_agg(${jsonBuildObject(shape)}
    ${
      options?.orderBy
        ? sql`ORDER BY ${options.orderBy.colName} ${sql.raw(options.orderBy.direction)}`
        : sql``
    })
    FILTER (WHERE ${sql.join(
      Object.values(shape).map((value) => sql`${value} IS NOT NULL`),
      sql` OR `,
    )})
    ,'${sql`[]`}')`
}

export function jsonAggBuildObjectOrEmptyArray<T extends SelectedFields, Table>(
  table: Table,
  shape: T,
): SQL<SelectResultFields<T>[]> {
  return sql`
    CASE
      WHEN COUNT(${table}) = 0 THEN '[]'::jsonb
      ELSE jsonb_agg(${jsonBuildObject(shape)})
    END
  `
}

export function inJsonArray<T extends SQL.Aliased<unknown[]>>(
  jsonArray: T,
  key: keyof T['_']['type'][number],
  values: string[],
) {
  const element = sql.raw(`${String(key)}_array_element`)

  return sql`EXISTS (
		SELECT 1
		FROM jsonb_array_elements(${jsonArray}) AS ${element}
		WHERE ${inArray(sql`${element}->>${key}`, values)}
	  )`
}
export interface ValidatorFactoryReturn<T> {
  schema: TObject
  verify: (data: T) => T
}

export const validatorFactory = <T extends TObject>(schema: TObject): ValidatorFactoryReturn<T> => {
  const C = TypeCompiler.Compile(schema)

  const verify = (data: T): T => {
    const isValid = C.Check(data)
    if (isValid) {
      return data
    }
    throw new Error(
      JSON.stringify([...C.Errors(data)].map(({ path, message }) => ({ path, message }))),
    )
  }

  return { schema, verify }
}

export function timeStringToMS(time: string | undefined): number | undefined {
  if (time == undefined) {
    return undefined
  }
  const parts = time.split(':')
  if (parts[0].length != 2 && parts[1].length != 2 && parts[2].length != 2) {
    return undefined
  } else {
    const hours = Number(parts[0])
    const mins = Number(parts[1])
    const secs = Number(parts[2])
    if (0 <= hours && hours <= 24 && 0 <= mins && mins <= 60 && 0 <= secs && secs <= 60)
      return hours * 3600000 + mins * 60000 + secs * 1000
  }
  return undefined
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export type PositiveInteger<T extends number> = `${T}` extends '0' | `-${any}` | `${any}.${any}`
  ? never
  : T

export const CreatedAndUpdatedAT = Type.Object({
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
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
  console.log('error: ', e)
  if (e instanceof Error && e.message.startsWith('duplicate key')) {
    return (
      'Please provide a unqiue and existing value for: ' +
      e.message.split(' ').splice(-1)[0].split('_')[1]
    )
  }
  if (e instanceof Error && e.message.includes('violates foreign key constraint')) {
    return (
      'Please provide a unqiue and existing value for: ' +
      e.message.split(' ').splice(-1)[0].split('_')[3]
    )
  }
  return 'error'
}

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
