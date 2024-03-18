import { test } from 'node:test'
import { build, readFile, writeToFile } from '../helper'
import assert from 'node:assert'

test('users login api', async (t) => {
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
  //Write token to file
  await writeToFile(parsedResponse.token, './test/authTokenForTest.txt')
})

test('users list api', async (t) => {
  const app = await build(t)
  const token = await readFile('./test/authTokenForTest.txt')
  const res = await app.inject({
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    url: '/users/',
  })
  const parsedResponse = JSON.parse(res.payload)
  console.log(parsedResponse)
  assert.strictEqual(res.statusCode, 200)
  //assert.equal(parsedResponse.message, 'Login success')
})
