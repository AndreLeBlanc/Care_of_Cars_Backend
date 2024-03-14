import { db } from '../config/db-connect'
import { CreateServiceSchemaType } from '../routes/services/serviceSchema'
import { services } from '../schema/schema'

export async function createService(service: CreateServiceSchemaType) {
  return await db.transaction(async (tx) => {
    return await tx
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
  })
}
