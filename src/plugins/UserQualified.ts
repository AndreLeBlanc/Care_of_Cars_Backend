import fp from 'fastify-plugin'

import { Brand, make } from 'ts-brand'

import { GlobalQualID, LocalQualID } from '../services/qualificationsService.js'
import { UserID } from '../services/userService.js'

import { userGlobalQualifications, userLocalQualifications } from '../schema/schema.js'
import { db } from '../config/db-connect.js'

import { count, eq } from 'drizzle-orm'

export type UserQualified = Brand<boolean, 'userQualified'>
export const UserQualified = make<UserQualified>()

export interface SupportPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify) => {
  fastify.decorate(
    'checkUserQualification',
    async function (
      userID: UserID,
      localQualID?: LocalQualID,
      globalQualID?: GlobalQualID,
    ): Promise<UserQualified> {
      return db.transaction(async (tx) => {
        if (localQualID) {
          const [numLocalQuals] = await tx
            .select({ count: count() })
            .from(userLocalQualifications)
            .where(eq(userLocalQualifications.userID, userID))
          return UserQualified(numLocalQuals.count > 0)
        }
        if (globalQualID) {
          const [numGlobalQuals] = await tx
            .select({ count: count() })
            .from(userGlobalQualifications)
            .where(eq(userGlobalQualifications.userID, userID))
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
      userID: UserID,
      localQualID: LocalQualID,
      globalQualID: GlobalQualID,
    ): Promise<UserQualified>
  }
}
