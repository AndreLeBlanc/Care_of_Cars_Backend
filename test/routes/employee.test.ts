import { after, before, describe, it } from 'node:test'
import { FastifyInstance } from 'fastify'
import { buildApp } from '../../src/app.js'
import { deepStrictEqual } from 'assert'
import { initDrizzle } from '../../src/config/db-connect.js'

let jwt = ''
describe('Employees tests', async () => {
  let app: FastifyInstance

  before(async () => {
    await initDrizzle()
    app = await buildApp({ logger: false })
    await new Promise((f) => setTimeout(f, 3500))
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

  it('Create user and employee and checkin/out', async () => {
    const strings = ['fdswerxcvdfsd', 'ffkkklllssseee', 'iuytrecvbnhgfd']
    const perms: number[] = []
    const roles: number[] = []
    for (const [i, name] of strings.entries()) {
      deepStrictEqual(name, strings[i])
      const responsePerm = await app.inject({
        method: 'POST',
        url: '/permissions',
        headers: {
          Authorization: jwt,
        },
        payload: {
          permissionTitle: name,
          description: name,
        },
      })
      const parsedresponsePerm = JSON.parse(responsePerm.body)
      perms.push(parsedresponsePerm.data.permissionID)
      const responseRole = await app.inject({
        method: 'POST',
        url: '/roles',
        headers: {
          Authorization: jwt,
        },
        payload: { roleName: name, description: name },
      })
      const parsedresponseRoles = JSON.parse(responseRole.body)
      roles.push(parsedresponseRoles.data.roleID)
    }
    const responseStore = await app.inject({
      method: 'POST',
      url: '/stores',
      headers: {
        Authorization: jwt,
      },
      payload: {
        storeName: 'the second store',
        storeOrgNumber: '23948y5232',
        storeFSkatt: false,
        storeStatus: true,
        storeEmail: 'mystoffre@store.is',
        storePhone: '076275999764',
        storeAddress: 'a sddt',
        storeZipCode: '32121',
        storeCity: 'Reykavik',
        storeCountry: 'Iceland',
        storeDescription: 'A store',
        storeContactPerson: 'kalle Anka',
        storeMaxUsers: 1024,
        storeAllowCarAPI: true,
        storeAllowSendSMS: true,
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
          firstName: 'My first name!',
          lastName: 'Meerkat',
          email: '23423123sed@sdfsdfs.is',
          isSuperAdmin: 'false',
          password: 'fdfsdfsdfdsfdsfsdewf2332werwfew',
          roleID: roles[0],
        },
        employee: {
          shortUserName: 'hime',
          employmentNumber: '3243223432',
          employeePersonalNumber: '1991335523',
          signature: 'lkc',
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
    deepStrictEqual(responseUserEmpParsed.user.firstName, 'My first name!')

    const checkInFirst = await app.inject({
      method: 'POST',
      url: '/employees/checkin',
      headers: {
        Authorization: jwt,
      },
      payload: {
        employeeID: responseUserEmpParsed.employee.employeeID,
        storeID: parsedresponseStore.store.storeID,
        employeeCheckedOut: 'CheckedIn',
      },
    })
    const checkInFirstParsed = JSON.parse(checkInFirst.body)
    deepStrictEqual(checkInFirstParsed.employeeID, responseUserEmpParsed.employee.employeeID)

    const checkoutFirst = await app.inject({
      method: 'POST',
      url: '/employees/checkin',
      headers: {
        Authorization: jwt,
      },
      payload: {
        employeeID: responseUserEmpParsed.employee.employeeID,
        storeID: parsedresponseStore.store.storeID,
        employeeCheckedOut: 'CheckedOut',
      },
    })
    const checkoutFirstParsed = JSON.parse(checkoutFirst.body)
    deepStrictEqual(checkoutFirstParsed.employeeID, responseUserEmpParsed.employee.employeeID)
    const checkoutAgain = await app.inject({
      method: 'POST',
      url: '/employees/checkin',
      headers: {
        Authorization: jwt,
      },
      payload: {
        employeeID: responseUserEmpParsed.employee.employeeID,
        storeID: parsedresponseStore.store.storeID,
        employeeCheckedOut: 'CheckedOut',
      },
    })

    const checkoutAgainParsed = JSON.parse(checkoutAgain.body)
    deepStrictEqual(checkoutAgainParsed.message, 'Already checked out')

    const checkInAgain = await app.inject({
      method: 'POST',
      url: '/employees/checkin',
      headers: {
        Authorization: jwt,
      },
      payload: {
        employeeID: responseUserEmpParsed.employee.employeeID,
        storeID: parsedresponseStore.store.storeID,
        employeeCheckedOut: 'CheckedIn',
      },
    })
    const checkInAgainParsed = JSON.parse(checkInAgain.body)
    deepStrictEqual(checkInAgainParsed.employeeID, responseUserEmpParsed.employee.employeeID)
    const checkInThrice = await app.inject({
      method: 'POST',
      url: '/employees/checkin',
      headers: {
        Authorization: jwt,
      },
      payload: {
        employeeID: responseUserEmpParsed.employee.employeeID,
        storeID: parsedresponseStore.store.storeID,
        employeeCheckedOut: 'CheckedIn',
      },
    })
    const checkInThriceParsed = JSON.parse(checkInThrice.body)
    deepStrictEqual(checkInThriceParsed.message, 'Already checked in')
  })

  it('Create user and employee', async () => {
    const strings = ['null', 'fsdggdfwer', 'qiwej']
    const perms: number[] = []
    const roles: number[] = []
    for (const [i, name] of strings.entries()) {
      deepStrictEqual(name, strings[i])
      const responsePerm = await app.inject({
        method: 'POST',
        url: '/permissions',
        headers: {
          Authorization: jwt,
        },
        payload: {
          permissionTitle: name,
          description: name,
        },
      })
      const parsedresponsePerm = JSON.parse(responsePerm.body)
      perms.push(parsedresponsePerm.data.permissionID)
      const responseRole = await app.inject({
        method: 'POST',
        url: '/roles',
        headers: {
          Authorization: jwt,
        },
        payload: { roleName: name, description: name },
      })
      const parsedresponseRoles = JSON.parse(responseRole.body)
      roles.push(parsedresponseRoles.data.roleID)
    }
    const responseStore = await app.inject({
      method: 'POST',
      url: '/stores',
      headers: {
        Authorization: jwt,
      },
      payload: {
        storeName: 'the third store',
        storeOrgNumber: '66s9dq5552',
        storeFSkatt: false,
        storeStatus: true,
        storeEmail: 'mystoffre@stored.ca',
        storePhone: '07627599934',
        storeAddress: 'a sddasdast',
        storeZipCode: '32191',
        storeCity: 'Reykaviasdk',
        storeCountry: 'Icelandsd',
        storeDescription: 'A stsadore',
        storeContactPerson: 'mcduck',
        storeMaxUsers: 10,
        storeAllowCarAPI: true,
        storeAllowSendSMS: true,
        storeSendSMS: true,
        storeUsesCheckin: true,
        storeUsesPIN: true,
      },
    })

    const parsedresponseStore = JSON.parse(responseStore.body)
    deepStrictEqual(responseStore.statusCode, 201)

    const responseStore2 = await app.inject({
      method: 'POST',
      url: '/stores',
      headers: {
        Authorization: jwt,
      },
      payload: {
        storeName: 'the fourth store',
        storeOrgNumber: '66s9dq4444',
        storeFSkatt: true,
        storeStatus: true,
        storeEmail: 'mystadasoffre@stored.ca',
        storePhone: '3242356934',
        storeAddress: 'a sddsdfasdast',
        storeZipCode: '321444',
        storeCity: 'Reykaviassdfsddk',
        storeCountry: 'Icelandsd',
        storeDescription: 'A stsasdfsore',
        storeContactPerson: 'Geoprge',
        storeMaxUsers: 100,
        storeAllowCarAPI: true,
        storeAllowSendSMS: true,
        storeSendSMS: true,
        storeUsesCheckin: true,
        storeUsesPIN: true,
      },
    })

    const parsedresponseStore2 = JSON.parse(responseStore2.body)
    deepStrictEqual(responseStore2.statusCode, 201)

    const userResponse = await app.inject({
      method: 'POST',
      url: '/users',
      headers: {
        Authorization: jwt,
      },
      payload: {
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email@email.com',
        isSuperAdmin: 'false',
        password: 'fdfsdfsdfdsfdsfsdewf2332werwfew',
        roleID: roles[0],
      },
    })
    deepStrictEqual(userResponse.statusCode, 201)
    const parseduserResponse = JSON.parse(userResponse.body)

    const userResponse2 = await app.inject({
      method: 'POST',
      url: '/users',
      headers: {
        Authorization: jwt,
      },
      payload: {
        firstName: 'första namn',
        lastName: 'sista namn',
        email: 'email@mejl.com',
        isSuperAdmin: 'true',
        password: 'fdfsdfsdfdsfdsfsdewf2332werwfew',
        roleID: roles[1],
      },
    })
    deepStrictEqual(userResponse2.statusCode, 201)
    const parseduserResponse2 = JSON.parse(userResponse2.body)

    const employeeResponse = await app.inject({
      method: 'PUT',
      url: '/employees',
      headers: {
        Authorization: jwt,
      },
      payload: {
        userID: parseduserResponse.userID,
        shortUserName: 'dfsd',
        employmentNumber: 'asd232asd',
        employeePersonalNumber: '20000101111',
        signature: 'were',
        employeePin: 'abss',
        employeeActive: true,
        employeeComment: 'a comment about me',
        storeID: [parsedresponseStore.store.storeID],
      },
    })

    const parsedemployeeResponse = JSON.parse(employeeResponse.body)
    deepStrictEqual(employeeResponse.statusCode, 201)
    deepStrictEqual(parsedemployeeResponse.userID, parseduserResponse.userID)
    deepStrictEqual(parsedemployeeResponse.employmentNumber, 'asd232asd')
    deepStrictEqual(parsedemployeeResponse.employeeActive, true)
    deepStrictEqual(parsedemployeeResponse.storeIDs, [
      {
        storeID: parsedresponseStore.store.storeID,
        storeName: parsedresponseStore.store.storeName,
      },
    ])

    const employeeResponse2 = await app.inject({
      method: 'PUT',
      url: '/employees',
      headers: {
        Authorization: jwt,
      },
      payload: {
        userID: parseduserResponse2.userID,
        shortUserName: 'vvvd',
        employmentNumber: 'asd232addsd',
        employeePersonalNumber: 'aaasdqw',
        signature: 'week',
        employeePin: 'abds',
        employeeActive: true,
        employeeComment: 'a comment about me agains',
        storeID: [parsedresponseStore.store.storeID, parsedresponseStore2.store.storeID],
      },
    })

    const parsedemployeeResponse2 = JSON.parse(employeeResponse2.body)
    deepStrictEqual(employeeResponse2.statusCode, 201)
    deepStrictEqual(parsedemployeeResponse2.userID, parseduserResponse2.userID)
    deepStrictEqual(parsedemployeeResponse2.employmentNumber, 'asd232addsd')
    deepStrictEqual(parsedemployeeResponse2.employeeActive, true)
    deepStrictEqual(parsedemployeeResponse2.storeIDs, [
      {
        storeID: parsedresponseStore.store.storeID,
        storeName: parsedresponseStore.store.storeName,
      },
      {
        storeID: parsedresponseStore2.store.storeID,
        storeName: parsedresponseStore2.store.storeName,
      },
    ])

    const employeeGetResponse = await app.inject({
      method: 'GET',
      url: '/employees/' + parsedemployeeResponse.employeeID,
      headers: {
        Authorization: jwt,
      },
    })

    const parsedemployeeGetResponse = JSON.parse(employeeGetResponse.body)

    deepStrictEqual(employeeGetResponse.statusCode, 200)
    deepStrictEqual(parsedemployeeGetResponse.userID, parseduserResponse.userID)
    deepStrictEqual(parsedemployeeGetResponse.employmentNumber, 'asd232asd')
    deepStrictEqual(parsedemployeeGetResponse.employeeActive, true)
    deepStrictEqual(parsedemployeeGetResponse.storeIDs, [
      {
        storeID: parsedresponseStore.store.storeID,
        storeName: parsedresponseStore.store.storeName,
      },
    ])

    const employeeGetResponse2 = await app.inject({
      method: 'GET',
      url: '/employees/' + parsedemployeeResponse2.employeeID,
      headers: {
        Authorization: jwt,
      },
    })

    const parsedemployeeGetResponse2 = JSON.parse(employeeGetResponse2.body)

    deepStrictEqual(employeeGetResponse2.statusCode, 200)
    deepStrictEqual(parsedemployeeGetResponse2.userID, parseduserResponse2.userID)
    deepStrictEqual(parsedemployeeGetResponse2.employmentNumber, 'asd232addsd')
    deepStrictEqual(parsedemployeeGetResponse2.employeeActive, true)
    deepStrictEqual(parsedemployeeGetResponse2.storeIDs, [
      {
        storeID: parsedresponseStore.store.storeID,
        storeName: parsedresponseStore.store.storeName,
      },
      {
        storeID: parsedresponseStore2.store.storeID,
        storeName: parsedresponseStore2.store.storeName,
      },
    ])

    const employeePatchResponse = await app.inject({
      method: 'PUT',
      url: '/employees',
      headers: {
        Authorization: jwt,
      },
      payload: {
        employeeID: parsedemployeeResponse2.employeeID,
        userID: parseduserResponse2.userID,
        shortUserName: 'vdv',
        employmentNumber: 'asd23vdv2addsd',
        employeePersonalNumber: 'aaasdqw',
        signature: 'week',
        employeePin: 'abds',
        employeeActive: true,
        employeeComment: 'a comment about me agains patched',
        storeID: [parsedresponseStore2.store.storeID],
      },
    })
    const parsedemployeePatchResponse = JSON.parse(employeePatchResponse.body)

    deepStrictEqual(employeePatchResponse.statusCode, 201)
    deepStrictEqual(parsedemployeePatchResponse.userID, parseduserResponse2.userID)
    deepStrictEqual(parsedemployeePatchResponse.employmentNumber, 'asd23vdv2addsd')
    deepStrictEqual(parsedemployeePatchResponse.employeeActive, true)
    deepStrictEqual(
      parsedemployeePatchResponse.employeeComment,
      'a comment about me agains patched',
    )
    deepStrictEqual(parsedemployeePatchResponse.storeIDs, [
      {
        storeID: parsedresponseStore2.store.storeID,
        storeName: parsedresponseStore2.store.storeName,
      },
    ])

    const employeePatchResponse2 = await app.inject({
      method: 'PUT',
      url: '/employees',
      headers: {
        Authorization: jwt,
      },
      payload: {
        employeeID: parsedemployeeResponse.employeeID,
        userID: parseduserResponse.userID,
        shortUserName: 'dfsd',
        employmentNumber: 'asd232addsd',
        employeePersonalNumber: '20000101111',
        signature: 'were',
        employeePin: 'abss',
        employeeActive: true,
        employeeComment: 'a comment about me',
        storeID: [parsedresponseStore.store.storeID, parsedresponseStore2.store.storeID],
      },
    })

    const parsedemployeePatchResponse2 = JSON.parse(employeePatchResponse2.body)
    deepStrictEqual(employeePatchResponse2.statusCode, 201)
    deepStrictEqual(parsedemployeePatchResponse2.userID, parseduserResponse.userID)
    deepStrictEqual(parsedemployeePatchResponse2.employmentNumber, 'asd232addsd')
    deepStrictEqual(parsedemployeePatchResponse2.employeeActive, true)
    deepStrictEqual(parsedemployeePatchResponse2.storeIDs, [
      {
        storeID: parsedresponseStore.store.storeID,
        storeName: parsedresponseStore.store.storeName,
      },
      {
        storeID: parsedresponseStore2.store.storeID,
        storeName: parsedresponseStore2.store.storeName,
      },
    ])

    const employeeDELETEResponse = await app.inject({
      method: 'GET',
      url: '/employees/' + parsedemployeeResponse.employeeID,
      headers: {
        Authorization: jwt,
      },
    })

    const parsedemployeeDELETEResponse = JSON.parse(employeeDELETEResponse.body)

    deepStrictEqual(employeeDELETEResponse.statusCode, 200)
    deepStrictEqual(parsedemployeeDELETEResponse.userID, parseduserResponse.userID)
    deepStrictEqual(parsedemployeeDELETEResponse.employmentNumber, 'asd232addsd')
    deepStrictEqual(parsedemployeeDELETEResponse.employeeActive, true)
    deepStrictEqual(parsedemployeeDELETEResponse.storeIDs, [
      {
        storeID: parsedresponseStore.store.storeID,
        storeName: parsedresponseStore.store.storeName,
      },
      {
        storeID: parsedresponseStore2.store.storeID,
        storeName: parsedresponseStore2.store.storeName,
      },
    ])

    const employeeDELETEResponse2 = await app.inject({
      method: 'GET',
      url: '/employees/' + parsedemployeeResponse2.employeeID,
      headers: {
        Authorization: jwt,
      },
    })

    const parsedemployeeDELETEResponse2 = JSON.parse(employeeDELETEResponse2.body)

    deepStrictEqual(employeeDELETEResponse2.statusCode, 200)
    deepStrictEqual(parsedemployeeDELETEResponse2.userID, parseduserResponse2.userID)
    deepStrictEqual(parsedemployeeDELETEResponse2.employmentNumber, 'asd23vdv2addsd')
    deepStrictEqual(parsedemployeeDELETEResponse2.employeeActive, true)
    deepStrictEqual(parsedemployeeDELETEResponse2.storeIDs, [
      {
        storeID: parsedresponseStore2.store.storeID,
        storeName: parsedresponseStore2.store.storeName,
      },
    ])
  })

  it('Create user and employee and checkin/out', async () => {
    const strings = ['worky', 'borky', 'zorky']
    const perms: number[] = []
    const roles: number[] = []
    for (const [i, name] of strings.entries()) {
      deepStrictEqual(name, strings[i])
      const responsePerm = await app.inject({
        method: 'POST',
        url: '/permissions',
        headers: {
          Authorization: jwt,
        },
        payload: {
          permissionTitle: name,
          description: name,
        },
      })
      const parsedresponsePerm = JSON.parse(responsePerm.body)
      perms.push(parsedresponsePerm.data.permissionID)
      const responseRole = await app.inject({
        method: 'POST',
        url: '/roles',
        headers: {
          Authorization: jwt,
        },
        payload: { roleName: name, description: name },
      })
      const parsedresponseRoles = JSON.parse(responseRole.body)
      roles.push(parsedresponseRoles.data.roleID)
    }
    const responseStore = await app.inject({
      method: 'POST',
      url: '/stores',
      headers: {
        Authorization: jwt,
      },
      payload: {
        storeName: 'slave store',
        storeOrgNumber: '22948y5232',
        storeFSkatt: false,
        storeStatus: true,
        storeEmail: 'workerPlace@store.is',
        storePhone: '076275999764',
        storeAddress: 'a workery',
        storeZipCode: '32121',
        storeCity: 'Reykavik',
        storeCountry: 'Iceland',
        storeDescription: 'A store',
        storeContactPerson: 'kalle Anka',
        storeMaxUsers: 1024,
        storeAllowCarAPI: true,
        storeAllowSendSMS: true,
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
          firstName: 'I work',
          lastName: 'Meerkat',
          email: '23423123s23423sfded@sdfsdfs.is',
          isSuperAdmin: 'false',
          password: 'fdfsdfsdfdsfdssdfsdfsdewf2332werwfew',
          roleID: roles[0],
        },
        employee: {
          shortUserName: 'hime',
          employmentNumber: '2234wersdfg',
          employeePersonalNumber: '1991333323',
          signature: 'lk5',
          employeePin: 's2fe',
          employeeActive: true,
          employeeComment: 'a comment for this user',
          storeID: [parsedresponseStore.store.storeID],
          employeeHourlyRateCurrency: 'DKK',
          employeeHourlyRate: 100,
        },
      },
    })

    const responseUserEmpParsed = JSON.parse(responseUserEmp.body)
    deepStrictEqual(responseUserEmpParsed.user.firstName, 'I work')

    const responseWorkTime = await app.inject({
      method: 'PUT',
      url: '/employees/workingHours',
      headers: {
        Authorization: jwt,
      },
      payload: {
        employeeID: responseUserEmpParsed.employee.employeeID,
        storeID: parsedresponseStore.store.storeID,
        mondayStart: '09:01:02',
        mondayStop: '17:15:04',
        mondayBreak: '01:10:01',
        tuesdayStart: '09:01:02',
        tuesdayStop: '17:15:04',
        tuesdayBreak: '01:10:01',
        wednesdayStart: '09:01:02',
        wednesdayStop: '17:15:04',
        wednesdayBreak: '01:10:01',
        thursdayStart: '09:01:02',
        thursdayStop: '17:15:04',
        thursdayBreak: '01:10:01',
        fridayStart: '09:01:02',
        fridayStop: '17:15:04',
        fridayBreak: '01:10:01',
        saturdayStart: '09:01:02',
        saturdayStop: '17:15:04',
        saturdayBreak: '01:10:01',
        sundayStart: '09:01:02',
        sundayStop: '17:15:04',
      },
    })

    const responseWorkTimeParsed = JSON.parse(responseWorkTime.body)
    deepStrictEqual(responseWorkTimeParsed.storeID, parsedresponseStore.store.storeID)

    const catResp = await app.inject({
      method: 'POST',
      url: '/category/service',
      headers: {
        Authorization: jwt,
      },
      payload: {
        serviceCategoryName: 'my work cat',
        serviceCategoryDescription: 'used for testing',
      },
    })

    const parsedcatResp = JSON.parse(catResp.body)
    deepStrictEqual(parsedcatResp.serviceCategoryName, 'my work cat')

    const createServiceResp = await app.inject({
      method: 'PUT',
      url: '/services',
      headers: {
        Authorization: jwt,
      },
      payload: {
        cost: 1337,
        currency: 'SEK',
        name: 'workTime test service',
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

    const createCompanyDriverResp = await app.inject({
      method: 'POST',
      url: '/customer',
      headers: {
        Authorization: jwt,
      },
      payload: {
        customerOrgNumber: 'dfgd34sd',
        customerCompanyName: 'ABC INdsfC',
        companyReference: 'XYZ',
        companyPhone: '0182340032',
        companyEmail: 'admin@blueorigin.com',
        companyAddress: 'Some Road, Some Where',
        companyZipCode: '74934',
        companyAddressCity: 'LOK',
        companyCountry: 'IN',
        driverExternalNumber: '0943094',
        driverGDPRAccept: true,
        driverISWarrantyDriver: true,
        driverAcceptsMarketing: true,
        driverFirstName: 'Madrass',
        driverLastName: 'patric',
        driverEmail: 'mahan.putri@abcincasdasd.com',
        driverPhoneNumber: '4532423678',
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

    deepStrictEqual(parsedCreateCompanyDriverResp.data.company.customerOrgNumber, 'dfgd34sd')
    deepStrictEqual(parsedCreateCompanyDriverResp.data.company.customerCompanyName, 'ABC INdsfC')
    deepStrictEqual(parsedCreateCompanyDriverResp.data.company.companyEmail, 'admin@blueorigin.com')
    deepStrictEqual(parsedCreateCompanyDriverResp.data.company.companyPhone, '0182340032')
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
        driverCarRegistrationNumber: 'pnt423',
        driverCarBrand: 'Audi',
        driverCarModel: 'brum brum',
        driverCarColor: 'Grey',
        driverCarYear: 2018,
        driverCarChassiNumber: 'rrwewdfsxf23asd',
        driverCarNotes: 'first Test cars!',
      },
    })
    const parsedcreateDriverCarResp = JSON.parse(createDriverCarResp.body)
    deepStrictEqual(parsedcreateDriverCarResp.driverCarBrand, 'Audi')
    deepStrictEqual(parsedcreateDriverCarResp.driverCarModel, 'brum brum')
    deepStrictEqual(parsedcreateDriverCarResp.driverCarNotes, 'first Test cars!')

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
        submissionTime: '2022-11-29T11:21:44.000-08:00',
        pickupTime: '2022-12-03T11:22:44.000-08:00',
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
            day1: '2022-12-03T11:22:44.000-08:00',
            day1Work: '01:10:10',
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

    const availableResponse = await app.inject({
      method: 'GET',
      url: '/employees/availableEmployees',
      headers: {
        Authorization: jwt,
      },
      query: {
        storeID: parsedresponseStore.store.storeID,
        startDay: '2024-09-30',
      },
    })

    const parseAvail = JSON.parse(availableResponse.body)
    deepStrictEqual(
      {
        message: 'Total available hours',
        employeeOnDuty: {
          monday: 7.0663888888888895,
          tuesday: 7.0663888888888895,
          wednesday: 7.0663888888888895,
          thursday: 7.0663888888888895,
          friday: 7.0663888888888895,
          saturday: 7.0663888888888895,
          sunday: 8.233333333333333,
        },
      },
      parseAvail,
    )

    const specialResp = await app.inject({
      method: 'PUT',
      url: 'employees/specialHours',
      headers: {
        Authorization: jwt,
      },
      payload: {
        specialHours: [
          {
            employeeID: responseUserEmpParsed.employee.employeeID,
            storeID: parsedresponseStore.store.storeID,
            start: '2022-11-30T11:22:44.000',
            end: '2022-12-01T11:22:44.000',
            description: 'första pausen',
            absence: 'true',
          },
        ],
      },
    })

    const parsedspecialResp = JSON.parse(specialResp.body)
    deepStrictEqual(parsedspecialResp, {
      specialHours: [
        {
          employeeID: 4,
          storeID: 5,
          start: '2022-11-30T11:22:44.000Z',
          end: '2022-12-01T11:22:44.000Z',
          absence: true,
          employeeSpecialHoursID: 1,
          description: 'första pausen',
        },
      ],
    })

    const availableOrderResponse = await app.inject({
      method: 'GET',
      url: '/employees/availableEmployees',
      headers: {
        Authorization: jwt,
      },
      query: {
        storeID: parsedresponseStore.store.storeID,
        startDay: '2022-11-30',
      },
    })

    const parsedavailableOrderResponse = JSON.parse(availableOrderResponse.body)
    deepStrictEqual(parsedavailableOrderResponse, {
      message: 'Total available hours',
      employeeOnDuty: {
        monday: 7.0663888888888895,
        tuesday: 7.0663888888888895,
        wednesday: 1.1952777777777783,
        thursday: 4.704166666666667,
        friday: 7.0663888888888895,
        saturday: 5.896944444444445,
        sunday: 8.233333333333333,
      },
    })
  })
})
