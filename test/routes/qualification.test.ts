import { after, before, describe, it } from 'node:test'
import { FastifyInstance } from 'fastify'
import { StoreID } from '../../src/schema/schema.js'
import { deepStrictEqual } from 'assert'

import { buildApp } from '../../src/app.js'
import { initDrizzle } from '../../src/config/db-connect.js'

const str = [
  'undefined',
  'undef',
  'null',
  'NULL',
  '(null)',
  'nil',
  'NIL',
  'true',
  'false',
  'True',
  'False',
  'TRUE',
  'FALSE',
  'None',
  'hasOwnProperty',
  'then',
  'constructor',
  'COM1',
  'LPT1',
  'LPT2',
  'LPT3',
  'COM2',
  'COM3',
  'COM4',
  'Scunthorpe General Hospital',
  'Penistone Community Church',
  'Lightwater Country Park',
  'Jimmy Clitheroe',
  'Horniman Museum',
  'shitake mushrooms',
  'RomansInSussex.co.uk',
  'http:www.cum.qc.ca/',
  'Craig Cockburn, Software Specialist',
  'Linda Callahan',
  'Dr. Herman I. Libshitz',
  'magna cum laude',
  'Super Bowl XXX',
  'medieval erection of parapets',
  'evaluate',
  'mocha',
  'expression',
  'Arsenal canal',
  'classic',
  'Tyson Gay',
  'Dick Van Dyke',
  'basement',
]

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

  it('put, delete and get local Quals', async () => {
    for (let i = 0; i < str.length; i++) {
      const response = await app.inject({
        method: 'PUT',
        url: '/qualifications/local',
        headers: {
          Authorization: jwt,
        },
        payload: [
          {
            storeID: 1,
            localQualName: str[i],
          },
        ],
      })
      const parsedResponse = JSON.parse(response.body)

      deepStrictEqual(parsedResponse.qualifications[0].localQualName, str[i])

      const getResponse = await app.inject({
        method: 'GET',
        url: '/qualifications/localQualifications/' + parsedResponse.qualifications[0].localQualID,
        headers: {
          Authorization: jwt,
        },
      })

      const parsedGetResponse = JSON.parse(getResponse.body)
      deepStrictEqual(parsedGetResponse.qualification.localQualName, str[i])

      const putResponse = await app.inject({
        method: 'PUT',
        url: '/qualifications/local/',
        headers: {
          Authorization: jwt,
        },
        payload: [
          {
            localQualID: parsedResponse.qualifications[0].localQualID,
            storeID: 1,
            localQualName: str[i] + 'patched',
          },
        ],
      })

      const parsedPatchResponse = JSON.parse(putResponse.body)

      deepStrictEqual(parsedPatchResponse.qualifications[0].localQualName, str[i] + 'patched')

      const deleteResponse = await app.inject({
        method: 'DELETE',
        url: '/qualifications/localqualifications',
        headers: {
          Authorization: jwt,
        },
        payload: [{ localQualID: parsedResponse.qualifications[0].localQualID }],
      })

      const parsedDeleteResponse = JSON.parse(deleteResponse.body)
      deepStrictEqual(parsedDeleteResponse.qualifications[0].localQualName, str[i] + 'patched')

      const getDeletedResponse = await app.inject({
        method: 'GET',
        url: '/qualifications/localQualifications/' + parsedResponse.qualifications[0].localQualID,
        headers: {
          Authorization: jwt,
        },
      })

      deepStrictEqual(getDeletedResponse.statusCode, 404)
    }

    const responseStore = await app.inject({
      method: 'POST',
      url: '/stores',
      headers: {
        Authorization: jwt,
      },
      payload: {
        storeName: 'pizza place',
        storeOrgNumber: '66s7dd5552',
        storeFSkatt: true,
        storeStatus: true,
        storeEmail: 'pizza@place.is',
        storePhone: '0762757764',
        storeAddress: 'apple drive',
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
    for (let i = 0; i < str.length; i++) {
      const response = await app.inject({
        method: 'PUT',
        url: '/qualifications/local',
        headers: {
          Authorization: jwt,
        },
        payload: [
          {
            storeID: parsedresponseStore.store.storeID,
            localQualName: str[i],
          },
        ],
      })

      const parsedResponse = JSON.parse(response.body)
      deepStrictEqual(parsedResponse.qualifications[0].localQualName, str[i])
    }

    for (let i = 0; i < str.length; i++) {
      const response = await app.inject({
        method: 'PUT',
        url: '/qualifications/local',
        headers: {
          Authorization: jwt,
        },
        payload: [
          {
            storeID: parsedresponseStore.store.storeID,
            localQualName: str[i] + 'glergx',
          },
          {
            storeID: parsedresponseStore.store.storeID,
            localQualName: str[i] + 'dsfs2sdfds',
          },
          {
            storeID: 1,
            localQualName: str[i] + 'Jonas is King',
          },
        ],
      })

      const parsedResponse = JSON.parse(response.body)
      deepStrictEqual(parsedResponse.qualifications[0].localQualName, str[i] + 'glergx')
      deepStrictEqual(parsedResponse.qualifications[1].localQualName, str[i] + 'dsfs2sdfds')
      deepStrictEqual(parsedResponse.qualifications[2].localQualName, str[i] + 'Jonas is King')

      const responsePatch = await app.inject({
        method: 'PUT',
        url: '/qualifications/local',
        headers: {
          Authorization: jwt,
        },
        payload: [
          {
            localQualID: parsedResponse.qualifications[0].localQualID,
            storeID: parsedresponseStore.store.storeID,
            localQualName: str[i] + 'Patched',
          },
          {
            localQualID: parsedResponse.qualifications[1].localQualID,
            storeID: 1,
            localQualName: str[i] + 'Patched2',
          },
          {
            localQualID: parsedResponse.qualifications[2].localQualID,
            storeID: 1,
            localQualName: str[i] + 'JPatched',
          },
        ],
      })

      const parsedResponsePatch = JSON.parse(responsePatch.body)

      deepStrictEqual(parsedResponsePatch.qualifications[0].localQualName, str[i] + 'Patched')
      deepStrictEqual(parsedResponsePatch.qualifications[1].localQualName, str[i] + 'Patched2')
      deepStrictEqual(parsedResponsePatch.qualifications[2].localQualName, str[i] + 'JPatched')
      deepStrictEqual(
        parsedResponsePatch.qualifications[0].localQualID,
        parsedResponse.qualifications[0].localQualID,
      )
      deepStrictEqual(
        parsedResponsePatch.qualifications[1].localQualID,
        parsedResponse.qualifications[1].localQualID,
      )
      deepStrictEqual(
        parsedResponsePatch.qualifications[2].localQualID,
        parsedResponse.qualifications[2].localQualID,
      )
      deepStrictEqual(parsedResponsePatch.qualifications[1].storeID, 1)
    }
  })

  it('put, delete and get Global Quals', async () => {
    for (let i = 0; i < str.length; i++) {
      const response = await app.inject({
        method: 'PUT',
        url: '/qualifications/global',
        headers: {
          Authorization: jwt,
        },
        payload: [
          {
            globalQualName: str[i],
          },
        ],
      })
      const parsedResponse = JSON.parse(response.body)

      deepStrictEqual(parsedResponse.qualifications[0].globalQualName, str[i])

      const getResponse = await app.inject({
        method: 'GET',
        url:
          '/qualifications/globalQualifications/' + parsedResponse.qualifications[0].globalQualID,
        headers: {
          Authorization: jwt,
        },
      })

      const parsedGetResponse = JSON.parse(getResponse.body)

      deepStrictEqual(parsedGetResponse.qualification.globalQualName, str[i])

      const putResponse = await app.inject({
        method: 'PUT',
        url: '/qualifications/global/',
        headers: {
          Authorization: jwt,
        },
        payload: [
          {
            globalQualID: parsedResponse.qualifications[0].globalQualID,
            globalQualName: str[i] + 'patched',
          },
        ],
      })

      const parsedPatchResponse = JSON.parse(putResponse.body)

      deepStrictEqual(parsedPatchResponse.qualifications[0].globalQualName, str[i] + 'patched')

      const deleteResponse = await app.inject({
        method: 'DELETE',
        url: '/qualifications/globalQualifications',
        headers: {
          Authorization: jwt,
        },
        payload: [{ globalQualID: parsedResponse.qualifications[0].globalQualID }],
      })

      const parsedDeleteResponse = JSON.parse(deleteResponse.body)
      deepStrictEqual(parsedDeleteResponse.qualifications[0].globalQualName, str[i] + 'patched')

      const getDeletedResponse = await app.inject({
        method: 'GET',
        url:
          '/qualifications/globalQualifications/' + parsedResponse.qualifications[0].globalQualID,
        headers: {
          Authorization: jwt,
        },
      })

      deepStrictEqual(getDeletedResponse.statusCode, 404)
    }

    for (let i = 0; i < str.length; i++) {
      const response = await app.inject({
        method: 'PUT',
        url: '/qualifications/global',
        headers: {
          Authorization: jwt,
        },
        payload: [
          {
            globalQualName: str[i] + 'glergx',
          },
          {
            globalQualName: str[i] + 'dsfs2sdfds',
          },
          {
            globalQualName: str[i] + 'Jonas is King',
          },
        ],
      })

      const parsedResponse = JSON.parse(response.body)
      deepStrictEqual(parsedResponse.qualifications[0].globalQualName, str[i] + 'glergx')
      deepStrictEqual(parsedResponse.qualifications[1].globalQualName, str[i] + 'dsfs2sdfds')
      deepStrictEqual(parsedResponse.qualifications[2].globalQualName, str[i] + 'Jonas is King')

      const responsePatch = await app.inject({
        method: 'PUT',
        url: '/qualifications/global',
        headers: {
          Authorization: jwt,
        },
        payload: [
          {
            globalQualID: parsedResponse.qualifications[0].globalQualID,
            globalQualName: str[i] + 'Patched',
          },
          {
            globalQualID: parsedResponse.qualifications[1].globalQualID,
            globalQualName: str[i] + 'Patched2',
          },
          {
            globalQualID: parsedResponse.qualifications[2].globalQualID,
            globalQualName: str[i] + 'JPatched',
          },
        ],
      })

      const parsedResponsePatch = JSON.parse(responsePatch.body)

      deepStrictEqual(parsedResponsePatch.qualifications[0].globalQualName, str[i] + 'Patched')
      deepStrictEqual(parsedResponsePatch.qualifications[1].globalQualName, str[i] + 'Patched2')
      deepStrictEqual(parsedResponsePatch.qualifications[2].globalQualName, str[i] + 'JPatched')
      deepStrictEqual(
        parsedResponsePatch.qualifications[0].globalQualID,
        parsedResponse.qualifications[0].globalQualID,
      )
      deepStrictEqual(
        parsedResponsePatch.qualifications[1].globalQualID,
        parsedResponse.qualifications[1].globalQualID,
      )
      deepStrictEqual(
        parsedResponsePatch.qualifications[2].globalQualID,
        parsedResponse.qualifications[2].globalQualID,
      )
    }
  })

  it('Create user and employee and assign quals', async () => {
    const strings = ['vncmx,zksj', 'fredeswlsd', 'Göran Andersson']
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
        deepStrictEqual(JSON.parse(roleToPerm.body).message, 'Role to Permission created')
      }
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
    deepStrictEqual(responseStore.statusCode, 201)

    const responseUserEmp = await app.inject({
      method: 'POST',
      url: '/users/employee',
      headers: {
        Authorization: jwt,
      },
      payload: {
        user: {
          firstName: 'Mitch',
          lastName: 'Mcgonal',
          email: '23423123sed@sdfsdfs.is',
          isSuperAdmin: 'false',
          password: 'fdfsdfsdfdsfdsfsdewf2332werwfew',
          roleID: roles[0],
        },
        employee: {
          shortUserName: ',,dd',
          employmentNumber: 'lkdsfjwesd9',
          employeePersonalNumber: '4442346456',
          signature: 'noir',
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

    deepStrictEqual(responseUserEmpParsed.user.firstName, 'Mitch')

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

    deepStrictEqual(responseUserEmpLoginParsed.lastName, 'Mcgonal')
    deepStrictEqual(responseUserEmpLoginParsed.role.roleHasPermission[0].permissionID, perms[0])
    deepStrictEqual(responseUserEmpLoginParsed.role.role.roleID, roles[0])
    deepStrictEqual(responseUserEmpLoginParsed.stores[0].storeID, parsedresponseStore.store.storeID)

    const responseUserEmp2 = await app.inject({
      method: 'POST',
      url: '/users/employee',
      headers: {
        Authorization: jwt,
      },
      payload: {
        user: {
          firstName: 'qas',
          lastName: 'heisenberg',
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

    deepStrictEqual(responseUserEmp2Parsed.user.firstName, 'qas')
    const localQuals: {
      localQualID: number
      localQualName: string
      storeID: number
    }[] = []
    for (let i = 0; i < str.length; i++) {
      const response = await app.inject({
        method: 'PUT',
        url: '/qualifications/local',
        headers: {
          Authorization: jwt,
        },
        payload: [
          {
            storeID: 1,
            localQualName: str[i],
          },
        ],
      })
      const parsedResponse = JSON.parse(response.body)
      localQuals.push({
        localQualID: parsedResponse.qualifications[0].localQualID,
        localQualName: parsedResponse.qualifications[0].localQualName,
        storeID: StoreID(1),
      })

      deepStrictEqual(parsedResponse.qualifications[0].localQualName, str[i])

      const responseEmpQual = await app.inject({
        method: 'POST',
        url: '/qualifications/local-qual',
        headers: {
          Authorization: jwt,
        },
        payload: [
          {
            employeeID: responseUserEmpParsed.employee.employeeID,
            localQualID: parsedResponse.qualifications[0].localQualID,
          },
        ],
      })
      const responseEmpQualParsed = JSON.parse(responseEmpQual.body)

      deepStrictEqual(
        responseEmpQualParsed.qualification[0].employeeID,
        responseUserEmpParsed.employee.employeeID,
      )

      const responseGetEmpQual = await app.inject({
        method: 'GET',
        url: '/qualifications/employee/' + responseUserEmpParsed.employee.employeeID,
        headers: {
          Authorization: jwt,
        },
      })
      const responseGetEmpQualarsed = JSON.parse(responseGetEmpQual.body)
      deepStrictEqual(responseGetEmpQualarsed.localQuals.sort(), localQuals.sort())
    }
    const localQualsBack = structuredClone(localQuals)
    while (localQuals.length > 0) {
      const q = localQuals.pop()

      const responseEmpQual = await app.inject({
        method: 'DELETE',
        url: '/qualifications/local-qual',
        headers: {
          Authorization: jwt,
        },
        payload: [
          {
            employeeID: responseUserEmpParsed.employee.employeeID,
            localQualID: q?.localQualID,
          },
        ],
      })
      const responseEmpQualparsed = JSON.parse(responseEmpQual.body)
      deepStrictEqual(responseEmpQualparsed.qualification[0].localQualID, q?.localQualID)

      const responseGetEmpQual = await app.inject({
        method: 'GET',
        url: '/qualifications/employee/' + responseUserEmpParsed.employee.employeeID,
        headers: {
          Authorization: jwt,
        },
      })
      const responseGetEmpQualarsed = JSON.parse(responseGetEmpQual.body)
      deepStrictEqual(responseGetEmpQualarsed.localQuals.sort(), localQuals.sort())
    }

    const globalQuals: {
      globalQualID: number
      employeeID: number
    }[] = []
    for (let i = 0; i < str.length; i++) {
      const response = await app.inject({
        method: 'PUT',
        url: '/qualifications/global',
        headers: {
          Authorization: jwt,
        },
        payload: [
          {
            globalQualName: str[i],
          },
        ],
      })
      const parsedResponse = JSON.parse(response.body)
      globalQuals.push({
        globalQualID: parsedResponse.qualifications[0].globalQualID,
        employeeID: parsedResponse.qualifications[0].employeeID,
      })

      deepStrictEqual(parsedResponse.qualifications[0].globalQualName, str[i])

      const responseEmpQual = await app.inject({
        method: 'POST',
        url: '/qualifications/global-qual',
        headers: {
          Authorization: jwt,
        },
        payload: [
          {
            employeeID: responseUserEmpParsed.employee.employeeID,
            globalQualID: parsedResponse.qualifications[0].globalQualID,
          },
        ],
      })
      const responseEmpQualParsed = JSON.parse(responseEmpQual.body)

      deepStrictEqual(
        responseEmpQualParsed.qualification[0].employeeID,
        responseUserEmpParsed.employee.employeeID,
      )

      const responseGetEmpQual = await app.inject({
        method: 'GET',
        url: '/qualifications/employee/' + responseUserEmpParsed.employee.employeeID,
        headers: {
          Authorization: jwt,
        },
      })
      const responseGetEmpQualarsed = JSON.parse(responseGetEmpQual.body)
      const res = responseGetEmpQualarsed.globalQuals
        .sort()
        .map((x: { globalQualID?: number | undefined; globalQualName: string }) => x.globalQualID)
      const exp = globalQuals.sort().map((x) => x.globalQualID)
      deepStrictEqual(res, exp)
    }

    const globalQualsBack = structuredClone(globalQuals)
    while (globalQuals.length > 0) {
      const q = globalQuals.pop()

      const responseEmpQual = await app.inject({
        method: 'DELETE',
        url: '/qualifications/global-qual',
        headers: {
          Authorization: jwt,
        },
        payload: [
          {
            employeeID: responseUserEmpParsed.employee.employeeID,
            globalQualID: q?.globalQualID,
          },
        ],
      })
      const responseEmpQualparsed = JSON.parse(responseEmpQual.body)
      deepStrictEqual(responseEmpQualparsed.qualification[0].globalQualID, q?.globalQualID)

      const responseGetEmpQual = await app.inject({
        method: 'GET',
        url: '/qualifications/employee/' + responseUserEmpParsed.employee.employeeID,
        headers: {
          Authorization: jwt,
        },
      })
      const responseGetEmpQualarsed = JSON.parse(responseGetEmpQual.body)
      const res = responseGetEmpQualarsed.globalQuals
        .sort()
        .map((x: { globalQualID?: number | undefined; globalQualName: string }) => x.globalQualID)
      const exp = globalQuals.sort().map((x) => x.globalQualID)
      deepStrictEqual(res, exp)
    }

    const responseEmpQual = await app.inject({
      method: 'POST',
      url: '/qualifications/global-qual',
      headers: {
        Authorization: jwt,
      },
      payload: [
        {
          employeeID: responseUserEmpParsed.employee.employeeID,
          globalQualID: globalQualsBack[0].globalQualID,
        },
        {
          employeeID: responseUserEmpParsed.employee.employeeID,
          globalQualID: globalQualsBack[1].globalQualID,
        },
        {
          employeeID: responseUserEmpParsed.employee.employeeID,
          globalQualID: globalQualsBack[2].globalQualID,
        },
        {
          employeeID: responseUserEmpParsed.employee.employeeID,
          globalQualID: globalQualsBack[3].globalQualID,
        },
        {
          employeeID: responseUserEmpParsed.employee.employeeID,
          globalQualID: globalQualsBack[4].globalQualID,
        },
      ],
    })
    const responseEmpQualParsed = JSON.parse(responseEmpQual.body)

    deepStrictEqual(
      responseEmpQualParsed.qualification[0].globalQualID,
      globalQualsBack[0].globalQualID,
    )
    deepStrictEqual(
      responseEmpQualParsed.qualification[1].globalQualID,
      globalQualsBack[1].globalQualID,
    )
    deepStrictEqual(
      responseEmpQualParsed.qualification[2].globalQualID,
      globalQualsBack[2].globalQualID,
    )
    deepStrictEqual(
      responseEmpQualParsed.qualification[3].globalQualID,
      globalQualsBack[3].globalQualID,
    )
    deepStrictEqual(
      responseEmpQualParsed.qualification[4].globalQualID,
      globalQualsBack[4].globalQualID,
    )

    const responseEmpQualDel = await app.inject({
      method: 'DELETE',
      url: '/qualifications/global-qual',
      headers: {
        Authorization: jwt,
      },
      payload: [
        {
          employeeID: responseUserEmpParsed.employee.employeeID,
          globalQualID: globalQualsBack[0].globalQualID,
        },
        {
          employeeID: responseUserEmpParsed.employee.employeeID,
          globalQualID: globalQualsBack[1].globalQualID,
        },
        {
          employeeID: responseUserEmpParsed.employee.employeeID,
          globalQualID: globalQualsBack[2].globalQualID,
        },
        {
          employeeID: responseUserEmpParsed.employee.employeeID,
          globalQualID: globalQualsBack[3].globalQualID,
        },
        {
          employeeID: responseUserEmpParsed.employee.employeeID,
          globalQualID: globalQualsBack[4].globalQualID,
        },
      ],
    })
    const responseEmpQualDelParsed = JSON.parse(responseEmpQualDel.body)

    deepStrictEqual(
      responseEmpQualDelParsed.qualification[0].globalQualID,
      globalQualsBack[0].globalQualID,
    )
    deepStrictEqual(
      responseEmpQualDelParsed.qualification[1].globalQualID,
      globalQualsBack[1].globalQualID,
    )
    deepStrictEqual(
      responseEmpQualDelParsed.qualification[2].globalQualID,
      globalQualsBack[2].globalQualID,
    )
    deepStrictEqual(
      responseEmpQualDelParsed.qualification[3].globalQualID,
      globalQualsBack[3].globalQualID,
    )
    deepStrictEqual(
      responseEmpQualDelParsed.qualification[4].globalQualID,
      globalQualsBack[4].globalQualID,
    )

    const responseEmpQualLocal = await app.inject({
      method: 'POST',
      url: '/qualifications/local-qual',
      headers: {
        Authorization: jwt,
      },
      payload: [
        {
          employeeID: responseUserEmpParsed.employee.employeeID,
          localQualID: localQualsBack[0].localQualID,
        },
        {
          employeeID: responseUserEmpParsed.employee.employeeID,
          localQualID: localQualsBack[1].localQualID,
        },
        {
          employeeID: responseUserEmpParsed.employee.employeeID,
          localQualID: localQualsBack[2].localQualID,
        },
        {
          employeeID: responseUserEmpParsed.employee.employeeID,
          localQualID: localQualsBack[3].localQualID,
        },
      ],
    })
    const responseEmpQualLocalParsed = JSON.parse(responseEmpQualLocal.body)

    deepStrictEqual(
      responseEmpQualLocalParsed.qualification[0].localQualID,
      localQualsBack[0].localQualID,
    )
    deepStrictEqual(
      responseEmpQualLocalParsed.qualification[1].localQualID,
      localQualsBack[1].localQualID,
    )
    deepStrictEqual(
      responseEmpQualLocalParsed.qualification[2].localQualID,
      localQualsBack[2].localQualID,
    )
    deepStrictEqual(
      responseEmpQualLocalParsed.qualification[3].localQualID,
      localQualsBack[3].localQualID,
    )

    const responseEmpQualLocalDel = await app.inject({
      method: 'DELETE',
      url: '/qualifications/local-qual',
      headers: {
        Authorization: jwt,
      },
      payload: [
        {
          employeeID: responseUserEmpParsed.employee.employeeID,
          localQualID: localQualsBack[0].localQualID,
        },
        {
          employeeID: responseUserEmpParsed.employee.employeeID,
          localQualID: localQualsBack[1].localQualID,
        },
        {
          employeeID: responseUserEmpParsed.employee.employeeID,
          localQualID: localQualsBack[2].localQualID,
        },
        {
          employeeID: responseUserEmpParsed.employee.employeeID,
          localQualID: localQualsBack[3].localQualID,
        },
      ],
    })
    const responseEmpQualLocalDelParsed = JSON.parse(responseEmpQualLocalDel.body)

    deepStrictEqual(
      responseEmpQualLocalDelParsed.qualification[0].localQualID,
      localQualsBack[0].localQualID,
    )
    deepStrictEqual(
      responseEmpQualLocalDelParsed.qualification[1].localQualID,
      localQualsBack[1].localQualID,
    )
    deepStrictEqual(
      responseEmpQualLocalDelParsed.qualification[2].localQualID,
      localQualsBack[2].localQualID,
    )
    deepStrictEqual(
      responseEmpQualLocalDelParsed.qualification[3].localQualID,
      localQualsBack[3].localQualID,
    )
  })
})
