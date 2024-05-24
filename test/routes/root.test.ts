import { FastifyInstance } from 'fastify'

import { after, before, describe, it } from 'node:test'
import assert from 'assert'
import { buildApp } from '../../src/app'

describe('GET / HTTP', () => {
  let app: FastifyInstance

  before(async () => {
    app = await buildApp({ logger: false }) // Assigning to the existing variable
  })

  after(async () => {
    await app.close()
  })

  it('GET / returns status 200', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/',
    })

    assert.strictEqual(response.statusCode, 200)
    assert.strictEqual(JSON.parse(response.payload).status, undefined)
    assert.deepStrictEqual(JSON.parse(response.body), { root: true })
  })
})
