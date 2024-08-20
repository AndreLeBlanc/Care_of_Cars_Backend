import { FastifyInstance } from 'fastify'
import fc from 'fast-check'

import { after, before, describe, it } from 'node:test'
import assert from 'assert'
import { buildApp } from '../../src/app.js'
import { initDrizzle } from '../../src/config/db-connect.js'

let jwt = ''
let newRole = 1
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

    const roleResp = await app.inject({
      method: 'POST',
      url: '/roles',
      headers: {
        Authorization: jwt,
      },
      payload: {
        roleName: 'Next role',
        description: 'My role desc',
      },
    })
    newRole = JSON.parse(roleResp.body).data.roleID
  })

  after(async () => {
    await app.close()
  })

  it('POST /users/login returns status 200', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users/login',
      payload: {
        email: 'superadmin@test.com',
        password: 'admin123',
      },
    })

    const parsedResponse = JSON.parse(response.body)
    assert.equal(parsedResponse.message, 'Login success')
    assert.deepStrictEqual(parsedResponse.user.id, 1)
    assert.deepStrictEqual(parsedResponse.user.firstName, 'SuperAdmin')
    assert.deepStrictEqual(parsedResponse.user.lastName, 'SuperAdmin')
    assert.deepStrictEqual(parsedResponse.user.isSuperAdmin, true)
    assert.deepStrictEqual(parsedResponse.user.email, 'superadmin@test.com')
    assert.strictEqual(response.statusCode, 200)
  })

  it('POST /users/login returns incorrect email 403 incorrect email and password', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users/login',
      payload: {
        email: 'user@example.com',
        password: 'string',
      },
    })

    const res = {
      message: 'Login failed, incorrect email or password',
    }

    const parsedResponse = JSON.parse(response.body)
    assert.deepStrictEqual(parsedResponse.message, res.message)
    assert.strictEqual(response.statusCode, 403)
  })

  it('POST /users/login returns incorrect email 403 incorrect password', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users/login',
      payload: {
        email: 'superadmin@test.com',
        password: 'string',
      },
    })

    const res = {
      message: 'Login failed, incorrect email or password',
    }

    const parsedResponse = JSON.parse(response.body)
    assert.deepStrictEqual(parsedResponse.message, res.message)
    assert.strictEqual(response.statusCode, 403)
  })

  it('Get /users/:id returns user not found', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/users/312311212',
      headers: {
        Authorization: jwt,
      },
    })

    const res = {
      message: 'user not found',
    }

    const parsedResponse = JSON.parse(response.body)
    assert.deepStrictEqual(parsedResponse.message, res.message)
    assert.deepStrictEqual(response.statusCode, 404)
  })

  it('Get /users/:id returns user', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/users/1',
      headers: {
        Authorization: jwt,
      },
    })
    const parsedResponse = JSON.parse(response.body)

    assert.deepStrictEqual(parsedResponse.userID, 1)
    assert.deepStrictEqual(parsedResponse.firstName, 'SuperAdmin')
    assert.deepStrictEqual(parsedResponse.lastName, 'SuperAdmin')
    assert.deepStrictEqual(parsedResponse.email, 'superadmin@test.com')
    assert.deepStrictEqual(response.statusCode, 200)
  })

  it('POST USER/ fast-check', async () => {
    const userIDs: number[] = []
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 3, maxLength: 128 }).noShrink(),
        fc.string({ minLength: 3, maxLength: 128 }).noShrink(),
        fc.emailAddress().noShrink(),
        async (firstName, lastName, email) => {
          const response = await app.inject({
            method: 'POST',
            url: '/users',
            headers: {
              Authorization: jwt,
            },
            payload: {
              firstName: firstName,
              lastName: lastName,
              email: email,
              isSuperAdmin: 'false',
              password: 'fdfsdfsdfdsfdsfsdewf2332werwfew',
              roleID: 1,
            },
          })

          const parsedResponse = JSON.parse(response.body)

          assert.deepStrictEqual(parsedResponse.firstName, firstName)
          assert.deepStrictEqual(parsedResponse.lastName, lastName)
          assert.deepStrictEqual(parsedResponse.email, email)
          assert.strictEqual(response.statusCode, 201)
          userIDs.push(parsedResponse.userID)

          const getResponse = await app.inject({
            method: 'GET',
            url: '/users/' + parsedResponse.userID,
            headers: {
              Authorization: jwt,
            },
          })

          const parsedGetResponse = JSON.parse(getResponse.body)

          assert.deepStrictEqual(parsedGetResponse.userID, parsedResponse.userID)
          assert.deepStrictEqual(parsedGetResponse.firstName, firstName)
          assert.deepStrictEqual(parsedGetResponse.lastName, lastName)
          assert.deepStrictEqual(parsedGetResponse.email, email)
          assert.deepStrictEqual(getResponse.statusCode, 200)

          const loginResponse = await app.inject({
            method: 'POST',
            url: '/users/login',
            payload: {
              email: email,
              password: 'fdfsdfsdfdsfdsfsdewf2332werwfew',
            },
          })
          const parsedLoginResponse = JSON.parse(loginResponse.body)

          assert.deepStrictEqual(parsedLoginResponse.message, 'Login success')
          assert.deepStrictEqual(parsedLoginResponse.user.firstName, firstName)
          assert.deepStrictEqual(parsedLoginResponse.user.lastName, lastName)
          assert.deepStrictEqual(loginResponse.statusCode, 200)
        },
      ),
    )

    for (const userID of userIDs) {
      const patchResponse = await app.inject({
        method: 'PATCH',
        url: '/users/' + userID,
        headers: {
          Authorization: jwt,
        },
        payload: {
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'email@' + userID + '.com',
          roleID: newRole,
        },
      })

      const parsedPatched = JSON.parse(patchResponse.body)
      assert.deepStrictEqual(parsedPatched.roleID, newRole)

      const deletedResponse = await app.inject({
        method: 'DELETE',
        url: '/users/' + userID,
        headers: {
          Authorization: jwt,
        },
      })

      const parsedDeleteResponse = JSON.parse(deletedResponse.body)
      assert.deepStrictEqual(parsedDeleteResponse.message, 'user deleted')
      assert.deepStrictEqual(deletedResponse.statusCode, 200)

      const getDeletedResponse = await app.inject({
        method: 'GET',
        url: '/users/' + userID,
        headers: {
          Authorization: jwt,
        },
      })

      const parsedGetResponse = JSON.parse(getDeletedResponse.body)
      assert.deepStrictEqual(parsedGetResponse.message, 'user not found')
      assert.deepStrictEqual(getDeletedResponse.statusCode, 404)
    }

    // Test patching, deleting and getting users that don't exist.
    for (let i = 1000; i < 1100; i++) {
      const patchResponse = await app.inject({
        method: 'PATCH',
        url: '/users/' + i,
        headers: {
          Authorization: jwt,
        },
        payload: {
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'email@' + 'userID' + '.com',
          roleID: newRole,
        },
      })

      assert.deepStrictEqual(patchResponse.statusCode, 404)

      const deletedResponse = await app.inject({
        method: 'DELETE',
        url: '/users/' + i,
        headers: {
          Authorization: jwt,
        },
      })

      assert.deepStrictEqual(deletedResponse.statusCode, 404)

      const getDeletedResponse = await app.inject({
        method: 'GET',
        url: '/users/' + i,
        headers: {
          Authorization: jwt,
        },
      })

      const parsedGetResponse = JSON.parse(getDeletedResponse.body)
      assert.deepStrictEqual(parsedGetResponse.message, 'user not found')
      assert.deepStrictEqual(getDeletedResponse.statusCode, 404)
    }
  })

  it('Create user and employee in one', async () => {
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

      for (const perm of perms) {
        const roleToPerm = await app.inject({
          method: 'POST',
          url: '/roleToPermissions',
          headers: {
            Authorization: jwt,
          },
          payload: {
            permissionID: perm,
            roleID: parsedresponseRoles.data.roleID,
          },
        })
        console.log('JSON.parse(roleToPerm.body)')
        console.log(JSON.parse(roleToPerm.body))
        console.log('JSON.parse(roleToPerm.body)')
        console.log('JSON.parse(roleToPerm.body)')
      }
    }

    const responseStore = await app.inject({
      method: 'POST',
      url: '/stores',
      headers: {
        Authorization: jwt,
      },
      payload: {
        storeName: 'the store',
        storeOrgNumber: '66s6dd5552',
        storeFSkatt: true,
        storeStatus: true,
        storeEmail: 'mystore@store.is',
        storePhone: '0762757764',
        storeAddress: 'a street',
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

    const responseUserEmpLogin = await app.inject({
      method: 'POST',
      url: '/users/employee/login',
      headers: {
        Authorization: jwt,
      },
      payload: {
        email: '23423123sed@sdfsdfs.is',
        password: 'fdfsdfsdfdsfdsfsdewf2332werwfew',
      },
    })

    const responseUserEmpLoginParsed = JSON.parse(responseUserEmpLogin.body)

    assert.deepStrictEqual(responseUserEmpLoginParsed.lastName, 'lastNamesdfs')
    assert.deepStrictEqual(
      responseUserEmpLoginParsed.role.roleHasPermission[0].permissionID,
      perms[0],
    )
    assert.deepStrictEqual(responseUserEmpLoginParsed.role.role.roleID, roles[0])
    assert.deepStrictEqual(
      responseUserEmpLoginParsed.stores[0].storeID,
      parsedresponseStore.store.storeID,
    )

    const responseUserEmp2 = await app.inject({
      method: 'POST',
      url: '/users/employee',
      headers: {
        Authorization: jwt,
      },
      payload: {
        user: {
          firstName: 'qas',
          lastName: 'lastsadNamesdfs',
          email: '23423123sed@s.is',
          isSuperAdmin: 'false',
          password: 'fdfsdfsdfdsfdsfsdewf2332werwfew',
          roleID: roles[1],
        },
        employee: {
          shortUserName: ',,dd',
          employmentNumber: '1337',
          employeePersonalNumber: '2342341995',
          signature: 'por',
          employeePin: 'ddfe',
          employeeActive: true,
          employeeComment: 'a comment for this user',
          storeID: [1, parsedresponseStore.store.storeID],
          employeeHourlyRateCurrency: 'DKK',
          employeeHourlyRate: 100,
        },
      },
    })

    const responseUserEmp2Parsed = JSON.parse(responseUserEmp2.body)

    assert.deepStrictEqual(responseUserEmp2Parsed.user.firstName, 'qas')

    const responseUserEmp2Login = await app.inject({
      method: 'POST',
      url: '/users/employee/login',
      headers: {
        Authorization: jwt,
      },
      payload: {
        email: '23423123sed@s.is',
        password: 'fdfsdfsdfdsfdsfsdewf2332werwfew',
      },
    })

    const responseUserEmp2LoginParsed = JSON.parse(responseUserEmp2Login.body)

    console.log('responseUserEmp2LoginParsed')
    console.log('responseUserEmp2LoginParsed')
    console.log(responseUserEmp2LoginParsed)
    console.log(responseUserEmp2LoginParsed.role)
    console.log('responseUserEmp2LoginParsed')
    console.log('responseUserEmp2LoginParsed')

    assert.deepStrictEqual(responseUserEmp2LoginParsed.lastName, 'lastsadNamesdfs')
    assert.deepStrictEqual(
      responseUserEmp2LoginParsed.role.roleHasPermission[0].permissionID,
      perms[0],
    )
    assert.deepStrictEqual(
      responseUserEmp2LoginParsed.role.roleHasPermission[1].permissionID,
      perms[1],
    )
    assert.deepStrictEqual(responseUserEmp2LoginParsed.role.role.roleID, roles[1])
    assert.deepStrictEqual(
      [
        responseUserEmp2LoginParsed.stores[0].storeID,
        responseUserEmp2LoginParsed.stores[1].storeID,
      ].sort(),
      [1, parsedresponseStore.store.storeID],
    )

    const responseUserEmp3 = await app.inject({
      method: 'POST',
      url: '/users/employee',
      headers: {
        Authorization: jwt,
      },
      payload: {
        user: {
          firstName: 'qas',
          lastName: 'lastsadNamesdfs',
          email: '23423123seaaad@s.is',
          isSuperAdmin: 'false',
          password: 'fdfsdfsdfdsfdsfsdewf2332werwfew',
          roleID: roles[2],
        },
        employee: {
          shortUserName: ',,jd',
          employmentNumber: '1477',
          employeePersonalNumber: '2342341925',
          signature: 'porh',
          employeePin: 'dffe',
          employeeActive: true,
          employeeComment: 'a comment for this user',
          storeID: [1, parsedresponseStore.store.storeID],
          employeeHourlyRateCurrency: 'SEK',
          employeeHourlyRate: 100,
        },
      },
    })

    const responseUserEmp3Parsed = JSON.parse(responseUserEmp3.body)

    assert.deepStrictEqual(responseUserEmp3Parsed.user.firstName, 'qas')

    const responseUserEmp3Login = await app.inject({
      method: 'POST',
      url: '/users/employee/login',
      headers: {
        Authorization: jwt,
      },
      payload: {
        email: '23423123seaaad@s.is',
        password: 'fdfsdfsdfdsfdsfsdewf2332werwfew',
      },
    })

    const responseUserEmp3LoginParsed = JSON.parse(responseUserEmp3Login.body)

    assert.deepStrictEqual(responseUserEmp3LoginParsed.lastName, 'lastsadNamesdfs')
    assert.deepStrictEqual(
      responseUserEmp3LoginParsed.role.roleHasPermission[0].permissionID,
      perms[0],
    )
    assert.deepStrictEqual(
      responseUserEmp3LoginParsed.role.roleHasPermission[1].permissionID,
      perms[1],
    )
    assert.deepStrictEqual(
      responseUserEmp3LoginParsed.role.roleHasPermission[2].permissionID,
      perms[2],
    )
    assert.deepStrictEqual(responseUserEmp3LoginParsed.role.role.roleID, roles[2])
    assert.deepStrictEqual(
      [
        responseUserEmp3LoginParsed.stores[0].storeID,
        responseUserEmp3LoginParsed.stores[1].storeID,
      ].sort(),
      [1, parsedresponseStore.store.storeID],
    )
  })
})
