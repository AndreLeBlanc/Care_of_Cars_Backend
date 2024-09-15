import { FastifyInstance } from 'fastify'

import { after, before, describe, it } from 'node:test'
import { buildApp } from '../../src/app.js'
import { deepStrictEqual } from 'assert'
import { initDrizzle } from '../../src/config/db-connect.js'

let jwt = ''
describe('PUT, GET and Delete orders', async () => {
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

  it('PUT order', async () => {
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
        storeName: 'the store',
        storeOrgNumber: '6advxcvxge',
        storeFSkatt: true,
        storeStatus: true,
        storeEmail: 'mystoreff@store.is',
        storePhone: '4444242342',
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
          firstName: 'Bonka',
          lastName: 'Wonka',
          email: 'Brussels@waffles.be',
          isSuperAdmin: 'false',
          password: 'fdfsdfsdfdsfdsfsdewf2332werwfew',
          roleID: parsedresponseRoles.data.roleID,
        },
        employee: {
          shortUserName: 'tewr',
          employmentNumber: '342lkdsfoaej',
          employeePersonalNumber: '3246555034',
          signature: 'tter',
          employeePin: 'sdfe',
          employeeActive: true,
          employeeComment: 'a comment for this user',
          storeID: [parsedresponseStore.store.storeID],
          employeeHourlyRateCurrency: 'DKK',
          employeeHourlyRate: 100,
        },
      },
    })

    const responseUserEmpParsed = JSON.parse(responseUserEmp.body)
    deepStrictEqual(responseUserEmpParsed.user.firstName, 'Bonka')

    const createCompanyDriverResp = await app.inject({
      method: 'POST',
      url: '/customer',
      headers: {
        Authorization: jwt,
      },
      payload: {
        customerOrgNumber: '123456',
        customerCompanyName: 'ABC INC',
        companyReference: 'XYZ',
        companyPhone: '018234432',
        companyEmail: 'admin@spacex.com',
        companyAddress: 'Some Road, Some Where',
        companyZipCode: '74934',
        companyAddressCity: 'LOK',
        companyCountry: 'IN',
        driverExternalNumber: '0943094',
        driverGDPRAccept: true,
        driverISWarrantyDriver: true,
        driverAcceptsMarketing: true,
        driverFirstName: 'Mahan',
        driverLastName: 'Putri',
        driverEmail: 'mahan.putri@abcinc.com',
        driverPhoneNumber: '12345678',
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

    deepStrictEqual(parsedCreateCompanyDriverResp.data.company.customerOrgNumber, '123456')
    deepStrictEqual(parsedCreateCompanyDriverResp.data.company.customerCompanyName, 'ABC INC')
    deepStrictEqual(parsedCreateCompanyDriverResp.data.company.companyEmail, 'admin@spacex.com')
    deepStrictEqual(parsedCreateCompanyDriverResp.data.company.companyPhone, '018234432')
    deepStrictEqual(
      parsedCreateCompanyDriverResp.data.company.companyAddress,
      'Some Road, Some Where',
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
        driverCarRegistrationNumber: 'wer123',
        driverCarBrand: 'Audi',
        driverCarModel: 'brum brum',
        driverCarColor: 'Grey',
        driverCarYear: 2018,
        driverCarChassiNumber: '1123wsdf234eqwed',
        driverCarNotes: 'first Test cars!',
      },
    })
    const parsedcreateDriverCarResp = JSON.parse(createDriverCarResp.body)
    deepStrictEqual(parsedcreateDriverCarResp.driverCarBrand, 'Audi')
    deepStrictEqual(parsedcreateDriverCarResp.driverCarModel, 'brum brum')
    deepStrictEqual(parsedcreateDriverCarResp.driverCarNotes, 'first Test cars!')

    const catResp = await app.inject({
      method: 'POST',
      url: '/category/service',
      headers: {
        Authorization: jwt,
      },
      payload: {
        serviceCategoryName: 'my cat',
        serviceCategoryDescription: 'used for testing',
      },
    })

    const parsedcatResp = JSON.parse(catResp.body)
    deepStrictEqual(parsedcatResp.serviceCategoryName, 'my cat')

    const createServiceResp = await app.inject({
      method: 'PUT',
      url: '/services',
      headers: {
        Authorization: jwt,
      },
      payload: {
        cost: 1337,
        currency: 'SEK',
        name: 'generated automated testing for orders',
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
        name: 'Oink',
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
        name: 'generated automated testing for orders SECOND',
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

    const creatOrderResp = await app.inject({
      method: 'PUT',
      url: '/orders',
      headers: {
        Authorization: jwt,
      },
      payload: {
        driverCarID: parsedcreateDriverCarResp.driverCarID,
        driverID: parsedCreateCompanyDriverResp.data.driver.driverID,
        storeID: parsedresponseStore.store.storeID,
        orderNotes: 'my notes for first order',
        bookedBy: responseUserEmpParsed.employee.employeeID,
        submissionTime: '2022-11-30T11:21:44.000-08:00',
        pickupTime: '2022-11-30T11:22:44.000-08:00',
        vatFree: true,
        orderStatus: 'preliminär',
        currency: 'SEK',
        discount: 100,
        services: [],
        products: [],
        deleteOrderService: [],
        deleteOrderProducts: [],
      },
    })

    const parsedcreatOrderResp = JSON.parse(creatOrderResp.body)
    deepStrictEqual(parsedcreatOrderResp.driverCarID, parsedcreateDriverCarResp.driverCarID)
    deepStrictEqual(parsedcreatOrderResp.storeID, parsedresponseStore.store.storeID)
    deepStrictEqual(parsedcreatOrderResp.orderNotes, 'my notes for first order')
    deepStrictEqual(parsedcreatOrderResp.orderStatus, 'preliminär')
    deepStrictEqual(parsedcreatOrderResp.discount, 100)

    const creatOrderPatchResp = await app.inject({
      method: 'PUT',
      url: '/orders',
      headers: {
        Authorization: jwt,
      },
      payload: {
        orderID: parsedcreatOrderResp.orderID,
        driverCarID: parsedcreateDriverCarResp.driverCarID,
        driverID: parsedCreateCompanyDriverResp.data.driver.driverID,
        storeID: parsedresponseStore.store.storeID,
        orderNotes: 'my notes for first order patched',
        bookedBy: responseUserEmpParsed.employee.employeeID,
        submissionTime: '2022-11-30T11:21:44.000-08:00',
        pickupTime: '2022-11-30T11:22:44.000-08:00',
        vatFree: true,
        orderStatus: 'avslutad',
        currency: 'SEK',
        discount: 150,
        services: [],
        products: [],
        deleteOrderService: [],
        deleteOrderProducts: [],
      },
    })
    const parsedcreatOrderPatchResp = JSON.parse(creatOrderPatchResp.body)

    deepStrictEqual(parsedcreatOrderPatchResp.driverCarID, parsedcreateDriverCarResp.driverCarID)
    deepStrictEqual(parsedcreatOrderPatchResp.storeID, parsedresponseStore.store.storeID)
    deepStrictEqual(parsedcreatOrderPatchResp.orderNotes, 'my notes for first order patched')
    deepStrictEqual(parsedcreatOrderPatchResp.orderStatus, 'avslutad')
    deepStrictEqual(parsedcreatOrderPatchResp.discount, 150)

    const creatOrderAddServResp = await app.inject({
      method: 'PUT',
      url: '/orders',
      headers: {
        Authorization: jwt,
      },
      payload: {
        orderID: parsedcreatOrderResp.orderID,
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
            name: 'generated automated testing for orders',
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

    const creatOrderDeleteServResp = await app.inject({
      method: 'PUT',
      url: '/orders',
      headers: {
        Authorization: jwt,
      },
      payload: {
        orderID: parsedcreatOrderResp.orderID,
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
          { orderID: parsedcreatOrderResp.orderID, serviceID: parsedcreateServiceResp.serviceID },
        ],
        deleteOrderProducts: [],
      },
    })

    const parsedcreatOrderDeleteServResp = JSON.parse(creatOrderDeleteServResp.body)

    const deletedRes = {
      orderID: parsedcreatOrderResp.orderID,
      driverCarID: parsedcreateDriverCarResp.driverCarID,
      driverID: parsedCreateCompanyDriverResp.data.driver.driverID,
      storeID: parsedresponseStore.store.storeID,
      submissionTime: '2022-11-30 11:21:44',
      pickupTime: '2022-11-30T19:22:44.000Z',
      vatFree: true,
      orderStatus: 'avslutad',
      currency: 'SEK',
      discount: 150,
      message: 'Service created',
      products: [],
      services: [],
      orderNotes: 'Added a service',
      bookedBy: responseUserEmpParsed.employee.employeeID,
    }

    delete parsedcreatOrderDeleteServResp.createdAt
    delete parsedcreatOrderDeleteServResp.updatedAt
    deepStrictEqual(parsedcreatOrderDeleteServResp, deletedRes)

    const getOrderAddServResp1 = await app.inject({
      method: 'GET',
      url: '/orders/' + parsedcreatOrderResp.orderID,
      headers: {
        Authorization: jwt,
      },
    })

    const parsedgetOrderAddServResp1 = JSON.parse(getOrderAddServResp1.body)

    deepStrictEqual(parsedcreatOrderDeleteServResp.orderID, parsedgetOrderAddServResp1.orderID)
    deepStrictEqual(parsedcreatOrderDeleteServResp.bookedBy, parsedgetOrderAddServResp1.bookedBy)
    deepStrictEqual(parsedcreatOrderDeleteServResp.discount, parsedgetOrderAddServResp1.discount)
    deepStrictEqual(parsedcreatOrderDeleteServResp.discount, parsedgetOrderAddServResp1.discount)
    deepStrictEqual(
      parsedcreatOrderDeleteServResp.driverCarID,
      parsedgetOrderAddServResp1.driverCarID,
    )
    deepStrictEqual(
      parsedcreatOrderDeleteServResp.services.length,
      parsedgetOrderAddServResp1.services.length,
    )

    const creatOrderAddServResp2 = await app.inject({
      method: 'PUT',
      url: '/orders',
      headers: {
        Authorization: jwt,
      },
      payload: {
        orderID: parsedcreatOrderResp.orderID,
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
            name: 'generated automated testing for orders',
            serviceCategoryID: parsedcatResp.serviceCategoryID,
            serviceVariants: [],
            amount: 2,
            day1: '2024-08-25T08:34:58+0000',
            day1Work: '10:10:10',
            day1Employee: responseUserEmpParsed.employee.employeeID,
            vatFree: true,
            orderNotes: 'added service',
          },
          {
            serviceID: parsedcreateServiceResp2.serviceID,
            cost: 10,
            currency: 'SEK',
            name: 'generated automated testing for orders SECOND',
            serviceCategoryID: parsedcatResp.serviceCategoryID,
            serviceVariants: [],
            amount: 2,
            day1: '2024-08-25T08:34:58+0000',
            day1Work: '01:09:10',
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

    const parsedcreatOrderAddServResp2 = JSON.parse(creatOrderAddServResp2.body)
    const doubleServiceOrder = {
      orderID: parsedcreatOrderResp.orderID,
      driverCarID: parsedcreateDriverCarResp.driverCarID,
      driverID: parsedCreateCompanyDriverResp.data.driver.driverID,
      storeID: parsedresponseStore.store.storeID,
      submissionTime: '2022-11-30 11:21:44',
      pickupTime: '2022-11-30T19:22:44.000Z',
      vatFree: true,
      orderStatus: 'avslutad',
      currency: 'SEK',
      discount: 150,
      message: 'Service created',
      products: [],
      services: [
        {
          serviceID: 2,
          name: 'generated automated testing for orders',
          amount: 2,
          cost: 1337,
          currency: 'SEK',
          vatFree: true,
          orderNotes: 'added service',
          total: 2674,
          day1: '2024-08-25T08:34:58.000Z',
          day1Work: '10:10:10',
          day1Employee: responseUserEmpParsed.employee.employeeID,
        },
        {
          serviceID: 4,
          name: 'generated automated testing for orders SECOND',
          amount: 2,
          cost: 10,
          currency: 'SEK',
          vatFree: true,
          orderNotes: 'added service',
          total: 20,
          day1: '2024-08-25T08:34:58.000Z',
          day1Work: '01:09:10',
          day1Employee: responseUserEmpParsed.employee.employeeID,
        },
      ],

      orderNotes: 'Added a service',
      bookedBy: responseUserEmpParsed.employee.employeeID,
    }

    delete parsedcreatOrderAddServResp2.createdAt
    delete parsedcreatOrderAddServResp2.updatedAt
    deepStrictEqual(doubleServiceOrder, parsedcreatOrderAddServResp2)

    const getOrderAddServResp2 = await app.inject({
      method: 'GET',
      url: '/orders/' + parsedcreatOrderResp.orderID,
      headers: {
        Authorization: jwt,
      },
    })

    const parsedgetOrderAddServResp2 = JSON.parse(getOrderAddServResp2.body)

    deepStrictEqual(doubleServiceOrder.orderID, parsedgetOrderAddServResp2.orderID)
    deepStrictEqual(doubleServiceOrder.bookedBy, parsedgetOrderAddServResp2.bookedBy)
    deepStrictEqual(doubleServiceOrder.discount, parsedgetOrderAddServResp2.discount)
    deepStrictEqual(doubleServiceOrder.discount, parsedgetOrderAddServResp2.discount)
    deepStrictEqual(doubleServiceOrder.driverCarID, parsedgetOrderAddServResp2.driverCarID)
    // deepStrictEqual(
    //   doubleServiceOrder.services.length,
    //   parsedgetOrderAddServResp2.services.length,
    // )

    const creatOrderWrongDates = await app.inject({
      method: 'PUT',
      url: '/orders',
      headers: {
        Authorization: jwt,
      },
      payload: {
        orderID: parsedcreatOrderResp.orderID,
        driverCarID: parsedcreateDriverCarResp.driverCarID,
        driverID: parsedCreateCompanyDriverResp.data.driver.driverID,
        storeID: parsedresponseStore.store.storeID,
        orderNotes: 'Changed dates',
        bookedBy: responseUserEmpParsed.employee.employeeID,
        submissionTime: '2022-12-01T11:21:44.000-08:00',
        pickupTime: '2022-11-30T11:22:44.000-08:00',
        vatFree: true,
        orderStatus: 'avslutad',
        currency: 'SEK',
        discount: 150,
        services: [],
        products: [],
        deleteOrderService: [],
        deleteOrderProducts: [],
      },
    })
    const parsedcreatOrderWrongDates = JSON.parse(creatOrderWrongDates.body)
    deepStrictEqual(
      { message: 'upphämtningstiden måste vara senare än inlämningstiden' },
      parsedcreatOrderWrongDates,
    )

    const putOrderLocalResp = await app.inject({
      method: 'PUT',
      url: '/orders',
      headers: {
        Authorization: jwt,
      },
      payload: {
        orderID: parsedcreatOrderResp.orderID,
        driverCarID: parsedcreateDriverCarResp.driverCarID,
        driverID: parsedCreateCompanyDriverResp.data.driver.driverID,
        storeID: parsedresponseStore.store.storeID,
        orderNotes: 'Local service',
        bookedBy: responseUserEmpParsed.employee.employeeID,
        submissionTime: '2022-11-01T11:21:44.000-08:00',
        pickupTime: '2023-11-30T11:22:44.000-08:00',
        vatFree: true,
        orderStatus: 'påbörjad',
        currency: 'SEK',
        discount: 150,
        products: [],
        services: [
          {
            cost: 1234,
            currency: 'SEK',
            name: 'generated automated testing for orders',
            amount: 1,
            vatFree: false,
            day1: '2024-08-25T08:34:58.000Z',
            serviceID: parsedcreateLocalServiceResp.serviceID,
            orderNotes: 'first localService',
            day1Work: '01:09:10',
            day1Employee: responseUserEmpParsed.employee.employeeID,
          },
        ],
        deleteOrderService: [],
        deleteOrderProducts: [],
      },
    })

    const parsedputOrderLocalResp = JSON.parse(putOrderLocalResp.body)

    deepStrictEqual(parsedputOrderLocalResp.orderID, doubleServiceOrder.orderID)
    deepStrictEqual(parsedputOrderLocalResp.bookedBy, doubleServiceOrder.bookedBy)
    deepStrictEqual(parsedputOrderLocalResp.discount, doubleServiceOrder.discount)
    deepStrictEqual(parsedputOrderLocalResp.discount, doubleServiceOrder.discount)
    deepStrictEqual(parsedputOrderLocalResp.driverCarID, doubleServiceOrder.driverCarID)
    deepStrictEqual(parsedputOrderLocalResp.services[0].cost, 1234)
    deepStrictEqual(parsedputOrderLocalResp.services[0].vatFree, false)
    deepStrictEqual(parsedputOrderLocalResp.services[0].day1Work, '01:09:10')
    deepStrictEqual(parsedputOrderLocalResp.services[0].orderNotes, 'first localService')
    deepStrictEqual(
      parsedputOrderLocalResp.services[0].day1Employee,
      responseUserEmpParsed.employee.employeeID,
    )
    const getputOrderLocalResp = await app.inject({
      method: 'GET',
      url: '/orders/' + parsedputOrderLocalResp.orderID,
      headers: {
        Authorization: jwt,
      },
    })

    const parsedgetputOrderLocalResp = JSON.parse(getputOrderLocalResp.body)

    deepStrictEqual(parsedgetputOrderLocalResp.orderID, doubleServiceOrder.orderID)
    deepStrictEqual(parsedgetputOrderLocalResp.bookedBy, doubleServiceOrder.bookedBy)
    deepStrictEqual(parsedgetputOrderLocalResp.discount, doubleServiceOrder.discount)
    deepStrictEqual(parsedgetputOrderLocalResp.discount, doubleServiceOrder.discount)
    deepStrictEqual(parsedgetputOrderLocalResp.driverCarID, doubleServiceOrder.driverCarID)
    deepStrictEqual(parsedgetputOrderLocalResp.services[1].cost, 1234)
    deepStrictEqual(parsedgetputOrderLocalResp.services[1].vatFree, false)
    deepStrictEqual(parsedgetputOrderLocalResp.services[1].day1Work, '01:09:10')
    deepStrictEqual(parsedgetputOrderLocalResp.services[1].orderNotes, 'first localService')
    deepStrictEqual(
      parsedgetputOrderLocalResp.services.slice(-1)[0].day1Employee,
      responseUserEmpParsed.employee.employeeID,
    )

    const listOrdersResp = await app.inject({
      method: 'GET',
      url: '/orders/list-orders',
      headers: {
        Authorization: jwt,
      },
      query: {
        storeID: parsedresponseStore.store.storeID,
      },
    })

    const parsedlistOrdersResp = JSON.parse(listOrdersResp.body)

    deepStrictEqual(parsedlistOrdersResp.totalOrders, 1)
    deepStrictEqual(parsedlistOrdersResp.orders[0].driverCarID, doubleServiceOrder.driverCarID)
    deepStrictEqual(parsedlistOrdersResp.orders[0].orderStatus, 'påbörjad')
    deepStrictEqual(parsedlistOrdersResp.orders[0].firstName, 'Mahan')
    const nextOrderResp = await app.inject({
      method: 'PUT',
      url: '/orders',
      headers: {
        Authorization: jwt,
      },
      payload: {
        driverCarID: parsedcreateDriverCarResp.driverCarID,
        driverID: parsedCreateCompanyDriverResp.data.driver.driverID,
        storeID: parsedresponseStore.store.storeID,
        orderNotes: 'Local service',
        bookedBy: responseUserEmpParsed.employee.employeeID,
        submissionTime: '2022-11-01T11:21:44.000-08:00',
        pickupTime: '2022-11-30T11:22:44.000-08:00',
        vatFree: true,
        orderStatus: 'preliminär',
        currency: 'SEK',
        discount: 10,
        products: [],
        services: [
          {
            serviceID: 2,
            name: 'generated automated testing for orders',
            amount: 2,
            cost: 1337,
            currency: 'SEK',
            vatFree: true,
            orderNotes: 'added service',
            total: 2674,
            day1: '2024-08-25T08:34:58.000Z',
            day1Work: '10:10:10',
            day1Employee: responseUserEmpParsed.employee.employeeID,
          },
          {
            serviceID: 1,
            name: 'generated automated testing for orders',
            amount: 2,
            cost: 1337,
            currency: 'SEK',
            vatFree: true,
            orderNotes: 'added service',
            total: 2674,
            day1: '2024-08-25T08:34:58.000Z',
            day1Work: '10:10:10',
            day1Employee: responseUserEmpParsed.employee.employeeID,
          },
          {
            serviceID: parsedcreateLocalServiceResp.serviceID,
            cost: 200,
            currency: 'SEK',
            name: 'generated automated testing for orders',
            amount: 1,
            vatFree: false,
            day1: '2024-08-25T08:34:58.000Z',
            orderNotes: 'second localService',
            day1Work: '01:09:10',
            day1Employee: responseUserEmpParsed.employee.employeeID,
          },
        ],
        deleteOrderService: [],
        deleteOrderProducts: [],
      },
    })
    const parsednextOrderResp = JSON.parse(nextOrderResp.body)
    deepStrictEqual(parsednextOrderResp.services[0].name, 'generated automated testing for orders')
    deepStrictEqual(parsednextOrderResp.services.length, 3)

    const listOrdersResp1 = await app.inject({
      method: 'GET',
      url: '/orders/list-orders',
      headers: {
        Authorization: jwt,
      },
      query: {
        storeID: parsedresponseStore.store.storeID,
      },
    })
    const parsedlistOrdersResp1 = JSON.parse(listOrdersResp1.body)
    deepStrictEqual(parsedlistOrdersResp1.totalOrders, 2)
    deepStrictEqual(parsedlistOrdersResp1.orders[0].driverCarID, doubleServiceOrder.driverCarID)
    deepStrictEqual(parsedlistOrdersResp1.orders[0].orderStatus, 'påbörjad')
    deepStrictEqual(parsedlistOrdersResp1.orders[0].firstName, 'Mahan')
    deepStrictEqual(parsedlistOrdersResp1.orders[0].total, [1234, 20, 2674])
    deepStrictEqual(parsedlistOrdersResp1.orders[1].total, [200, 2674, 2674])
  })
})
