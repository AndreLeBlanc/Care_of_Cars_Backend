import fp from 'fastify-plugin'

import * as dotenv from 'dotenv'

import { CreateProductCategory, createProductCategory } from '../services/categoryService.js'
import { CreateServiceCategory, createServiceCategory } from '../services/categoryService.js'
import { CreatedRole, createRole } from '../services/roleService.js'
import { CreatedUser, createUser, generatePasswordHash } from '../services/userService.js'
import { Either, match } from '../utils/helper.js'
import { PermissionIDDescName, createPermission } from '../services/permissionService.js'
import { Service, ServiceCreate, createService } from '../services/serviceService.js'
import { Store, StoreCreate, StorePaymentOptions, createStore } from '../services/storeService.js'

import Dinero from 'dinero.js'

import {
  Award,
  IsSuperAdmin,
  PermissionDescription,
  PermissionTitle,
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

export type SeedResult = 'Failed' | 'WrongConfig' | 'Success' | 'AlreadySeeded'

async function seedPermissions(): Promise<SeedResult> {
  try {
    const perms: Either<string, PermissionIDDescName[]> = await createPermission([
      {
        permissionTitle: PermissionTitle('list_permission'),
        description: PermissionDescription('allows user to list permissions'),
      },
      { permissionTitle: PermissionTitle('view_permission') },
      { permissionTitle: PermissionTitle('update_permission') },
      { permissionTitle: PermissionTitle('delete_permission') },
      { permissionTitle: PermissionTitle('assign_user_to_store') },
      { permissionTitle: PermissionTitle('checkin_checkout_employee') },
      { permissionTitle: PermissionTitle('create_bill') },
      { permissionTitle: PermissionTitle('create_customer') },
      { permissionTitle: PermissionTitle('create_order') },
      { permissionTitle: PermissionTitle('create_product') },
      { permissionTitle: PermissionTitle('create_product_category') },
      { permissionTitle: PermissionTitle('create_rent_car') },
      { permissionTitle: PermissionTitle('create_rent_car_booking') },
      { permissionTitle: PermissionTitle('create_role') },
      { permissionTitle: PermissionTitle('create_role_to_permission') },
      { permissionTitle: PermissionTitle('create_service') },
      { permissionTitle: PermissionTitle('create_service_category') },
      { permissionTitle: PermissionTitle('create_store') },
      { permissionTitle: PermissionTitle('create_store_special_opening_hours') },
      { permissionTitle: PermissionTitle('create_user') },
      { permissionTitle: PermissionTitle('customers_users') },
      { permissionTitle: PermissionTitle('delete_company') },
      { permissionTitle: PermissionTitle('delete_driver_car') },
      { permissionTitle: PermissionTitle('delete_employee') },
      { permissionTitle: PermissionTitle('delete_employee_global_qualification') },
      { permissionTitle: PermissionTitle('delete_employee_local_qualification') },
      { permissionTitle: PermissionTitle('delete_employee_special_working_hours') },
      { permissionTitle: PermissionTitle('delete_employee_working_hours') },
      { permissionTitle: PermissionTitle('delete_global_qualification') },
      { permissionTitle: PermissionTitle('delete_local_qualification') },
      { permissionTitle: PermissionTitle('delete_order') },
      { permissionTitle: PermissionTitle('delete_product') },
      { permissionTitle: PermissionTitle('delete_product_category') },
      { permissionTitle: PermissionTitle('delete_rent_car') },
      { permissionTitle: PermissionTitle('delete_rent_car_booking') },
      { permissionTitle: PermissionTitle('delete_role') },
      { permissionTitle: PermissionTitle('delete_role_to_permission') },
      { permissionTitle: PermissionTitle('delete_service_category') },
      { permissionTitle: PermissionTitle('delete_service_quals') },
      { permissionTitle: PermissionTitle('delete_store') },
      { permissionTitle: PermissionTitle('delete_store_opening_hours') },
      { permissionTitle: PermissionTitle('delete_store_special_opening_hours') },
      { permissionTitle: PermissionTitle('delete_user') },
      { permissionTitle: PermissionTitle('delete_user_from_store') },
      { permissionTitle: PermissionTitle('delete_weekly_notes') },
      { permissionTitle: PermissionTitle('get_available_rent_cars') },
      { permissionTitle: PermissionTitle('get_bill') },
      { permissionTitle: PermissionTitle('get_checkin_stats') },
      { permissionTitle: PermissionTitle('get_company_by_id') },
      { permissionTitle: PermissionTitle('get_dashboard') },
      { permissionTitle: PermissionTitle('get_driver_by_id') },
      { permissionTitle: PermissionTitle('get_driver_car') },
      { permissionTitle: PermissionTitle('get_employee') },
      { permissionTitle: PermissionTitle('get_employee_availablities') },
      { permissionTitle: PermissionTitle('get_employee_special_working_hours') },
      { permissionTitle: PermissionTitle('get_employee_special_working_hours_by_date') },
      { permissionTitle: PermissionTitle('get_employee_working_hours') },
      { permissionTitle: PermissionTitle('get_employees_qualification') },
      { permissionTitle: PermissionTitle('get_global_qualification') },
      { permissionTitle: PermissionTitle('get_local_qualification') },
      { permissionTitle: PermissionTitle('get_order') },
      { permissionTitle: PermissionTitle('get_product_by_id') },
      { permissionTitle: PermissionTitle('get_product_stats') },
      { permissionTitle: PermissionTitle('get_rent_car_booking') },
      { permissionTitle: PermissionTitle('get_revenue_stats') },
      { permissionTitle: PermissionTitle('get_role_with_permissions') },
      { permissionTitle: PermissionTitle('get_service_quals') },
      { permissionTitle: PermissionTitle('get_service_stats') },
      { permissionTitle: PermissionTitle('get_store_opening_hours') },
      { permissionTitle: PermissionTitle('get_weekly_notes') },
      { permissionTitle: PermissionTitle('list_checkin_status') },
      { permissionTitle: PermissionTitle('list_company_drivers') },
      { permissionTitle: PermissionTitle('list_driver_cars') },
      { permissionTitle: PermissionTitle('list_employees') },
      { permissionTitle: PermissionTitle('list_orders') },
      { permissionTitle: PermissionTitle('list_product_category') },
      { permissionTitle: PermissionTitle('list_qualifications') },
      { permissionTitle: PermissionTitle('list_role') },
      { permissionTitle: PermissionTitle('list_role_with_permissions') },
      { permissionTitle: PermissionTitle('list_service') },
      { permissionTitle: PermissionTitle('list_service_category') },
      { permissionTitle: PermissionTitle('list_services_order') },
      { permissionTitle: PermissionTitle('list_stores') },
      { permissionTitle: PermissionTitle('list_user') },
      { permissionTitle: PermissionTitle('put_driver_car') },
      { permissionTitle: PermissionTitle('put_employee') },
      { permissionTitle: PermissionTitle('put_employee_global_qualification') },
      { permissionTitle: PermissionTitle('put_employee_local_qualification') },
      { permissionTitle: PermissionTitle('put_employee_specialhours') },
      { permissionTitle: PermissionTitle('put_employee_workhours') },
      { permissionTitle: PermissionTitle('put_global_qualification') },
      { permissionTitle: PermissionTitle('put_local_qualification') },
      { permissionTitle: PermissionTitle('put_store_weekly_notes') },
      { permissionTitle: PermissionTitle('Set_global_quals_global_service') },
      { permissionTitle: PermissionTitle('Set_local_quals_global_service') },
      { permissionTitle: PermissionTitle('Set_local_quals_local_service') },
      { permissionTitle: PermissionTitle('set_store_opening_hours') },
      { permissionTitle: PermissionTitle('update_company') },
      { permissionTitle: PermissionTitle('update_driver') },
      { permissionTitle: PermissionTitle('update_product') },
      { permissionTitle: PermissionTitle('update_product_category') },
      { permissionTitle: PermissionTitle('update_product_inventory') },
      { permissionTitle: PermissionTitle('update_role') },
      { permissionTitle: PermissionTitle('update_service_category') },
      { permissionTitle: PermissionTitle('update_store') },
      { permissionTitle: PermissionTitle('update_store_special_opening_hours') },
      { permissionTitle: PermissionTitle('update_user') },
      { permissionTitle: PermissionTitle('update_user_password') },
      { permissionTitle: PermissionTitle('view_product_category') },
      { permissionTitle: PermissionTitle('view_role') },
      { permissionTitle: PermissionTitle('view_service') },
      { permissionTitle: PermissionTitle('view_service_category') },
      { permissionTitle: PermissionTitle('view_store') },
      { permissionTitle: PermissionTitle('view_user') },
    ])
    return match(
      perms,
      () => {
        return 'Success'
      },
      (err) => {
        console.log(err)
        if (err.slice(0, 16) === 'Please provide a') {
          return 'AlreadySeeded'
        }
        return 'Failed'
      },
    )
  } catch (e) {
    console.log('seeding permissions failed: ', e)
    return 'Failed'
  }
}

async function seedMockData(superAdminPassword: string, superAdminEmail: string) {
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

      const service: Either<string, Service> = await createService(newService, [])
      console.log('created service status: ', service)
    },
    (err: string) => {
      console.log("couldn't create cat: ", err)
    },
  )
}

export default fp(async () => {
  async function seedSuperAdmin(): Promise<SeedResult> {
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
    try {
      let seedPermsRes = seedPermissions()
      if (typeof superAdminPassword === 'string' && typeof superAdminEmail === 'string') {
        seedMockData(superAdminPassword, superAdminEmail)
        seedPermsRes = Promise.resolve<SeedResult>('Success')
      } else {
        seedPermsRes = Promise.resolve<SeedResult>('WrongConfig')
      }
      return seedPermsRes
    } catch (err: unknown) {
      console.error(err)
      return Promise.resolve<SeedResult>('Failed')
    }
  }
  if (process.env.RUN_SEED === 'true') {
    await seedSuperAdmin()
  }
})

declare module 'fastify' {
  export interface FastifyInstance {
    seedSuperAdmin(): Promise<SeedResult>
  }
}
