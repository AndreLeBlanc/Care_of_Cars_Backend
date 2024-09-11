import { and, asc, desc, eq, getTableColumns, ilike, isNull, or, sql } from 'drizzle-orm'
import { db } from '../config/db-connect.js'

import { listServiceOrderByEnum, serviceOrderEnum } from '../routes/services/serviceSchema.js'

import {
  Award,
  ColorForService,
  GlobalQualID,
  LocalQualID,
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
  serviceCategories,
  serviceLocalQualifications,
  serviceQualifications,
  serviceVariants,
  services,
} from '../schema/schema.js'

import Dinero, { Currency } from 'dinero.js'

import { Limit, Offset, Page, Search } from '../plugins/pagination.js'

import {
  Either,
  Right,
  errorHandling,
  isRight,
  jsonAggBuildObject,
  left,
  match,
  right,
} from '../utils/helper.js'

type ServiceVariant = {
  serviceID?: ServiceID
  serviceVariantID?: ServiceID
  name: ServiceName
  award: Award
  cost: ServiceCostDinero
  day1?: ServiceDay1
  day2?: ServiceDay2
  day3?: ServiceDay3
  day4?: ServiceDay4
  day5?: ServiceDay5
}
type ServiceVariantUnBranded = {
  serviceID?: ServiceID
  serviceVariantID?: ServiceID
  name: ServiceName
  award: Award
  cost: ServiceCostNumber
  currency: string
  day1: ServiceDay1 | null
  day2: ServiceDay2 | null
  day3: ServiceDay3 | null
  day4: ServiceDay4 | null
  day5: ServiceDay5 | null
}

export type ServicesPaginated = {
  totalServices: number
  totalPage: number
  perPage: Page
  services: (Omit<Service, 'colorForService'> & { colorForService: ColorForService })[]
}

export type ServiceBase = {
  name: ServiceName
  storeID?: StoreID
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

type DeletedServiceVariant = {
  serviceVariantID: ServiceID
  name: ServiceName
}

export type Service = ServiceCreate & { serviceID: ServiceID; serviceVariants: ServiceVariant[] }
export type ServicePatch = ServiceCreate & {
  serviceID: ServiceID
  serviceVariants: ServiceVariant[]
  deletedVariants: DeletedServiceVariant[]
}

export type ServiceLocalQual = {
  serviceID: ServiceID
  localQualID: LocalQualID
}

export type ServiceGlobalQual = {
  serviceID: ServiceID
  globalQualID: GlobalQualID
}

export type GlobalServiceQuals = {
  localQuals: LocalQualID[]
  globalQuals: GlobalQualID[]
}

type ServVariantOrderList = {
  name: ServiceName
  cost: ServiceCostNumber
  day1?: ServiceDay1
  day2?: ServiceDay2
  day3?: ServiceDay3
  day4?: ServiceDay4
  day5?: ServiceDay5
  serviceVariantID: ServiceID
}

export type ServiceOrder = {
  serviceID: ServiceID
  name: ServiceName
  cost: ServiceCostNumber
  serviceVariants: ServVariantOrderList[]
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
  storeID: StoreID | null
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
  serviceID: ServiceID
}

function brander(rawService: ServiceUnBranded): Either<string, Service> {
  return rawService
    ? right({
        serviceID: rawService.serviceID,
        serviceCategoryID: rawService.serviceCategoryID,
        storeID: rawService.storeID ?? undefined,
        name: rawService.name,
        cost: ServiceCostDinero(
          Dinero({
            amount: rawService.cost,
            currency: rawService.currency as Dinero.Currency,
          }),
        ),
        award: rawService.award,
        includeInAutomaticSms: rawService.includeInAutomaticSms,
        hidden: rawService.hidden,
        serviceVariants: [],
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
      })
    : left("couldn't add service")
}

export async function createService(
  service: ServiceCreate & { serviceID?: ServiceID },
  deleteServiceVariants: ServiceID[],
): Promise<Either<string, ServicePatch>> {
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
      const [insertedService] = service.serviceID
        ? await tx
            .update(services)
            .set({ ...addToService, storeID: service.storeID })
            .where(eq(services.serviceID, service.serviceID))
            .returning()
        : await tx
            .insert(services)
            .values({ ...addToService, storeID: service.storeID })
            .returning()

      const insertedServiceBranded: Either<string, Service> = brander(insertedService)

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

      let variants: ServiceVariantUnBranded[] = []
      if (0 < serviceVariantArr.length) {
        variants = await tx
          .insert(serviceVariants)
          .values(serviceVariantArr)
          .onConflictDoUpdate({
            target: serviceVariants.serviceVariantID,
            set: {
              serviceVariantID: sql`"excluded"."serviceVariantID"`,
              serviceID: sql`"excluded"."serviceID"`,
              name: sql`"excluded"."name"`,
              cost: sql`"excluded"."cost"`,
              currency: sql`"excluded"."currency"`,
              award: sql`"excluded"."award"`,
              day1: sql`"excluded"."day1"`,
              day2: sql`"excluded"."day2"`,
              day3: sql`"excluded"."day3"`,
              day4: sql`"excluded"."day4"`,
              day5: sql`"excluded"."day5"`,
              updatedAt: sql`"excluded"."updatedAt"`,
            },
          })
          .returning()
      }

      let deletedVariants: DeletedServiceVariant[] = []
      if (0 < deleteServiceVariants.length) {
        deletedVariants = await tx
          .delete(serviceVariants)
          .where(sql`${serviceVariants.serviceVariantID} IN ${deleteServiceVariants}`)
          .returning({
            serviceVariantID: serviceVariants.serviceVariantID,
            name: serviceVariants.name,
          })
      }

      let variantsDinero: ServiceVariant[] = []
      if (variants != null) {
        variantsDinero = variants.flat().map((vari) => {
          return {
            serviceVariantID: vari.serviceVariantID,
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
        (brandedService) =>
          right({ ...brandedService, serviceVariants: variantsDinero, deletedVariants }),
        (err) => left(err),
      )
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
  let condition = and(
    eq(services.hidden, hidden),
    or(
      ilike(services.name, '%' + search + '%'),
      ilike(services.itemNumber, '%' + search + '%'),
      ilike(services.suppliersArticleNumber, '%' + search + '%'),
      ilike(services.externalArticleNumber, '%' + search + '%'),
    ),
  )

  condition = storeID
    ? and(condition, or(isNull(services.storeID), eq(services.storeID, storeID)))
    : condition

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

      const branded = servicesList.map(brander)
      const brandedRight: Right<Service>[] = branded.filter(isRight)
      const serviceListReady: Service[] = brandedRight.reduce<Service[]>((acc, x) => {
        if ('serviceID' in x.right) {
          acc.push(x.right)
        }
        return acc
      }, [])

      const totalPage: number = Math.ceil(totalItems.count / limit)
      return right({
        totalServices: totalServices.count,
        totalPage,
        perPage: page,
        services: serviceListReady,
      })
    })
    return res
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getServicesWithVariants(
  store: StoreID,
): Promise<Either<string, ServiceOrder[]>> {
  try {
    const condition = store
      ? and(
          eq(services.hidden, ServiceHidden(false)),
          or(eq(services.storeID, store), isNull(services.storeID)),
        )
      : eq(services.hidden, ServiceHidden(false))
    const servs = await db
      .select({
        serviceID: services.serviceID,
        name: services.name,
        cost: services.cost,
        day1: services.day1,
        day2: services.day2,
        day3: services.day3,
        day4: services.day4,
        day5: services.day5,
        serviceVariants: sql<ServVariantOrderList[]>`
        COALESCE(
          jsonb_agg(
            CASE WHEN ${serviceVariants.serviceID} IS NOT NULL THEN
              jsonb_build_object(
                'name', ${serviceVariants.name},
                'serviceVariantID', ${serviceVariants.serviceVariantID},
                'cost', ${serviceVariants.cost},
                'day1', ${serviceVariants.day1},
                'day2', ${serviceVariants.day2},
                'day3', ${serviceVariants.day3},
                'day4', ${serviceVariants.day4},
                'day5', ${serviceVariants.day5}
              )
            ELSE NULL END
          ) FILTER (WHERE ${serviceVariants.serviceID} IS NOT NULL),
          '[]'::jsonb
        )
      `,
      })
      .from(services)
      .where(condition)
      .leftJoin(serviceVariants, eq(serviceVariants.serviceID, services.serviceID))
      .groupBy(services.serviceID)

    return right(servs)
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function getServiceById(id: ServiceID): Promise<Either<string, Service>> {
  try {
    const [servicesDetail] = await db
      .select({
        serviceID: services.serviceID,
        serviceCategoryID: services.serviceCategoryID,
        name: services.name,
        storeID: services.storeID,
        currency: services.currency,
        cost: services.cost,
        includeInAutomaticSms: services.includeInAutomaticSms,
        hidden: services.hidden,
        callInterval: services.callInterval,
        colorForService: services.colorForService,
        warrantyCard: services.warrantyCard,
        itemNumber: services.itemNumber,
        award: services.award,
        suppliersArticleNumber: services.suppliersArticleNumber,
        externalArticleNumber: services.externalArticleNumber,
        day1: services.day1,
        day2: services.day2,
        day3: services.day3,
        day4: services.day4,
        day5: services.day5,
        createdAt: services.createdAt,
        updatedAt: services.updatedAt,
        serviceVariants: jsonAggBuildObject(getTableColumns(serviceVariants)),
      })
      .from(services)
      .where(eq(services.serviceID, id))
      .leftJoin(serviceVariants, eq(serviceVariants.serviceID, id))
      .groupBy(services.serviceID)

    let variants: ServiceVariant[] = []

    if (servicesDetail.serviceVariants) {
      variants = servicesDetail.serviceVariants.reduce<ServiceVariant[]>((acc, serviceVariant) => {
        if (serviceVariants != null) {
          acc.push({
            serviceVariantID: serviceVariant.serviceVariantID,
            serviceID: serviceVariant.serviceID,
            name: serviceVariant.name,
            cost: ServiceCostDinero(
              Dinero({
                amount: serviceVariant.cost,
                currency: serviceVariant.currency as Currency,
              }),
            ),
            award: serviceVariant.award,
            day1: serviceVariant.day1 ?? undefined,
            day2: serviceVariant.day2 ?? undefined,
            day3: serviceVariant.day3 ?? undefined,
            day4: serviceVariant.day4 ?? undefined,
            day5: serviceVariant.day5 ?? undefined,
          })
        }
        return acc
      }, [])
    }
    const branded = brander(servicesDetail)
    return match(
      branded,
      (brandedService) => right({ ...brandedService, serviceVariants: variants }),
      (err) => {
        return left(errorHandling(err))
      },
    )
  } catch (e) {
    return left(errorHandling(e))
  }
}

export async function deletetServiceById(id: ServiceID): Promise<Either<string, Service>> {
  try {
    const servicesDetail = await db.delete(services).where(eq(services.serviceID, id)).returning()
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
