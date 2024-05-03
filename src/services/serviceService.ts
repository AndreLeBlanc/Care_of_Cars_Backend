import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { db } from '../config/db-connect.js'
import {
  ServiceSchemaType,
  colorForService,
  listServiceOrderByEnum,
  serviceOrderEnum,
} from '../routes/services/serviceSchema.js'
import { serviceCategories, serviceVariants, services } from '../schema/schema.js'
import { ServiceCategoryID } from './serviceCategory.js'
import { Offset, Page, Search, Limit } from '../plugins/pagination.js'
import { Brand, make } from 'ts-brand'

export type ServiceID = Brand<number, ' serviceID'>
export const ServiceID = make<ServiceID>()
type ServiceName = Brand<string, ' serviceName'>
const ServiceName = make<ServiceName>()
type ServiceAward = Brand<number, ' serviceAward'>
const ServiceAward = make<ServiceAward>()
type ServiceCost = Brand<number, ' serviceCost'>
const ServiceCost = make<ServiceCost>()
type ServiceDay1 = Brand<string, ' serviceDay1'>
const ServiceDay1 = make<ServiceDay1>()
type ServiceDay2 = Brand<string, ' serviceDay2'>
const ServiceDay2 = make<ServiceDay2>()
type ServiceDay3 = Brand<string, ' serviceDay3'>
const ServiceDay3 = make<ServiceDay3>()
type ServiceDay4 = Brand<string, ' serviceDay4'>
const ServiceDay4 = make<ServiceDay4>()
type ServiceDay5 = Brand<string, ' serviceDay5'>
const ServiceDay5 = make<ServiceDay5>()

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

type ServiceIncludeInAutomaticSms = Brand<boolean | null, 'ServiceIncludeInAutomaticSms'>
const ServiceIncludeInAutomaticSms = make<ServiceIncludeInAutomaticSms>()
type ServiceHidden = Brand<boolean | null, 'ServiceHidden'>
const ServiceHidden = make<ServiceHidden>()
type ServiceCallInterval = Brand<number | null, 'ServiceCallInterval'>
const ServiceCallInterval = make<ServiceCallInterval>()
type ServiceWarrantyCard = Brand<boolean | null, 'ServiceWarrantyCard'>
const ServiceWarrantyCard = make<ServiceWarrantyCard>()
type ServiceItemNumber = Brand<string | null, 'ServiceItemNumber'>
const ServiceItemNumber = make<ServiceItemNumber>()
type ServiceSuppliersArticleNumber = Brand<string | null, 'ServiceSuppliersArticleNumber'>
const ServiceSuppliersArticleNumber = make<ServiceSuppliersArticleNumber>()
type ServiceExternalArticleNumber = Brand<string | null, 'ServiceExternalArticleNumber'>
const ServiceExternalArticleNumber = make<ServiceExternalArticleNumber>()

export type ServiceNoVariant = {
  serviceID: ServiceID
  serviceName: ServiceName
  serviceCategoryID: ServiceCategoryID
  serviceIncludeInAutomaticSms: ServiceIncludeInAutomaticSms
  serviceHidden: ServiceHidden
  serviceCallInterval: ServiceCallInterval
  serviceColorForService: colorForService
  serviceWarrantyCard: ServiceWarrantyCard
  serviceItemNumber: ServiceItemNumber
  serviceSuppliersArticleNumber: ServiceSuppliersArticleNumber
  serviceExternalArticleNumber: ServiceExternalArticleNumber
  createdAt: Date
  updatedAt: Date
}

export type UpdateService = ServiceNoVariant & { serviceVariants: updateServiceVariant[] }

export async function createService(service: ServiceSchemaType): Promise<ServiceID> {
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

export async function updateServiceByID(id: ServiceID, service: ServiceSchemaType) {
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
        colorForService: serviceWithUpdatedAt.colorForService,
        warrantyCard: serviceWithUpdatedAt.warrantyCard,
        itemNumber: serviceWithUpdatedAt.itemNumber,
        suppliersArticleNumber: serviceWithUpdatedAt.suppliersArticleNumber,
        externalArticleNumber: serviceWithUpdatedAt.externalArticleNumber,
        updatedAt: serviceWithUpdatedAt.updatedAt,
      })
      .where(eq(services.serviceID, id))
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
    serviceID: ServiceID(servicesDetail.serviceID),
    serviceName: ServiceName(servicesDetail.name),
    serviceCategoryID: ServiceCategoryID(servicesDetail.serviceCategoryID),

    serviceIncludeInAutomaticSms: ServiceIncludeInAutomaticSms(
      servicesDetail.includeInAutomaticSms,
    ),
    serviceHidden: ServiceHidden(servicesDetail.hidden),
    serviceCallInterval: ServiceCallInterval(servicesDetail.callInterval),
    serviceColorForService: serviceColor,
    serviceWarrantyCard: ServiceWarrantyCard(servicesDetail.warrantyCard),
    serviceItemNumber: ServiceItemNumber(servicesDetail.itemNumber),

    serviceSuppliersArticleNumber: ServiceSuppliersArticleNumber(
      servicesDetail.suppliersArticleNumber,
    ),
    serviceExternalArticleNumber: ServiceExternalArticleNumber(
      servicesDetail.externalArticleNumber,
    ),
    createdAt: servicesDetail.createdAt,
    updatedAt: servicesDetail.updatedAt,
  }
}
