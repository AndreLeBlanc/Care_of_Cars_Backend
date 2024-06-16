import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { db } from '../config/db-connect.js'

import { listServiceOrderByEnum, serviceOrderEnum } from '../routes/services/serviceSchema.js'

import {
  Award,
  ColorForService,
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

import { Either, Right, errorHandling, isRight, left, match, right } from '../utils/helper.js'

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
export type ServiceVariant = ServiceVariantBase & {
  serviceID?: ServiceID
  serviceVariantID?: ServiceID
}
export type LocalServiceVariant = ServiceVariantBase & {
  localServiceID?: LocalServiceID
  serviceVariantID?: ServiceID
}

export type ServicesPaginated = {
  totalServices: number
  totalLocalServices: number
  totalPage: number
  perPage: Page
  localServices: (Omit<LocalService, 'colorForService'> & { colorForService: ColorForService })[]
  services: (Omit<Service, 'colorForService'> & { colorForService: ColorForService })[]
}

export type ServiceBase = {
  name: ServiceName
  cost: ServiceCostDinero
  award: Award
  serviceCategoryID: ServiceCategoryID
  includeInAutomaticSms: ServiceIncludeInAutomaticSms
  hidden: ServiceHidden
  callInterval?: ServiceCallInterval
  colorForService: ColorForService
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

export function convertToColorEnum(str: string): ColorForService {
  if (colorForService.includes(str as ColorForService)) {
    return str as ColorForService
  }
  return 'None' as ColorForService
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
  colorForService: string
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
            : ('None' as ColorForService),
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
  service:
    | (ServiceCreate & { serviceID?: ServiceID })
    | (LocalServiceCreate & { localServiceID?: LocalServiceID }),
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
      let insertedService: ServiceUnBranded
      if ('storeID' in service) {
        ;[insertedService] = service.localServiceID
          ? await tx
              .update(localServices)
              .set({ ...addToService, storeID: service.storeID })
              .where(eq(localServices.localServiceID, service.localServiceID))
              .returning()
          : await tx
              .insert(localServices)
              .values({ ...addToService, storeID: service.storeID })
              .returning()
      } else {
        ;[insertedService] = service.serviceID
          ? await tx
              .update(services)
              .set(addToService)
              .where(eq(services.serviceID, service.serviceID))
              .returning()
          : await tx
              .insert(services)
              .values({ ...addToService })
              .returning()
      }
      const insertedServiceBranded: Either<string, Service | LocalService> =
        brander(insertedService)

      if ('localServiceID' in insertedService && 'localServiceVariants' in service) {
        const variCurrency = service.cost.getCurrency()
        const variCost = ServiceCostNumber(service.cost.getAmount())
        const serviceVariantArr = service.localServiceVariants.map((serviceVariant) => ({
          serviceVariantID: serviceVariant.serviceVariantID,
          localServiceID: insertedService.localServiceID,
          name: serviceVariant.name,
          cost: variCost,
          currency: variCurrency,
          award: serviceVariant.award,
          day1: serviceVariant.day1,
          day2: serviceVariant.day2,
          day3: serviceVariant.day3,
          day4: serviceVariant.day4,
          day5: serviceVariant.day5,
          updatedAt: new Date(),
        }))

        const variants = await Promise.all(
          serviceVariantArr.map(async (serviceVariant) => {
            if (serviceVariant.serviceVariantID) {
              return await tx
                .update(localServiceVariants)
                .set(serviceVariant)
                .where(eq(localServiceVariants.serviceVariantID, serviceVariant.serviceVariantID))
                .returning()
            } else {
              return await tx.insert(localServiceVariants).values(serviceVariant).returning()
            }
          }),
        )

        let variantsDinero: LocalServiceVariant[] = []
        if (variants != null) {
          variantsDinero = variants.flat().map((vari) => {
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
      } else if ('serviceID' in insertedService && 'serviceVariants' in service) {
        const variCurrency = service.cost.getCurrency()
        const variCost = ServiceCostNumber(service.cost.getAmount())
        const serviceVariantArr = service.serviceVariants.map((serviceVariant) => ({
          serviceVariantID: serviceVariant.serviceVariantID,
          serviceID: insertedService.serviceID,
          name: serviceVariant.name,
          cost: variCost,
          currency: variCurrency,
          award: serviceVariant.award,
          day1: serviceVariant.day1,
          day2: serviceVariant.day2,
          day3: serviceVariant.day3,
          day4: serviceVariant.day4,
          day5: serviceVariant.day5,
          updatedAt: new Date(),
        }))

        const variants = await Promise.all(
          serviceVariantArr.map(async (serviceVariant) => {
            if (serviceVariant.serviceVariantID) {
              return await tx
                .update(serviceVariants)
                .set(serviceVariant)
                .where(eq(serviceVariants.serviceVariantID, serviceVariant.serviceVariantID))
                .returning()
            } else {
              return await tx.insert(serviceVariants).values(serviceVariant).returning()
            }
          }),
        )

        let variantsDinero: ServiceVariant[] = []
        if (variants != null) {
          variantsDinero = variants.flat().map((vari) => {
            return {
              serviceID: vari.serviceID,
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
  storeID: StoreID,
  search: Search,
  limit = Limit(10),
  page = Page(1),
  offset = Offset(0),
  orderBy: listServiceOrderByEnum,
  order: serviceOrderEnum,
  hidden: ServiceHidden = ServiceHidden(true),
): Promise<Either<string, ServicesPaginated>> {
  const condition = and(
    eq(services.hidden, hidden),
    or(
      ilike(services.name, '%' + search + '%'),
      ilike(services.itemNumber, '%' + search + '%'),
      ilike(services.suppliersArticleNumber, '%' + search + '%'),
      ilike(services.externalArticleNumber, '%' + search + '%'),
    ),
  )

  const localCondition = and(
    and(eq(localServices.storeID, storeID), eq(localServices.hidden, hidden)),
    or(
      ilike(localServices.name, '%' + search + '%'),
      ilike(localServices.itemNumber, '%' + search + '%'),
      ilike(localServices.suppliersArticleNumber, '%' + search + '%'),
      ilike(localServices.externalArticleNumber, '%' + search + '%'),
    ),
  )
  let orderCondition

  if (order === serviceOrderEnum.desc) {
    orderCondition =
      orderBy === listServiceOrderByEnum.name
        ? desc(services.name)
        : orderBy === listServiceOrderByEnum.serviceCategoryID
        ? desc(serviceCategories.serviceCategoryID)
        : desc(services.serviceID)
  } else if (order === serviceOrderEnum.asc) {
    orderCondition =
      orderBy === listServiceOrderByEnum.name
        ? asc(services.name)
        : orderBy === listServiceOrderByEnum.serviceCategoryID
        ? asc(serviceCategories.serviceCategoryID)
        : asc(services.serviceID)
  } else {
    orderCondition = desc(services.serviceID) // Default to descending order by service ID
  }
  let orderConditionLocal

  if (order === serviceOrderEnum.desc) {
    orderConditionLocal =
      orderBy === listServiceOrderByEnum.name
        ? desc(services.name)
        : orderBy === listServiceOrderByEnum.serviceCategoryID
        ? desc(serviceCategories.serviceCategoryID)
        : desc(localServices.localServiceID)
  } else if (order === serviceOrderEnum.asc) {
    orderConditionLocal =
      orderBy === listServiceOrderByEnum.name
        ? asc(localServices.name)
        : orderBy === listServiceOrderByEnum.serviceCategoryID
        ? asc(serviceCategories.serviceCategoryID)
        : asc(localServices.localServiceID)
  } else {
    orderConditionLocal = desc(localServices.localServiceID) // Default to descending order by service ID
  }

  try {
    const res = await db.transaction(async (tx) => {
      const [totalItems] = await tx
        .select({
          count: sql`count(*)`.mapWith(Number).as('count'),
        })
        .from(services)
        .where(condition)

      const servicesList = await tx.query.services.findMany({
        where: condition,
        limit: limit || 10,
        offset: offset || 0,
        orderBy: orderCondition,
        with: {
          serviceCategories: true,
          serviceVariants: true,
        },
      })
      const [totalServices] = await tx
        .select({
          count: sql`count(*)`.mapWith(Number).as('count'),
        })
        .from(services)
        .where(condition)

      const [totalLocalServices] = await tx
        .select({
          count: sql`count(*)`.mapWith(Number).as('count'),
        })
        .from(services)
        .where(condition)

      const localServicesList = await tx.query.localServices.findMany({
        where: localCondition,
        limit: limit || 10,
        offset: offset || 0,
        orderBy: orderConditionLocal,
        with: {
          serviceCategories: true,
          localServiceVariants: true,
        },
      })

      const branded = servicesList.map(brander)
      const brandedRight: Right<Service | LocalService>[] = branded.filter(isRight)
      const serviceListReady: Service[] = brandedRight.reduce<Service[]>((acc, x) => {
        if ('serviceID' in x.right) {
          acc.push(x.right)
        }
        return acc
      }, [])

      const brandedLocal = localServicesList.map(brander)
      const brandedLocalRight: Right<Service | LocalService>[] = brandedLocal.filter(isRight)
      const localServiceListReady: LocalService[] = brandedLocalRight.reduce<LocalService[]>(
        (acc, x) => {
          if ('localServiceID' in x.right) {
            acc.push(x.right)
          }
          return acc
        },
        [],
      )

      const totalPage: number = Math.ceil(totalItems.count / limit)
      return right({
        totalServices: totalServices.count,
        totalLocalServices: totalLocalServices.count,
        totalPage,
        perPage: page,
        services: serviceListReady,
        localServices: localServiceListReady,
      })
    })
    return res
  } catch (e) {
    return left(errorHandling(e))
  }
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
