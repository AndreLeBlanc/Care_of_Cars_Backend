import { asc, desc, ilike, or, sql } from 'drizzle-orm'
import { db } from '../config/db-connect.js'
import {
  CreateServiceSchemaType,
  listServiceOrderByEnum,
  serviceOrderEnum,
} from '../routes/services/serviceSchema.js'
import { serviceVariants, services } from '../schema/schema.js'

export async function createService(service: CreateServiceSchemaType) {
  return await db.transaction(async (tx) => {
    const [insertedService] = await tx
      .insert(services)
      .values({
        description: service.description,
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
        id: services.id,
      })
    for (const serviceVariant of service.serviceVariants || []) {
      await tx.insert(serviceVariants).values({
        description: serviceVariant.description,
        serviceId: insertedService.id,
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
) {
  const condition = or(
    ilike(services.description, '%' + search + '%'),
    ilike(services.itermNumber, '%' + search + '%'),
    ilike(services.suppliersArticleNumber, '%' + search + '%'),
    ilike(services.externalArticleNumber, '%' + search + '%'),
  )
  let orderCondition = desc(services.id)
  if (order == serviceOrderEnum.desc) {
    if (orderBy == listServiceOrderByEnum.description) {
      orderCondition = desc(services.description)
    } else {
      orderCondition = desc(services.id)
    }
  }

  if (order == serviceOrderEnum.asc) {
    if (orderBy == listServiceOrderByEnum.description) {
      orderCondition = asc(services.description)
    } else {
      orderCondition = asc(services.id)
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
  //     id: services.id,
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
  //   .leftJoin(serviceVariants, eq(services.id, serviceVariants.serviceId))
  //   .where(condition)
  //   //.orderBy(desc(services.id))
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
