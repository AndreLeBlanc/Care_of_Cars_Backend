import {
  CreatedAt,
  EmployeeID,
  GlobalQualID,
  GlobalQualName,
  LocalQualID,
  LocalQualName,
  StoreID,
  UpdatedAt,
  employeeGlobalQualifications,
  employeeLocalQualifications,
  qualificationsGlobal,
  qualificationsLocal,
} from '../schema/schema.js'

import { Search } from '../plugins/pagination.js'

import { db } from '../config/db-connect.js'

import { and, eq, ilike, or, sql } from 'drizzle-orm'

import { Either, errorHandling, left, right } from '../utils/helper.js'

export type CreateQualificationsLocal = {
  localQualID?: LocalQualID
  storeID: StoreID
  localQualName: LocalQualName
}

export type CreateQualificationsGlobal = {
  globalQualID?: GlobalQualID
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

export type EmployeeQualificationsGlobal = {
  globalQualID: GlobalQualID
  globalQualName: GlobalQualName
}

export type EmployeeQualificationsLocal = {
  storeID: StoreID
  localQualID: LocalQualID
  localQualName: LocalQualName
}

export type QualificationsListed = {
  totalLocalQuals: number
  totalGlobalQuals: number
  localQuals: EmployeeQualificationsLocal[]
  globalQuals: EmployeeQualificationsGlobal[]
}

export type EmployeeLocalQualifications = {
  employeeID: EmployeeID
  localQualID: LocalQualID
}

export type EmployeeGlobalQualifications = {
  employeeID: EmployeeID
  globalQualID: GlobalQualID
}

export type QualsByEmployeeStatus = {
  employeeID: EmployeeID
  employeesGlobalQuals: EmployeeQualificationsGlobal[]
  NotEmployeesGlobalQuals: EmployeeQualificationsGlobal[]
  employeesLocalQuals: EmployeeQualificationsLocal[]
  NotEmployeesLocalQuals: EmployeeQualificationsLocal[]
}

export async function updateLocalQuals(
  localQuals: CreateQualificationsLocal[],
): Promise<Either<string, QualificationsLocal[]>> {
  try {
    const qual = await db
      .insert(qualificationsLocal)
      .values(localQuals)
      .onConflictDoUpdate({
        target: [qualificationsLocal.localQualID],
        set: {
          localQualID: sql`"excluded"."localQualID"`,
          localQualName: sql`"excluded"."localQualName"`,
          storeID: sql`"excluded"."storeID"`,
          updatedAt: new Date(),
        },
      })
      .returning()

    return qual
      ? right(
          qual.map((q) => ({
            qual: {
              storeID: q.storeID,
              localQualID: q.localQualID,
              localQualName: q.localQualName,
            },
            dates: {
              createdAt: CreatedAt(q.createdAt),
              updatedAt: UpdatedAt(q.updatedAt),
            },
          })),
        )
      : left("couldn't update local quals")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function updateGlobalQuals(
  globalQual: CreateQualificationsGlobal[],
): Promise<Either<string, QualificationsGlobal[]>> {
  try {
    const qual = await db
      .insert(qualificationsGlobal)
      .values(globalQual)
      .onConflictDoUpdate({
        target: [qualificationsGlobal.globalQualID],
        set: {
          globalQualID: sql`"excluded"."globalQualID"`,
          globalQualName: sql`"excluded"."globalQualName"`,
          updatedAt: new Date(),
        },
      })
      .returning()

    return qual
      ? right(
          qual.map((q) => ({
            qual: {
              globalQualID: q.globalQualID,
              globalQualName: q.globalQualName,
            },
            dates: { createdAt: CreatedAt(q.createdAt), updatedAt: UpdatedAt(q.updatedAt) },
          })),
        )
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
  localQual: LocalQualID[],
): Promise<Either<string, QualificationsLocal[]>> {
  try {
    const qual = await db
      .delete(qualificationsLocal)
      .where(or(...localQual.map((key) => eq(qualificationsLocal.localQualID, key))))
      .returning()
    return qual
      ? right(
          qual.map((q) => ({
            qual: {
              storeID: q.storeID,
              localQualID: q.localQualID,
              localQualName: q.localQualName,
            },
            dates: { createdAt: CreatedAt(q.createdAt), updatedAt: UpdatedAt(q.updatedAt) },
          })),
        )
      : left('Qualification not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteGlobalQuals(
  globalQual: GlobalQualID[],
): Promise<Either<string, QualificationsGlobal[]>> {
  try {
    const qual = await db
      .delete(qualificationsGlobal)
      .where(or(...globalQual.map((key) => eq(qualificationsGlobal.globalQualID, key))))
      .returning()
    return qual
      ? right(
          qual.map((q) => ({
            qual: {
              globalQualID: q.globalQualID,
              globalQualName: q.globalQualName,
            },
            dates: { createdAt: CreatedAt(q.createdAt), updatedAt: UpdatedAt(q.updatedAt) },
          })),
        )
      : left("Can't find qualification")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getQualifcations(
  search: Search,
  storeID?: StoreID,
  employeeID?: EmployeeID,
): Promise<Either<string, QualificationsListed>> {
  try {
    const quals = await db.transaction(async (tx) => {
      const globalQualsList = employeeID
        ? await tx
            .select({
              globalQualID: qualificationsGlobal.globalQualID,
              globalQualName: qualificationsGlobal.globalQualName,
            })
            .from(qualificationsGlobal)
            .innerJoin(
              employeeGlobalQualifications,
              eq(employeeGlobalQualifications.globalQualID, qualificationsGlobal.globalQualID),
            )
            .where(
              and(
                ilike(qualificationsGlobal.globalQualName, '%' + search + '%'),
                eq(employeeGlobalQualifications.employeeID, employeeID),
              ),
            )
        : await tx
            .select()
            .from(qualificationsGlobal)
            .where(and(ilike(qualificationsGlobal.globalQualName, '%' + search + '%')))

      if (storeID != null) {
        const localQualList = employeeID
          ? await tx
              .select({
                localQualID: qualificationsLocal.localQualID,
                localQualName: qualificationsLocal.localQualName,
                storeID: qualificationsLocal.storeID,
              })
              .from(qualificationsLocal)
              .innerJoin(
                employeeLocalQualifications,
                eq(employeeLocalQualifications.localQualID, qualificationsLocal.localQualID),
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

export async function setEmployeeLocalQualification(
  empQuals: EmployeeLocalQualifications[],
): Promise<Either<string, EmployeeLocalQualifications[]>> {
  try {
    const insertLocalQual = await db
      .insert(employeeLocalQualifications)
      .values(empQuals)
      .returning()
      .onConflictDoNothing()
    return right(insertLocalQual)
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function setEmployeeGlobalQualification(
  empQuals: EmployeeGlobalQualifications[],
): Promise<Either<string, EmployeeGlobalQualifications[]>> {
  try {
    const insertGlobalQual = await db
      .insert(employeeGlobalQualifications)
      .values(empQuals)
      .returning()
      .onConflictDoNothing()

    return insertGlobalQual ? right(insertGlobalQual) : left('qualification not created')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteEmployeeLocalQualification(
  empQuals: EmployeeLocalQualifications[],
): Promise<Either<string, EmployeeLocalQualifications[]>> {
  try {
    const insertLocalQual = await db
      .delete(employeeLocalQualifications)
      .where(
        or(
          ...empQuals.map((key) =>
            and(
              eq(employeeLocalQualifications.employeeID, key.employeeID),
              eq(employeeLocalQualifications.localQualID, key.localQualID),
            ),
          ),
        ),
      )
      .returning()
    return insertLocalQual ? right(insertLocalQual) : left('Qualification not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteEmployeeGlobalQualification(
  empQuals: EmployeeGlobalQualifications[],
): Promise<Either<string, EmployeeGlobalQualifications[]>> {
  try {
    const insertGlobalQual = await db
      .delete(employeeGlobalQualifications)
      .where(
        or(
          ...empQuals.map((key) =>
            and(
              eq(employeeGlobalQualifications.employeeID, key.employeeID),
              eq(employeeGlobalQualifications.globalQualID, key.globalQualID),
            ),
          ),
        ),
      )
      .returning()
    return insertGlobalQual ? right(insertGlobalQual) : left('employee or qualification not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getEmployeeQualifications(
  employeeID: EmployeeID,
): Promise<
  Either<
    string,
    { localQuals: EmployeeQualificationsLocal[]; globalQuals: EmployeeQualificationsGlobal[] }
  >
> {
  try {
    const quals = await db.transaction(async (tx) => {
      const localQualsList = await tx
        .select({
          storeID: qualificationsLocal.storeID,
          localQualID: qualificationsLocal.localQualID,
          localQualName: qualificationsLocal.localQualName,
        })
        .from(employeeLocalQualifications)
        .rightJoin(
          qualificationsLocal,
          eq(employeeLocalQualifications.localQualID, qualificationsLocal.localQualID),
        )
        .where(eq(employeeLocalQualifications.employeeID, employeeID))

      const globalQualsList = await tx
        .select({
          globalQualID: qualificationsGlobal.globalQualID,
          globalQualName: qualificationsGlobal.globalQualName,
        })
        .from(employeeGlobalQualifications)
        .rightJoin(
          qualificationsGlobal,
          eq(employeeGlobalQualifications.globalQualID, qualificationsLocal.localQualID),
        )
        .where(eq(employeeGlobalQualifications.employeeID, employeeID))
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

export async function getQualificationsStatusByEmployee(
  employeeID: EmployeeID,
): Promise<Either<string, QualsByEmployeeStatus>> {
  try {
    const quals = await db.transaction(async (tx) => {
      const localQualsList = await tx
        .select({
          storeID: qualificationsLocal.storeID,
          localQualID: qualificationsLocal.localQualID,
          localQualName: qualificationsLocal.localQualName,
          employeeID: employeeLocalQualifications.employeeID,
        })
        .from(employeeLocalQualifications)
        .rightJoin(
          qualificationsLocal,
          eq(employeeLocalQualifications.localQualID, qualificationsLocal.localQualID),
        )
        .where(eq(employeeLocalQualifications.employeeID, employeeID))

      const globalQualsList = await tx
        .select({
          globalQualID: qualificationsGlobal.globalQualID,
          globalQualName: qualificationsGlobal.globalQualName,
          employeeID: employeeGlobalQualifications.employeeID,
        })
        .from(employeeGlobalQualifications)
        .rightJoin(
          qualificationsGlobal,
          eq(employeeGlobalQualifications.globalQualID, qualificationsLocal.localQualID),
        )
        .where(eq(employeeGlobalQualifications.employeeID, employeeID))
      return { localQualsList, globalQualsList }
    })

    interface QualsByStatus<T> {
      has: T[]
      doesntHave: T[]
    }

    const localQualsByStatus: {
      has: EmployeeQualificationsLocal[]
      doesntHave: EmployeeQualificationsLocal[]
    } = quals.localQualsList.reduce<QualsByStatus<EmployeeQualificationsLocal>>(
      (acc, qual) => {
        const empQual: EmployeeQualificationsLocal = {
          storeID: qual.storeID,
          localQualID: qual.localQualID,
          localQualName: qual.localQualName,
        }
        if (qual.employeeID != null) {
          acc.has.push(empQual)
        } else {
          acc.doesntHave.push(empQual)
        }
        return acc
      },
      { has: [], doesntHave: [] },
    )

    const globalQualsByStatus: {
      has: EmployeeQualificationsGlobal[]
      doesntHave: EmployeeQualificationsGlobal[]
    } = quals.globalQualsList.reduce<QualsByStatus<EmployeeQualificationsGlobal>>(
      (acc, qual) => {
        const empQual: EmployeeQualificationsGlobal = {
          globalQualID: qual.globalQualID,
          globalQualName: qual.globalQualName,
        }
        if (qual.employeeID != null) {
          acc.has.push(empQual)
        } else {
          acc.doesntHave.push(empQual)
        }
        return acc
      },
      { has: [], doesntHave: [] },
    )

    return right({
      employeeID: employeeID,
      employeesGlobalQuals: globalQualsByStatus.has,
      NotEmployeesGlobalQuals: globalQualsByStatus.doesntHave,
      employeesLocalQuals: localQualsByStatus.has,
      NotEmployeesLocalQuals: localQualsByStatus.doesntHave,
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}
