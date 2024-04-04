import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { db } from '../config/db-connect.js'
import {
  CreateServiceSchemaType,
  PatchServiceSchemaType,
  listServiceOrderByEnum,
  serviceOrderEnum,
} from '../routes/services/serviceSchema.js'
import { serviceCategories, serviceVariants, services } from '../schema/schema.js'
import { ServiceCategoryID } from './serviceCategory.js'

export type ServiceID = { serviceID: number }
type ServiceName = { servicename: string }
type ServiceAward = { serviceaward: number }
type ServiceCost = { servicecost: number }
type ServiceDay1 = { serviceday1: string }
type ServiceDay2 = { serviceday2: string }
type ServiceDay3 = { serviceday3: string }
type ServiceDay4 = { serviceday4: string }
type ServiceDay5 = { serviceday5: string }

export type updateServiceVariant = {
  serviceID: ServiceID
  serviceName: ServiceName
  serviceAward: ServiceAward
  serviceCost: ServiceCost
  serviceDay1: ServiceDay1
  serviceDay2: ServiceDay2
  serviceDay3: ServiceDay3
  serviceDay4: ServiceDay4
  serviceDay5: ServiceDay5
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

type ServiceIncludeInAutomaticSms = { serviceIncludeInAutomaticSms: boolean }
type ServiceHidden = { serviceHidden: boolean }
type ServiceCallInterval = { serviceCallInterval: number }
type ServiceColorOnDuty = { serviceColorOnDuty: colorOnDutyEnum }
type ServiceWarrantyCard = { serviceWarrantyCard: boolean }
type ServiceItemNumber = { serviceItemNumber: boolean }
type ServiceSuppliersArticleNumber = { serviceSuppliersArticleNumber: string }
type ServiceExternalArticleNumber = { serviceExternalArticleNumber: string }

export type UpdateService = {
  serviceID: ServiceID
  serviceName: ServiceName
  serviceCategoryID: ServiceCategoryID
  serviceIncludeInAutomaticSms: ServiceIncludeInAutomaticSms
  serviceHidden: ServiceHidden
  serviceCallInterval: ServiceCallInterval
  serviceColorOnDuty: ServiceColorOnDuty
  serviceWarrantyCard: ServiceWarrantyCard
  serviceItemNumber: ServiceItemNumber
  serviceSuppliersArticleNumber: ServiceSuppliersArticleNumber
  serviceExternalArticleNumber: ServiceExternalArticleNumber
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
        serviceCategoryID: service.serviceCategoryID,
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
): Promise<any> {
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
  const totalPage: number = Math.ceil(totalItems.count / limit)

  return {
    totalItems: totalItems.count,
    totalPage,
    perPage: page,
    data: servicesList,
  }
}

export async function updateServiceByID(
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
        serviceCategoryID: serviceWithUpdatedAt.serviceCategoryID,
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
        ServiceCategoryID: services.serviceCategoryID,
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
