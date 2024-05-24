import { db } from '../config/db-connect'

import {
  RentCarColor,
  RentCarModel,
  RentCarNotes,
  RentCarNumber,
  RentCarRegistrationNumber,
  RentCarYear,
  StoreID,
  rentcars,
} from '../schema/schema'

import { and, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { Offset } from '../plugins/pagination'

export type RentCarCreateType = {
  storeID: StoreID
  rentCarRegistrationNumber: RentCarRegistrationNumber
  rentCarModel: RentCarModel
  rentCarColor: RentCarColor
  rentCarYear: RentCarYear
  rentCarNotes?: RentCarNotes
  rentCarNumber?: RentCarNumber
}

export type RentCarEditType = {
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

export type RentCarEdit = RentCarEditType & {
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
      storeID: carData.storeID,
      rentCarRegistrationNumber: carData.rentCarRegistrationNumber,
      rentCarModel: carData.rentCarModel,
      rentCarColor: carData.rentCarColor,
      rentCarYear: carData.rentCarYear,
      rentCarNotes: carData.rentCarNotes,
      rentCarNumber: carData.rentCarNumber,
    })
    .returning({
      storeID: rentcars.storeID,
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
        storeID: newCar.storeID,
        rentCarRegistrationNumber: newCar.rentCarRegistrationNumber,
        rentCarModel: newCar.rentCarModel,
        rentCarColor: newCar.rentCarColor,
        rentCarYear: newCar.rentCarYear,
        rentCarNotes: newCar.rentCarNotes ? newCar.rentCarNotes : undefined,
        rentCarNumber: newCar.rentCarNumber ? newCar.rentCarNumber : undefined,
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
  storeID?: StoreID,
): Promise<RentCarsPaginate> {
  const rentalCarInfo = await db.transaction(async (tx) => {
    let condition = or(
      ilike(rentcars.rentCarRegistrationNumber, '%' + search + '%'),
      ilike(rentcars.rentCarModel, '%' + search + '%'),
      ilike(rentcars.rentCarNotes, '%' + search + '%'),
    )

    if (storeID != undefined) {
      condition = and(condition, eq(rentcars.storeID, storeID))
    }
    const [totalItems] = await tx
      .select({
        count: sql`count(*)`.mapWith(Number).as('count'),
      })
      .from(rentcars)
      .where(condition)

    const rentCarList = await tx
      .select({
        storeID: rentcars.storeID,
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

  const totalPage = Math.ceil(rentalCarInfo.totalItems.count / limit)

  const brandedRentCars: RentCar[] = rentalCarInfo.rentCarList.map((rentCar) => {
    return {
      storeID: rentCar.storeID,
      rentCarRegistrationNumber: rentCar.rentCarRegistrationNumber,
      rentCarModel: rentCar.rentCarModel,
      rentCarColor: rentCar.rentCarColor,
      rentCarYear: rentCar.rentCarYear,
      rentCarNotes: rentCar.rentCarNotes ? rentCar.rentCarNotes : undefined,
      rentCarNumber: rentCar.rentCarNumber ? rentCar.rentCarNumber : undefined,
      createdAt: rentCar.createdAt,
      updatedAt: rentCar.updatedAt,
    }
  })

  return {
    totalItems: rentalCarInfo.totalItems.count,
    totalPage,
    perPage: page,
    data: brandedRentCars,
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
export async function editRentCar(carDetails: RentCarEditType): Promise<RentCar | undefined> {
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
      storeID: rentcars.storeID,
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
        storeID: updatedRentCar.storeID,
        rentCarRegistrationNumber: updatedRentCar.rentCarRegistrationNumber,
        rentCarModel: updatedRentCar.rentCarModel,
        rentCarColor: updatedRentCar.rentCarColor,
        rentCarYear: updatedRentCar.rentCarYear,
        rentCarNotes: updatedRentCar.rentCarNotes ? updatedRentCar.rentCarNotes : undefined,
        rentCarNumber: updatedRentCar.rentCarNumber ? updatedRentCar.rentCarNumber : undefined,
        createdAt: updatedRentCar.createdAt,
        updatedAt: updatedRentCar.updatedAt,
      }
    : undefined
}

export async function getRentCarByID(
  regNumber: RentCarRegistrationNumber,
): Promise<RentCar | undefined> {
  const [rentCarDetails] = await db
    .select({
      storeID: rentcars.storeID,
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
    .where(eq(rentcars.rentCarRegistrationNumber, regNumber))
  return rentCarDetails
    ? {
        storeID: rentCarDetails.storeID,
        rentCarRegistrationNumber: rentCarDetails.rentCarRegistrationNumber,
        rentCarModel: rentCarDetails.rentCarModel,
        rentCarColor: rentCarDetails.rentCarColor,
        rentCarYear: rentCarDetails.rentCarYear,
        rentCarNotes: rentCarDetails.rentCarNotes ? rentCarDetails.rentCarNotes : undefined,
        rentCarNumber: rentCarDetails.rentCarNumber ? rentCarDetails.rentCarNumber : undefined,
        createdAt: rentCarDetails.createdAt,
        updatedAt: rentCarDetails.updatedAt,
      }
    : undefined
}
