import { FastifyInstance } from 'fastify'

import { after, before, describe, it } from 'node:test'
import assert from 'assert'
import { buildApp } from '../../src/app.js'
import { initDrizzle } from '../../src/config/db-connect.js'

let jwt = ''
describe('POST /users/login HTTP', async () => {
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
    console.log('parsedresponseStore')
    console.log('parsedresponseStore')
    console.log(parsedresponseStore)
    console.log('parsedresponseStore')
    console.log('parsedresponseStore')
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

    console.log('responseUserEmpParsed')
    console.log('responseUserEmpParsed')
    console.log(responseUserEmpParsed)
    console.log('responseUserEmpParsed')

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
  })
})
