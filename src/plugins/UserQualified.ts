import fp from 'fastify-plugin'

import { Brand, make } from 'ts-brand'

import {
  EmployeeID,
  GlobalQualID,
  LocalQualID,
  employeeGlobalQualifications,
  employeeLocalQualifications,
} from '../schema/schema.js'
import { db } from '../config/db-connect.js'

import { count, eq } from 'drizzle-orm'

export type UserQualified = Brand<boolean, 'userQualified'>
export const UserQualified = make<UserQualified>()

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp(async (fastify) => {
  fastify.decorate(
    'checkUserQualification',
    async function (
      employeeID: EmployeeID,
      localQualID?: LocalQualID,
      globalQualID?: GlobalQualID,
    ): Promise<UserQualified> {
      return db.transaction(async (tx) => {
        if (localQualID) {
          const [numLocalQuals] = await tx
            .select({ count: count() })
            .from(employeeLocalQualifications)
            .where(eq(employeeLocalQualifications.employeeID, employeeID))
          return UserQualified(numLocalQuals.count > 0)
        }
        if (globalQualID) {
          const [numGlobalQuals] = await tx
            .select({ count: count() })
            .from(employeeGlobalQualifications)
            .where(eq(employeeGlobalQualifications.employeeID, employeeID))
          return UserQualified(numGlobalQuals.count > 0)
        }
        return UserQualified(false)
      })
    },
  )
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    checkUserQualification(
      employeeID: EmployeeID,
      localQualID: LocalQualID,
      globalQualID: GlobalQualID,
    ): Promise<UserQualified>
  }
}
