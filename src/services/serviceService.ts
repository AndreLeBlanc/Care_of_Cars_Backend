import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { db } from '../config/db-connect.js'

import { listServiceOrderByEnum, serviceOrderEnum } from '../routes/services/serviceSchema.js'

import {
  Award,
  ColorForService,
  GlobalQualID,
  LocalQualID,
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
  localServiceGlobalQualifications,
  localServiceLocalQualifications,
  localServiceVariants,
  localServices,
  serviceCategories,
  serviceLocalQualifications,
  serviceQualifications,
  serviceVariants,
  services,
} from '../schema/schema.js'

import Dinero, { Currency } from 'dinero.js'

import { Limit, Offset, Page, Search } from '../plugins/pagination.js'

import { Either, Right, errorHandling, isRight, left, match, right } from '../utils/helper.js'
import { LocalOrGlobal } from './productService.js'

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

export type LocalServiceLocalQual = {
  localServiceID: LocalServiceID
  localQualID: LocalQualID
}

export type LocalServiceGlobalQual = {
  localServiceID: LocalServiceID
  globalQualID: GlobalQualID
}

export type ServiceLocalQual = {
  serviceID: ServiceID
  localQualID: LocalQualID
}

export type ServiceGlobalQual = {
  serviceID: ServiceID
  globalQualID: GlobalQualID
}

export type LocalServiceQuals = {
  localQuals: LocalQualID[]
  globalQuals: GlobalQualID[]
}

export type GlobalServiceQuals = {
  localQuals: LocalQualID[]
  globalQuals: GlobalQualID[]
}

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
        const serviceVariantArr = service.localServiceVariants.map((serviceVariant) => ({
          serviceVariantID: serviceVariant.serviceVariantID,
          localServiceID: insertedService.localServiceID,
          name: serviceVariant.name,
          cost: ServiceCostNumber(serviceVariant.cost.getAmount()),
          currency: serviceVariant.cost.getCurrency(),
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
          (err) => left(errorHandling(err)),
        )
      } else if ('serviceID' in insertedService && 'serviceVariants' in service) {
        const serviceVariantArr = service.serviceVariants.map((serviceVariant) => ({
          serviceVariantID: serviceVariant.serviceVariantID,
          serviceID: insertedService.serviceID,
          name: serviceVariant.name,
          cost: ServiceCostNumber(serviceVariant.cost.getAmount()),
          currency: serviceVariant.cost.getCurrency(),
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

export async function getServiceById(serviceID: {
  type: LocalOrGlobal
  id: ServiceID | LocalServiceID
}): Promise<Either<string, Service | LocalService>> {
  try {
    if (serviceID.type === 'Global') {
      const servicesDetail = await db
        .select()
        .from(services)
        .where(eq(services.serviceID, serviceID.id as ServiceID))
        .leftJoin(serviceVariants, eq(serviceVariants.serviceID, services.serviceID))

      const variants = servicesDetail.reduce<ServiceVariant[]>((acc, serviceVariant) => {
        if (serviceVariant.serviceVariants != null) {
          acc.push({
            serviceVariantID: serviceVariant.serviceVariants.serviceVariantID,
            serviceID: serviceVariant.services.serviceID,
            name: serviceVariant.serviceVariants.name,
            cost: ServiceCostDinero(
              Dinero({
                amount: serviceVariant.serviceVariants.cost,
                currency: serviceVariant.serviceVariants.currency as Currency,
              }),
            ),
            award: serviceVariant.serviceVariants.award,
            day1: serviceVariant.serviceVariants.day1 ?? undefined,
            day2: serviceVariant.serviceVariants.day2 ?? undefined,
            day3: serviceVariant.serviceVariants.day3 ?? undefined,
            day4: serviceVariant.serviceVariants.day4 ?? undefined,
            day5: serviceVariant.serviceVariants.day5 ?? undefined,
          })
        }
        return acc
      }, [])

      const branded = brander(servicesDetail[0].services)
      return match(
        branded,
        (brandedService) => right({ ...brandedService, serviceVariants: variants }),
        (err) => {
          return left(err)
        },
      )
    } else {
      const servicesDetail = await db
        .select()
        .from(localServices)
        .where(eq(localServices.localServiceID, serviceID.id as LocalServiceID))
        .leftJoin(
          localServiceVariants,
          eq(localServiceVariants.localServiceID, serviceID.id as LocalServiceID),
        )

      const variants = servicesDetail.reduce<LocalServiceVariant[]>((acc, serviceVariant) => {
        if (serviceVariant.localServiceVariants != null) {
          acc.push({
            serviceVariantID: serviceVariant.localServiceVariants.serviceVariantID,
            localServiceID: serviceVariant.localServices.localServiceID,
            name: serviceVariant.localServiceVariants.name,
            cost: ServiceCostDinero(
              Dinero({
                amount: serviceVariant.localServiceVariants.cost,
                currency: serviceVariant.localServiceVariants.currency as Currency,
              }),
            ),
            award: serviceVariant.localServiceVariants.award,
            day1: serviceVariant.localServiceVariants.day1 ?? undefined,
            day2: serviceVariant.localServiceVariants.day2 ?? undefined,
            day3: serviceVariant.localServiceVariants.day3 ?? undefined,
            day4: serviceVariant.localServiceVariants.day4 ?? undefined,
            day5: serviceVariant.localServiceVariants.day5 ?? undefined,
          })
        }
        return acc
      }, [])
      const branded = brander(servicesDetail[0].localServices)
      return match(
        branded,
        (brandedService) => right({ ...brandedService, serviceVariants: variants }),
        (err) => {
          return left(errorHandling(err))
        },
      )
    }
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deletetServiceById(serviceID: {
  type: LocalOrGlobal
  id: ServiceID | LocalServiceID
}): Promise<Either<string, Service | LocalService>> {
  try {
    let servicesDetail
    if (serviceID.type === 'Global') {
      servicesDetail = await db
        .delete(services)
        .where(eq(services.serviceID, serviceID.id as ServiceID))
        .returning()
    } else {
      servicesDetail = await db
        .delete(localServices)
        .where(eq(localServices.localServiceID, serviceID.id as LocalServiceID))
        .returning()
    }
    return servicesDetail ? brander(servicesDetail[0]) : left("Couldn't find service")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function setServiceQualifications(
  serviceQual: ServiceGlobalQual,
): Promise<Either<string, ServiceGlobalQual>> {
  try {
    const [newQualForService] = await db
      .insert(serviceQualifications)
      .values(serviceQual)
      .returning()
    return newQualForService
      ? right(newQualForService)
      : left("couldn't assign qualification to service")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function setServiceLocalQual(
  serviceQual: ServiceLocalQual,
): Promise<Either<string, ServiceLocalQual>> {
  try {
    const [newQualForService] = await db
      .insert(serviceLocalQualifications)
      .values(serviceQual)
      .returning()
    return newQualForService
      ? right(newQualForService)
      : left("couldn't assign local qualification to service")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function setLocalServiceQualifications(
  serviceQual: LocalServiceGlobalQual,
): Promise<Either<string, LocalServiceGlobalQual>> {
  try {
    const [newQualForService] = await db
      .insert(localServiceGlobalQualifications)
      .values(serviceQual)
      .returning()
    return newQualForService
      ? right(newQualForService)
      : left("couldn't assign local qualification to service")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function setLocalServiceLocalQual(
  serviceQual: LocalServiceLocalQual,
): Promise<Either<string, LocalServiceLocalQual>> {
  try {
    const [newQualForService] = await db
      .insert(localServiceLocalQualifications)
      .values(serviceQual)
      .returning()
    return newQualForService
      ? right(newQualForService)
      : left("couldn't assign local qualification to local service")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getServiceQualifications(
  serviceID: ServiceID,
): Promise<Either<string, GlobalServiceQuals>> {
  try {
    const newQualForService = await db
      .select()
      .from(serviceQualifications)
      .where(and(eq(serviceQualifications.serviceID, serviceID)))
      .fullJoin(serviceLocalQualifications, eq(serviceLocalQualifications.serviceID, serviceID))

    const qualsList = newQualForService.reduce(
      (acc, qual) => {
        if (qual.serviceLocalQualifications != null) {
          acc.localQuals.push(qual.serviceLocalQualifications.localQualID)
        }
        if (qual.serviceQualifications != null) {
          acc.globalQuals.push(qual.serviceQualifications.globalQualID)
        }
        return acc
      },
      {
        localQuals: [] as LocalQualID[],
        globalQuals: [] as GlobalQualID[],
      },
    )
    return qualsList ? right(qualsList) : left("Couldn't get qualifications ")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getLocalServiceQualifications(
  localServiceID: LocalServiceID,
): Promise<Either<string, LocalServiceQuals>> {
  try {
    const newQualForService = await db
      .select()
      .from(localServiceGlobalQualifications)
      .where(and(eq(localServiceGlobalQualifications.localServiceID, localServiceID)))
      .fullJoin(
        localServiceLocalQualifications,
        eq(localServiceLocalQualifications.localServiceID, localServiceID),
      )

    const qualsList = newQualForService.reduce(
      (acc, qual) => {
        if (qual.localServiceLocalQualifications != null) {
          acc.localQuals.push(qual.localServiceLocalQualifications.localQualID)
        }
        if (qual.localServiceGlobalQualifications != null) {
          acc.globalQuals.push(qual.localServiceGlobalQualifications.globalQualID)
        }
        return acc
      },
      {
        localQuals: [] as LocalQualID[],
        globalQuals: [] as GlobalQualID[],
      },
    )
    return qualsList ? right(qualsList) : left("Couldn't get qualifications ")
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteServiceQualifications(
  serviceID: ServiceID,
  localQualID?: LocalQualID,
  globalQualID?: GlobalQualID,
): Promise<Either<string, GlobalServiceQuals>> {
  try {
    const qualList = await db.transaction(async (tx) => {
      let quals: { globalQuals: GlobalQualID }[] = []
      let localQuals: { localQuals: LocalQualID }[] = []
      if (globalQualID != null) {
        quals = await tx
          .delete(serviceQualifications)
          .where(eq(serviceQualifications.serviceID, serviceID))
          .returning({ globalQuals: serviceQualifications.globalQualID })
      }
      if (localQualID != null) {
        localQuals = await tx
          .delete(serviceLocalQualifications)
          .where(eq(serviceLocalQualifications.serviceID, serviceID))
          .returning({ localQuals: serviceLocalQualifications.localQualID })
      }
      if (quals != null && localQuals != null) {
        return right({
          localQuals: localQuals.map((x) => x.localQuals),
          globalQuals: quals.map((x) => x.globalQuals),
        })
      } else {
        return left("couldn't find qualifications ")
      }
    })
    return qualList
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deleteLocalServiceQualifications(
  localServiceID: LocalServiceID,
  localQualID?: LocalQualID,
  globalQualID?: GlobalQualID,
): Promise<Either<string, LocalServiceQuals>> {
  try {
    const qualList = await db.transaction(async (tx) => {
      let quals: { globalQuals: GlobalQualID }[] = []
      let localQuals: { localQuals: LocalQualID }[] = []
      if (globalQualID != null) {
        quals = await tx
          .delete(localServiceGlobalQualifications)
          .where(eq(localServiceGlobalQualifications.localServiceID, localServiceID))
          .returning({ globalQuals: localServiceGlobalQualifications.globalQualID })
      }
      if (localQualID != null) {
        localQuals = await tx
          .delete(localServiceLocalQualifications)
          .where(eq(localServiceLocalQualifications.localServiceID, localServiceID))
          .returning({ localQuals: localServiceLocalQualifications.localQualID })
      }

      if (quals != null && localQuals != null) {
        return right({
          localQuals: localQuals.map((x) => x.localQuals),
          globalQuals: quals.map((x) => x.globalQuals),
        })
      } else {
        return left("couldn't find qualifications ")
      }
    })
    return qualList
  } catch (e) {
    return left(errorHandling(e))
  }
}
