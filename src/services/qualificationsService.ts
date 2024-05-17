import { Brand, make } from 'ts-brand'

import { PositiveInteger } from '../utils/helper.js'

import {
  qualificationsGlobal,
  qualificationsLocal,
  userGlobalQualifications,
  userLocalQualifications,
} from '../schema/schema.js'

import { Search } from '../plugins/pagination.js'

import { db } from '../config/db-connect.js'

import { and, eq, ilike } from 'drizzle-orm'

import { StoreID } from './storeService.js'
import { UserID } from './userService.js'

export type LocalQualID = Brand<PositiveInteger<number>, 'localQualID'>
export const LocalQualID = make<LocalQualID>()
export type LocalQualName = Brand<string, 'localQualName'>
export const LocalQualName = make<LocalQualName>()
export type CreatedAt = Brand<Date, 'createdAt'>
export const CreatedAt = make<CreatedAt>()
export type UpdatedAt = Brand<Date, 'updatedAt'>
export const UpdatedAt = make<UpdatedAt>()
export type GlobalQualID = Brand<PositiveInteger<number>, 'globalQualID'>
export const GlobalQualID = make<GlobalQualID>()
export type GlobalQualName = Brand<string, 'globalQualName'>
export const GlobalQualName = make<GlobalQualName>()

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
): Promise<QualificationsLocal | undefined> {
  const [qual] = localQualID
    ? await db
        .update(qualificationsLocal)
        .set(localQual)
        .where(eq(qualificationsLocal.localQualID, localQualID))
        .returning()
    : await db.insert(qualificationsLocal).values(localQual).returning()
  return qual
    ? {
        qual: {
          storeID: StoreID(qual.storeID),
          localQualID: LocalQualID(qual.localQualID),
          localQualName: LocalQualName(qual.localQualName),
        },
        dates: {
          createdAt: CreatedAt(qual.createdAt),
          updatedAt: UpdatedAt(qual.updatedAt),
        },
      }
    : undefined
}

export async function updateGlobalQuals(
  globalQual: CreateQualificationsGlobal,
  globalQualID?: GlobalQualID,
): Promise<QualificationsGlobal | undefined> {
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
    ? {
        qual: {
          globalQualID: GlobalQualID(qual.globalQualID),
          globalQualName: GlobalQualName(qual.globalQualName),
        },
        dates: { createdAt: CreatedAt(qual.createdAt), updatedAt: UpdatedAt(qual.updatedAt) },
      }
    : undefined
}

export async function getLocalQual(
  localQual: LocalQualID,
): Promise<QualificationsLocal | undefined> {
  const [qual] = await db
    .select()
    .from(qualificationsLocal)
    .where(eq(qualificationsLocal.localQualID, localQual))
  return qual
    ? {
        qual: {
          storeID: StoreID(qual.storeID),
          localQualID: LocalQualID(qual.localQualID),
          localQualName: LocalQualName(qual.localQualName),
        },
        dates: { createdAt: CreatedAt(qual.createdAt), updatedAt: UpdatedAt(qual.updatedAt) },
      }
    : undefined
}

export async function getGlobalQual(
  globalQual: GlobalQualID,
): Promise<QualificationsGlobal | undefined> {
  const [qual] = await db
    .select()
    .from(qualificationsGlobal)
    .where(eq(qualificationsGlobal.globalQualID, globalQual))
  return qual
    ? {
        qual: {
          globalQualID: GlobalQualID(qual.globalQualID),
          globalQualName: GlobalQualName(qual.globalQualName),
        },
        dates: { createdAt: CreatedAt(qual.createdAt), updatedAt: UpdatedAt(qual.updatedAt) },
      }
    : undefined
}

export async function deleteLocalQuals(
  localQual: LocalQualID,
): Promise<QualificationsLocal | undefined> {
  const [qual] = await db
    .delete(qualificationsLocal)
    .where(eq(qualificationsLocal.localQualID, localQual))
    .returning()
  return qual
    ? {
        qual: {
          storeID: StoreID(qual.storeID),
          localQualID: LocalQualID(qual.localQualID),
          localQualName: LocalQualName(qual.localQualName),
        },
        dates: { createdAt: CreatedAt(qual.createdAt), updatedAt: UpdatedAt(qual.updatedAt) },
      }
    : undefined
}

export async function deleteGlobalQuals(
  globalQual: GlobalQualID,
): Promise<QualificationsGlobal | undefined> {
  const [qual] = await db
    .delete(qualificationsGlobal)
    .where(eq(qualificationsGlobal.globalQualID, globalQual))
    .returning()
  return qual
    ? {
        qual: {
          globalQualID: GlobalQualID(qual.globalQualID),
          globalQualName: GlobalQualName(qual.globalQualName),
        },
        dates: { createdAt: CreatedAt(qual.createdAt), updatedAt: UpdatedAt(qual.updatedAt) },
      }
    : undefined
}

export async function getQualifcations(
  search: Search,
  storeID?: StoreID,
  userID?: UserID,
): Promise<QualificationsListed> {
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
              eq(userGlobalQualifications.userID, 1),
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

  const brandedLocalQuals: UserQualificationsLocal[] = quals.localQualList.map((localQuals) => {
    return {
      storeID: StoreID(localQuals.storeID),
      localQualID: LocalQualID(localQuals.localQualID),
      localQualName: LocalQualName(localQuals.localQualName),
    }
  })

  const brandedGlobalQuals: UserQualificationsGlobal[] = quals.globalQualList.map((globalQuals) => {
    return {
      globalQualID: GlobalQualID(globalQuals.globalQualID),
      globalQualName: GlobalQualName(globalQuals.globalQualName),
    }
  })

  return {
    totalLocalQuals: quals.totalLocalQuals,
    totalGlobalQuals: quals.totalGlobalQuals,
    localQuals: brandedLocalQuals,
    globalQuals: brandedGlobalQuals,
  }
}

export async function setUserLocalQualification(
  userID: UserID,
  localQualID: LocalQualID,
): Promise<UserLocalQualifications | undefined> {
  const [insertLocalQual] = await db
    .insert(userLocalQualifications)
    .values({ userID: userID, localQualID: localQualID })
    .returning()
  return insertLocalQual
    ? {
        userID: UserID(insertLocalQual.userID),
        localQualID: LocalQualID(insertLocalQual.localQualID),
      }
    : undefined
}

export async function setUserGlobalQualification(
  userID: UserID,
  globalQualID: GlobalQualID,
): Promise<UserGlobalQualifications | undefined> {
  const [insertGlobalQual] = await db
    .insert(userGlobalQualifications)
    .values({ userID: userID, globalQualID: globalQualID })
    .returning()
  return insertGlobalQual
    ? {
        userID: UserID(insertGlobalQual.userID),
        globalQualID: LocalQualID(insertGlobalQual.globalQualID),
      }
    : undefined
}

export async function deleteUserLocalQualification(
  userID: UserID,
  localQualID: LocalQualID,
): Promise<UserLocalQualifications | undefined> {
  const [insertLocalQual] = await db
    .delete(userLocalQualifications)
    .where(
      and(
        eq(userLocalQualifications.userID, userID),
        eq(userLocalQualifications.localQualID, localQualID),
      ),
    )
    .returning()
  return insertLocalQual
    ? {
        userID: UserID(insertLocalQual.userID),
        localQualID: LocalQualID(insertLocalQual.localQualID),
      }
    : undefined
}

export async function deleteUserGlobalQualification(
  userID: UserID,
  globalQualID: GlobalQualID,
): Promise<UserGlobalQualifications | undefined> {
  const [insertGlobalQual] = await db
    .delete(userGlobalQualifications)
    .where(
      and(
        eq(userGlobalQualifications.userID, userID),
        eq(userGlobalQualifications.globalQualID, globalQualID),
      ),
    )
    .returning()
  return insertGlobalQual
    ? {
        userID: UserID(insertGlobalQual.userID),
        globalQualID: LocalQualID(insertGlobalQual.globalQualID),
      }
    : undefined
}

export async function getUserQualifications(
  userID: UserID,
): Promise<{ localQuals: UserQualificationsLocal[]; globalQuals: UserQualificationsGlobal[] }> {
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

  const brandedLocalQuals: UserQualificationsLocal[] = quals.localQualsList.map((localQuals) => {
    return {
      storeID: StoreID(localQuals.storeID),
      localQualID: LocalQualID(localQuals.localQualID),
      localQualName: LocalQualName(localQuals.localQualName),
    }
  })

  const brandedGlobalQuals: UserQualificationsGlobal[] = quals.globalQualsList.map(
    (globalQuals) => {
      return {
        globalQualID: GlobalQualID(globalQuals.globalQualID),
        globalQualName: GlobalQualName(globalQuals.globalQualName),
      }
    },
  )
  return {
    localQuals: brandedLocalQuals,
    globalQuals: brandedGlobalQuals,
  }
}
