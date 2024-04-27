import { FastifyInstance } from 'fastify'
import { describe, it, before, after } from 'node:test'
import assert from 'assert'
import { buildApp } from '../../src/app.js'

describe('POST /users/login HTTP', () => {
  let app: FastifyInstance

  before(async () => {
    app = await buildApp({ logger: false }) // Assigning to the existing variable
  })

  after(async () => {
    await app.close()
  })sdfsdfsd

  it('POST /users/login returns status 200', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users/login',
      payload: {
        email: 'superadmin@test.com',
        password: 'admin123',
      },
    })

    const res = {
      message: 'Login success',
      user: {
        id: 1,
        firstName: 'SuperAdmin',
        lastName: 'SuperAdmin',
        email: 'superadmin@test.com',
        isSuperAdmin: true,
        role: {
          id: 1,
          roleName: 'SuperAdmin',
          rolePermissions: [],
          roleFullPermissions: [],
        },
      },
    }

    const parsedResponse = JSON.parse(response.body)
    assert.equal(parsedResponse.message, 'Login success')
    assert.deepStrictEqual(parsedResponse.user, res.user)
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
})
