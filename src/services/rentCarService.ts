import { Brand, make } from 'ts-brand'
import { db } from '../config/db-connect.js'
import { rentcars } from '../schema/schema.js'
import { desc, eq, ilike, or, sql } from 'drizzle-orm'
import { Offset } from '../plugins/pagination.js'

export type RentCarRegistrationNumber = Brand<string, 'rentCarRegistrationNumber'>
export const RentCarRegistrationNumber = make<RentCarRegistrationNumber>()
export type RentCarModel = Brand<string, 'rentCarModel'>
export const RentCarModel = make<RentCarModel>()
export type RentCarColor = Brand<string, 'rentCarColor'>
export const RentCarColor = make<RentCarColor>()
export type RentCarYear = Brand<number, 'rentCarYear'>
export const RentCarYear = make<RentCarYear>()
export type RentCarNotes = Brand<string | null, 'rentCarNotes'>
export const RentCarNotes = make<RentCarNotes>()
export type RentCarNumber = Brand<number | null, 'rentCarNumber'>
export const RentCarNumber = make<RentCarNumber>()

export type RentCarCreateType = {
  rentCarRegistrationNumber: RentCarRegistrationNumber
  rentCarModel: RentCarModel
  rentCarColor: RentCarColor
  rentCarYear: RentCarYear
  rentCarNotes?: RentCarNotes
  rentCarNumber?: RentCarNumber
}

export type RentCar = RentCarCreateType & {
  createdAt: Date
  updatedAt: Date
}

export type RentCarsPaginate = {
  totalItems: number
  totalPage: number
  perPage: number
  data: RentCar[]
}

export const createRentCar = async (carData: RentCarCreateType): Promise<RentCar | undefined> => {
  const [newCar] = await db
    .insert(rentcars)
    .values({
      rentCarRegistrationNumber: carData.rentCarRegistrationNumber,
      rentCarModel: carData.rentCarModel,
      rentCarColor: carData.rentCarColor,
      rentCarYear: carData.rentCarYear,
      rentCarNotes: carData.rentCarNotes,
      rentCarNumber: carData.rentCarNumber,
    })
    .returning({
      rentCarRegistrationNumber: rentcars.rentCarRegistrationNumber,
      rentCarModel: rentcars.rentCarModel,
      rentCarColor: rentcars.rentCarColor,
      rentCarYear: rentcars.rentCarYear,
      rentCarNotes: rentcars.rentCarNotes,
      rentCarNumber: rentcars.rentCarNumber,
      createdAt: rentcars.createdAt,
      updatedAt: rentcars.updatedAt,
    })
  return newCar
    ? {
        rentCarRegistrationNumber: RentCarRegistrationNumber(newCar.rentCarRegistrationNumber),
        rentCarModel: RentCarModel(newCar.rentCarModel),
        rentCarColor: RentCarColor(newCar.rentCarColor),
        rentCarYear: RentCarYear(newCar.rentCarYear),
        rentCarNotes: RentCarNotes(newCar.rentCarNotes),
        rentCarNumber: RentCarNumber(newCar.rentCarNumber),
        createdAt: newCar.createdAt,
        updatedAt: newCar.updatedAt,
      }
    : undefined
}

export async function getRentCarPaginate(
  search: string,
  limit = 10,
  page = 1,
  offset = Offset(0),
): Promise<RentCarsPaginate> {
  const returnData = await db.transaction(async (tx) => {
    const condition = or(
      ilike(rentcars.rentCarRegistrationNumber, '%' + search + '%'),
      ilike(rentcars.rentCarModel, '%' + search + '%'),
      ilike(rentcars.rentCarNotes, '%' + search + '%'),
    )

    const [totalItems] = await tx
      .select({
        count: sql`count(*)`.mapWith(Number).as('count'),
      })
      .from(rentcars)
      .where(condition)

    const rentCarList = await tx
      .select({
        rentCarRegistrationNumber: rentcars.rentCarRegistrationNumber,
        rentCarModel: rentcars.rentCarModel,
        rentCarColor: rentcars.rentCarColor,
        rentCarYear: rentcars.rentCarYear,
        rentCarNotes: rentcars.rentCarNotes,
        rentCarNumber: rentcars.rentCarNumber,
        createdAt: rentcars.createdAt,
        updatedAt: rentcars.updatedAt,
      })
      .from(rentcars)
      .where(condition)
      .orderBy(desc(rentcars.createdAt))
      .limit(limit || 10)
      .offset(offset || 0)

    return { totalItems, rentCarList }
  })

  const rentCarBrandedList = returnData.rentCarList.map((item) => {
    return {
      rentCarRegistrationNumber: RentCarRegistrationNumber(item.rentCarRegistrationNumber),
      rentCarModel: RentCarModel(item.rentCarModel),
      rentCarColor: RentCarColor(item.rentCarColor),
      rentCarYear: RentCarYear(item.rentCarYear),
      rentCarNotes: RentCarNotes(item.rentCarNotes),
      rentCarNumber: RentCarNumber(item.rentCarNumber),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }
  })

  const totalPage = Math.ceil(returnData.totalItems.count / limit)

  return {
    totalItems: returnData.totalItems.count,
    totalPage,
    perPage: page,
    data: rentCarBrandedList,
  }
}

export async function deleteRentCarByRegNumber(
  regNumber: RentCarRegistrationNumber,
): Promise<RentCarRegistrationNumber | undefined> {
  const [deletedRentCar] = await db
    .delete(rentcars)
    .where(eq(rentcars.rentCarRegistrationNumber, regNumber))
    .returning({ deletedRegNumber: rentcars.rentCarRegistrationNumber })
  return deletedRentCar ? RentCarRegistrationNumber(deletedRentCar.deletedRegNumber) : undefined
}

//edit rent car
export async function editRentCar(carDetails: RentCarCreateType): Promise<RentCar | undefined> {
  const [updatedRentCar] = await db
    .update(rentcars)
    .set({
      rentCarRegistrationNumber: carDetails.rentCarRegistrationNumber,
      rentCarModel: carDetails.rentCarModel,
      rentCarColor: carDetails.rentCarColor,
      rentCarYear: carDetails.rentCarYear,
      rentCarNotes: carDetails.rentCarNotes,
      rentCarNumber: carDetails.rentCarNumber,
      updatedAt: new Date(),
    })
    .where(eq(rentcars.rentCarRegistrationNumber, carDetails.rentCarRegistrationNumber))
    .returning({
      rentCarRegistrationNumber: rentcars.rentCarRegistrationNumber,
      rentCarModel: rentcars.rentCarModel,
      rentCarColor: rentcars.rentCarColor,
      rentCarYear: rentcars.rentCarYear,
      rentCarNotes: rentcars.rentCarNotes,
      rentCarNumber: rentcars.rentCarNumber,
      createdAt: rentcars.createdAt,
      updatedAt: rentcars.updatedAt,
    })

  return updatedRentCar
    ? {
        rentCarRegistrationNumber: RentCarRegistrationNumber(
          updatedRentCar.rentCarRegistrationNumber,
        ),
        rentCarModel: RentCarModel(updatedRentCar.rentCarModel),
        rentCarColor: RentCarColor(updatedRentCar.rentCarColor),
        rentCarYear: RentCarYear(updatedRentCar.rentCarYear),
        rentCarNotes: RentCarNotes(updatedRentCar.rentCarNotes),
        rentCarNumber: RentCarNumber(updatedRentCar.rentCarNumber),
        createdAt: updatedRentCar.createdAt,
        updatedAt: updatedRentCar.updatedAt,
      }
    : undefined
}
