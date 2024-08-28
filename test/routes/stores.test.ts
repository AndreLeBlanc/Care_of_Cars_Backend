import { FastifyInstance } from 'fastify'

import { after, before, describe, it } from 'node:test'
import assert from 'assert'
import { buildApp } from '../../src/app.js'
import { initDrizzle } from '../../src/config/db-connect.js'

//function onlyUnique(value, index, array) {
//  return array.indexOf(value) === index
//}

let jwt = ''
describe('POST /users/login HTTP', async () => {
  let app: FastifyInstance

  before(async () => {
    await initDrizzle()
    app = await buildApp({ logger: false }) // Assigning to the existing variable
    const response = await app.inject({
      method: 'POST',
      url: '/users/login',
      payload: {
        email: 'superadmin@test.com',
        password: 'admin123',
      },
    })
    console.log('parsed 123: ', response)
    const parsedResponse = JSON.parse(response.body)
    jwt = 'Bearer ' + parsedResponse.token
  })
  //  const storeIDs: number[] = []

  after(async () => {
    await app.close()
  })

  it('stores create', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/stores',
      headers: {
        Authorization: jwt,
      },
      payload: {
        storeName: 'dsfslkdfnd',
        storeOrgNumber: '665592342',
        storeFSkatt: true,
        storeStatus: true,
        storeEmail: '213dlkfsdknf@dsfsknl.com',
        storePhone: '08945050',
        storeAddress: 'svesdlnsleknr 12',
        storeZipCode: '75327',
        storeCity: 'uppsala',
        storeCountry: 'Sverige',
        storeDescription: 'first in test',
        storeContactPerson: 'Alfons Åberg',
        storeMaxUsers: 123,
        storeAllowCarAPI: true,
        storeAllowSendSMS: true,
        storeSendSMS: true,
        storeUsesCheckin: true,
        storeUsesPIN: true,
      },
    })

    const parsedResponse = JSON.parse(response.body)
    assert.strictEqual(response.statusCode, 201)
    assert.strictEqual(parsedResponse.store.storeName, 'dsfslkdfnd')
    assert.strictEqual(parsedResponse.store.storeOrgNumber, '665592342')
    assert.strictEqual(parsedResponse.store.storeFSkatt, true)
    assert.strictEqual(parsedResponse.store.storeStatus, true)
    assert.strictEqual(parsedResponse.store.storeEmail, '213dlkfsdknf@dsfsknl.com')
    assert.strictEqual(parsedResponse.store.storePhone, '08945050')
    assert.strictEqual(parsedResponse.store.storeAddress, 'svesdlnsleknr 12')
    assert.strictEqual(parsedResponse.store.storeZipCode, '75327')
    assert.strictEqual(parsedResponse.store.storeCity, 'uppsala')
    assert.strictEqual(parsedResponse.store.storeCountry, 'Sverige')
    assert.strictEqual(parsedResponse.store.storeDescription, 'first in test')
    assert.strictEqual(parsedResponse.store.storeContactPerson, 'Alfons Åberg')
    assert.strictEqual(parsedResponse.store.storeMaxUsers, 123)
    assert.strictEqual(parsedResponse.store.storeAllowCarAPI, true)
    assert.strictEqual(parsedResponse.store.storeAllowSendSMS, true)
    assert.strictEqual(parsedResponse.store.storeSendSMS, true)
    assert.strictEqual(parsedResponse.store.storeUsesCheckin, true)
    assert.strictEqual(parsedResponse.store.storeUsesPIN, true)
  })
})
