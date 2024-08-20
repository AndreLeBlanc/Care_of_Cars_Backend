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
})
