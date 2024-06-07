import {
  CreatedAt,
  GlobalQualID,
  GlobalQualName,
  LocalQualID,
  LocalQualName,
  StoreID,
  UpdatedAt,
  UserID,
  qualificationsGlobal,
  qualificationsLocal,
  userGlobalQualifications,
  userLocalQualifications,
} from '../schema/schema.js'

import { Search } from '../plugins/pagination.js'

import { db } from '../config/db-connect.js'

import { and, eq, ilike } from 'drizzle-orm'

import { Either, errorHandling, left, right } from '../utils/helper.js'

export type CreateQualificationsLocal = {
  storeID: StoreID
  localQualName: LocalQualName
}

export type CreateQualificationsGlobal = {
  globalQualName: GlobalQualName
}

export type QualificationsGlobal = {
  qual: { globalQualID: GlobalQualID; globalQualName: GlobalQualName }
  dates: {
    createdAt: CreatedAt
    updatedAt: UpdatedAt
  }
}

export type QualificationsLocal = {
  qual: {
    storeID: StoreID
    localQualID: LocalQualID
    localQualName: LocalQualName
  }
  dates: {
    createdAt: CreatedAt
    updatedAt: UpdatedAt
  }
}

export type UserQualificationsGlobal = {
  globalQualID: GlobalQualID
  globalQualName: GlobalQualName
}

export type UserQualificationsLocal = {
  storeID: StoreID
  localQualID: LocalQualID
  localQualName: LocalQualName
}

export type QualificationsListed = {
  totalLocalQuals: number
  totalGlobalQuals: number
  localQuals: UserQualificationsLocal[]
  globalQuals: UserQualificationsGlobal[]
}

export type UserLocalQualifications = {
  userID: UserID
  localQualID: LocalQualID
}

export type UserGlobalQualifications = {
  userID: UserID
  globalQualID: LocalQualID
}

export async function updateLocalQuals(
  localQual: CreateQualificationsLocal,
  localQualID?: LocalQualID,
): Promise<Either<string, QualificationsLocal>> {
  try {
    const [qual] = localQualID
      ? await db
          .update(qualificationsLocal)
          .set(localQual)
          .where(eq(qualificationsLocal.localQualID, localQualID))
          .returning()
      : await db.insert(qualificationsLocal).values(localQual).returning()

    if (qual != null) {
      return right({
        qual: {
          storeID: qual.storeID,
          localQualID: qual.localQualID,
          localQualName: qual.localQualName,
        },
        dates: {
          createdAt: CreatedAt(qual.createdAt),
          updatedAt: UpdatedAt(qual.updatedAt),
        },
      })
    }
  } catch (e) {
    return left(errorHandling(e))
  }
  return left("couldn't update local quals")
}

export async function updateGlobalQuals(
  globalQual: CreateQualificationsGlobal,
  globalQualID?: GlobalQualID,
): Promise<Either<string, QualificationsGlobal>> {
  try {
    const [qual] = globalQualID
      ? await db
          .update(qualificationsGlobal)
          .set(globalQual)
          .where(eq(qualificationsGlobal.globalQualID, globalQualID))
          .returning()
      : await db
          .insert(qualificationsGlobal)
          .values(globalQual)
          .onConflictDoUpdate({
            target: [qualificationsGlobal.globalQualName],
            set: globalQual,
          })
          .returning()
    return qual
      ? right({
          qual: {
            globalQualID: qual.globalQualID,
            globalQualName: qual.globalQualName,
          },
          dates: { createdAt: CreatedAt(qual.createdAt), updatedAt: UpdatedAt(qual.updatedAt) },
        })
      : left('Database failiure')
  } catch (e: unknown) {
    return left(errorHandling(e))
  }
}

export async function getLocalQual(
  localQual: LocalQualID,
): Promise<Either<string, QualificationsLocal>> {
  try {
    const [qual] = await db
      .select()
      .from(qualificationsLocal)
      .where(eq(qualificationsLocal.localQualID, localQual))
    return qual
      ? right({
          qual: {
            storeID: qual.storeID,
            localQualID: qual.localQualID,
            localQualName: qual.localQualName,
          },
          dates: { createdAt: CreatedAt(qual.createdAt), updatedAt: UpdatedAt(qual.updatedAt) },
        })
      : left("couldn't get local qual")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getGlobalQual(
  globalQual: GlobalQualID,
): Promise<Either<string, QualificationsGlobal>> {
  try {
    const [qual] = await db
      .select()
      .from(qualificationsGlobal)
      .where(eq(qualificationsGlobal.globalQualID, globalQual))
    return qual
      ? right({
          qual: {
            globalQualID: qual.globalQualID,
            globalQualName: qual.globalQualName,
          },
          dates: { createdAt: CreatedAt(qual.createdAt), updatedAt: UpdatedAt(qual.updatedAt) },
        })
      : left('no results found')
  } catch (e) {
    return left(errorHandling(e))
  }
}
export async function deleteLocalQuals(
  localQual: LocalQualID,
): Promise<Either<string, QualificationsLocal>> {
  try {
    const [qual] = await db
      .delete(qualificationsLocal)
      .where(eq(qualificationsLocal.localQualID, localQual))
      .returning()
    return qual
      ? right({
          qual: {
            storeID: qual.storeID,
            localQualID: qual.localQualID,
            localQualName: qual.localQualName,
          },
          dates: { createdAt: CreatedAt(qual.createdAt), updatedAt: UpdatedAt(qual.updatedAt) },
        })
      : left('Qualification not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteGlobalQuals(
  globalQual: GlobalQualID,
): Promise<Either<string, QualificationsGlobal>> {
  try {
    const [qual] = await db
      .delete(qualificationsGlobal)
      .where(eq(qualificationsGlobal.globalQualID, globalQual))
      .returning()
    return qual
      ? right({
          qual: {
            globalQualID: qual.globalQualID,
            globalQualName: qual.globalQualName,
          },
          dates: { createdAt: CreatedAt(qual.createdAt), updatedAt: UpdatedAt(qual.updatedAt) },
        })
      : left("Can't find qualification")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getQualifcations(
  search: Search,
  storeID?: StoreID,
  userID?: UserID,
): Promise<Either<string, QualificationsListed>> {
  try {
    const quals = await db.transaction(async (tx) => {
      const globalQualsList = userID
        ? await tx
            .select({
              globalQualID: qualificationsGlobal.globalQualID,
              globalQualName: qualificationsGlobal.globalQualName,
            })
            .from(qualificationsGlobal)
            .innerJoin(
              userGlobalQualifications,
              eq(userGlobalQualifications.globalQualID, qualificationsGlobal.globalQualID),
            )
            .where(
              and(
                ilike(qualificationsGlobal.globalQualName, '%' + search + '%'),
                eq(userGlobalQualifications.userID, userID),
              ),
            )
        : await tx
            .select()
            .from(qualificationsGlobal)
            .where(and(ilike(qualificationsGlobal.globalQualName, '%' + search + '%')))

      if (storeID != null) {
        const localQualList = userID
          ? await tx
              .select({
                localQualID: qualificationsLocal.localQualID,
                localQualName: qualificationsLocal.localQualName,
                storeID: qualificationsLocal.storeID,
              })
              .from(qualificationsLocal)
              .innerJoin(
                userLocalQualifications,
                eq(userLocalQualifications.localQualID, qualificationsLocal.localQualID),
              )
              .where(
                and(
                  ilike(qualificationsLocal.localQualName, '%' + search + '%'),
                  eq(qualificationsLocal.storeID, storeID),
                ),
              )
          : await tx
              .select({
                localQualID: qualificationsLocal.localQualID,
                localQualName: qualificationsLocal.localQualName,
                storeID: qualificationsLocal.storeID,
              })
              .from(qualificationsLocal)
              .where(
                and(
                  ilike(qualificationsLocal.localQualName, '%' + search + '%'),
                  eq(qualificationsLocal.storeID, storeID),
                ),
              )

        return {
          totalLocalQuals: localQualList.length,
          localQualList: localQualList,
          totalGlobalQuals: globalQualsList.length,
          globalQualList: globalQualsList,
        }
      }
      return {
        totalLocalQuals: 0,
        localQualList: [],
        totalGlobalQuals: globalQualsList.length,
        globalQualList: globalQualsList,
      }
    })

    return right({
      totalLocalQuals: quals.totalLocalQuals,
      totalGlobalQuals: quals.totalGlobalQuals,
      localQuals: quals.localQualList,
      globalQuals: quals.globalQualList,
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function setUserLocalQualification(
  userID: UserID,
  localQualID: LocalQualID,
): Promise<Either<string, UserLocalQualifications>> {
  try {
    const [insertLocalQual] = await db
      .insert(userLocalQualifications)
      .values({ userID: userID, localQualID: localQualID })
      .returning()
    return right(insertLocalQual)
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function setUserGlobalQualification(
  userID: UserID,
  globalQualID: GlobalQualID,
): Promise<Either<string, UserGlobalQualifications>> {
  try {
    const [insertGlobalQual] = await db
      .insert(userGlobalQualifications)
      .values({ userID: userID, globalQualID: globalQualID })
      .returning({ globalQualID: userGlobalQualifications.globalQualID })
    return insertGlobalQual
      ? right({
          userID: userID,
          globalQualID: LocalQualID(insertGlobalQual.globalQualID),
        })
      : left('qualification not created')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteUserLocalQualification(
  userID: UserID,
  localQualID: LocalQualID,
): Promise<Either<string, UserLocalQualifications>> {
  try {
    const [insertLocalQual] = await db
      .delete(userLocalQualifications)
      .where(
        and(
          eq(userLocalQualifications.userID, userID),
          eq(userLocalQualifications.localQualID, localQualID),
        ),
      )
      .returning({ localQualID: userLocalQualifications.localQualID })
    return insertLocalQual
      ? right({
          userID: userID,
          localQualID: LocalQualID(insertLocalQual.localQualID),
        })
      : left('Qualification not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteUserGlobalQualification(
  userID: UserID,
  globalQualID: GlobalQualID,
): Promise<Either<string, UserGlobalQualifications>> {
  try {
    const [insertGlobalQual] = await db
      .delete(userGlobalQualifications)
      .where(
        and(
          eq(userGlobalQualifications.userID, userID),
          eq(userGlobalQualifications.globalQualID, globalQualID),
        ),
      )
      .returning({ globalQualID: userGlobalQualifications.globalQualID })
    return insertGlobalQual
      ? right({
          userID: userID,
          globalQualID: LocalQualID(insertGlobalQual.globalQualID),
        })
      : left('user or qualification not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getUserQualifications(
  userID: UserID,
): Promise<
  Either<string, { localQuals: UserQualificationsLocal[]; globalQuals: UserQualificationsGlobal[] }>
> {
  try {
    const quals = await db.transaction(async (tx) => {
      const localQualsList = await tx
        .select({
          storeID: qualificationsLocal.storeID,
          localQualID: qualificationsLocal.localQualID,
          localQualName: qualificationsLocal.localQualName,
        })
        .from(userLocalQualifications)
        .rightJoin(
          qualificationsLocal,
          eq(userLocalQualifications.localQualID, qualificationsLocal.localQualID),
        )
        .where(eq(userLocalQualifications.userID, userID))

      const globalQualsList = await tx
        .select({
          globalQualID: qualificationsGlobal.globalQualID,
          globalQualName: qualificationsGlobal.globalQualName,
        })
        .from(userGlobalQualifications)
        .rightJoin(
          qualificationsGlobal,
          eq(userGlobalQualifications.globalQualID, qualificationsLocal.localQualID),
        )
        .where(eq(userGlobalQualifications.userID, userID))
      return { localQualsList, globalQualsList }
    })

    return right({
      localQuals: quals.localQualsList,
      globalQuals: quals.globalQualsList,
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}
