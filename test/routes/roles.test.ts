import { FastifyInstance } from 'fastify'
import fc from 'fast-check'

import { after, before, describe, it } from 'node:test'
import assert from 'assert'
import { buildApp } from '../../src/app.js'
import { initDrizzle } from '../../src/config/db-connect.js'

const jwt =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJmaXJzdE5hbWUiOiJTdXBlckFkbWluIiwiZW1haWwiOiJzdXBlcmFkbWluQHRlc3QuY29tIiwiaXNTdXBlckFkbWluIjp0cnVlLCJyb2xlIjp7ImlkIjoxLCJyb2xlTmFtZSI6IlN1cGVyQWRtaW4ifX0sImlhdCI6MTcxMDk0MzA5N30.sFrI-MOfltQXJrbAudYNjsTpzDm1OqAAwNM_5dPzxPU'

describe('roles', async () => {
  let app: FastifyInstance
  const roleIDs: number[] = []

  before(async () => {
    await initDrizzle()
    app = await buildApp({ logger: false })
  })

  after(async () => {
    await app.close()
  })

  it('roles create and get fast-check', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 3, maxLength: 128 }).noShrink(),
        fc.string({ minLength: 3, maxLength: 128 }).noShrink(),
        async (name, description) => {
          const response = await app.inject({
            method: 'POST',
            url: '/roles',
            headers: {
              Authorization: jwt,
            },
            payload: { roleName: name, description: description },
          })

          const parsedResponse = JSON.parse(response.body)
          roleIDs.push(parsedResponse.data.roleID)
          assert.deepStrictEqual(parsedResponse.data.roleName, name)
          assert.deepStrictEqual(parsedResponse.data.roleDescription, description)
          assert.deepStrictEqual(parsedResponse.message, 'Role created')
          assert.strictEqual(response.statusCode, 201)

          const getResponse = await app.inject({
            method: 'GET',
            url: '/roles/' + parsedResponse.data.roleID,
            headers: {
              Authorization: jwt,
            },
          })
          const parsedGetResponse = JSON.parse(getResponse.body)
          assert.deepStrictEqual(parsedGetResponse.role.roleName, name)
          assert.strictEqual(getResponse.statusCode, 200)
        },
      ),
    )
  })
  it('roles delete and get fast-check', async () => {
    for (const roleID of roleIDs) {
      const deleteResponse = await app.inject({
        method: 'DELETE',
        url: '/roles/' + roleID,
        headers: {
          Authorization: jwt,
        },
      })
      const parsedDeleteResponse = JSON.parse(deleteResponse.body)
      assert.deepStrictEqual(parsedDeleteResponse.message, 'Role deleted')
      assert.deepStrictEqual(deleteResponse.statusCode, 200)

      const getResponse = await app.inject({
        method: 'GET',
        url: '/roles/' + roleID,
        headers: {
          Authorization: jwt,
        },
      })
      const parsedGetResponse = JSON.parse(getResponse.body)
      assert.deepStrictEqual(parsedGetResponse.message, 'role not found')
      assert.strictEqual(getResponse.statusCode, 404)
    }
  })
})
