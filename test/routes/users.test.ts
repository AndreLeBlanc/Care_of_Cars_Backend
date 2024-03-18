import { test } from 'node:test'
import { build } from '../helper'
import assert from 'node:assert'

test('users login check', async (t) => {
  const app = await build(t)
  const res = await app.inject({
    method: 'POST',
    url: '/users/login',
    payload: {
      email: process.env.SUPER_ADMIN_EMAIL,
      password: process.env.SUPER_ADMIN_PASSWORD,
    },
  })
  const parsedResponse = JSON.parse(res.payload)
  assert.strictEqual(res.statusCode, 200)
  assert.equal(parsedResponse.message, 'Login success')
})
