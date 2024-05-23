import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { db } from '../config/db-connect.js'

import {
  colorForService,
  listServiceOrderByEnum,
  serviceOrderEnum,
} from '../routes/services/serviceSchema.js'
import { serviceCategories, serviceVariants, services } from '../schema/schema.js'
import { ServiceCategoryID } from './CategoryService.js'

import { Limit, Offset, Page, Search } from '../plugins/pagination.js'

import { Brand, make } from 'ts-brand'

export type ServiceID = Brand<number, ' serviceID'>
export const ServiceID = make<ServiceID>()
export type ServiceName = Brand<string, ' serviceName'>
export const ServiceName = make<ServiceName>()
export type ServiceAward = Brand<number, ' serviceAward'>
export const ServiceAward = make<ServiceAward>()
export type ServiceCost = Brand<number, ' serviceCost'>
export const ServiceCost = make<ServiceCost>()
export type ServiceDay1 = Brand<string, ' serviceDay1'>
export const ServiceDay1 = make<ServiceDay1>()
export type ServiceDay2 = Brand<string, ' serviceDay2'>
export const ServiceDay2 = make<ServiceDay2>()
export type ServiceDay3 = Brand<string, ' serviceDay3'>
export const ServiceDay3 = make<ServiceDay3>()
export type ServiceDay4 = Brand<string, ' serviceDay4'>
export const ServiceDay4 = make<ServiceDay4>()
export type ServiceDay5 = Brand<string, ' serviceDay5'>
export const ServiceDay5 = make<ServiceDay5>()

export type updateServiceVariant = {
  serviceID?: ServiceID
  serviceName: ServiceName
  serviceAward: ServiceAward
  serviceCost: ServiceCost
  serviceDay1?: ServiceDay1
  serviceDay2?: ServiceDay2
  serviceDay3?: ServiceDay3
  serviceDay4?: ServiceDay4
  serviceDay5?: ServiceDay5
}

export type ServicesPaginated = {
  totalItems: number
  totalPage: number
  perPage: Page
  data: ServiceNoVariant[]
}

export type ServiceIncludeInAutomaticSms = Brand<boolean, 'ServiceIncludeInAutomaticSms'>
export const ServiceIncludeInAutomaticSms = make<ServiceIncludeInAutomaticSms>()
export type ServiceHidden = Brand<boolean, 'ServiceHidden'>
export const ServiceHidden = make<ServiceHidden>()
export type ServiceCallInterval = Brand<number, 'ServiceCallInterval'>
export const ServiceCallInterval = make<ServiceCallInterval>()
export type ServiceWarrantyCard = Brand<boolean, 'ServiceWarrantyCard'>
export const ServiceWarrantyCard = make<ServiceWarrantyCard>()
export type ServiceItemNumber = Brand<string, 'ServiceItemNumber'>
export const ServiceItemNumber = make<ServiceItemNumber>()
export type ServiceSuppliersArticleNumber = Brand<string, 'ServiceSuppliersArticleNumber'>
export const ServiceSuppliersArticleNumber = make<ServiceSuppliersArticleNumber>()
export type ServiceExternalArticleNumber = Brand<string, 'ServiceExternalArticleNumber'>
export const ServiceExternalArticleNumber = make<ServiceExternalArticleNumber>()

export type ServiceNoVariant = {
  serviceID?: ServiceID
  serviceName: ServiceName
  serviceCategoryID: ServiceCategoryID
  serviceIncludeInAutomaticSms: ServiceIncludeInAutomaticSms
  serviceHidden?: ServiceHidden
  serviceCallInterval?: ServiceCallInterval
  serviceColorForService?: colorForService
  serviceWarrantyCard?: ServiceWarrantyCard
  serviceItemNumber?: ServiceItemNumber
  serviceSuppliersArticleNumber?: ServiceSuppliersArticleNumber
  serviceExternalArticleNumber?: ServiceExternalArticleNumber
  createdAt?: Date
  updatedAt?: Date
}

export type UpdateService = ServiceNoVariant & { serviceVariants: updateServiceVariant[] }

export async function createService(service: UpdateService): Promise<ServiceID> {
  return await db.transaction(async (tx) => {
    const [insertedService] = await tx
      .insert(services)
      .values({
        name: service.serviceName,
        serviceCategoryID: service.serviceCategoryID,
        includeInAutomaticSms: service.serviceIncludeInAutomaticSms,
        hidden: service.serviceHidden,
        callInterval: service.serviceCallInterval,
        colorForService: service.serviceColorForService,
        warrantyCard: service.serviceWarrantyCard,
        itemNumber: service.serviceItemNumber,
        suppliersArticleNumber: service.serviceSuppliersArticleNumber,
        externalArticleNumber: service.serviceExternalArticleNumber,
      })
      .returning({
        serviceID: services.serviceID,
      })
    for (const serviceVariant of service.serviceVariants || []) {
      await tx.insert(serviceVariants).values({
        serviceID: insertedService.serviceID,
        name: serviceVariant.serviceName,
        award: serviceVariant.serviceAward,
        cost: serviceVariant.serviceCost,
        day1: serviceVariant.serviceDay1,
        day2: serviceVariant.serviceDay2,
        day3: serviceVariant.serviceDay3,
        day4: serviceVariant.serviceDay4,
        day5: serviceVariant.serviceDay5,
      })
    }
    return ServiceID(insertedService.serviceID)
  })
}

export async function getServicesPaginate(
  search: Search,
  limit = Limit(10),
  page = Page(1),
  offset = Offset(0),
  orderBy: listServiceOrderByEnum,
  order: serviceOrderEnum,
  hidden: ServiceHidden = ServiceHidden(true),
): Promise<ServicesPaginated> {
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

  const serviceListBranded = servicesList.map((service) => {
    return {
      serviceName: service.name,
      serviceCategoryID: service.serviceCategoryID,
      serviceIncludeInAutomaticSms: service.includeInAutomaticSms ?? undefined,
      serviceHidden: service.hidden ?? undefined,
      serviceCallInterval: service.callInterval ?? undefined,
      serviceColorForService: service.colorForService
        ? colorForService[service.colorForService]
        : undefined,
      serviceWarrantyCard: service.warrantyCard ?? undefined,
      serviceItemNumber: service.itemNumber ?? undefined,
      serviceSuppliersArticleNumber: service.suppliersArticleNumber ?? undefined,
      serviceExternalArticleNumber: service.externalArticleNumber ?? undefined,
      updatedAt: service.updatedAt,
    }
  })

  return {
    totalItems: totalItems.count,
    totalPage,
    perPage: page,
    data: serviceListBranded,
  }
}

export async function updateServiceByID(id: ServiceID, service: UpdateService) {
  const serviceWithUpdatedAt = { ...service, updatedAt: new Date() }
  return await db.transaction(async (tx) => {
    const [updatedService] = await tx
      .update(services)
      .set({
        name: serviceWithUpdatedAt.serviceName,
        serviceCategoryID: serviceWithUpdatedAt.serviceCategoryID,
        includeInAutomaticSms: serviceWithUpdatedAt.serviceIncludeInAutomaticSms,
        hidden: serviceWithUpdatedAt.serviceHidden,
        callInterval: serviceWithUpdatedAt.serviceCallInterval,
        colorForService: serviceWithUpdatedAt.serviceColorForService,
        warrantyCard: serviceWithUpdatedAt.serviceWarrantyCard,
        itemNumber: serviceWithUpdatedAt.serviceItemNumber,
        suppliersArticleNumber: serviceWithUpdatedAt.serviceSuppliersArticleNumber,
        externalArticleNumber: serviceWithUpdatedAt.serviceExternalArticleNumber,
        updatedAt: serviceWithUpdatedAt.updatedAt,
      })
      .where(eq(services.serviceID, id))
      .returning()
    if (updatedService == null) {
      return undefined
    }
    //    delete all existing variants and insert fresh
    await db.delete(serviceVariants).where(eq(serviceVariants.serviceID, updatedService.serviceID))
    for (const serviceVariant of service.serviceVariants || []) {
      await tx.insert(serviceVariants).values({
        name: serviceVariant.serviceName,
        serviceID: updatedService.serviceID,
        award: serviceVariant.serviceAward,
        cost: serviceVariant.serviceCost,
        day1: serviceVariant.serviceDay1,
        day2: serviceVariant.serviceDay2,
        day3: serviceVariant.serviceDay3,
        day4: serviceVariant.serviceDay4,
        day5: serviceVariant.serviceDay5,
      })
    }
    const updatedServiceWithVariants = await tx.query.services.findFirst({
      where: eq(services.serviceID, updatedService.serviceID),
      with: {
        serviceCategories: true,
        serviceVariants: true,
      },
    })
    return [updatedServiceWithVariants]
  })
}

export async function getServiceById(serviceID: ServiceID): Promise<ServiceNoVariant | undefined> {
  const servicesDetail = await db.query.services.findFirst({
    where: eq(services.serviceID, serviceID),
    with: {
      serviceCategories: true,
      serviceVariants: true,
    },
  })
  if (servicesDetail == null) {
    return undefined
  }

  function convertToColorEnum(str: string): colorForService | undefined {
    const colorValue: colorForService = colorForService[str as keyof typeof colorForService]
    return colorValue
  }

  const serviceColor = convertToColorEnum(servicesDetail.colorForService)

  if (serviceColor === undefined) {
    return undefined
  }

  return {
    serviceID: servicesDetail.serviceID,
    serviceName: servicesDetail.name,
    serviceCategoryID: servicesDetail.serviceCategoryID,

    serviceIncludeInAutomaticSms: ServiceIncludeInAutomaticSms(
      servicesDetail.includeInAutomaticSms,
    ),
    serviceHidden: servicesDetail.hidden ?? undefined,
    serviceCallInterval: servicesDetail.callInterval
      ? ServiceCallInterval(servicesDetail.callInterval)
      : undefined,
    serviceColorForService: serviceColor,
    serviceWarrantyCard: servicesDetail.warrantyCard
      ? ServiceWarrantyCard(servicesDetail.warrantyCard)
      : undefined,
    serviceItemNumber: servicesDetail.itemNumber
      ? ServiceItemNumber(servicesDetail.itemNumber)
      : undefined,

    serviceSuppliersArticleNumber: servicesDetail.suppliersArticleNumber
      ? ServiceSuppliersArticleNumber(servicesDetail.suppliersArticleNumber)
      : undefined,
    serviceExternalArticleNumber: servicesDetail.externalArticleNumber
      ? ServiceExternalArticleNumber(servicesDetail.externalArticleNumber)
      : undefined,
    createdAt: servicesDetail.createdAt,
    updatedAt: servicesDetail.updatedAt,
  }
}
