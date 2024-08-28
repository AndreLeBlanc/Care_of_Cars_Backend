import { FastifyInstance } from 'fastify'
import fc from 'fast-check'

import { Value } from '@sinclair/typebox/value'

import { after, before, describe, it } from 'node:test'
import { deepStrictEqual } from 'assert'

import { buildApp } from '../../src/app.js'
import { initDrizzle } from '../../src/config/db-connect.js'

import { RoleSchema } from '../../src/routes/roles/roleSchema.js'

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

  const roleIDs: number[] = []

  after(async () => {
    await app.close()
  })

  it('roles create and get fast-check', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc
          .uniqueArray(fc.string({ minLength: 3, maxLength: 128 }), {
            minLength: 100,
            maxLength: 100,
          })
          .noShrink(),
        fc
          .uniqueArray(fc.string({ minLength: 3, maxLength: 128 }), {
            minLength: 100,
            maxLength: 100,
          })
          .noShrink(),
        async (name, description) => {
          for (let i = 0; i < name.length; i++) {
            if (Value.Check(RoleSchema, { roleName: name[i], description: description[i] })) {
              const response = await app.inject({
                method: 'POST',
                url: '/roles',
                headers: {
                  Authorization: jwt,
                },
                payload: { roleName: name[i], description: description[i] },
              })

              const parsedResponse = JSON.parse(response.body)
              deepStrictEqual(parsedResponse.message, 'Role created')
              deepStrictEqual(parsedResponse.data.description, description[i])
              deepStrictEqual(response.statusCode, 201)
              roleIDs.push(parsedResponse.data.roleID)
              const getResponse = await app.inject({
                method: 'GET',
                url: '/roles/' + parsedResponse.data.roleID,
                headers: {
                  Authorization: jwt,
                },
              })
              const parsedGetResponse = JSON.parse(getResponse.body)
              deepStrictEqual(parsedGetResponse.role.roleName, name[i])
              deepStrictEqual(getResponse.statusCode, 200)
            }
          }
        },
      ),
      { numRuns: 1 },
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
      deepStrictEqual(parsedDeleteResponse.message, 'Role deleted')
      deepStrictEqual(deleteResponse.statusCode, 200)

      const getResponse = await app.inject({
        method: 'GET',
        url: '/roles/' + roleID,
        headers: {
          Authorization: jwt,
        },
      })

      const parsedGetResponse = JSON.parse(getResponse.body)
      deepStrictEqual(parsedGetResponse.message, 'could not find role')
      deepStrictEqual(getResponse.statusCode, 404)
    }
  })
})
