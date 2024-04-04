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
type ServiceName = { serviceName: string }
type ServiceAward = { serviceAward?: number }
type ServiceCost = { serviceCost: number }
type ServiceDay1 = { serviceDay1: string }
type ServiceDay2 = { serviceDay2: string }
type ServiceDay3 = { serviceDay3: string }
type ServiceDay4 = { serviceDay4: string }
type ServiceDay5 = { serviceDay5: string }

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

type ServiceIncludeInAutomaticSms = { serviceIncludeInAutomaticSms: boolean | null }
type ServiceHidden = { serviceHidden: boolean | null }
type ServiceCallInterval = { serviceCallInterval: number | null }
type ServiceWarrantyCard = { serviceWarrantyCard: boolean | null }
type ServiceItemNumber = { serviceItemNumber: string | null }
type ServiceSuppliersArticleNumber = { serviceSuppliersArticleNumber: string | null }
type ServiceExternalArticleNumber = { serviceExternalArticleNumber: string | null }
type ServiceVariants = Array<updateServiceVariant>

export type ServiceNoVariant = {
  serviceID: ServiceID
  serviceName: ServiceName
  serviceCategoryID: ServiceCategoryID
  serviceIncludeInAutomaticSms: ServiceIncludeInAutomaticSms
  serviceHidden: ServiceHidden
  serviceCallInterval: ServiceCallInterval
  serviceColorForService: string
  serviceWarrantyCard: ServiceWarrantyCard
  serviceItemNumber: ServiceItemNumber
  serviceSuppliersArticleNumber: ServiceSuppliersArticleNumber
  serviceExternalArticleNumber: ServiceExternalArticleNumber
  createdAt: Date
  updatedAt: Date
}

export type UpdateService = ServiceNoVariant & ServiceVariants

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
        colorForService: service.colorForService,
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

export async function updateServiceByID(id: ServiceID, service: PatchServiceSchemaType) {
  const serviceWithUpdatedAt = { ...service, updatedAt: new Date() }
  return await db.transaction(async (tx) => {
    const [updatedService]: ServiceNoVariant[] = await tx
      .update(services)
      .set({
        name: serviceWithUpdatedAt.name,
        serviceCategoryID: serviceWithUpdatedAt.serviceCategoryID,
        includeInAutomaticSms: serviceWithUpdatedAt.includeInAutomaticSms,
        hidden: serviceWithUpdatedAt.hidden,
        callInterval: serviceWithUpdatedAt.callInterval,
        colorForService: serviceWithUpdatedAt.colorForService,
        warrantyCard: serviceWithUpdatedAt.warrantyCard,
        itemNumber: serviceWithUpdatedAt.itemNumber,
        suppliersArticleNumber: serviceWithUpdatedAt.suppliersArticleNumber,
        externalArticleNumber: serviceWithUpdatedAt.externalArticleNumber,
        updatedAt: serviceWithUpdatedAt.updatedAt,
      })
      .where(eq(services.serviceID, id.serviceID))
      .returning({
        serviceID: { serviceID: services.serviceCategoryID },
        serviceName: { serviceName: services.name },
        serviceCategoryID: { serviceCategoryID: services.serviceCategoryID },
        serviceIncludeInAutomaticSms: {
          serviceIncludeInAutomaticSms: services.includeInAutomaticSms,
        },
        serviceHidden: { serviceHidden: services.hidden },
        serviceCallInterval: { serviceCallInterval: services.callInterval },
        serviceColorForService: services.colorForService,
        serviceWarrantyCard: { serviceWarrantyCard: services.warrantyCard },
        serviceItemNumber: { serviceItemNumber: services.itemNumber },
        serviceSuppliersArticleNumber: {
          serviceSuppliersArticleNumber: services.suppliersArticleNumber,
        },
        serviceExternalArticleNumber: {
          serviceExternalArticleNumber: services.externalArticleNumber,
        },
        createdAt: services.createdAt,
        updatedAt: services.updatedAt,
      })
    if (updatedService == null) {
      return undefined
    }
    //    delete all existing variants and insert fresh
    await db
      .delete(serviceVariants)
      .where(eq(serviceVariants.serviceID, updatedService.serviceID.serviceID))
    for (const serviceVariant of service.serviceVariants || []) {
      await tx.insert(serviceVariants).values({
        name: serviceVariant.name,
        serviceID: updatedService.serviceID.serviceID,
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
      where: eq(services.serviceCategoryID, updatedService.serviceID.serviceID),
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
    where: eq(services.serviceID, serviceID.serviceID),
    with: {
      serviceCategories: true,
      serviceVariants: true,
    },
  })
  if (servicesDetail == null) {
    return undefined
  }
  return {
    serviceID: { serviceID: servicesDetail.serviceID },
    serviceName: { serviceName: servicesDetail.name },
    serviceCategoryID: { serviceCategoryID: servicesDetail.serviceCategoryID },
    serviceIncludeInAutomaticSms: {
      serviceIncludeInAutomaticSms: servicesDetail.includeInAutomaticSms,
    },
    serviceHidden: { serviceHidden: servicesDetail.hidden },
    serviceCallInterval: { serviceCallInterval: servicesDetail.callInterval },
    serviceColorForService: servicesDetail.colorForService,
    serviceWarrantyCard: { serviceWarrantyCard: servicesDetail.warrantyCard },
    serviceItemNumber: { serviceItemNumber: servicesDetail.itemNumber },
    serviceSuppliersArticleNumber: {
      serviceSuppliersArticleNumber: servicesDetail.suppliersArticleNumber,
    },
    serviceExternalArticleNumber: {
      serviceExternalArticleNumber: servicesDetail.externalArticleNumber,
    },
    createdAt: servicesDetail.createdAt,
    updatedAt: servicesDetail.updatedAt,
  }
}
