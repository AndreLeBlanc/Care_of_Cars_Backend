import { Brand, make } from 'ts-brand'

import { PositiveInteger } from '../utils/helper.js'

import {
  qualificationsGlobal,
  qualificationsLocal,
  userGlobalQualifications,
  userLocalQualifications,
} from '../schema/schema.js'

import { Limit, Offset, Page, Search } from '../plugins/pagination.js'

import { db } from '../config/db-connect.js'

import { and, eq, ilike, sql } from 'drizzle-orm'

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

export type QualificationsPaginated = {
  totalLocalQuals: number
  totalGlobalQuals: number
  totalLocalPage: number
  totalGlobalPage: number
  perPage: number
  localQuals: QualificationsLocal[]
  globalQuals: QualificationsGlobal[]
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
): Promise<QualificationsLocal | undefined> {
  const [qual] = await db
    .insert(qualificationsLocal)
    .values(localQual)
    .onConflictDoUpdate({
      target: [qualificationsLocal.storeID, qualificationsLocal.localQualName],
      set: localQual,
    })
    .returning()
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
): Promise<QualificationsGlobal | undefined> {
  const [qual] = await db
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

export async function getQualifcationsPaginate(
  search: Search,
  limit = Limit(10),
  page = Page(1),
  offset = Offset(0),
  storeID?: StoreID,
): Promise<QualificationsPaginated> {
  const quals = await db.transaction(async (tx) => {
    const [totalGlobalQuals] = await tx
      .select({
        count: sql`count(*)`.mapWith(Number).as('count'),
      })
      .from(qualificationsGlobal)
      .where(and(ilike(qualificationsGlobal.globalQualName, '%' + search + '%')))

    const globalQualList = await tx
      .select()
      .from(qualificationsGlobal)
      .where(ilike(qualificationsGlobal.globalQualName, '%' + search + '%'))
      .limit(limit || 10)
      .offset(offset || 0)

    if (storeID != null) {
      const [totalLocalQuals] = await tx
        .select({
          count: sql`count(*)`.mapWith(Number).as('count'),
        })
        .from(qualificationsLocal)
        .where(
          and(
            ilike(qualificationsLocal.localQualName, '%' + search + '%'),
            eq(qualificationsLocal.storeID, storeID),
          ),
        )

      const localQualList = await tx
        .select()
        .from(qualificationsLocal)
        .where(eq(qualificationsLocal.storeID, storeID))
        .limit(limit || 10)
        .offset(offset || 0)

      return {
        totalLocalQuals: totalLocalQuals.count,
        localQualList: localQualList,
        totalGlobalQuals: totalGlobalQuals.count,
        globalQualList: globalQualList,
      }
    }
    return {
      totalLocalQuals: 0,
      localQualList: [],
      totalGlobalQuals: totalGlobalQuals.count,
      globalQualList: globalQualList,
    }
  })
  const pageLocalQuals = Math.ceil(quals.totalLocalQuals / limit)
  const pageGlobalQuals = Math.ceil(quals.totalGlobalQuals / limit)

  const brandedLocalQuals: QualificationsLocal[] = quals.localQualList.map((localQuals) => {
    return {
      qual: {
        storeID: StoreID(localQuals.storeID),
        localQualID: LocalQualID(localQuals.localQualID),
        localQualName: LocalQualName(localQuals.localQualName),
      },
      dates: {
        createdAt: CreatedAt(localQuals.createdAt),
        updatedAt: UpdatedAt(localQuals.updatedAt),
      },
    }
  })

  const brandedGlobalQuals: QualificationsGlobal[] = quals.globalQualList.map((globalQuals) => {
    return {
      qual: {
        globalQualID: GlobalQualID(globalQuals.globalQualID),
        globalQualName: GlobalQualName(globalQuals.globalQualName),
      },
      dates: {
        createdAt: CreatedAt(globalQuals.createdAt),
        updatedAt: UpdatedAt(globalQuals.updatedAt),
      },
    }
  })
  return {
    totalLocalQuals: quals.totalLocalQuals,
    totalGlobalQuals: quals.totalGlobalQuals,
    totalLocalPage: pageLocalQuals,
    totalGlobalPage: pageGlobalQuals,
    localQuals: brandedLocalQuals,
    globalQuals: brandedGlobalQuals,
    perPage: page,
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
