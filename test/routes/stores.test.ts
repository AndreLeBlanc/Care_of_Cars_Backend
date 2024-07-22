import { FastifyInstance } from 'fastify'
import fc from 'fast-check'

import { after, before, describe, it } from 'node:test'
import assert from 'assert'
import { buildApp } from '../../src/app.js'
import { initDrizzle } from '../../src/config/db-connect.js'

let jwt = ''
describe('stores test', async () => {
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
    const parsedResponse = JSON.parse(response.body)

    jwt = 'Bearer ' + parsedResponse.token
  })

  //  const storeIDs: number[] = []

  after(async () => {
    await app.close()
  })

  it('stores create and get fast-check', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc
          .uniqueArray(fc.string({ minLength: 1 }).noShrink(), { minLength: 1, maxLength: 1 })
          .noShrink(),
        fc
          .uniqueArray(fc.string({ minLength: 1, maxLength: 11 }).noShrink(), {
            minLength: 1,
            maxLength: 1,
          })
          .noShrink(),
        fc.uniqueArray(fc.boolean().noShrink(), { minLength: 1, maxLength: 1 }).noShrink(),
        fc.uniqueArray(fc.boolean().noShrink(), { minLength: 1, maxLength: 1 }).noShrink(),
        fc.uniqueArray(fc.emailAddress().noShrink(), { minLength: 1, maxLength: 1 }).noShrink(),
        fc
          .uniqueArray(fc.string({ minLength: 1 }).noShrink(), { minLength: 1, maxLength: 1 })
          .noShrink(),
        fc
          .uniqueArray(fc.string({ minLength: 1 }).noShrink(), { minLength: 1, maxLength: 1 })
          .noShrink(),
        fc
          .uniqueArray(fc.string({ minLength: 1 }).noShrink(), { minLength: 1, maxLength: 1 })
          .noShrink(),
        fc
          .uniqueArray(fc.string({ minLength: 1 }).noShrink(), { minLength: 1, maxLength: 1 })
          .noShrink(),
        fc
          .uniqueArray(fc.string({ minLength: 1 }).noShrink(), { minLength: 1, maxLength: 1 })
          .noShrink(),
        fc
          .uniqueArray(fc.string({ minLength: 1 }).noShrink(), { minLength: 1, maxLength: 1 })
          .noShrink(),
        fc
          .uniqueArray(fc.integer({ min: 1, max: 1024 }).noShrink(), { minLength: 1, maxLength: 1 })
          .noShrink(),
        fc.uniqueArray(fc.boolean().noShrink(), { minLength: 1, maxLength: 1 }).noShrink(),
        fc.uniqueArray(fc.boolean().noShrink(), { minLength: 1, maxLength: 1 }).noShrink(),
        fc.uniqueArray(fc.boolean().noShrink(), { minLength: 1, maxLength: 1 }).noShrink(),
        fc.uniqueArray(fc.boolean().noShrink(), { minLength: 1, maxLength: 1 }).noShrink(),
        fc.uniqueArray(fc.boolean().noShrink(), { minLength: 1, maxLength: 1 }).noShrink(),
        async (
          storeName,
          storeOrgNumber,
          storeFSkatt,
          storeStatus,
          storeEmail,
          storeAddress,
          storeZipCode,
          storeCity,
          storeCountry,
          storeDescription,
          storeContactPerson,
          storeMaxUsers,
          storeAllowCarAPI,
          storeAllowSendSMS,
          storeSendSMS,
          storeUsesCheckin,
          storeUsesPIN,
        ) => {
          for (let i = 0; i < storeName.length; i++) {
            const response = await app.inject({
              method: 'POST',
              url: '/stores',
              headers: {
                Authorization: jwt,
              },
              payload: {
                storeName: storeName[i],
                storeOrgNumber: storeOrgNumber[i],
                storeFSkatt: storeFSkatt[i],
                storeStatus: storeStatus[i],
                storeEmail: storeEmail[i],
                storePhone: '0762757764',
                storeAddress: storeAddress[i],
                storeZipCode: storeZipCode[i],
                storeCity: storeCity[i],
                storeCountry: storeCountry[i],
                storeDescription: storeDescription[i],
                storeContactPerson: storeContactPerson[i],
                storeMaxUsers: storeMaxUsers[i],
                storeAllowCarAPI: storeAllowCarAPI[i],
                storeAllowSendSMS: storeAllowSendSMS[i],
                storeSendSMS: storeSendSMS[i],
                storeUsesCheckin: storeUsesCheckin[i],
                storeUsesPIN: storeUsesPIN[i],
              },
            })

            const parsedResponse = JSON.parse(response.body)
            console.log('parsed store', parsedResponse.store)
            //          storeIDs.push(parsedResponse.data.permissionID)
            //assert.deepStrictEqual(parsedResponse.data.permissionName, name)
            //assert.deepStrictEqual(parsedResponse.data.permissionDescription, description)
            //assert.deepStrictEqual(parsedResponse.message, 'store created')
            assert.strictEqual(response.statusCode, 201)
            assert.strictEqual(parsedResponse.store.storeName, storeName[i])

            //     const getResponse = await app.inject({
            //       method: 'GET',
            //       url: '/permissions/' + parsedResponse.data.permissionID,
            //       headers: {
            //         Authorization: jwt,
            //       },
            //     })
            //     const parsedGetResponse = JSON.parse(getResponse.body)
            //     assert.deepStrictEqual(parsedGetResponse.permissionName, name)
            //     assert.deepStrictEqual(parsedGetResponse.permissionDescription, description)
            //     assert.strictEqual(getResponse.statusCode, 200)
          }
        },
      ),
    ),
      { numRuns: 1 }
  })
  // it('permissions delete and get fast-check', async () => {
  //   for (const permissionID of storeIDs) {
  //     const deleteResponse = await app.inject({
  //       method: 'DELETE',
  //       url: '/permissions/' + permissionID,
  //       headers: {
  //         Authorization: jwt,
  //       },
  //     })
  //     const parsedDeleteResponse = JSON.parse(deleteResponse.body)
  //     assert.deepStrictEqual(parsedDeleteResponse.message, 'Permission deleted')
  //     assert.deepStrictEqual(deleteResponse.statusCode, 200)
  //
  //     const getResponse = await app.inject({
  //       method: 'GET',
  //       url: '/permissions/' + permissionID,
  //       headers: {
  //         Authorization: jwt,
  //       },
  //     })
  //     const parsedGetResponse = JSON.parse(getResponse.body)
  //     assert.deepStrictEqual(parsedGetResponse.message, 'Permission not found')
  //     assert.strictEqual(getResponse.statusCode, 404)
  //   }
  //})
})
