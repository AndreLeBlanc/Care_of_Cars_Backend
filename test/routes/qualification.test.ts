import { FastifyInstance } from 'fastify'

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

      assert.deepStrictEqual(parsedResponse.qualifications[0].localQualName, str[i])

      const getResponse = await app.inject({
        method: 'GET',
        url: '/qualifications/localQualifications/' + parsedResponse.qualifications[0].localQualID,
        headers: {
          Authorization: jwt,
        },
      })

      const parsedGetResponse = JSON.parse(getResponse.body)
      assert.deepStrictEqual(parsedGetResponse.qualification.localQualName, str[i])

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

      assert.deepStrictEqual(
        parsedPatchResponse.qualifications[0].localQualName,
        str[i] + 'patched',
      )

      const deleteResponse = await app.inject({
        method: 'DELETE',
        url: '/qualifications/localqualifications',
        headers: {
          Authorization: jwt,
        },
        payload: [{ localQualID: parsedResponse.qualifications[0].localQualID }],
      })

      const parsedDeleteResponse = JSON.parse(deleteResponse.body)
      assert.deepStrictEqual(
        parsedDeleteResponse.qualifications[0].localQualName,
        str[i] + 'patched',
      )

      const getDeletedResponse = await app.inject({
        method: 'GET',
        url: '/qualifications/localQualifications/' + parsedResponse.qualifications[0].localQualID,
        headers: {
          Authorization: jwt,
        },
      })

      assert.deepStrictEqual(getDeletedResponse.statusCode, 404)
    }

    const responseStore = await app.inject({
      method: 'POST',
      url: '/stores',
      headers: {
        Authorization: jwt,
      },
      payload: {
        storeName: 'the store',
        storeOrgNumber: '66s7dd5552',
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
      assert.deepStrictEqual(parsedResponse.qualifications[0].localQualName, str[i])
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
      assert.deepStrictEqual(parsedResponse.qualifications[0].localQualName, str[i] + 'glergx')
      assert.deepStrictEqual(parsedResponse.qualifications[1].localQualName, str[i] + 'dsfs2sdfds')
      assert.deepStrictEqual(
        parsedResponse.qualifications[2].localQualName,
        str[i] + 'Jonas is King',
      )

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

      assert.deepStrictEqual(
        parsedResponsePatch.qualifications[0].localQualName,
        str[i] + 'Patched',
      )
      assert.deepStrictEqual(
        parsedResponsePatch.qualifications[1].localQualName,
        str[i] + 'Patched2',
      )
      assert.deepStrictEqual(
        parsedResponsePatch.qualifications[2].localQualName,
        str[i] + 'JPatched',
      )
      assert.deepStrictEqual(
        parsedResponsePatch.qualifications[0].localQualID,
        parsedResponse.qualifications[0].localQualID,
      )
      assert.deepStrictEqual(
        parsedResponsePatch.qualifications[1].localQualID,
        parsedResponse.qualifications[1].localQualID,
      )
      assert.deepStrictEqual(
        parsedResponsePatch.qualifications[2].localQualID,
        parsedResponse.qualifications[2].localQualID,
      )
      assert.deepStrictEqual(parsedResponsePatch.qualifications[1].storeID, 1)
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

      assert.deepStrictEqual(parsedResponse.qualifications[0].globalQualName, str[i])

      const getResponse = await app.inject({
        method: 'GET',
        url:
          '/qualifications/globalQualifications/' + parsedResponse.qualifications[0].globalQualID,
        headers: {
          Authorization: jwt,
        },
      })

      const parsedGetResponse = JSON.parse(getResponse.body)

      console.log('parsedGetResponse')
      console.log('parsedGetResponse')
      console.log(parsedGetResponse)
      console.log('parsedGetResponse')
      console.log('parsedGetResponse')
      assert.deepStrictEqual(parsedGetResponse.qualification.globalQualName, str[i])

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

      assert.deepStrictEqual(
        parsedPatchResponse.qualifications[0].globalQualName,
        str[i] + 'patched',
      )

      const deleteResponse = await app.inject({
        method: 'DELETE',
        url: '/qualifications/globalQualifications',
        headers: {
          Authorization: jwt,
        },
        payload: [{ globalQualID: parsedResponse.qualifications[0].globalQualID }],
      })

      const parsedDeleteResponse = JSON.parse(deleteResponse.body)
      assert.deepStrictEqual(
        parsedDeleteResponse.qualifications[0].globalQualName,
        str[i] + 'patched',
      )

      const getDeletedResponse = await app.inject({
        method: 'GET',
        url:
          '/qualifications/globalQualifications/' + parsedResponse.qualifications[0].globalQualID,
        headers: {
          Authorization: jwt,
        },
      })

      assert.deepStrictEqual(getDeletedResponse.statusCode, 404)
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
            globalQualName: str[i],
          },
        ],
      })

      const parsedResponse = JSON.parse(response.body)
      assert.deepStrictEqual(parsedResponse.qualifications[0].globalQualName, str[i])
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
      assert.deepStrictEqual(parsedResponse.qualifications[0].globalQualName, str[i] + 'glergx')
      assert.deepStrictEqual(parsedResponse.qualifications[1].globalQualName, str[i] + 'dsfs2sdfds')
      assert.deepStrictEqual(
        parsedResponse.qualifications[2].globalQualName,
        str[i] + 'Jonas is King',
      )

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

      assert.deepStrictEqual(
        parsedResponsePatch.qualifications[0].globalQualName,
        str[i] + 'Patched',
      )
      assert.deepStrictEqual(
        parsedResponsePatch.qualifications[1].globalQualName,
        str[i] + 'Patched2',
      )
      assert.deepStrictEqual(
        parsedResponsePatch.qualifications[2].globalQualName,
        str[i] + 'JPatched',
      )
      assert.deepStrictEqual(
        parsedResponsePatch.qualifications[0].globalQualID,
        parsedResponse.qualifications[0].globalQualID,
      )
      assert.deepStrictEqual(
        parsedResponsePatch.qualifications[1].globalQualID,
        parsedResponse.qualifications[1].globalQualID,
      )
      assert.deepStrictEqual(
        parsedResponsePatch.qualifications[2].globalQualID,
        parsedResponse.qualifications[2].globalQualID,
      )
    }
  })
})
