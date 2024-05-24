import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { db } from '../config/db-connect'

import { listServiceOrderByEnum, serviceOrderEnum } from '../routes/services/serviceSchema'

import {
  ServiceAward,
  ServiceCallInterval,
  ServiceCategoryID,
  ServiceCost,
  ServiceDay1,
  ServiceDay2,
  ServiceDay3,
  ServiceDay4,
  ServiceDay5,
  ServiceExternalArticleNumber,
  ServiceHidden,
  ServiceID,
  ServiceIncludeInAutomaticSms,
  ServiceItemNumber,
  ServiceName,
  ServiceSuppliersArticleNumber,
  ServiceWarrantyCard,
  colorForService,
  serviceCategories,
  serviceVariants,
  services,
} from '../schema/schema'

import { Limit, Offset, Page, Search } from '../plugins/pagination'

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

export type ColorForService = (typeof colorForService)[number]

export type ServiceNoVariant = {
  serviceID?: ServiceID
  serviceName: ServiceName
  serviceCategoryID: ServiceCategoryID
  serviceIncludeInAutomaticSms: ServiceIncludeInAutomaticSms
  serviceHidden?: ServiceHidden
  serviceCallInterval?: ServiceCallInterval
  serviceColorForService?: ColorForService
  serviceWarrantyCard?: ServiceWarrantyCard
  serviceItemNumber?: ServiceItemNumber
  serviceSuppliersArticleNumber?: ServiceSuppliersArticleNumber
  serviceExternalArticleNumber?: ServiceExternalArticleNumber
  createdAt?: Date
  updatedAt?: Date
}

export type UpdateService = ServiceNoVariant & { serviceVariants: updateServiceVariant[] }

function convertToColorEnum(str: string): ColorForService | undefined {
  if (colorForService.includes(str as ColorForService)) {
    return str as ColorForService
  }
  return undefined
}

export async function createService(service: UpdateService): Promise<ServiceID> {
  const color: ColorForService = service.serviceColorForService || 'None'
  return await db.transaction(async (tx) => {
    const [insertedService] = await tx
      .insert(services)
      .values({
        name: service.serviceName,
        serviceCategoryID: service.serviceCategoryID,
        includeInAutomaticSms: service.serviceIncludeInAutomaticSms,
        hidden: service.serviceHidden,
        callInterval: service.serviceCallInterval,
        colorForService: color,
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
      serviceColorForService: convertToColorEnum(service.colorForService),
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
    const color: ColorForService = service.serviceColorForService || 'None'

    const [updatedService] = await tx
      .update(services)
      .set({
        name: serviceWithUpdatedAt.serviceName,
        serviceCategoryID: serviceWithUpdatedAt.serviceCategoryID,
        includeInAutomaticSms: serviceWithUpdatedAt.serviceIncludeInAutomaticSms,
        hidden: serviceWithUpdatedAt.serviceHidden,
        callInterval: serviceWithUpdatedAt.serviceCallInterval,
        colorForService: color,
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
