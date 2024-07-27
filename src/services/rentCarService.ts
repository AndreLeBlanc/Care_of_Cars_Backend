import { db } from '../config/db-connect.js'

import {
  BookingEnd,
  BookingStart,
  EmployeeID,
  OrderID,
  OrderStatus,
  RentCarBookingID,
  RentCarColor,
  RentCarModel,
  RentCarNotes,
  RentCarNumber,
  RentCarRegistrationNumber,
  RentCarYear,
  StoreID,
  SubmissionTime,
  rentCarBookings,
  rentcars,
} from '../schema/schema.js'

import { and, desc, eq, gte, ilike, lte, or, sql } from 'drizzle-orm'
import { Offset } from '../plugins/pagination.js'

import { Either, errorHandling, left, right } from '../utils/helper.js'

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

export type RentCarBooking = {
  rentCarBookingID?: RentCarBookingID
  orderID?: OrderID
  rentCarRegistrationNumber: RentCarRegistrationNumber
  bookingStart: BookingStart
  bookingEnd: BookingEnd
  bookedBy?: EmployeeID
  bookingStatus: OrderStatus
  submissionTime: SubmissionTime
}

export type RentCarBookingReply = RentCarBooking & {
  createdAt: Date
  updatedAt: Date
}

export const createRentCar = async (
  carData: RentCarCreateType,
): Promise<Either<string, RentCar>> => {
  try {
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
      ? right({
          storeID: newCar.storeID,
          rentCarRegistrationNumber: newCar.rentCarRegistrationNumber,
          rentCarModel: newCar.rentCarModel,
          rentCarColor: newCar.rentCarColor,
          rentCarYear: newCar.rentCarYear,
          rentCarNotes: newCar.rentCarNotes ? newCar.rentCarNotes : undefined,
          rentCarNumber: newCar.rentCarNumber ? newCar.rentCarNumber : undefined,
          createdAt: newCar.createdAt,
          updatedAt: newCar.updatedAt,
        })
      : left("couldn't create car")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getRentCarPaginate(
  search: string,
  limit = 10,
  page = 1,
  offset = Offset(0),
  storeID?: StoreID,
): Promise<Either<string, RentCarsPaginate>> {
  try {
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

    return right({
      totalItems: rentalCarInfo.totalItems.count,
      totalPage,
      perPage: page,
      data: brandedRentCars,
    })
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteRentCarByRegNumber(
  regNumber: RentCarRegistrationNumber,
): Promise<Either<string, RentCarRegistrationNumber>> {
  try {
    const [deletedRentCar] = await db
      .delete(rentcars)
      .where(eq(rentcars.rentCarRegistrationNumber, regNumber))
      .returning({ deletedRegNumber: rentcars.rentCarRegistrationNumber })
    return deletedRentCar
      ? right(RentCarRegistrationNumber(deletedRentCar.deletedRegNumber))
      : left("couldn't find car")
  } catch (e) {
    return left(errorHandling(e))
  }
}

//edit rent car
export async function editRentCar(carDetails: RentCarEditType): Promise<Either<string, RentCar>> {
  try {
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
      ? right({
          storeID: updatedRentCar.storeID,
          rentCarRegistrationNumber: updatedRentCar.rentCarRegistrationNumber,
          rentCarModel: updatedRentCar.rentCarModel,
          rentCarColor: updatedRentCar.rentCarColor,
          rentCarYear: updatedRentCar.rentCarYear,
          rentCarNotes: updatedRentCar.rentCarNotes ? updatedRentCar.rentCarNotes : undefined,
          rentCarNumber: updatedRentCar.rentCarNumber ? updatedRentCar.rentCarNumber : undefined,
          createdAt: updatedRentCar.createdAt,
          updatedAt: updatedRentCar.updatedAt,
        })
      : left("couldn't find car")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getRentCarByID(
  regNumber: RentCarRegistrationNumber,
): Promise<Either<string, RentCar>> {
  try {
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
      ? right({
          storeID: rentCarDetails.storeID,
          rentCarRegistrationNumber: rentCarDetails.rentCarRegistrationNumber,
          rentCarModel: rentCarDetails.rentCarModel,
          rentCarColor: rentCarDetails.rentCarColor,
          rentCarYear: rentCarDetails.rentCarYear,
          rentCarNotes: rentCarDetails.rentCarNotes ? rentCarDetails.rentCarNotes : undefined,
          rentCarNumber: rentCarDetails.rentCarNumber ? rentCarDetails.rentCarNumber : undefined,
          createdAt: rentCarDetails.createdAt,
          updatedAt: rentCarDetails.updatedAt,
        })
      : left("Couldn't find car")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function createRentCarBooking(
  booking: RentCarBooking,
): Promise<Either<string, RentCarBookingReply>> {
  try {
    const [newBooking] = await db
      .insert(rentCarBookings)
      .values(booking)
      .onConflictDoUpdate({
        target: [rentCarBookings.rentCarBookingID, rentCarBookings.orderID],
        set: booking,
      })
      .returning()

    return newBooking
      ? right({
          rentCarBookingID: newBooking.rentCarBookingID,
          orderID: newBooking.orderID ?? undefined,
          rentCarRegistrationNumber: newBooking.rentCarRegistrationNumber,
          bookingStart: newBooking.bookingStart,
          bookingEnd: newBooking.bookingEnd,
          bookedBy: newBooking.bookedBy ?? undefined,
          bookingStatus: newBooking.bookingStatus,
          submissionTime: newBooking.submissionTime,
          createdAt: newBooking.createdAt,
          updatedAt: newBooking.updatedAt,
        })
      : left('no booking made')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getRentCarBooking(
  bookingID: RentCarBookingID,
): Promise<Either<string, RentCarBookingReply>> {
  try {
    const [fetchedBooking] = await db
      .select()
      .from(rentCarBookings)
      .where(eq(rentCarBookings.rentCarBookingID, bookingID))

    return fetchedBooking
      ? right({
          rentCarBookingID: fetchedBooking.rentCarBookingID,
          orderID: fetchedBooking.orderID ?? undefined,
          rentCarRegistrationNumber: fetchedBooking.rentCarRegistrationNumber,
          bookingStart: fetchedBooking.bookingStart,
          bookingEnd: fetchedBooking.bookingEnd,
          bookedBy: fetchedBooking.bookedBy ?? undefined,
          bookingStatus: fetchedBooking.bookingStatus,
          submissionTime: fetchedBooking.submissionTime,
          createdAt: fetchedBooking.createdAt,
          updatedAt: fetchedBooking.updatedAt,
        })
      : left('no booking found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function availableRentCars(
  storeID: StoreID,
  start: BookingStart,
  end: BookingEnd,
): Promise<Either<string, RentCar[]>> {
  try {
    const fetchedBooking = await db
      .select()
      .from(rentCarBookings)
      .rightJoin(
        rentcars,
        and(
          lte(rentCarBookings.bookingEnd, BookingEnd(start)),
          gte(rentCarBookings.bookingStart, BookingStart(end)),
          eq(rentcars.storeID, storeID),
        ),
      )
    const available: RentCar[] = fetchedBooking.reduce((acc: RentCar[], book) => {
      if (book.rentCarBookings && book.rentCars) {
        acc.push({
          storeID: book.rentCars.storeID,
          rentCarRegistrationNumber: book.rentCars.rentCarRegistrationNumber,
          rentCarModel: book.rentCars.rentCarModel,
          rentCarColor: book.rentCars.rentCarColor,
          rentCarYear: book.rentCars.rentCarYear,
          rentCarNotes: book.rentCars.rentCarNotes ?? undefined,
          rentCarNumber: book.rentCars.rentCarNumber ?? undefined,
          createdAt: book.rentCars.createdAt,
          updatedAt: book.rentCars.updatedAt,
        })
      }
      return acc
    }, [])
    return fetchedBooking ? right(available) : left('no booking found')
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteRentCarBooking(
  bookingID: RentCarBookingID,
): Promise<Either<string, RentCarBookingReply>> {
  try {
    const [deletedBooking] = await db
      .delete(rentCarBookings)
      .where(eq(rentCarBookings.rentCarBookingID, bookingID))
      .returning()

    return deletedBooking
      ? right({
          rentCarBookingID: deletedBooking.rentCarBookingID,
          orderID: deletedBooking.orderID ?? undefined,
          rentCarRegistrationNumber: deletedBooking.rentCarRegistrationNumber,
          bookingStart: deletedBooking.bookingStart,
          bookingEnd: deletedBooking.bookingEnd,
          bookedBy: deletedBooking.bookedBy ?? undefined,
          bookingStatus: deletedBooking.bookingStatus,
          submissionTime: deletedBooking.submissionTime,
          createdAt: deletedBooking.createdAt,
          updatedAt: deletedBooking.updatedAt,
        })
      : left('no booking found')
  } catch (e) {
    return left(errorHandling(e))
  }
}
