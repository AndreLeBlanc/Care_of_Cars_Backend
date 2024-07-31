import {
  DriverCarBrand,
  DriverCarChassiNumber,
  DriverCarColor,
  DriverCarID,
  DriverCarModel,
  DriverCarNotes,
  DriverCarRegistrationNumber,
  DriverCarYear,
  DriverID,
  driverCars,
} from '../schema/schema.js'

import { db } from '../config/db-connect.js'

import { and, eq, ilike, or, sql } from 'drizzle-orm'

import { Limit, Offset, Page, ResultCount, Search } from '../plugins/pagination.js'

export type CreateCar = {
  driverID?: DriverID
  driverCarRegistrationNumber: DriverCarRegistrationNumber
  driverCarBrand?: DriverCarBrand
  driverCarModel?: DriverCarModel
  driverCarColor?: DriverCarColor
  driverCarYear?: DriverCarYear
  driverCarChassiNumber?: DriverCarChassiNumber
  driverCarNotes?: DriverCarNotes
}

export type Car = {
  carInfo: CreateCar & { driverCarID: DriverCarID }
  dates: { createdAt: Date; updatedAt: Date }
}

export type CarsPaginated = {
  totalCars: ResultCount
  totalPage: Page
  perPage: Limit
  page: Page
  cars: (CreateCar & {
    driverCarID: DriverCarID
  })[]
}

export async function putCar(car: CreateCar, driverCarID?: DriverCarID): Promise<Car | undefined> {
  const [createdCar] = driverCarID
    ? await db
        .update(driverCars)
        .set(car)
        .where(eq(driverCars.driverCarID, driverCarID))
        .returning()
    : await db.insert(driverCars).values(car).returning()

  return {
    carInfo: {
      driverCarID: createdCar.driverCarID,
      driverCarBrand: createdCar.driverCarBrand ?? undefined,
      driverCarChassiNumber: createdCar.driverCarChassiNumber ?? undefined,
      driverCarColor: createdCar.driverCarColor ?? undefined,
      driverCarModel: createdCar.driverCarModel ?? undefined,
      driverCarNotes: createdCar.driverCarNotes ?? undefined,
      driverCarRegistrationNumber: createdCar.driverCarRegistrationNumber,
      driverCarYear: createdCar.driverCarYear ?? undefined,
      driverID: createdCar.driverID ?? undefined,
    },
    dates: {
      createdAt: createdCar.createdAt,
      updatedAt: createdCar.updatedAt,
    },
  }
}

export async function deleteCar(driverCarID: DriverCarID): Promise<Car | undefined> {
  const [deletedCar] = await db
    .delete(driverCars)
    .where(eq(driverCars.driverCarID, driverCarID))
    .returning()

  return {
    carInfo: {
      driverCarID: deletedCar.driverCarID,
      driverCarBrand: deletedCar.driverCarBrand ?? undefined,
      driverCarChassiNumber: deletedCar.driverCarChassiNumber ?? undefined,
      driverCarColor: deletedCar.driverCarColor ?? undefined,
      driverCarModel: deletedCar.driverCarModel ?? undefined,
      driverCarNotes: deletedCar.driverCarNotes ?? undefined,
      driverCarRegistrationNumber: deletedCar.driverCarRegistrationNumber,
      driverCarYear: deletedCar.driverCarYear ?? undefined,
      driverID: deletedCar.driverID ?? undefined,
    },
    dates: {
      createdAt: deletedCar.createdAt,
      updatedAt: deletedCar.updatedAt,
    },
  }
}

export async function getCar(driverCarID: DriverCarID): Promise<Car | undefined> {
  const [deletedCar] = await db
    .select()
    .from(driverCars)
    .where(eq(driverCars.driverCarID, driverCarID))

  return {
    carInfo: {
      driverCarID: deletedCar.driverCarID,
      driverCarBrand: deletedCar.driverCarBrand ?? undefined,
      driverCarChassiNumber: deletedCar.driverCarChassiNumber ?? undefined,
      driverCarColor: deletedCar.driverCarColor ?? undefined,
      driverCarModel: deletedCar.driverCarModel ?? undefined,
      driverCarNotes: deletedCar.driverCarNotes ?? undefined,
      driverCarRegistrationNumber: deletedCar.driverCarRegistrationNumber,
      driverCarYear: deletedCar.driverCarYear ?? undefined,
      driverID: deletedCar.driverID ?? undefined,
    },
    dates: {
      createdAt: deletedCar.createdAt,
      updatedAt: deletedCar.updatedAt,
    },
  }
}
export async function getCarByReg(
  driverCarReg: DriverCarRegistrationNumber,
): Promise<Car | undefined> {
  const [deletedCar] = await db
    .select()
    .from(driverCars)
    .where(eq(driverCars.driverCarRegistrationNumber, driverCarReg))

  return {
    carInfo: {
      driverCarID: deletedCar.driverCarID,
      driverCarBrand: deletedCar.driverCarBrand ?? undefined,
      driverCarChassiNumber: deletedCar.driverCarChassiNumber ?? undefined,
      driverCarColor: deletedCar.driverCarColor ?? undefined,
      driverCarModel: deletedCar.driverCarModel ?? undefined,
      driverCarNotes: deletedCar.driverCarNotes ?? undefined,
      driverCarRegistrationNumber: deletedCar.driverCarRegistrationNumber,
      driverCarYear: deletedCar.driverCarYear ?? undefined,
      driverID: deletedCar.driverID ?? undefined,
    },
    dates: {
      createdAt: deletedCar.createdAt,
      updatedAt: deletedCar.updatedAt,
    },
  }
}

export async function getCarsPaginated(
  search: Search,
  limit = Limit(10),
  offset = Offset(0),
  page = Page(1),
): Promise<CarsPaginated | undefined> {
  const condition = and(
    or(
      ilike(driverCars.driverCarChassiNumber, '%' + search + '%'),
      ilike(driverCars.driverCarRegistrationNumber, '%' + search + '%'),
    ),
  )
  const { totalCars, listedCars } = await db.transaction(async (tx) => {
    const [totalCars] = await tx
      .select({
        count: sql`count(*)`.mapWith(Number).as('count'),
      })
      .from(driverCars)
      .where(condition)

    const listedCars = await tx
      .select({
        driverCarID: driverCars.driverCarID,
        driverCarBrand: driverCars.driverCarBrand,
        driverCarChassiNumber: driverCars.driverCarChassiNumber,
        driverCarColor: driverCars.driverCarColor,
        driverCarModel: driverCars.driverCarModel,
        driverCarNotes: driverCars.driverCarNotes,
        driverCarRegistrationNumber: driverCars.driverCarRegistrationNumber,
        driverCarYear: driverCars.driverCarYear,
        driverID: driverCars.driverID,
      })
      .from(driverCars)
      .where(condition)
      .limit(limit || 10)
      .offset(offset || 0)

    return { totalCars, listedCars }
  })

  const listCarsUndefined = listedCars.map((car) => {
    return {
      driverCarID: car.driverCarID,
      driverCarBrand: car.driverCarBrand ?? undefined,
      driverCarChassiNumber: car.driverCarChassiNumber ?? undefined,
      driverCarColor: car.driverCarColor ?? undefined,
      driverCarModel: car.driverCarModel ?? undefined,
      driverCarNotes: car.driverCarNotes ?? undefined,
      driverCarRegistrationNumber: car.driverCarRegistrationNumber,
      driverCarYear: car.driverCarYear ?? undefined,
      driverID: car.driverID ?? undefined,
    }
  })

  const totalPage = Page(Math.ceil(totalCars.count / limit))
  return {
    totalCars: ResultCount(totalCars.count),
    totalPage: totalPage,
    perPage: limit,
    page: page,
    cars: listCarsUndefined,
  }
}
