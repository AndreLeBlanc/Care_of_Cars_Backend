import { FastifyInstance } from 'fastify'

import { after, before, describe, it } from 'node:test'
import { buildApp } from '../../src/app.js'
import { deepStrictEqual } from 'assert'
import { initDrizzle } from '../../src/config/db-connect.js'

let jwt = ''
describe('testing statistics route', async () => {
  let app: FastifyInstance

  before(async () => {
    await initDrizzle()
    app = await buildApp({ logger: false })
    await new Promise((f) => setTimeout(f, 1500))
    const response = await app.inject({
      method: 'POST',
      url: '/users/login',
      payload: {
        email: 'superadmin@test.com',
        password: 'admin123',
      },
    })
    const parsedResponse = JSON.parse(response.body)
    jwt = 'Bearer ' + parsedResponse.token
  })

  after(async () => {
    await app.close()
  })

  it('employee checkin stats', async () => {
    const responseRole = await app.inject({
      method: 'POST',
      url: '/roles',
      headers: {
        Authorization: jwt,
      },
      payload: { roleName: 'name', description: ' desc' },
    })
    const parsedresponseRoles = JSON.parse(responseRole.body)
    const responseStore = await app.inject({
      method: 'POST',
      url: '/stores',
      headers: {
        Authorization: jwt,
      },
      payload: {
        storeName: 'the stats store',
        storeOrgNumber: '6advxwerxge',
        storeFSkatt: true,
        storeStatus: true,
        storeEmail: 'mystoreff@swwwtore.is',
        storePhone: '444424234423',
        storeAddress: 'b street',
        storeZipCode: '356121',
        storeCity: 'Reykavik',
        storeCountry: 'Iceland',
        storeDescription: 'A store',
        storeContactPerson: 'duckling',
        storeMaxUsers: 512,
        storeAllowCarAPI: true,
        storeAllowSendSMS: false,
        storeSendSMS: true,
        storeUsesCheckin: true,
        storeUsesPIN: true,
      },
    })

    const parsedresponseStore = JSON.parse(responseStore.body)
    deepStrictEqual(responseStore.statusCode, 201)

    const responseUserEmp = await app.inject({
      method: 'POST',
      url: '/users/employee',
      headers: {
        Authorization: jwt,
      },
      payload: {
        user: {
          firstName: 'BonkaWok',
          lastName: 'WonkaDonk',
          email: 'Brusselwws@wafffles.be',
          isSuperAdmin: 'false',
          password: 'fdfsdfdsfsdfdsfdsfsdewf2332werwfew',
          roleID: parsedresponseRoles.data.roleID,
        },
        employee: {
          shortUserName: 'tewv',
          employmentNumber: '3tmlkdsfoaej',
          employeePersonalNumber: '3246555034',
          signature: 'iter',
          employeePin: 'sefe',
          employeeActive: true,
          employeeComment: 'a comment for this stats user',
          storeID: [parsedresponseStore.store.storeID],
          employeeHourlyRateCurrency: 'DKK',
          employeeHourlyRate: 100,
        },
      },
    })

    const responseUserEmpParsed = JSON.parse(responseUserEmp.body)
    deepStrictEqual(responseUserEmpParsed.user.firstName, 'BonkaWok')

    const createCompanyDriverResp = await app.inject({
      method: 'POST',
      url: '/customer',
      headers: {
        Authorization: jwt,
      },
      payload: {
        customerOrgNumber: '1265932',
        customerCompanyName: 'ABC INC AB',
        companyReference: 'XYZwr',
        companyPhone: '018234432342',
        companyEmail: 'admin@spacwrwex.com',
        companyAddress: 'Some Road, Some Where2',
        companyZipCode: '74934',
        companyAddressCity: 'LOK',
        companyCountry: 'IN',
        driverExternalNumber: '094302394',
        driverGDPRAccept: true,
        driverISWarrantyDriver: true,
        driverAcceptsMarketing: true,
        driverFirstName: 'Mahanic',
        driverLastName: 'Putric',
        driverEmail: 'mahanic.putric@abcinc.com',
        driverPhoneNumber: '123456733',
        driverAddress: 'smae',
        driverZipCode: 'sae',
        driverAddressCity: '23',
        driverCountry: 'SW',
        driverHasCard: true,
        driverCardNumber: 'XXXX-XXXX-XXXX',
        driverCardValidTo: '2024-04-18',
        driverKeyNumber: 'XXXX',
        driverNotesShared: 'some note!',
        driverNotes: 'some note!',
      },
    })

    const parsedCreateCompanyDriverResp = JSON.parse(createCompanyDriverResp.body)

    deepStrictEqual(parsedCreateCompanyDriverResp.data.company.customerOrgNumber, '1265932')
    deepStrictEqual(parsedCreateCompanyDriverResp.data.company.customerCompanyName, 'ABC INC AB')
    deepStrictEqual(parsedCreateCompanyDriverResp.data.company.companyEmail, 'admin@spacwrwex.com')
    deepStrictEqual(parsedCreateCompanyDriverResp.data.company.companyPhone, '018234432342')
    deepStrictEqual(
      parsedCreateCompanyDriverResp.data.company.companyAddress,
      'Some Road, Some Where2',
    )
    deepStrictEqual(parsedCreateCompanyDriverResp.data.company.companyZipCode, '74934')
    deepStrictEqual(parsedCreateCompanyDriverResp.data.company.companyAddressCity, 'LOK')
    deepStrictEqual(parsedCreateCompanyDriverResp.data.company.companyCountry, 'IN')

    const createDriverCarResp = await app.inject({
      method: 'PUT',
      url: '/driver-car',
      headers: {
        Authorization: jwt,
      },
      payload: {
        driverID: parsedCreateCompanyDriverResp.data.driver.driverID,
        driverCarRegistrationNumber: 'apa420',
        driverCarBrand: 'Audi',
        driverCarModel: 'brum brum',
        driverCarColor: 'Grey',
        driverCarYear: 2018,
        driverCarChassiNumber: '114234wsdf234eqwed',
        driverCarNotes: 'stats Test cars!',
      },
    })
    const parsedcreateDriverCarResp = JSON.parse(createDriverCarResp.body)
    deepStrictEqual(parsedcreateDriverCarResp.driverCarBrand, 'Audi')
    deepStrictEqual(parsedcreateDriverCarResp.driverCarModel, 'brum brum')
    deepStrictEqual(parsedcreateDriverCarResp.driverCarNotes, 'stats Test cars!')

    const catResp = await app.inject({
      method: 'POST',
      url: '/category/service',
      headers: {
        Authorization: jwt,
      },
      payload: {
        serviceCategoryName: 'my cat stat',
        serviceCategoryDescription: 'used for testing stats',
      },
    })

    const parsedcatResp = JSON.parse(catResp.body)
    deepStrictEqual(parsedcatResp.serviceCategoryName, 'my cat stat')

    const createServiceResp = await app.inject({
      method: 'PUT',
      url: '/services',
      headers: {
        Authorization: jwt,
      },
      payload: {
        cost: 1337,
        currency: 'SEK',
        name: 'generated automated testing for stats of stats',
        serviceCategoryID: parsedcatResp.serviceCategoryID,
        includeInAutomaticSms: true,
        serviceVariants: [],
        localServiceVariants: [],
        hidden: false,
        colorForService: 'Red',
        warrantyCard: true,
        itemNumber: 'dfdswrf',
        award: 1,
        suppliersArticleNumber: 'sdfsdf',
        externalArticleNumber: 'ExternalArticleNumberSchema',
        day1: '10:10:10',
      },
    })
    const parsedcreateServiceResp = JSON.parse(createServiceResp.body)

    deepStrictEqual(parsedcreateServiceResp.day1, '10:10:10')
    deepStrictEqual(parsedcreateServiceResp.hidden, false)
    deepStrictEqual(parsedcreateServiceResp.warrantyCard, true)

    const createLocalServiceResp = await app.inject({
      method: 'PUT',
      url: '/services',
      headers: {
        Authorization: jwt,
      },
      payload: {
        storeID: parsedresponseStore.store.storeID,
        cost: 1447,
        currency: 'SEK',
        name: 'generated automated testing for stats of stats 2',
        serviceCategoryID: parsedcatResp.serviceCategoryID,
        includeInAutomaticSms: true,
        serviceVariants: [],
        localServiceVariants: [],
        hidden: false,
        colorForService: 'Red',
        warrantyCard: true,
        itemNumber: 'dfdswrf',
        award: 1,
        suppliersArticleNumber: 'sdfsdf',
        externalArticleNumber: 'ExternalArticleNumberSchema',
        day1: '10:10:10',
      },
    })
    const parsedcreateLocalServiceResp = JSON.parse(createLocalServiceResp.body)

    deepStrictEqual(parsedcreateLocalServiceResp.day1, '10:10:10')
    deepStrictEqual(parsedcreateLocalServiceResp.hidden, false)
    deepStrictEqual(parsedcreateLocalServiceResp.warrantyCard, true)

    const createServiceResp2 = await app.inject({
      method: 'PUT',
      url: '/services',
      headers: {
        Authorization: jwt,
      },
      payload: {
        cost: 10,
        currency: 'SEK',
        name: 'generated automated testing for stats SECOND stats test',
        serviceCategoryID: parsedcatResp.serviceCategoryID,
        includeInAutomaticSms: true,
        serviceVariants: [],
        localServiceVariants: [],
        hidden: false,
        colorForService: 'Red',
        warrantyCard: false,
        itemNumber: 'dfdswrf2',
        award: 1,
        suppliersArticleNumber: 'sdfsdf',
        externalArticleNumber: 'ext',
        day1: '09:09:01',
      },
    })
    const parsedcreateServiceResp2 = JSON.parse(createServiceResp2.body)

    deepStrictEqual(parsedcreateServiceResp2.day1, '09:09:01')
    deepStrictEqual(parsedcreateServiceResp2.hidden, false)
    deepStrictEqual(parsedcreateServiceResp2.cost, 10)
    deepStrictEqual(parsedcreateServiceResp2.warrantyCard, false)

    const prodCatResp = await app.inject({
      method: 'POST',
      url: '/category/product',
      headers: {
        Authorization: jwt,
      },
      payload: {
        productCategoryName: 'my prod cat stat',
        productCategoryDescription: 'used for testing prod stats',
      },
    })

    const parsedprodCatResp = JSON.parse(prodCatResp.body)
    deepStrictEqual(parsedprodCatResp.productCategoryName, 'my prod cat stat')

    const createProductsResp = await app.inject({
      method: 'POST',
      url: '/product',
      headers: {
        Authorization: jwt,
      },
      payload: {
        cost: 10,
        currency: 'SEK',
        productDescription: 'generated automated testing for stats product',
        productCategoryID: parsedprodCatResp.productCategoryID,
        productItemNumber: 123,
        award: 1,
        type: 'Global',
      },
    })

    const parsedCreateProductsResp = JSON.parse(createProductsResp.body)
    deepStrictEqual(parsedCreateProductsResp.cost, 10)
    deepStrictEqual(
      parsedCreateProductsResp.productDescription,
      'generated automated testing for stats product',
    )

    const createProductsResp2 = await app.inject({
      method: 'POST',
      url: '/product',
      headers: {
        Authorization: jwt,
      },
      payload: {
        cost: 30,
        currency: 'SEK',
        productDescription: 'generated automated testing for stats product 2',
        productCategoryID: parsedprodCatResp.productCategoryID,
        productItemNumber: 1234,
        award: 1,
        type: 'Global',
      },
    })

    const parsedcreateProductsResp2 = JSON.parse(createProductsResp2.body)
    deepStrictEqual(parsedcreateProductsResp2.cost, 30)
    deepStrictEqual(
      parsedcreateProductsResp2.productDescription,
      'generated automated testing for stats product 2',
    )

    const createLocalProductsResp = await app.inject({
      method: 'POST',
      url: '/product',
      headers: {
        Authorization: jwt,
      },
      payload: {
        cost: 90,
        currency: 'SEK',
        storeID: parsedresponseStore.store.storeID,
        productDescription: 'generated automated testing for stats local product',
        productCategoryID: parsedprodCatResp.productCategoryID,
        productItemNumber: 1234,
        award: 1,
        type: 'Local',
      },
    })

    const parsedcreateLocalProductsResp = JSON.parse(createLocalProductsResp.body)

    deepStrictEqual(parsedcreateLocalProductsResp.cost, 90)
    deepStrictEqual(
      parsedcreateLocalProductsResp.productDescription,
      'generated automated testing for stats local product',
    )

    const creatOrderAddServResp = await app.inject({
      method: 'PUT',
      url: '/orders',
      headers: {
        Authorization: jwt,
      },
      payload: {
        driverCarID: parsedcreateDriverCarResp.driverCarID,
        driverID: parsedCreateCompanyDriverResp.data.driver.driverID,
        storeID: parsedresponseStore.store.storeID,
        orderNotes: 'Added a service',
        bookedBy: responseUserEmpParsed.employee.employeeID,
        submissionTime: '2022-11-30T11:21:44.000-08:00',
        pickupTime: '2022-11-30T11:22:44.000-08:00',
        vatFree: true,
        orderStatus: 'avslutad',
        currency: 'SEK',
        discount: 150,
        services: [
          {
            serviceID: parsedcreateServiceResp.serviceID,
            cost: 1337,
            currency: 'SEK',
            name: 'generated automated testing for stats',
            serviceCategoryID: parsedcatResp.serviceCategoryID,
            serviceVariants: [],
            amount: 2,
            day1: '2024-08-25T08:34:58+0000',
            day1Work: '10:10:10',
            day1Employee: responseUserEmpParsed.employee.employeeID,
            vatFree: true,
            orderNotes: 'added service',
          },
        ],
        products: [],
        deleteOrderService: [],
        deleteOrderProducts: [],
      },
    })

    const parsedcreatOrderAddServResp = JSON.parse(creatOrderAddServResp.body)

    deepStrictEqual(parsedcreatOrderAddServResp.driverCarID, parsedcreateDriverCarResp.driverCarID)
    deepStrictEqual(parsedcreatOrderAddServResp.storeID, parsedresponseStore.store.storeID)
    deepStrictEqual(parsedcreatOrderAddServResp.orderNotes, 'Added a service')
    deepStrictEqual(parsedcreatOrderAddServResp.orderStatus, 'avslutad')
    deepStrictEqual(parsedcreatOrderAddServResp.discount, 150)
    deepStrictEqual(parsedcreatOrderAddServResp.services[0].currency, 'SEK')
    deepStrictEqual(parsedcreatOrderAddServResp.services[0].cost, 1337)
    deepStrictEqual(parsedcreatOrderAddServResp.services[0].amount, 2)
    deepStrictEqual(parsedcreatOrderAddServResp.services[0].total, 2674)

    const servStatResp = await app.inject({
      method: 'GET',
      url: '/statistics/services',
      headers: {
        Authorization: jwt,
      },
      query: {
        from: '2022-10-30T11:21:44.000-08:00',
        to: '2024-11-30T11:21:44.000-08:00',
      },
    })

    const parsedservStatResp = JSON.parse(servStatResp.body)
    const expectedFirstServStat = {
      message: 'service statstics',
      stats: [
        {
          serviceID: 4,
          name: 'generated automated testing for stats SECOND stats test',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
          workedHours: 0,
          revenuePerHour: 0,
        },
        {
          serviceID: 3,
          name: 'generated automated testing for stats of stats 2',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
          workedHours: 0,
          revenuePerHour: 0,
        },
        {
          serviceID: 1,
          name: 'init service',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
          workedHours: 0,
          revenuePerHour: 0,
        },
        {
          serviceID: 2,
          name: 'generated automated testing for stats of stats',
          amount: 2,
          revenue: 2674,
          cost: 0,
          profit: 2674,
          workedHours: 10,
          revenuePerHour: 263,
        },
      ],
    }

    deepStrictEqual(parsedservStatResp, expectedFirstServStat)

    const servStatOutRangeResp = await app.inject({
      method: 'GET',
      url: '/statistics/services',
      headers: {
        Authorization: jwt,
      },
      query: {
        from: '2025-10-30T11:21:44.000-08:00',
        to: '2025-11-30T11:21:44.000-08:00',
      },
    })

    const parsedservStatOutRangeResp = JSON.parse(servStatOutRangeResp.body)

    const expectedFirstServOutRangeStat = {
      message: 'service statstics',
      stats: [
        {
          serviceID: 4,
          name: 'generated automated testing for stats SECOND stats test',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
          workedHours: 0,
          revenuePerHour: 0,
        },
        {
          serviceID: 3,
          name: 'generated automated testing for stats of stats 2',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
          workedHours: 0,
          revenuePerHour: 0,
        },
        {
          serviceID: 1,
          name: 'init service',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
          workedHours: 0,
          revenuePerHour: 0,
        },
        {
          serviceID: 2,
          name: 'generated automated testing for stats of stats',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
          workedHours: 0,
          revenuePerHour: 0,
        },
      ],
    }

    deepStrictEqual(parsedservStatOutRangeResp, expectedFirstServOutRangeStat)

    const anotherOrderAddServResp = await app.inject({
      method: 'PUT',
      url: '/orders',
      headers: {
        Authorization: jwt,
      },
      payload: {
        driverCarID: parsedcreateDriverCarResp.driverCarID,
        driverID: parsedCreateCompanyDriverResp.data.driver.driverID,
        storeID: parsedresponseStore.store.storeID,
        orderNotes: 'Added a service',
        bookedBy: responseUserEmpParsed.employee.employeeID,
        submissionTime: '2022-11-30T11:21:44.000-08:00',
        pickupTime: '2022-11-30T11:22:44.000-08:00',
        vatFree: true,
        orderStatus: 'avslutad',
        currency: 'SEK',
        discount: 150,
        services: [
          {
            serviceID: parsedcreateServiceResp.serviceID,
            cost: 1337,
            currency: 'SEK',
            name: 'generated automated testing for stats',
            serviceCategoryID: parsedcatResp.serviceCategoryID,
            serviceVariants: [],
            amount: 3,
            day1: '2024-08-25T08:34:58+0000',
            day1Work: '10:10:10',
            day1Employee: responseUserEmpParsed.employee.employeeID,
            vatFree: true,
            orderNotes: 'added service',
          },
        ],
        products: [],
        deleteOrderService: [],
        deleteOrderProducts: [],
      },
    })

    deepStrictEqual(anotherOrderAddServResp.statusCode, 201)

    const servStatAnotherResp = await app.inject({
      method: 'GET',
      url: '/statistics/services',
      headers: {
        Authorization: jwt,
      },
      query: {
        from: '2021-10-30T11:21:44.000-08:00',
        to: '2025-11-30T11:21:44.000-08:00',
      },
    })
    const parsedservStatAnotherResp = JSON.parse(servStatAnotherResp.body)
    const expectedAnotherServStat = {
      message: 'service statstics',
      stats: [
        {
          serviceID: 4,
          name: 'generated automated testing for stats SECOND stats test',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
          workedHours: 0,
          revenuePerHour: 0,
        },
        {
          serviceID: 3,
          name: 'generated automated testing for stats of stats 2',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
          workedHours: 0,
          revenuePerHour: 0,
        },
        {
          serviceID: 1,
          name: 'init service',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
          workedHours: 0,
          revenuePerHour: 0,
        },
        {
          serviceID: 2,
          name: 'generated automated testing for stats of stats',
          amount: 5,
          revenue: 6685,
          cost: 0,
          profit: 6685,
          workedHours: 20.5,
          revenuePerHour: 329,
        },
      ],
    }

    deepStrictEqual(parsedservStatAnotherResp, expectedAnotherServStat)

    const thirdOrderAddServResp = await app.inject({
      method: 'PUT',
      url: '/orders',
      headers: {
        Authorization: jwt,
      },
      payload: {
        driverCarID: parsedcreateDriverCarResp.driverCarID,
        driverID: parsedCreateCompanyDriverResp.data.driver.driverID,
        storeID: parsedresponseStore.store.storeID,
        orderNotes: 'Added a service',
        bookedBy: responseUserEmpParsed.employee.employeeID,
        submissionTime: '2022-11-30T11:21:44.000-08:00',
        pickupTime: '2022-11-30T11:22:44.000-08:00',
        vatFree: true,
        orderStatus: 'avslutad',
        currency: 'SEK',
        discount: 150,
        services: [
          {
            serviceID: parsedcreateServiceResp.serviceID,
            cost: 1337,
            currency: 'SEK',
            name: 'generated automated testing for stats',
            serviceCategoryID: parsedcatResp.serviceCategoryID,
            serviceVariants: [],
            amount: 3,
            day1: '2024-08-25T08:34:58+0000',
            day1Work: '23:59:59',
            day1Employee: responseUserEmpParsed.employee.employeeID,
            vatFree: true,
            orderNotes: 'added service',
          },
        ],
        products: [],
        deleteOrderService: [],
        deleteOrderProducts: [],
      },
    })
    const parsedthirdOrderAddServResp = JSON.parse(thirdOrderAddServResp.body)

    deepStrictEqual(thirdOrderAddServResp.statusCode, 201)

    const servStatThirdResp = await app.inject({
      method: 'GET',
      url: '/statistics/services',
      headers: {
        Authorization: jwt,
      },
      query: {
        from: '2021-10-30T11:21:44.000-08:00',
        to: '2025-11-30T11:21:44.000-08:00',
      },
    })
    const parsedservStatThirdResp = JSON.parse(servStatThirdResp.body)
    const expectedThirdServStat = {
      message: 'service statstics',
      stats: [
        {
          serviceID: 4,
          name: 'generated automated testing for stats SECOND stats test',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
          workedHours: 0,
          revenuePerHour: 0,
        },
        {
          serviceID: 3,
          name: 'generated automated testing for stats of stats 2',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
          workedHours: 0,
          revenuePerHour: 0,
        },
        {
          serviceID: 1,
          name: 'init service',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
          workedHours: 0,
          revenuePerHour: 0,
        },
        {
          serviceID: 2,
          name: 'generated automated testing for stats of stats',
          amount: 8,
          revenue: 10696,
          cost: 0,
          profit: 10696,
          workedHours: 44.5,
          revenuePerHour: 241,
        },
      ],
    }

    deepStrictEqual(parsedservStatThirdResp, expectedThirdServStat)

    const thirdOrderDeletedServResp = await app.inject({
      method: 'PUT',
      url: '/orders',
      headers: {
        Authorization: jwt,
      },
      payload: {
        orderID: parsedthirdOrderAddServResp.orderID,
        driverCarID: parsedcreateDriverCarResp.driverCarID,
        driverID: parsedCreateCompanyDriverResp.data.driver.driverID,
        storeID: parsedresponseStore.store.storeID,
        orderNotes: 'Added a service',
        bookedBy: responseUserEmpParsed.employee.employeeID,
        submissionTime: '2022-11-30T11:21:44.000-08:00',
        pickupTime: '2022-11-30T11:22:44.000-08:00',
        vatFree: true,
        orderStatus: 'avslutad',
        currency: 'SEK',
        discount: 150,
        services: [],
        products: [],
        deleteOrderService: [
          {
            orderID: parsedthirdOrderAddServResp.orderID,
            serviceID: parsedcreateServiceResp.serviceID,
          },
        ],
        deleteOrderProducts: [],
      },
    })

    deepStrictEqual(thirdOrderDeletedServResp.statusCode, 201)

    const servStatDeleteResp = await app.inject({
      method: 'GET',
      url: '/statistics/services',
      headers: {
        Authorization: jwt,
      },
      query: {
        from: '2021-10-30T11:21:44.000-08:00',
        to: '2025-11-30T11:21:44.000-08:00',
      },
    })
    const parsedservStatDeleteResp = JSON.parse(servStatDeleteResp.body)

    deepStrictEqual(parsedservStatDeleteResp, expectedAnotherServStat)

    const AddingLocalServResp = await app.inject({
      method: 'PUT',
      url: '/orders',
      headers: {
        Authorization: jwt,
      },
      payload: {
        orderID: parsedthirdOrderAddServResp.orderID,
        driverCarID: parsedcreateDriverCarResp.driverCarID,
        driverID: parsedCreateCompanyDriverResp.data.driver.driverID,
        storeID: parsedresponseStore.store.storeID,
        orderNotes: 'Added a service',
        bookedBy: responseUserEmpParsed.employee.employeeID,
        submissionTime: '2022-11-30T11:21:44.000-08:00',
        pickupTime: '2022-11-30T11:22:44.000-08:00',
        vatFree: true,
        orderStatus: 'avslutad',
        currency: 'SEK',
        discount: 150,
        services: [
          {
            serviceID: parsedcreateLocalServiceResp.serviceID,
            cost: 1337,
            currency: 'SEK',
            name: 'generated automated testing for stats of stats 2',
            serviceCategoryID: parsedcatResp.serviceCategoryID,
            serviceVariants: [],
            amount: 3,
            day1: '2024-08-25T08:34:58+0000',
            day1Work: '23:59:59',
            day1Employee: responseUserEmpParsed.employee.employeeID,
            vatFree: true,
            orderNotes: 'added service',
          },
        ],
        products: [],
        deleteOrderService: [],
        deleteOrderProducts: [],
      },
    })

    deepStrictEqual(AddingLocalServResp.statusCode, 201)

    const servStatLocalResp = await app.inject({
      method: 'GET',
      url: '/statistics/services',
      headers: {
        Authorization: jwt,
      },
      query: {
        from: '2021-10-30T11:21:44.000-08:00',
        to: '2025-11-30T11:21:44.000-08:00',
      },
    })

    const parsedservStatLocalResp = JSON.parse(servStatLocalResp.body)

    const expectedLocalServStat = {
      message: 'service statstics',
      stats: [
        {
          serviceID: 4,
          name: 'generated automated testing for stats SECOND stats test',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
          workedHours: 0,
          revenuePerHour: 0,
        },
        {
          serviceID: 3,
          name: 'generated automated testing for stats of stats 2',
          amount: 3,
          revenue: 4011,
          cost: 0,
          profit: 4011,
          workedHours: 24,
          revenuePerHour: 167,
        },
        {
          serviceID: 1,
          name: 'init service',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
          workedHours: 0,
          revenuePerHour: 0,
        },
        {
          serviceID: 2,
          name: 'generated automated testing for stats of stats',
          amount: 5,
          revenue: 6685,
          cost: 0,
          profit: 6685,
          workedHours: 20.5,
          revenuePerHour: 329,
        },
      ],
    }

    deepStrictEqual(parsedservStatLocalResp, expectedLocalServStat)

    const servStatLocalStoreResp = await app.inject({
      method: 'GET',
      url: '/statistics/services',
      headers: {
        Authorization: jwt,
      },
      query: {
        from: '2021-10-30T11:21:44.000-08:00',
        to: '2025-11-30T11:21:44.000-08:00',
        store: parsedresponseStore.store.storeID,
      },
    })
    const parsedservStatLocalStoreResp = JSON.parse(servStatLocalStoreResp.body)

    deepStrictEqual(
      parsedservStatLocalStoreResp.stats,
      expectedLocalServStat.stats.sort((a, b) => {
        if (a['serviceID'] > b['serviceID']) {
          return 1
        } else if (a['serviceID'] < b['serviceID']) {
          return -1
        } else {
          return 0
        }
      }),
    )

    const servStatLocalWrongStoreResp = await app.inject({
      method: 'GET',
      url: '/statistics/services',
      headers: {
        Authorization: jwt,
      },
      query: {
        from: '2021-10-30T11:21:44.000-08:00',
        to: '2025-11-30T11:21:44.000-08:00',
        store: '2000',
      },
    })
    const parsedservStatLocalWrongStoreResp = JSON.parse(servStatLocalWrongStoreResp.body)
    const expectedLocalServStat2000 = {
      message: 'service statstics',
      stats: [
        {
          serviceID: 1,
          name: 'init service',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
          workedHours: 0,
          revenuePerHour: 0,
        },
        {
          serviceID: 2,
          name: 'generated automated testing for stats of stats',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
          workedHours: 0,
          revenuePerHour: 0,
        },
        {
          serviceID: 4,
          name: 'generated automated testing for stats SECOND stats test',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
          workedHours: 0,
          revenuePerHour: 0,
        },
      ],
      store: 2000,
    }

    deepStrictEqual(parsedservStatLocalWrongStoreResp, expectedLocalServStat2000)

    const AddingProdResp = await app.inject({
      method: 'PUT',
      url: '/orders',
      headers: {
        Authorization: jwt,
      },
      payload: {
        orderID: parsedthirdOrderAddServResp.orderID,
        driverCarID: parsedcreateDriverCarResp.driverCarID,
        driverID: parsedCreateCompanyDriverResp.data.driver.driverID,
        storeID: parsedresponseStore.store.storeID,
        orderNotes: 'Added a service',
        bookedBy: responseUserEmpParsed.employee.employeeID,
        submissionTime: '2022-11-30T11:21:44.000-08:00',
        pickupTime: '2022-11-30T11:22:44.000-08:00',
        vatFree: true,
        orderStatus: 'avslutad',
        currency: 'SEK',
        discount: 150,
        services: [],
        products: [
          {
            productID: parsedCreateProductsResp.productID,
            productDescription: parsedCreateProductsResp.productDescription,
            amount: 2,
            cost: 100,
            currency: 'SEK',
            orderProductNotes: 'testing for stats!',
          },
        ],
        deleteOrderService: [],
        deleteOrderProducts: [],
      },
    })

    const parsedAddingProdResp = JSON.parse(AddingProdResp.body)

    deepStrictEqual(AddingProdResp.statusCode, 201)

    deepStrictEqual(parsedAddingProdResp.products[0].productID, parsedCreateProductsResp.productID)

    const prodStatResp = await app.inject({
      method: 'GET',
      url: '/statistics/products',
      headers: {
        Authorization: jwt,
      },
      query: {
        from: '2021-10-30T11:21:44.000-08:00',
        to: '2025-11-30T11:21:44.000-08:00',
      },
    })
    const parsedprodStatResp = JSON.parse(prodStatResp.body)
    const prodStats = {
      message: 'product statstics',
      stats: [
        {
          productID: 2,
          productDescription: 'generated automated testing for stats product 2',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
        },
        {
          productID: 3,
          productDescription: 'generated automated testing for stats local product',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
        },
        {
          productID: 1,
          productDescription: 'generated automated testing for stats product',
          amount: 2,
          revenue: 200,
          cost: 0,
          profit: 200,
        },
      ],
    }

    deepStrictEqual(parsedprodStatResp, prodStats)
    const prodStatTimeResp = await app.inject({
      method: 'GET',
      url: '/statistics/products',
      headers: {
        Authorization: jwt,
      },
      query: {
        from: '2025-10-30T11:21:44.000-08:00',
        to: '2025-11-30T11:21:44.000-08:00',
      },
    })
    const parsedprodStatTimeResp = JSON.parse(prodStatTimeResp.body)
    const prodStatsTime = {
      message: 'product statstics',
      stats: [
        {
          productID: 2,
          productDescription: 'generated automated testing for stats product 2',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
        },
        {
          productID: 3,
          productDescription: 'generated automated testing for stats local product',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
        },
        {
          productID: 1,
          productDescription: 'generated automated testing for stats product',
          amount: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
        },
      ],
    }
    deepStrictEqual(parsedprodStatTimeResp, prodStatsTime)

    const empStatTimeResp = await app.inject({
      method: 'GET',
      url: '/statistics/checkins',
      headers: {
        Authorization: jwt,
      },
      query: {
        from: '2021-10-30T11:21:44.000-08:00',
        to: '2025-11-30T11:21:44.000-08:00',
      },
    })
    const parsedempStatTimeResp = JSON.parse(empStatTimeResp.body)
    deepStrictEqual(parsedempStatTimeResp, { message: 'checkin statstics', stats: [] })

    const empCheckinResp = await app.inject({
      method: 'POST',
      url: '/employees/checkin',
      headers: {
        Authorization: jwt,
      },
      body: {
        employeeID: responseUserEmpParsed.employee.employeeID,
        storeID: parsedresponseStore.store.storeID,
        employeeCheckedOut: 'CheckedIn',
      },
    })

    const parsedempCheckinResp = JSON.parse(empCheckinResp.body)
    deepStrictEqual(parsedempCheckinResp.employeeID, responseUserEmpParsed.employee.employeeID)

    const empCheckoutResp = await app.inject({
      method: 'POST',
      url: '/employees/checkin',
      headers: {
        Authorization: jwt,
      },
      body: {
        employeeID: responseUserEmpParsed.employee.employeeID,
        storeID: parsedresponseStore.store.storeID,
        employeeCheckedOut: 'CheckedOut',
      },
    })

    const parsedempCheckoutResp = JSON.parse(empCheckoutResp.body)
    deepStrictEqual(parsedempCheckoutResp.employeeID, responseUserEmpParsed.employee.employeeID)

    const empCheckin2Resp = await app.inject({
      method: 'POST',
      url: '/employees/checkin',
      headers: {
        Authorization: jwt,
      },
      body: {
        employeeID: responseUserEmpParsed.employee.employeeID,
        storeID: parsedresponseStore.store.storeID,
        employeeCheckedOut: 'CheckedIn',
      },
    })

    const parsedempCheckin2Resp = JSON.parse(empCheckin2Resp.body)
    deepStrictEqual(parsedempCheckin2Resp.employeeID, responseUserEmpParsed.employee.employeeID)

    const empCheckout2Resp = await app.inject({
      method: 'POST',
      url: '/employees/checkin',
      headers: {
        Authorization: jwt,
      },
      body: {
        employeeID: responseUserEmpParsed.employee.employeeID,
        storeID: parsedresponseStore.store.storeID,
        employeeCheckedOut: 'CheckedOut',
      },
    })

    const parsedempCheckout2Resp = JSON.parse(empCheckout2Resp.body)
    deepStrictEqual(parsedempCheckout2Resp.employeeID, responseUserEmpParsed.employee.employeeID)

    const empStatWrongTimeResp = await app.inject({
      method: 'GET',
      url: '/statistics/checkins',
      headers: {
        Authorization: jwt,
      },
      query: {
        from: '2021-10-30T11:21:44.000-08:00',
        to: '2021-11-30T11:21:44.000-08:00',
      },
    })
    const parsedempStatWrongTimeResp = JSON.parse(empStatWrongTimeResp.body)
    deepStrictEqual(parsedempStatWrongTimeResp, { message: 'checkin statstics', stats: [] })

    const empStatWrongStoreResp = await app.inject({
      method: 'GET',
      url: '/statistics/checkins',
      headers: {
        Authorization: jwt,
      },
      query: {
        from: '2021-10-30T11:21:44.000-08:00',
        to: '2041-11-30T11:21:44.000-08:00',
        store: '1',
      },
    })
    const parsedempStatWrongStoreResp = JSON.parse(empStatWrongStoreResp.body)
    deepStrictEqual(parsedempStatWrongStoreResp, {
      message: 'checkin statstics',
      stats: [],
      store: 1,
    })

    const empStatWrongEmpResp = await app.inject({
      method: 'GET',
      url: '/statistics/checkins',
      headers: {
        Authorization: jwt,
      },
      query: {
        from: '2021-10-30T11:21:44.000-08:00',
        to: '2041-11-30T11:21:44.000-08:00',
        store: '1',
        employeeID: '1',
      },
    })
    const parsedempStatWrongEmpResp = JSON.parse(empStatWrongEmpResp.body)
    deepStrictEqual(parsedempStatWrongEmpResp, {
      message: 'checkin statstics',
      stats: [],
      store: 1,
    })

    const empStatEmpResp = await app.inject({
      method: 'GET',
      url: '/statistics/checkins',
      headers: {
        Authorization: jwt,
      },
      query: {
        from: '2021-10-30T11:21:44.000-08:00',
        to: '2041-11-30T11:21:44.000-08:00',
        employeeID: responseUserEmpParsed.employee.employeeID,
      },
    })
    const parsedempStatEmpResp = JSON.parse(empStatEmpResp.body)
    deepStrictEqual(parsedempStatEmpResp.stats[0].firstName, 'BonkaWok')
    deepStrictEqual(parsedempStatEmpResp.stats[0].employeeID, 1)

    const empStatEmpWithStoreResp = await app.inject({
      method: 'GET',
      url: '/statistics/checkins',
      headers: {
        Authorization: jwt,
      },
      query: {
        from: '2021-10-30T11:21:44.000-08:00',
        to: '2041-11-30T11:21:44.000-08:00',
        employeeID: responseUserEmpParsed.employee.employeeID,
        storeID: parsedresponseStore.store.storeID,
      },
    })
    const parsedempStatEmpWithStoreResp = JSON.parse(empStatEmpWithStoreResp.body)
    deepStrictEqual(parsedempStatEmpWithStoreResp.stats[0].firstName, 'BonkaWok')
    deepStrictEqual(parsedempStatEmpWithStoreResp.stats[0].employeeID, 1)

    const dashboradResp = await app.inject({
      method: 'GET',
      url: '/statistics/dashboard',
      headers: {
        Authorization: jwt,
      },
      query: {},
    })

    const parseddashboradResp = JSON.parse(dashboradResp.body)
    deepStrictEqual(parseddashboradResp, {
      message: 'dashboard statistics',
      employees: 1,
      services: 4,
      customers: 1,
      billed: 0,
    })

    const dashboradWrongDateResp = await app.inject({
      method: 'GET',
      url: '/statistics/dashboard',
      headers: {
        Authorization: jwt,
      },
      query: {
        from: '2026-10-30T11:21:44.000-08:00',
      },
    })
    const parseddashboradWrongDateResp = JSON.parse(dashboradWrongDateResp.body)
    deepStrictEqual(parseddashboradWrongDateResp, {
      message: 'dashboard statistics',
      employees: 1,
      services: 4,
      customers: 0,
      billed: 0,
    })

    const dashboardStoreResp = await app.inject({
      method: 'GET',
      url: '/statistics/dashboard',
      headers: {
        Authorization: jwt,
      },
      query: {
        from: '2021-10-30T11:21:44.000-08:00',
        storeID: parsedresponseStore.store.storeID,
      },
    })
    const parseddashboardStoreResp = JSON.parse(dashboardStoreResp.body)

    deepStrictEqual(parseddashboardStoreResp, {
      message: 'dashboard statistics',
      employees: 1,
      services: 4,
      storeID: parsedresponseStore.store.storeID,
      customers: 1,
      billed: 0,
    })
    const dashboradWrongStoreResp = await app.inject({
      method: 'GET',
      url: '/statistics/dashboard',
      headers: {
        Authorization: jwt,
      },
      query: {
        storeID: '3245',
      },
    })
    const parseddashboradWrongStoreResp = JSON.parse(dashboradWrongStoreResp.body)
    deepStrictEqual(parseddashboradWrongStoreResp, {
      message: 'dashboard statistics',
      employees: 0,
      services: 3,
      storeID: 3245,
      customers: 0,
      billed: 0,
    })

    const creatOrderDateResp = await app.inject({
      method: 'PUT',
      url: '/orders',
      headers: {
        Authorization: jwt,
      },
      payload: {
        driverCarID: parsedcreateDriverCarResp.driverCarID,
        driverID: parsedCreateCompanyDriverResp.data.driver.driverID,
        storeID: parsedresponseStore.store.storeID,
        orderNotes: 'Added a service',
        bookedBy: responseUserEmpParsed.employee.employeeID,
        submissionTime: '2023-01-29T11:21:44.000-08:00',
        pickupTime: '2023-01-30T11:22:44.000-08:00',
        vatFree: true,
        orderStatus: 'avslutad',
        currency: 'SEK',
        discount: 150,
        services: [
          {
            serviceID: parsedcreateServiceResp.serviceID,
            cost: 1337,
            currency: 'SEK',
            name: 'generated automated testing for stats',
            serviceCategoryID: parsedcatResp.serviceCategoryID,
            serviceVariants: [],
            amount: 2,
            day1: '2024-08-25T08:34:58+0000',
            day1Work: '10:10:10',
            day1Employee: responseUserEmpParsed.employee.employeeID,
            vatFree: true,
            orderNotes: 'added service',
          },
        ],
        products: [],
        deleteOrderService: [],
        deleteOrderProducts: [],
      },
    })

    deepStrictEqual(creatOrderDateResp.statusCode, 201)

    const creatOrderPaborjadResp = await app.inject({
      method: 'PUT',
      url: '/orders',
      headers: {
        Authorization: jwt,
      },
      payload: {
        driverCarID: parsedcreateDriverCarResp.driverCarID,
        driverID: parsedCreateCompanyDriverResp.data.driver.driverID,
        storeID: parsedresponseStore.store.storeID,
        orderNotes: 'Added a service',
        bookedBy: responseUserEmpParsed.employee.employeeID,
        submissionTime: '2023-01-29T11:21:44.000-08:00',
        pickupTime: '2023-01-30T11:22:44.000-08:00',
        vatFree: true,
        orderStatus: 'påbörjad',
        currency: 'SEK',
        discount: 150,
        services: [
          {
            serviceID: parsedcreateServiceResp.serviceID,
            cost: 1337,
            currency: 'SEK',
            name: 'generated automated testing for stats',
            serviceCategoryID: parsedcatResp.serviceCategoryID,
            serviceVariants: [],
            amount: 2,
            day1: '2024-08-25T08:34:58+0000',
            day1Work: '10:10:10',
            day1Employee: responseUserEmpParsed.employee.employeeID,
            vatFree: true,
            orderNotes: 'added service',
          },
        ],
        products: [],
        deleteOrderService: [],
        deleteOrderProducts: [],
      },
    })

    deepStrictEqual(creatOrderPaborjadResp.statusCode, 201)

    const revenueResp = await app.inject({
      method: 'GET',
      url: '/statistics/revenue',
      headers: {
        Authorization: jwt,
      },
      query: {
        from: '2023-08-25T08:34:58+0000',
        storeID: parsedresponseStore.store.storeID,
      },
    })
    const parsedrevenueResp = JSON.parse(revenueResp.body)
    deepStrictEqual(parsedrevenueResp, {
      message: 'revenue statistics',
      totalRevenue: 2674,
      totalBookings: 2,
      averageRevenuePerBooking: 1337,
      cashPaid: 0,
      billPaid: 0,
      totalDiscounts: 150,
      year: {
        jan: {
          monthlyRevenue: 2674,
          potentialMonthlyRevenue: 2674,
          totalMonthlyRevenue: 2824,
          totalMonthlyRevenueLastYear: 0,
          absoluteDifference: 2674,
          percentDifference: 0,
        },
        feb: {
          monthlyRevenue: 0,
          potentialMonthlyRevenue: 0,
          totalMonthlyRevenue: 0,
          totalMonthlyRevenueLastYear: 0,
          absoluteDifference: 0,
          percentDifference: 0,
        },
        mar: {
          monthlyRevenue: 0,
          potentialMonthlyRevenue: 0,
          totalMonthlyRevenue: 0,
          totalMonthlyRevenueLastYear: 0,
          absoluteDifference: 0,
          percentDifference: 0,
        },
        apr: {
          monthlyRevenue: 0,
          potentialMonthlyRevenue: 0,
          totalMonthlyRevenue: 0,
          totalMonthlyRevenueLastYear: 0,
          absoluteDifference: 0,
          percentDifference: 0,
        },
        may: {
          monthlyRevenue: 0,
          potentialMonthlyRevenue: 0,
          totalMonthlyRevenue: 0,
          totalMonthlyRevenueLastYear: 0,
          absoluteDifference: 0,
          percentDifference: 0,
        },
        jun: {
          monthlyRevenue: 0,
          potentialMonthlyRevenue: 0,
          totalMonthlyRevenue: 0,
          totalMonthlyRevenueLastYear: 0,
          absoluteDifference: 0,
          percentDifference: 0,
        },
        jul: {
          monthlyRevenue: 0,
          potentialMonthlyRevenue: 0,
          totalMonthlyRevenue: 0,
          totalMonthlyRevenueLastYear: 0,
          absoluteDifference: 0,
          percentDifference: 0,
        },
        aug: {
          monthlyRevenue: 0,
          potentialMonthlyRevenue: 0,
          totalMonthlyRevenue: 0,
          totalMonthlyRevenueLastYear: 0,
          absoluteDifference: 0,
          percentDifference: 0,
        },
        sep: {
          monthlyRevenue: 0,
          potentialMonthlyRevenue: 0,
          totalMonthlyRevenue: 0,
          totalMonthlyRevenueLastYear: 0,
          absoluteDifference: 0,
          percentDifference: 0,
        },
        oct: {
          monthlyRevenue: 0,
          potentialMonthlyRevenue: 0,
          totalMonthlyRevenue: 0,
          totalMonthlyRevenueLastYear: 0,
          absoluteDifference: 0,
          percentDifference: 0,
        },
        nov: {
          monthlyRevenue: 0,
          potentialMonthlyRevenue: 0,
          totalMonthlyRevenue: 0,
          totalMonthlyRevenueLastYear: 10446,
          absoluteDifference: -10446,
          percentDifference: -100,
        },
        dec: {
          monthlyRevenue: 0,
          potentialMonthlyRevenue: 0,
          totalMonthlyRevenue: 0,
          totalMonthlyRevenueLastYear: 0,
          absoluteDifference: 0,
          percentDifference: 0,
        },
      },
    })
  })
})
