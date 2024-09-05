import fp from 'fastify-plugin'

import * as dotenv from 'dotenv'

import { Either, match } from '../utils/helper.js'

import { Store, StoreCreate, StorePaymentOptions, createStore } from '../services/storeService.js'

import { Service, ServiceCreate, createService } from '../services/serviceService.js'

import { CreateServiceCategory, createServiceCategory } from '../services/categoryService.js'

import { CreateProductCategory, createProductCategory } from '../services/categoryService.js'

import { CreatedRole, createRole } from '../services/roleService.js'
import { CreatedUser, createUser, generatePasswordHash } from '../services/userService.js'

import Dinero from 'dinero.js'

import {
  Award,
  IsSuperAdmin,
  ProductCategoryDescription,
  ProductCategoryName,
  RoleDescription,
  RoleID,
  RoleName,
  ServiceCallInterval,
  ServiceCategoryDescription,
  ServiceCategoryID,
  ServiceCategoryName,
  ServiceCostDinero,
  ServiceDay1,
  ServiceDay2,
  ServiceDay3,
  ServiceDay4,
  ServiceDay5,
  ServiceExternalArticleNumber,
  ServiceHidden,
  ServiceIncludeInAutomaticSms,
  ServiceItemNumber,
  ServiceName,
  ServiceSuppliersArticleNumber,
  ServiceWarrantyCard,
  StoreAddress,
  StoreAllowCarAPI,
  StoreAllowSendSMS,
  StoreBankgiro,
  StoreCity,
  StoreContactPerson,
  StoreCountry,
  StoreDescription,
  StoreEmail,
  StoreFSkatt,
  StoreMaxUsers,
  StoreName,
  StoreOrgNumber,
  StorePaymentdays,
  StorePhone,
  StoreSendSMS,
  StoreStatus,
  StoreUsesCheckin,
  StoreUsesPIN,
  StoreVatNumber,
  StoreWebSite,
  StoreZipCode,
  UserEmail,
  UserFirstName,
  UserLastName,
  UserPassword,
} from '../schema/schema.js'
dotenv.config()

export enum seedResult {
  Failed,
  WrongConfig,
  Success,
  AlreadySeeded,
}

export default fp(async () => {
  async function seedSuperAdmin(): Promise<seedResult> {
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
    try {
      if (typeof superAdminPassword === 'string' && typeof superAdminEmail === 'string') {
        const role: Either<string, CreatedRole> = await createRole(
          RoleName('SuperAdmin'),
          RoleDescription('Super admin user'),
        )

        match(
          role,
          async (createdRole: CreatedRole) => {
            // Below two envs are required in plugins/env.ts so it will throw message in console if not added.
            const passwordHash = await generatePasswordHash(UserPassword(superAdminPassword))
            const user: Either<string, CreatedUser> = await createUser(
              UserFirstName('SuperAdmin'),
              UserLastName('SuperAdmin'),
              UserEmail(superAdminEmail),
              passwordHash,
              RoleID(createdRole.roleID),
              IsSuperAdmin(true),
            )
            console.info('Super admin created from seed!', role, user)
            const roleSecond: Either<string, CreatedRole> = await createRole(
              RoleName('testRole'),
              RoleDescription('second test user'),
            )
            const userSecond: Either<string, CreatedUser> = await createUser(
              UserFirstName('SuperAdmin'),
              UserLastName('SuperAdmin'),
              UserEmail('27CM@HOTMAIL.COM'),
              passwordHash,
              RoleID(createdRole.roleID),
              IsSuperAdmin(true),
            )
            console.info('Second user created from seed!', roleSecond, userSecond)
          },
          (err) => {
            console.log('seed error: ', err)
          },
        )

        const storeInfo: StoreCreate = {
          storeName: StoreName('Vendstore'),
          storeOrgNumber: StoreOrgNumber('14771477'),
          storeStatus: StoreStatus(true),
          storeEmail: StoreEmail('andre@vendfox.com'),
          storePhone: StorePhone('0762757764'),
          storeAddress: StoreAddress('Norrtäljegatan 15a'),
          storeZipCode: StoreZipCode('75327'),
          storeCity: StoreCity('Uppsala'),
          storeCountry: StoreCountry('Sverige'),
          storeDescription: StoreDescription('Discount web agency'),
          storeContactPerson: StoreContactPerson('Blanken'),
          storeMaxUsers: StoreMaxUsers(400),
          storeAllowCarAPI: StoreAllowCarAPI(true),
          storeAllowSendSMS: StoreAllowSendSMS(true),
          storeSendSMS: StoreSendSMS(true),
          storeUsesCheckin: StoreUsesCheckin(true),
          storeUsesPIN: StoreUsesPIN(true),
          storeWebSite: StoreWebSite('vendfox.com'),
          storeVatNumber: StoreVatNumber('123123123'),
          storeFSkatt: StoreFSkatt(true),
        }

        const pay: StorePaymentOptions = {
          bankgiro: StoreBankgiro('2342442123'),
          paymentdays: StorePaymentdays(30),
        }

        const store: Either<
          string,
          {
            store: Store
            paymentInfo: StorePaymentOptions | undefined
            updatedAt: Date
            createdAt: Date
          }
        > = await createStore(storeInfo, pay)
        console.log('created store status: ', store)

        const catService: Either<string, CreateServiceCategory> = await createServiceCategory(
          ServiceCategoryName('seeded service'),
          ServiceCategoryDescription('service created during seed'),
        )
        console.log('created service category status: ', catService)

        const catProduct: Either<string, CreateProductCategory> = await createProductCategory(
          ProductCategoryName('seeded products'),
          ProductCategoryDescription('Products created during seed'),
        )
        console.log('created product category status: ', catProduct)

        match(
          catService,
          async (cat: CreateServiceCategory) => {
            const newService: ServiceCreate = {
              name: ServiceName('init service'),
              cost: ServiceCostDinero(Dinero({ amount: 100, currency: 'SEK' })),
              award: Award(0.01),
              serviceCategoryID: ServiceCategoryID(cat.serviceCategoryID),
              includeInAutomaticSms: ServiceIncludeInAutomaticSms(true),
              hidden: ServiceHidden(false),
              callInterval: ServiceCallInterval(180),
              colorForService: 'None',
              warrantyCard: ServiceWarrantyCard(true),
              itemNumber: ServiceItemNumber('sdf'),
              suppliersArticleNumber: ServiceSuppliersArticleNumber('2342'),
              externalArticleNumber: ServiceExternalArticleNumber('asdf'),
              day1: ServiceDay1('01:30:00'),
              day2: ServiceDay2('01:30:00'),
              day3: ServiceDay3('01:30:00'),
              day4: ServiceDay4('01:30:00'),
              day5: ServiceDay5('01:30:00'),
              serviceVariants: [],
            }

            const service: Either<string, Service> = await createService(newService)
            console.log('created service status: ', service)
          },
          (err: string) => {
            console.log("couldn't create cat: ", err)
          },
        )
        return seedResult.Success
      } else {
        return seedResult.WrongConfig
      }
    } catch (err: unknown) {
      console.error(err)
      return seedResult.Failed
    }
  }
  if (process.env.RUN_SEED === 'true') {
    await seedSuperAdmin()
  }
})

declare module 'fastify' {
  export interface FastifyInstance {
    seedSuperAdmin(): Promise<seedResult>
  }
}
