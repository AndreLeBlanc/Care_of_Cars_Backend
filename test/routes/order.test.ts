import { FastifyInstance } from 'fastify'

import { after, before, describe, it } from 'node:test'
import assert from 'assert'
import { buildApp } from '../../src/app.js'
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
    assert.deepStrictEqual(responseStore.statusCode, 201)

    const responseUserEmp = await app.inject({
      method: 'POST',
      url: '/users/employee',
      headers: {
        Authorization: jwt,
      },
      payload: {
        user: {
          firstName: 'inserT',
          lastName: 'lastNamesdfs',
          email: '23423123sed@sdfsdfs.is',
          isSuperAdmin: 'false',
          password: 'fdfsdfsdfdsfdsfsdewf2332werwfew',
          roleID: parsedresponseRoles.data.roleID,
        },
        employee: {
          shortUserName: ',,dd',
          employmentNumber: '46564235',
          employeePersonalNumber: '234134234',
          signature: 'poir',
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
    assert.deepStrictEqual(responseUserEmpParsed.user.firstName, 'inserT')

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
        companyEmail: 'admin@abcinc.com',
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

    assert.deepStrictEqual(parsedCreateCompanyDriverResp.data.company.customerOrgNumber, '123456')
    assert.deepStrictEqual(
      parsedCreateCompanyDriverResp.data.company.customerCompanyName,
      'ABC INC',
    )
    assert.deepStrictEqual(
      parsedCreateCompanyDriverResp.data.company.companyEmail,
      'admin@abcinc.com',
    )
    assert.deepStrictEqual(parsedCreateCompanyDriverResp.data.company.companyPhone, '018234432')
    assert.deepStrictEqual(
      parsedCreateCompanyDriverResp.data.company.companyAddress,
      'Some Road, Some Where',
    )
    assert.deepStrictEqual(parsedCreateCompanyDriverResp.data.company.companyZipCode, '74934')
    assert.deepStrictEqual(parsedCreateCompanyDriverResp.data.company.companyAddressCity, 'LOK')
    assert.deepStrictEqual(parsedCreateCompanyDriverResp.data.company.companyCountry, 'IN')

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
    assert.deepStrictEqual(parsedcreateDriverCarResp.driverCarBrand, 'Audi')
    assert.deepStrictEqual(parsedcreateDriverCarResp.driverCarModel, 'brum brum')
    assert.deepStrictEqual(parsedcreateDriverCarResp.driverCarNotes, 'first Test cars!')

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
    assert.deepStrictEqual(parsedcatResp.serviceCategoryName, 'my cat')

    const createServiceResp = await app.inject({
      method: 'PUT',
      url: '/services',
      headers: {
        Authorization: jwt,
      },
      payload: {
        cost: 1337,
        currency: 'SEK',
        name: 'generated automated testing',
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

    assert.deepStrictEqual(parsedcreateServiceResp.day1, '10:10:10')
    assert.deepStrictEqual(parsedcreateServiceResp.hidden, false)
    assert.deepStrictEqual(parsedcreateServiceResp.warrantyCard, true)

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
        name: 'generated automated testing',
        serviceCategoryID: parsedcatResp.serviceCategoryID,
        includeInAutomaticSms: true,
        localServiceVariants: [],
        serviceVariants: [],
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

    console.log('parsedcreateLocalServiceResp')
    console.log('parsedcreateLocalServiceResp')
    console.log(parsedcreateLocalServiceResp)
    console.log('parsedcreateLocalServiceResp')
    console.log('parsedcreateLocalServiceResp')

    assert.deepStrictEqual(parsedcreateLocalServiceResp.day1, '10:10:10')
    assert.deepStrictEqual(parsedcreateLocalServiceResp.hidden, false)
    assert.deepStrictEqual(parsedcreateLocalServiceResp.warrantyCard, true)

    const createServiceResp2 = await app.inject({
      method: 'PUT',
      url: '/services',
      headers: {
        Authorization: jwt,
      },
      payload: {
        cost: 10,
        currency: 'SEK',
        name: 'generated automated testing SECOND',
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

    assert.deepStrictEqual(parsedcreateServiceResp2.day1, '09:09:01')
    assert.deepStrictEqual(parsedcreateServiceResp2.hidden, false)
    assert.deepStrictEqual(parsedcreateServiceResp2.cost, 10)
    assert.deepStrictEqual(parsedcreateServiceResp2.warrantyCard, false)

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
        localServices: [],
        deleteOrderService: [],
        deleteOrderLocalService: [],
      },
    })
    const parsedcreatOrderResp = JSON.parse(creatOrderResp.body)

    assert.deepStrictEqual(parsedcreatOrderResp.driverCarID, parsedcreateDriverCarResp.driverCarID)
    assert.deepStrictEqual(parsedcreatOrderResp.storeID, parsedresponseStore.store.storeID)
    assert.deepStrictEqual(parsedcreatOrderResp.orderNotes, 'my notes for first order')
    assert.deepStrictEqual(parsedcreatOrderResp.orderStatus, 'preliminär')
    assert.deepStrictEqual(parsedcreatOrderResp.discount, 100)

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
        localServices: [],
        deleteOrderService: [],
        deleteOrderLocalService: [],
      },
    })
    const parsedcreatOrderPatchResp = JSON.parse(creatOrderPatchResp.body)

    assert.deepStrictEqual(
      parsedcreatOrderPatchResp.driverCarID,
      parsedcreateDriverCarResp.driverCarID,
    )
    assert.deepStrictEqual(parsedcreatOrderPatchResp.storeID, parsedresponseStore.store.storeID)
    assert.deepStrictEqual(parsedcreatOrderPatchResp.orderNotes, 'my notes for first order patched')
    assert.deepStrictEqual(parsedcreatOrderPatchResp.orderStatus, 'avslutad')
    assert.deepStrictEqual(parsedcreatOrderPatchResp.discount, 150)

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
            name: 'generated automated testing',
            serviceCategoryID: parsedcatResp.serviceCategoryID,
            serviceVariants: [],
            localServiceVariants: [],
            amount: 2,
            day1: '2024-08-25T08:34:58+0000',
            day1Work: '10:10:10',
            day1Employee: responseUserEmpParsed.employee.employeeID,
            vatFree: true,
            orderNotes: 'added service',
          },
        ],
        localServices: [],
        deleteOrderService: [],
        deleteOrderLocalService: [],
      },
    })

    const parsedcreatOrderAddServResp = JSON.parse(creatOrderAddServResp.body)

    assert.deepStrictEqual(
      parsedcreatOrderAddServResp.driverCarID,
      parsedcreateDriverCarResp.driverCarID,
    )
    assert.deepStrictEqual(parsedcreatOrderAddServResp.storeID, parsedresponseStore.store.storeID)
    assert.deepStrictEqual(parsedcreatOrderAddServResp.orderNotes, 'Added a service')
    assert.deepStrictEqual(parsedcreatOrderAddServResp.orderStatus, 'avslutad')
    assert.deepStrictEqual(parsedcreatOrderAddServResp.discount, 150)
    assert.deepStrictEqual(parsedcreatOrderAddServResp.services[0].currency, 'SEK')
    assert.deepStrictEqual(parsedcreatOrderAddServResp.services[0].cost, 1337)
    assert.deepStrictEqual(parsedcreatOrderAddServResp.services[0].amount, 2)
    assert.deepStrictEqual(parsedcreatOrderAddServResp.services[0].total, 2674)

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
        localServices: [],
        deleteOrderService: [
          { orderID: parsedcreatOrderResp.orderID, serviceID: parsedcreateServiceResp.serviceID },
        ],
        deleteOrderLocalService: [],
      },
    })

    const parsedcreatOrderDeleteServResp = JSON.parse(creatOrderDeleteServResp.body)

    const deletedRes = {
      orderID: parsedcreatOrderResp.orderID,
      driverCarID: parsedcreateDriverCarResp.driverCarID,
      driverID: parsedCreateCompanyDriverResp.data.driver.driverID,
      storeID: parsedresponseStore.store.storeID,
      submissionTime: '2022-11-30T19:21:44.000Z',
      pickupTime: '2022-11-30T19:22:44.000Z',
      vatFree: true,
      orderStatus: 'avslutad',
      currency: 'SEK',
      discount: 150,
      message: 'Service created',
      services: [],
      localServices: [],
      orderNotes: 'Added a service',
      bookedBy: responseUserEmpParsed.employee.employeeID,
    }

    delete parsedcreatOrderDeleteServResp.createdAt
    delete parsedcreatOrderDeleteServResp.updatedAt
    assert.deepStrictEqual(parsedcreatOrderDeleteServResp, deletedRes)

    const getOrderAddServResp1 = await app.inject({
      method: 'GET',
      url: '/orders/' + parsedcreatOrderResp.orderID,
      headers: {
        Authorization: jwt,
      },
    })

    const parsedgetOrderAddServResp1 = JSON.parse(getOrderAddServResp1.body)

    assert.deepStrictEqual(
      parsedcreatOrderDeleteServResp.orderID,
      parsedgetOrderAddServResp1.orderID,
    )
    assert.deepStrictEqual(
      parsedcreatOrderDeleteServResp.bookedBy,
      parsedgetOrderAddServResp1.bookedBy,
    )
    assert.deepStrictEqual(
      parsedcreatOrderDeleteServResp.discount,
      parsedgetOrderAddServResp1.discount,
    )
    assert.deepStrictEqual(
      parsedcreatOrderDeleteServResp.discount,
      parsedgetOrderAddServResp1.discount,
    )
    assert.deepStrictEqual(
      parsedcreatOrderDeleteServResp.driverCarID,
      parsedgetOrderAddServResp1.driverCarID,
    )
    assert.deepStrictEqual(
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
            name: 'generated automated testing',
            serviceCategoryID: parsedcatResp.serviceCategoryID,
            serviceVariants: [],
            localServiceVariants: [],
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
            name: 'generated automated testing SECOND',
            serviceCategoryID: parsedcatResp.serviceCategoryID,
            serviceVariants: [],
            localServiceVariants: [],
            amount: 2,
            day1: '2024-08-25T08:34:58+0000',
            day1Work: '01:09:10',
            day1Employee: responseUserEmpParsed.employee.employeeID,
            vatFree: true,
            orderNotes: 'added service',
          },
        ],
        localServices: [],
        deleteOrderService: [],
        deleteOrderLocalService: [],
      },
    })

    const parsedcreatOrderAddServResp2 = JSON.parse(creatOrderAddServResp2.body)
    const doubleServiceOrder = {
      orderID: parsedcreatOrderResp.orderID,
      driverCarID: parsedcreateDriverCarResp.driverCarID,
      driverID: parsedCreateCompanyDriverResp.data.driver.driverID,
      storeID: parsedresponseStore.store.storeID,
      submissionTime: '2022-11-30T19:21:44.000Z',
      pickupTime: '2022-11-30T19:22:44.000Z',
      vatFree: true,
      orderStatus: 'avslutad',
      currency: 'SEK',
      discount: 150,
      message: 'Service created',
      services: [
        {
          serviceID: 2,
          name: 'generated automated testing',
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
          serviceID: 3,
          name: 'generated automated testing SECOND',
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
      localServices: [],
      orderNotes: 'Added a service',
      bookedBy: responseUserEmpParsed.employee.employeeID,
    }

    delete parsedcreatOrderAddServResp2.createdAt
    delete parsedcreatOrderAddServResp2.updatedAt
    assert.deepStrictEqual(doubleServiceOrder, parsedcreatOrderAddServResp2)

    const getOrderAddServResp2 = await app.inject({
      method: 'GET',
      url: '/orders/' + parsedcreatOrderResp.orderID,
      headers: {
        Authorization: jwt,
      },
    })

    const parsedgetOrderAddServResp2 = JSON.parse(getOrderAddServResp2.body)

    assert.deepStrictEqual(doubleServiceOrder.orderID, parsedgetOrderAddServResp2.orderID)
    assert.deepStrictEqual(doubleServiceOrder.bookedBy, parsedgetOrderAddServResp2.bookedBy)
    assert.deepStrictEqual(doubleServiceOrder.discount, parsedgetOrderAddServResp2.discount)
    assert.deepStrictEqual(doubleServiceOrder.discount, parsedgetOrderAddServResp2.discount)
    assert.deepStrictEqual(doubleServiceOrder.driverCarID, parsedgetOrderAddServResp2.driverCarID)
    // assert.deepStrictEqual(
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
        localServices: [],
        deleteOrderService: [],
        deleteOrderLocalService: [],
      },
    })
    const parsedcreatOrderWrongDates = JSON.parse(creatOrderWrongDates.body)
    assert.deepStrictEqual(
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
        pickupTime: '2022-11-30T11:22:44.000-08:00',
        vatFree: true,
        orderStatus: 'påbörjad',
        currency: 'SEK',
        discount: 150,
        services: [],
        localServices: [
          {
            cost: 1234,
            currency: 'SEK',
            name: 'generated automated testing',
            amount: 1,
            vatFree: false,
            day1: '2024-08-25T08:34:58.000Z',
            localServiceID: parsedcreateLocalServiceResp.localServiceID,
            orderNotes: 'first localService',
            day1Work: '01:09:10',
            day1Employee: responseUserEmpParsed.employee.employeeID,
          },
        ],
        deleteOrderService: [],
        deleteOrderLocalService: [],
      },
    })
    const parsedputOrderLocalResp = JSON.parse(putOrderLocalResp.body)

    assert.deepStrictEqual(parsedputOrderLocalResp.orderID, doubleServiceOrder.orderID)
    assert.deepStrictEqual(parsedputOrderLocalResp.bookedBy, doubleServiceOrder.bookedBy)
    assert.deepStrictEqual(parsedputOrderLocalResp.discount, doubleServiceOrder.discount)
    assert.deepStrictEqual(parsedputOrderLocalResp.discount, doubleServiceOrder.discount)
    assert.deepStrictEqual(parsedputOrderLocalResp.driverCarID, doubleServiceOrder.driverCarID)
    assert.deepStrictEqual(parsedputOrderLocalResp.localServices[0].cost, 1234)
    assert.deepStrictEqual(parsedputOrderLocalResp.localServices[0].vatFree, false)
    assert.deepStrictEqual(parsedputOrderLocalResp.localServices[0].day1Work, '01:09:10')
    assert.deepStrictEqual(
      parsedputOrderLocalResp.localServices[0].orderNotes,
      'first localService',
    )
    assert.deepStrictEqual(
      parsedputOrderLocalResp.localServices[0].day1Employee,
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
    assert.deepStrictEqual(parsedgetputOrderLocalResp.orderID, doubleServiceOrder.orderID)
    assert.deepStrictEqual(parsedgetputOrderLocalResp.bookedBy, doubleServiceOrder.bookedBy)
    assert.deepStrictEqual(parsedgetputOrderLocalResp.discount, doubleServiceOrder.discount)
    assert.deepStrictEqual(parsedgetputOrderLocalResp.discount, doubleServiceOrder.discount)
    assert.deepStrictEqual(parsedgetputOrderLocalResp.driverCarID, doubleServiceOrder.driverCarID)
    assert.deepStrictEqual(parsedgetputOrderLocalResp.localServices[0].cost, 1234)
    assert.deepStrictEqual(parsedgetputOrderLocalResp.localServices[0].vatFree, false)
    assert.deepStrictEqual(parsedgetputOrderLocalResp.localServices[0].day1Work, '01:09:10')
    assert.deepStrictEqual(
      parsedgetputOrderLocalResp.localServices[0].orderNotes,
      'first localService',
    )
    assert.deepStrictEqual(
      parsedgetputOrderLocalResp.localServices[0].day1Employee,
      responseUserEmpParsed.employee.employeeID,
    )
  })
})
