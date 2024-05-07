import { FastifyInstance } from 'fastify'
import fc from 'fast-check'
import { describe, it, before, after } from 'node:test'
import assert from 'assert'
import { buildApp } from '../../src/app.js'
import { initDrizzle } from '../../src/config/db-connect.js'

const jwt =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJmaXJzdE5hbWUiOiJTdXBlckFkbWluIiwiZW1haWwiOiJzdXBlcmFkbWluQHRlc3QuY29tIiwiaXNTdXBlckFkbWluIjp0cnVlLCJyb2xlIjp7ImlkIjoxLCJyb2xlTmFtZSI6IlN1cGVyQWRtaW4ifX0sImlhdCI6MTcxMDk0MzA5N30.sFrI-MOfltQXJrbAudYNjsTpzDm1OqAAwNM_5dPzxPU'

describe('permissions', async () => {
  let app: FastifyInstance
  const permissionIDs: number[] = []

  before(async () => {
    await initDrizzle()
    app = await buildApp({ logger: false })
  })

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
            payload: { PermissionName: name, description: description },
          })

          const parsedResponse = JSON.parse(response.body)
          console.log(parsedResponse)
          permissionIDs.push(parsedResponse.data.permissionID)
          assert.deepStrictEqual(parsedResponse.data.permissionName, name)
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
          assert.deepStrictEqual(parsedGetResponse.permissionName, name)
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
