import { FastifyInstance } from 'fastify'
import fc from 'fast-check'

import { after, before, describe, it } from 'node:test'
import assert from 'assert'
import { buildApp } from '../../src/app.js'
import { initDrizzle } from '../../src/config/db-connect.js'

let jwt = ''
const newRole = 1
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
    console.log(parsedResponse)
    jwt = 'Bearer ' + parsedResponse.token

    //const roleResp = await app.inject({
    //  method: 'POST',
    //  url: '/roles',
    //  headers: {
    //    Authorization: jwt,
    //  },
    //  payload: {
    //    roleName: 'Next role',
    //    description: 'My role desc',
    //  },
    //})
    //newRole = JSON.parse(roleResp.body).data.roleID
    //console.log(newRole)
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
              password: 'fdfsdfsdfdsfdsfsdewf2332werwfew',
              roleID: 1,
            },
          })

          const parsedResponse = JSON.parse(response.body)
          assert.deepStrictEqual(parsedResponse.body.firstName, firstName)
          assert.deepStrictEqual(parsedResponse.body.lastName, lastName)
          assert.deepStrictEqual(parsedResponse.body.email, email)
          assert.strictEqual(response.statusCode, 201)
          userIDs.push(parsedResponse.body.userID)

          const getResponse = await app.inject({
            method: 'GET',
            url: '/users/' + parsedResponse.body.userID,
            headers: {
              Authorization: jwt,
            },
          })

          const parsedGetResponse = JSON.parse(getResponse.body)

          assert.deepStrictEqual(parsedGetResponse.userID, parsedResponse.body.userID)
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
  })
})
