//import { WorkDuration, WorkTime } from '../../src/schema/schema.js'
import { after, before, describe, it } from 'node:test'
import { FastifyInstance } from 'fastify'
import { buildApp } from '../../src/app.js'
//import { firstDayOfWeek } from '../../src/services/employeeService.js'
import { initDrizzle } from '../../src/config/db-connect.js'
//import { timeStringToMS } from '../../src/utils/helper.js'

import assert from 'assert'

// describe('interValToMiliseconds Test', () => {
//   it('convert time to ms', async () => {
//     const milis0 = timeStringToMS('00:00:00')
//     assert.deepStrictEqual(milis0, 0)
//
//     const milis10 = timeStringToMS('10:00:00')
//     assert.deepStrictEqual(milis10, 36000000)
//
//     const milis12 = timeStringToMS('12:59:59')
//     assert.deepStrictEqual(milis12, 46799000)
//
//     const milisMid = timeStringToMS('23:59:59')
//     assert.deepStrictEqual(milisMid, 86399000)
//   })
// })
//
// describe('first  Day of the week Test', () => {
//   it('Cut off a worktime at the start of a week', async () => {
//     const startDay = WorkTime(new Date('2024-07-15'))
//     const start = WorkTime(new Date('2024-07-15'))
//     assert.deepStrictEqual(WorkDuration(1721045410), WorkDuration(1721045410)) //firstDayOfWeek(start, startDay), WorkDuration(1721045410))
//     assert.deepStrictEqual(firstDayOfWeek(start, startDay), WorkDuration(1720994400))
//   })
// })

let jwt = ''
describe('qualifications tests', async () => {
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
    const strings = ['balsdf', 'zzzzzzzzzzzz', 'dsfsdfsewrwrfsdfr']
    const perms: number[] = []
    const roles: number[] = []
    for (const [i, name] of strings.entries()) {
      assert.deepStrictEqual(name, strings[i])
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
        storeOrgNumber: '66s6dq5552',
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
          roleID: roles[0],
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

    assert.deepStrictEqual(checkInFirstParsed.employeeID, responseUserEmpParsed.employee.employeeID)

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
    assert.deepStrictEqual(
      checkoutFirstParsed.employeeID,
      responseUserEmpParsed.employee.employeeID,
    )
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
    console.log(checkoutAgainParsed)
    assert.deepStrictEqual(checkoutAgainParsed.message, 'Already checked out')

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

    assert.deepStrictEqual(checkInAgainParsed.employeeID, responseUserEmpParsed.employee.employeeID)
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

    assert.deepStrictEqual(checkInThriceParsed.message, 'Already checked in')
  })

  it('Create user and employee and checkin/out', async () => {
    const strings = ['null', 'fsdggdfwer', 'qiwej']
    const perms: number[] = []
    const roles: number[] = []
    for (const [i, name] of strings.entries()) {
      assert.deepStrictEqual(name, strings[i])
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
    assert.deepStrictEqual(responseStore.statusCode, 201)

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
    assert.deepStrictEqual(responseStore2.statusCode, 201)

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
    assert.deepStrictEqual(userResponse.statusCode, 201)
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
    assert.deepStrictEqual(userResponse2.statusCode, 201)
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
    assert.deepStrictEqual(employeeResponse.statusCode, 201)
    assert.deepStrictEqual(parsedemployeeResponse.userID, parseduserResponse.userID)
    assert.deepStrictEqual(parsedemployeeResponse.employmentNumber, 'asd232asd')
    assert.deepStrictEqual(parsedemployeeResponse.employeeActive, true)
    assert.deepStrictEqual(parsedemployeeResponse.storeIDs, [
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
    assert.deepStrictEqual(employeeResponse2.statusCode, 201)
    assert.deepStrictEqual(parsedemployeeResponse2.userID, parseduserResponse2.userID)
    assert.deepStrictEqual(parsedemployeeResponse2.employmentNumber, 'asd232addsd')
    assert.deepStrictEqual(parsedemployeeResponse2.employeeActive, true)
    assert.deepStrictEqual(parsedemployeeResponse2.storeIDs, [
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

    assert.deepStrictEqual(employeeGetResponse.statusCode, 200)
    assert.deepStrictEqual(parsedemployeeGetResponse.userID, parseduserResponse.userID)
    assert.deepStrictEqual(parsedemployeeGetResponse.employmentNumber, 'asd232asd')
    assert.deepStrictEqual(parsedemployeeGetResponse.employeeActive, true)
    assert.deepStrictEqual(parsedemployeeGetResponse.storeIDs, [
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

    assert.deepStrictEqual(employeeGetResponse2.statusCode, 200)
    assert.deepStrictEqual(parsedemployeeGetResponse2.userID, parseduserResponse2.userID)
    assert.deepStrictEqual(parsedemployeeGetResponse2.employmentNumber, 'asd232addsd')
    assert.deepStrictEqual(parsedemployeeGetResponse2.employeeActive, true)
    assert.deepStrictEqual(parsedemployeeGetResponse2.storeIDs, [
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

    assert.deepStrictEqual(employeePatchResponse.statusCode, 201)
    assert.deepStrictEqual(parsedemployeePatchResponse.userID, parseduserResponse2.userID)
    assert.deepStrictEqual(parsedemployeePatchResponse.employmentNumber, 'asd23vdv2addsd')
    assert.deepStrictEqual(parsedemployeePatchResponse.employeeActive, true)
    assert.deepStrictEqual(
      parsedemployeePatchResponse.employeeComment,
      'a comment about me agains patched',
    )
    assert.deepStrictEqual(parsedemployeePatchResponse.storeIDs, [
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
    assert.deepStrictEqual(employeePatchResponse2.statusCode, 201)
    assert.deepStrictEqual(parsedemployeePatchResponse2.userID, parseduserResponse.userID)
    assert.deepStrictEqual(parsedemployeePatchResponse2.employmentNumber, 'asd232addsd')
    assert.deepStrictEqual(parsedemployeePatchResponse2.employeeActive, true)
    assert.deepStrictEqual(parsedemployeePatchResponse2.storeIDs, [
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

    assert.deepStrictEqual(employeeDELETEResponse.statusCode, 200)
    assert.deepStrictEqual(parsedemployeeDELETEResponse.userID, parseduserResponse.userID)
    assert.deepStrictEqual(parsedemployeeDELETEResponse.employmentNumber, 'asd232addsd')
    assert.deepStrictEqual(parsedemployeeDELETEResponse.employeeActive, true)
    assert.deepStrictEqual(parsedemployeeDELETEResponse.storeIDs, [
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

    assert.deepStrictEqual(employeeDELETEResponse2.statusCode, 200)
    assert.deepStrictEqual(parsedemployeeDELETEResponse2.userID, parseduserResponse2.userID)
    assert.deepStrictEqual(parsedemployeeDELETEResponse2.employmentNumber, 'asd23vdv2addsd')
    assert.deepStrictEqual(parsedemployeeDELETEResponse2.employeeActive, true)
    assert.deepStrictEqual(parsedemployeeDELETEResponse2.storeIDs, [
      {
        storeID: parsedresponseStore2.store.storeID,
        storeName: parsedresponseStore2.store.storeName,
      },
    ])
  })
})
