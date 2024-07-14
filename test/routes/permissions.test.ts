import { FastifyInstance } from 'fastify'
import fc from 'fast-check'

import { after, before, describe, it } from 'node:test'
import assert from 'assert'
import { buildApp } from '../../src/app.js'
import { initDrizzle } from '../../src/config/db-connect.js'

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
    const parsedResponse = JSON.parse(response.body)

    jwt = 'Bearer ' + parsedResponse.token
  })

  const permissionIDs: number[] = []

  after(async () => {
    await app.close()
  })

  it('permissions create and get fast-check', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 3, maxLength: 128 }).noShrink(),
        fc.string({ minLength: 3, maxLength: 128 }).noShrink(),
        async (name, description) => {
          const response = await app.inject({
            method: 'POST',
            url: '/permissions',
            headers: {
              Authorization: jwt,
            },
            payload: { permissionTitle: name, description: description },
          })

          const parsedResponse = JSON.parse(response.body)
          console.log('parsedResponse', parsedResponse)
          permissionIDs.push(parsedResponse.data.permissionID)
          assert.deepStrictEqual(parsedResponse.data.permissionTitle, name)
          assert.deepStrictEqual(parsedResponse.data.permissionDescription, description)
          assert.deepStrictEqual(parsedResponse.message, 'Permission created')
          assert.strictEqual(response.statusCode, 201)

          const getResponse = await app.inject({
            method: 'GET',
            url: '/permissions/' + parsedResponse.data.permissionID,
            headers: {
              Authorization: jwt,
            },
          })
          const parsedGetResponse = JSON.parse(getResponse.body)
          assert.deepStrictEqual(parsedGetResponse.permissionTitle, name)
          assert.deepStrictEqual(parsedGetResponse.permissionDescription, description)
          assert.strictEqual(getResponse.statusCode, 200)
        },
      ),
    )
  })
  it('permissions delete and get fast-check', async () => {
    for (const permissionID of permissionIDs) {
      const deleteResponse = await app.inject({
        method: 'DELETE',
        url: '/permissions/' + permissionID,
        headers: {
          Authorization: jwt,
        },
      })
      const parsedDeleteResponse = JSON.parse(deleteResponse.body)
      assert.deepStrictEqual(parsedDeleteResponse.message, 'Permission deleted')
      assert.deepStrictEqual(deleteResponse.statusCode, 200)

      const getResponse = await app.inject({
        method: 'GET',
        url: '/permissions/' + permissionID,
        headers: {
          Authorization: jwt,
        },
      })
      const parsedGetResponse = JSON.parse(getResponse.body)
      assert.deepStrictEqual(parsedGetResponse.message, 'Permission not found')
      assert.strictEqual(getResponse.statusCode, 404)
    }
  })
})
