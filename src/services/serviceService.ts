import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { db } from '../config/db-connect.js'
import {
  CreateServiceSchemaType,
  PatchServiceSchemaType,
  listServiceOrderByEnum,
  serviceOrderEnum,
} from '../routes/services/serviceSchema.js'
import { serviceCategories, serviceVariants, services } from '../schema/schema.js'

export type ServiceID = { serviceID: number }

export type updateServiceVariant = {
  id: number
  name: string
  award: number
  cost: number
  day1: string
  day2: string
  day3: string
  day4: string
  day5: string
}

export enum colorOnDutyEnum {
  LightBlue = 'LightBlue',
  Blue = 'Blue',
  DarkBlue = 'DarkBlue',
  LightGreen = 'LightGreen',
  Green = 'Green',
  DarkGreen = 'DarkGreen',
  LightYellow = 'LightYellow',
  Yellow = 'Yellow',
  DarkYellow = 'DarkYellow',
  LightPurple = 'LightPurple',
  Purple = 'Purple',
  DarkPurple = 'DarkPurple',
  LightPink = 'LightPink',
  Pink = 'Pink',
  DarkPink = 'DarkPink',
  LightTurquoise = 'LightTurquoise',
  Turquoise = 'Turquoise',
  DarkTurquoise = 'DarkTurquoise',
  Orange = 'Orange',
  Red = 'Red',
}
export type updateService = {
  id: number
  name: string
  serviceCategoryId: number
  includeInAutomaticSms: boolean
  hidden: boolean
  callInterval: number
  colorOnDuty: colorOnDutyEnum
  warrantyCard: boolean
  itemNumber: boolean
  suppliersArticleNumber: string
  externalArticleNumber: string
  serviceVariants: Array<updateServiceVariant>
  createdAt: Date
  updatedAt: Date
}

export async function createService(service: CreateServiceSchemaType): Promise<ServiceID> {
  return await db.transaction(async (tx) => {
    const [insertedService] = await tx
      .insert(services)
      .values({
        name: service.name,
        serviceCategoryID: service.serviceCategoryId,
        includeInAutomaticSms: service.includeInAutomaticSms,
        hidden: service.hidden,
        callInterval: service.callInterval,
        colorOnDuty: service.colorOnDuty,
        warrantyCard: service.warrantyCard,
        itemNumber: service.itemNumber,
        suppliersArticleNumber: service.suppliersArticleNumber,
        externalArticleNumber: service.externalArticleNumber,
      })
      .returning({
        serviceID: services.serviceID,
      })
    for (const serviceVariant of service.serviceVariants || []) {
      await tx.insert(serviceVariants).values({
        serviceID: insertedService.serviceID,
        name: serviceVariant.name,
        award: serviceVariant.award,
        cost: serviceVariant.cost,
        day1: serviceVariant.day1,
        day2: serviceVariant.day2,
        day3: serviceVariant.day3,
        day4: serviceVariant.day4,
        day5: serviceVariant.day5,
      })
    }
    return insertedService
  })
}

export async function getServicesPaginate(
  search: string,
  limit = 10,
  page = 1,
  offset = 0,
  orderBy: listServiceOrderByEnum,
  order: serviceOrderEnum,
  hidden: boolean = true,
) {
  const condition = and(
    eq(services.hidden, hidden),
    or(
      ilike(services.name, '%' + search + '%'),
      ilike(services.itemNumber, '%' + search + '%'),
      ilike(services.suppliersArticleNumber, '%' + search + '%'),
      ilike(services.externalArticleNumber, '%' + search + '%'),
    ),
  )
  let orderCondition = desc(services.serviceID)
  if (order == serviceOrderEnum.desc) {
    if (orderBy == listServiceOrderByEnum.name) {
      orderCondition = desc(services.name)
    } else if (orderBy == listServiceOrderByEnum.serviceCategoryID) {
      orderCondition = desc(serviceCategories.serviceCategoryID)
    } else {
      orderCondition = desc(services.serviceID)
    }
  }

  if (order == serviceOrderEnum.asc) {
    if (orderBy == listServiceOrderByEnum.name) {
      orderCondition = asc(services.name)
    } else if (orderBy == listServiceOrderByEnum.serviceCategoryID) {
      orderCondition = asc(serviceCategories.serviceCategoryID)
    } else {
      orderCondition = asc(services.serviceID)
    }
  }

  const [totalItems] = await db
    .select({
      count: sql`count(*)`.mapWith(Number).as('count'),
    })
    .from(services)
    .where(condition)

  const servicesList = await db.query.services.findMany({
    where: condition,
    limit: limit || 10,
    offset: offset || 0,
    orderBy: orderCondition,
    with: {
      serviceCategories: true,
      serviceVariants: true,
    },
  })
  const totalPage = Math.ceil(totalItems.count / limit)

  return {
    totalItems: totalItems.count,
    totalPage,
    perPage: page,
    data: servicesList,
  }
}

export async function updateServiceById(
  id: ServiceID,
  service: PatchServiceSchemaType,
): Promise<any | undefined> {
  // TODO: updateService type currently not working using any need to fix it.
  const serviceWithUpdatedAt = { ...service, updatedAt: new Date() }
  return await db.transaction(async (tx) => {
    const [updatedService] = await tx
      .update(services)
      .set({
        name: serviceWithUpdatedAt.name,
        serviceCategoryID: serviceWithUpdatedAt.serviceCategoryId,
        includeInAutomaticSms: serviceWithUpdatedAt.includeInAutomaticSms,
        hidden: serviceWithUpdatedAt.hidden,
        callInterval: serviceWithUpdatedAt.callInterval,
        colorOnDuty: serviceWithUpdatedAt.colorOnDuty,
        warrantyCard: serviceWithUpdatedAt.warrantyCard,
        itemNumber: serviceWithUpdatedAt.itemNumber,
        suppliersArticleNumber: serviceWithUpdatedAt.suppliersArticleNumber,
        externalArticleNumber: serviceWithUpdatedAt.externalArticleNumber,
        updatedAt: serviceWithUpdatedAt.updatedAt,
      })
      .where(eq(services.serviceID, id.serviceID))
      .returning({
        serviceID: services.serviceCategoryID,
        name: services.name,
        serviceCategoryId: services.serviceCategoryID,
        includeInAutomaticSms: services.includeInAutomaticSms,
        hidden: services.hidden,
        callInterval: services.callInterval,
        colorOnDuty: services.colorOnDuty,
        warrantyCard: services.warrantyCard,
        itemNumber: services.itemNumber,
        suppliersArticleNumber: services.suppliersArticleNumber,
        externalArticleNumber: services.externalArticleNumber,
        createdAt: services.createdAt,
        updatedAt: services.updatedAt,
      })
    if (updatedService == null) {
      return undefined
    }
    // delete all existing variants and insert fresh
    await db.delete(serviceVariants).where(eq(serviceVariants.serviceID, updatedService.serviceID))
    for (const serviceVariant of service.serviceVariants || []) {
      await tx.insert(serviceVariants).values({
        name: serviceVariant.name,
        serviceID: updatedService.serviceID,
        award: serviceVariant.award,
        cost: serviceVariant.cost,
        day1: serviceVariant.day1,
        day2: serviceVariant.day2,
        day3: serviceVariant.day3,
        day4: serviceVariant.day4,
        day5: serviceVariant.day5,
      })
    }
    const updatedServiceWithVariants = await tx.query.services.findFirst({
      where: eq(services.serviceCategoryID, updatedService.serviceID),
      with: {
        serviceCategories: true,
        serviceVariants: true,
      },
    })
    return [updatedServiceWithVariants]
  })
}
