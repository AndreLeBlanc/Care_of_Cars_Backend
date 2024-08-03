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
  globalQualID: LocalQualID
}

export type QualsByEmployeeStatus = {
  employeeID: EmployeeID
  employeesGlobalQuals: EmployeeQualificationsGlobal[]
  NotEmployeesGlobalQuals: EmployeeQualificationsGlobal[]
  employeesLocalQuals: EmployeeQualificationsLocal[]
  NotEmployeesLocalQuals: EmployeeQualificationsLocal[]
}

export async function updateLocalQuals(
  localQual: CreateQualificationsLocal,
  localQualID?: LocalQualID,
): Promise<Either<string, QualificationsLocal>> {
  try {
    const [qual] = localQualID
      ? await db
          .update(qualificationsLocal)
          .set({ ...localQual, updatedAt: new Date() })
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
          .set({ ...globalQual, updatedAt: new Date() })
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
  employeeID: EmployeeID,
  localQualID: LocalQualID,
): Promise<Either<string, EmployeeLocalQualifications>> {
  try {
    const [insertLocalQual] = await db
      .insert(employeeLocalQualifications)
      .values({ employeeID: employeeID, localQualID: localQualID })
      .returning()
    return right(insertLocalQual)
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function setEmployeeGlobalQualification(
  employeeID: EmployeeID,
  globalQualID: GlobalQualID,
): Promise<Either<string, EmployeeGlobalQualifications>> {
  try {
    const [insertGlobalQual] = await db
      .insert(employeeGlobalQualifications)
      .values({ employeeID: employeeID, globalQualID: globalQualID })
      .returning({ globalQualID: employeeGlobalQualifications.globalQualID })
    return insertGlobalQual
      ? right({
          employeeID: employeeID,
          globalQualID: LocalQualID(insertGlobalQual.globalQualID),
        })
      : left('qualification not created')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteEmployeeLocalQualification(
  employeeID: EmployeeID,
  localQualID: LocalQualID,
): Promise<Either<string, EmployeeLocalQualifications>> {
  try {
    const [insertLocalQual] = await db
      .delete(employeeLocalQualifications)
      .where(
        and(
          eq(employeeLocalQualifications.employeeID, employeeID),
          eq(employeeLocalQualifications.localQualID, localQualID),
        ),
      )
      .returning({ localQualID: employeeLocalQualifications.localQualID })
    return insertLocalQual
      ? right({
          employeeID: employeeID,
          localQualID: LocalQualID(insertLocalQual.localQualID),
        })
      : left('Qualification not found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteEmployeeGlobalQualification(
  employeeID: EmployeeID,
  globalQualID: GlobalQualID,
): Promise<Either<string, EmployeeGlobalQualifications>> {
  try {
    const [insertGlobalQual] = await db
      .delete(employeeGlobalQualifications)
      .where(
        and(
          eq(employeeGlobalQualifications.employeeID, employeeID),
          eq(employeeGlobalQualifications.globalQualID, globalQualID),
        ),
      )
      .returning({ globalQualID: employeeGlobalQualifications.globalQualID })
    return insertGlobalQual
      ? right({
          employeeID: employeeID,
          globalQualID: LocalQualID(insertGlobalQual.globalQualID),
        })
      : left('employee or qualification not found')
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
