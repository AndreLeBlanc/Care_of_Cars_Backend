import { FastifyInstance } from 'fastify'

import * as crypto from 'node:crypto'

import { after, before, describe, it } from 'node:test'
import assert from 'assert'
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
      app = await buildApp({ logger: false })
      const response = await app.inject({
        method: 'PUT',
        url: '/qualifications/local',
        payload: {
          storeID: 1,
          localQualName: str[i],
        },
      })
      const parsedResponse = JSON.parse(response.body)
      console.log(parsedResponse)
      assert.deepStrictEqual(parsedResponse[0].localQualName, str[i])
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
    for (let i = 0; i < str.length; i++) {
      app = await buildApp({ logger: false })
      const response = await app.inject({
        method: 'PUT',
        url: '/qualifications/local',
        payload: {
          storeID: parsedresponseStore[0].storeID,
          localQualName: str[i],
        },
      })

      const parsedResponse = JSON.parse(response.body)
      console.log(parsedResponse)
      assert.deepStrictEqual(parsedResponse[0].localQualName, str[i])
    }

    for (let i = 0; i < str.length; i++) {
      app = await buildApp({ logger: false })
      const response = await app.inject({
        method: 'PUT',
        url: '/qualifications/local',
        payload: [
          {
            storeID: parsedresponseStore[0].storeID,
            localQualName: str[i] + str[i],
          },
          {
            storeID: parsedresponseStore[0].storeID,
            localQualName: str[i] + str[i] + 'sdfds',
          },
          {
            storeID: 1,
            localQualName: str[i] + str[i] + 'sdfds',
          },
        ],
      })

      const parsedResponse = JSON.parse(response.body)
      console.log(parsedResponse)
      assert.deepStrictEqual(parsedResponse[0].localQualName, str[i])
    }
  })
})
