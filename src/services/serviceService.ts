import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { db } from '../config/db-connect.js'

import { listServiceOrderByEnum, serviceOrderEnum } from '../routes/services/serviceSchema.js'

import {
  Award,
  LocalServiceID,
  ServiceCallInterval,
  ServiceCategoryID,
  ServiceCostDinero,
  ServiceCostNumber,
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
  StoreID,
  colorForService,
  localServiceVariants,
  localServices,
  serviceCategories,
  serviceVariants,
  services,
} from '../schema/schema.js'

import Dinero from 'dinero.js'

import { Limit, Offset, Page, Search } from '../plugins/pagination.js'

import { Either, errorHandling, left, match, right } from '../utils/helper.js'

type ServiceVariantBase = {
  name: ServiceName
  award: Award
  cost: ServiceCostDinero
  day1?: ServiceDay1
  day2?: ServiceDay2
  day3?: ServiceDay3
  day4?: ServiceDay4
  day5?: ServiceDay5
}
export type ServiceVariant = ServiceVariantBase & { serviceID: ServiceID }
export type LocalServiceVariant = ServiceVariantBase & { localServiceID: LocalServiceID }

export type ServicesPaginated = {
  totalItems: number
  totalPage: number
  perPage: Page
  localServices: LocalServiceVariant[]
  Services: ServiceVariant[]
}

export type ColorForService = (typeof colorForService)[number]

type ServiceBase = {
  name: ServiceName
  cost: ServiceCostDinero
  award: Award
  serviceCategoryID: ServiceCategoryID
  includeInAutomaticSms: ServiceIncludeInAutomaticSms
  hidden: ServiceHidden
  callInterval?: ServiceCallInterval
  colorForService?: ColorForService
  warrantyCard?: ServiceWarrantyCard
  itemNumber?: ServiceItemNumber
  suppliersArticleNumber?: ServiceSuppliersArticleNumber
  externalArticleNumber?: ServiceExternalArticleNumber
  day1?: ServiceDay1
  day2?: ServiceDay2
  day3?: ServiceDay3
  day4?: ServiceDay4
  day5?: ServiceDay5
}

export type ServiceCreate = ServiceBase & {
  serviceVariants: ServiceVariant[]
}
export type LocalServiceCreate = ServiceBase & {
  storeID: StoreID
  localServiceVariants: LocalServiceVariant[]
}

export type Service = ServiceCreate & { serviceID: ServiceID; serviceVariants: ServiceVariant[] }
export type LocalService = LocalServiceCreate & { localServiceID: LocalServiceID }

function convertToColorEnum(str: string): ColorForService | undefined {
  if (colorForService.includes(str as ColorForService)) {
    return str as ColorForService
  }
  return undefined
}

type ServiceUnBranded = {
  name: ServiceName
  cost: number
  award: Award
  currency: string
  storeID?: StoreID
  serviceCategoryID: ServiceCategoryID
  includeInAutomaticSms: ServiceIncludeInAutomaticSms
  hidden: ServiceHidden
  callInterval: ServiceCallInterval | null
  colorForService: string | null
  warrantyCard: ServiceWarrantyCard | null
  itemNumber: ServiceItemNumber | null
  suppliersArticleNumber: ServiceSuppliersArticleNumber | null
  externalArticleNumber: ServiceExternalArticleNumber | null
  day1: ServiceDay1 | null
  day2: ServiceDay2 | null
  day3: ServiceDay3 | null
  day4: ServiceDay4 | null
  day5: ServiceDay5 | null
} & ({ serviceID: ServiceID } | { localServiceID: LocalServiceID; storeID: StoreID })

function brander(rawService: ServiceUnBranded): Either<string, Service | LocalService> {
  let id:
    | { serviceID: ServiceID; serviceVariants: ServiceVariant[] }
    | {
        localServiceID: LocalServiceID
        localServiceVariants: LocalServiceVariant[]
        storeID: StoreID
      }

  if ('serviceID' in rawService) {
    id = { serviceID: rawService.serviceID, serviceVariants: [] }
  } else {
    id = {
      localServiceID: rawService.localServiceID,
      localServiceVariants: [],
      storeID: rawService.storeID,
    }
  }

  return rawService
    ? right({
        ...{
          name: rawService.name,
          serviceCategoryID: rawService.serviceCategoryID,
          cost: ServiceCostDinero(
            Dinero({
              amount: rawService.cost,
              currency: rawService.currency as Dinero.Currency,
            }),
          ),
          award: rawService.award,
          includeInAutomaticSms: rawService.includeInAutomaticSms,
          hidden: rawService.hidden,
          callInterval: rawService.callInterval ?? undefined,
          colorForService: rawService.colorForService
            ? convertToColorEnum(rawService.colorForService)
            : undefined,
          warrantyCard: rawService.warrantyCard ?? undefined,
          itemNumber: rawService.itemNumber ?? undefined,
          suppliersArticleNumber: rawService.suppliersArticleNumber ?? undefined,
          externalArticleNumber: rawService.externalArticleNumber ?? undefined,
          day1: rawService.day1 ?? undefined,
          day2: rawService.day2 ?? undefined,
          day3: rawService.day3 ?? undefined,
          day4: rawService.day4 ?? undefined,
          day5: rawService.day5 ?? undefined,
        },
        ...id,
      })
    : left("couldn't add service")
}

function isServiceID(serviceID: ServiceID | LocalServiceID): serviceID is ServiceID {
  return (serviceID as ServiceID).__type__ === ' serviceID'
}
export async function createService(
  service: ServiceCreate | LocalServiceCreate,
): Promise<Either<string, Service | LocalService>> {
  const color: ColorForService = service.colorForService || 'None'

  const currency = service.cost.getCurrency()
  const cost = ServiceCostNumber(service.cost.getAmount())
  const addToService = {
    name: service.name,
    serviceCategoryID: service.serviceCategoryID,
    currency: currency,
    cost: cost,
    award: service.award,
    includeInAutomaticSms: service.includeInAutomaticSms,
    hidden: service.hidden,
    callInterval: service.callInterval,
    colorForService: color,
    warrantyCard: service.warrantyCard,
    itemNumber: service.itemNumber,
    suppliersArticleNumber: service.suppliersArticleNumber,
    externalArticleNumber: service.externalArticleNumber,
    day1: service.day1,
    day2: service.day2,
    day3: service.day3,
    day4: service.day4,
    day5: service.day5,
  }

  try {
    return await db.transaction(async (tx) => {
      let insertedService
      if ('storeID' in service) {
        insertedService = await tx
          .insert(localServices)
          .values({ ...addToService, storeID: service.storeID })
          .returning()
      } else {
        insertedService = await tx
          .insert(services)
          .values({ ...addToService })
          .returning()
      }
      const insertedServiceBranded: Either<string, Service | LocalService> = brander(
        insertedService[0],
      )

      if ('localServiceID' in insertedService[0] && 'localServiceVariants' in service) {
        const serviceVariantArr = []
        for (const serviceVariant of service.localServiceVariants || []) {
          const variantCurrency = serviceVariant.cost.getCurrency()
          const variantCost = ServiceCostNumber(serviceVariant.cost.getAmount())
          serviceVariantArr.push({
            localServiceID: insertedService[0].localServiceID,
            name: serviceVariant.name,
            cost: variantCost,
            currency: variantCurrency,
            award: serviceVariant.award,
            day1: serviceVariant.day1,
            day2: serviceVariant.day2,
            day3: serviceVariant.day3,
            day4: serviceVariant.day4,
            day5: serviceVariant.day5,
          })
        }
        const variants = await tx.insert(localServiceVariants).values(serviceVariantArr).returning()

        let variantsDinero: LocalServiceVariant[] = []
        if (variants != null) {
          variantsDinero = variants.map((vari) => {
            return {
              localServiceID: vari.localServiceID,
              name: vari.name,
              cost: ServiceCostDinero(
                Dinero({
                  amount: vari.cost,
                  currency: vari.currency as Dinero.Currency,
                }),
              ),
              award: vari.award,
              day1: vari.day1 ?? undefined,
              day2: vari.day2 ?? undefined,
              day3: vari.day3 ?? undefined,
              day4: vari.day4 ?? undefined,
              day5: vari.day5 ?? undefined,
            }
          })
        }
        return match(
          insertedServiceBranded,
          (brandedService) => right({ ...brandedService, localServiceVariants: variantsDinero }),
          (err) => left(err),
        )
      } else if ('serviceID' in insertedService[0] && 'serviceVariants' in service) {
        const serviceVariantArr = []
        for (const serviceVariant of service.serviceVariants || []) {
          const variantCurrency = serviceVariant.cost.getCurrency()
          const variantCost = ServiceCostNumber(serviceVariant.cost.getAmount())
          serviceVariantArr.push({
            serviceID: insertedService[0].serviceID,
            name: serviceVariant.name,
            cost: variantCost,
            currency: variantCurrency,
            award: serviceVariant.award,
            day1: serviceVariant.day1,
            day2: serviceVariant.day2,
            day3: serviceVariant.day3,
            day4: serviceVariant.day4,
            day5: serviceVariant.day5,
          })
        }
        const variants = await tx.insert(serviceVariants).values(serviceVariantArr).returning()
        let variantsDinero: ServiceVariant[] = []
        if (variants != null) {
          variantsDinero = variants.map((vari) => {
            return {
              serviceID: vari.serviceVariantID,
              name: vari.name,
              cost: ServiceCostDinero(
                Dinero({
                  amount: vari.cost,
                  currency: vari.currency as Dinero.Currency,
                }),
              ),
              award: vari.award,
              day1: vari.day1 ?? undefined,
              day2: vari.day2 ?? undefined,
              day3: vari.day3 ?? undefined,
              day4: vari.day4 ?? undefined,
              day5: vari.day5 ?? undefined,
            }
          })
        }
        return match(
          insertedServiceBranded,
          (brandedService) => right({ ...brandedService, serviceVariants: variantsDinero }),
          (err) => left(err),
        )
      }
      return left("couldn't create service")
    })
  } catch (e) {
    return left(errorHandling(e))
  }
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

export async function updateServiceByID(
  id: ServiceID | LocalServiceID,
  service: ServiceCreate | LocalServiceCreate,
): Promise<Either<string, Service | LocalService>> {
  const color: ColorForService = service.colorForService || 'None'

  const currency = service.cost.getCurrency()
  const cost = ServiceCostNumber(service.cost.getAmount())
  const addToService = {
    name: service.name,
    serviceCategoryID: service.serviceCategoryID,
    currency: currency,
    cost: cost,
    award: service.award,
    includeInAutomaticSms: service.includeInAutomaticSms,
    hidden: service.hidden,
    callInterval: service.callInterval,
    colorForService: color,
    warrantyCard: service.warrantyCard,
    itemNumber: service.itemNumber,
    suppliersArticleNumber: service.suppliersArticleNumber,
    externalArticleNumber: service.externalArticleNumber,
    day1: service.day1,
    day2: service.day2,
    day3: service.day3,
    day4: service.day4,
    day5: service.day5,
    updatedAt: new Date(),
  }

  if (isServiceID(id)) {
  return await db.transaction(async (tx) => {
    const [updatedService] = await tx
      .update(services)
      .set(addToService)
      .where(eq(services.serviceID, id))
      .returning()
    if (updatedService == null) {
      return undefined
    }
    //    delete all existing variants and insert fresh
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

export async function getServiceById(
  serviceID: ServiceID | LocalServiceID,
): Promise<Either<string, Service | LocalService>> {
  try {
    let servicesDetail
    if (isServiceID(serviceID)) {
      servicesDetail = await db.query.services.findFirst({
        where: eq(services.serviceID, serviceID),
        with: {
          serviceCategories: true,
          serviceVariants: true,
        },
      })
    } else {
      servicesDetail = await db.query.localServices.findFirst({
        where: eq(localServices.localServiceID, serviceID),
        with: {
          serviceCategories: true,
          serviceVariants: true,
        },
      })
    }
    return servicesDetail ? brander(servicesDetail) : left("Couldn't find service")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deletetServiceById(
  serviceID: ServiceID | LocalServiceID,
): Promise<Either<string, Service | LocalService>> {
  try {
    let servicesDetail
    if (isServiceID(serviceID)) {
      servicesDetail = await db
        .delete(services)
        .where(eq(services.serviceID, serviceID))
        .returning()
    } else {
      servicesDetail = await db
        .delete(localServices)
        .where(eq(localServices.localServiceID, serviceID))
        .returning()
    }
    return servicesDetail ? brander(servicesDetail[0]) : left("Couldn't find service")
  } catch (e) {
    return left(errorHandling(e))
  }
}
