import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { db } from '../config/db-connect.js'
import {
  CreateServiceSchemaType,
  listServiceOrderByEnum,
  serviceOrderEnum,
} from '../routes/services/serviceSchema.js'
import { serviceCategories, serviceVariants, services } from '../schema/schema.js'

export type serviceID = { serviceID: number }

export async function createService(service: CreateServiceSchemaType): Promise<serviceID> {
  return await db.transaction(async (tx) => {
    const [insertedService] = await tx
      .insert(services)
      .values({
        name: service.name,
        serviceCategoryId: service.serviceCategoryId,
        includeInAutomaticSms: service.includeInAutomaticSms,
        hidden: service.hidden,
        callInterval: service.callInterval,
        colorOnDuty: service.colorOnDuty,
        warantyCard: service.warantyCard,
        itermNumber: service.itermNumber,
        suppliersArticleNumber: service.suppliersArticleNumber,
        externalArticleNumber: service.externalArticleNumber,
      })
      .returning({
        serviceID: services.serviceID,
      })
    for (const serviceVariant of service.serviceVariants || []) {
      await tx.insert(serviceVariants).values({
        serviceId: insertedService.serviceID,
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
      ilike(services.itermNumber, '%' + search + '%'),
      ilike(services.suppliersArticleNumber, '%' + search + '%'),
      ilike(services.externalArticleNumber, '%' + search + '%'),
    ),
  )
  let orderCondition = desc(services.serviceID)
  if (order == serviceOrderEnum.desc) {
    if (orderBy == listServiceOrderByEnum.name) {
      orderCondition = desc(services.name)
    } else if (orderBy == listServiceOrderByEnum.serviceCategoryId) {
      orderCondition = desc(serviceCategories.serviceCategoryID)
    } else {
      orderCondition = desc(services.serviceID)
    }
  }

  if (order == serviceOrderEnum.asc) {
    if (orderBy == listServiceOrderByEnum.name) {
      orderCondition = asc(services.name)
    } else if (orderBy == listServiceOrderByEnum.serviceCategoryId) {
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

  // const servicesList = await db
  //   .select({
  //     id: services.serviceID,
  //     description: services.description,
  //     serviceCategoryId: services.serviceCategoryId,
  //     includeInAutomaticSms: services.includeInAutomaticSms,
  //     hidden: services.hidden,
  //     callInterval: services.callInterval,
  //     colorOnDuty: services.colorOnDuty,
  //     warantyCard: services.warantyCard,
  //     itermNumber: services.itermNumber,
  //     suppliersArticleNumber: services.suppliersArticleNumber,
  //     externalArticleNumber: services.externalArticleNumber,
  //     createdAt: services.createdAt,
  //     updatedAt: services.updatedAt,
  //     serviceVariants: serviceVariants,
  //   })
  //   .from(services)
  //   .leftJoin(serviceVariants, eq(services.serviceID, serviceVariants.serviceId))
  //   .where(condition)
  //   //.orderBy(desc(services.serviceID))
  //   .orderBy(orderCondition)
  //   .limit(limit || 10)
  //   .offset(offset || 0)
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
