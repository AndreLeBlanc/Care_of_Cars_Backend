import { FastifyInstance } from 'fastify'

import * as crypto from 'node:crypto'

import { after, before, describe, it } from 'node:test'
import assert from 'assert'
import { buildApp } from '../../src/app.js'
import { initDrizzle } from '../../src/config/db-connect.js'

const str = [
  'undefined',
  'undef',
  'null',
  'NULL',
  '(null)',
  'nil',
  'NIL',
  'true',
  'false',
  'True',
  'False',
  'TRUE',
  'FALSE',
  'None',
  'hasOwnProperty',
  'then',
  'constructor',
  'COM1',
  'LPT1',
  'LPT2',
  'LPT3',
  'COM2',
  'COM3',
  'COM4',
  'Scunthorpe General Hospital',
  'Penistone Community Church',
  'Lightwater Country Park',
  'Jimmy Clitheroe',
  'Horniman Museum',
  'shitake mushrooms',
  'RomansInSussex.co.uk',
  'http:www.cum.qc.ca/',
  'Craig Cockburn, Software Specialist',
  'Linda Callahan',
  'Dr. Herman I. Libshitz',
  'magna cum laude',
  'Super Bowl XXX',
  'medieval erection of parapets',
  'evaluate',
  'mocha',
  'expression',
  'Arsenal canal',
  'classic',
  'Tyson Gay',
  'Dick Van Dyke',
  'basement',
]

let jwt = ''
describe('category tests', async () => {
  let app: FastifyInstance

  before(async () => {
    await initDrizzle()
    app = await buildApp({ logger: false })
    const response = await app.inject({
      method: 'POST',
      url: '/users/login',
      payload: {
        email: 'superadmin@test.com',
        password: 'admin123',
      },
    })
    const parsedResponse = JSON.parse(response.body)
    console.log('login info: ', parsedResponse)

    jwt = 'Bearer ' + parsedResponse.token
  })

  after(async () => {
    await app.close()
  })

  it('service Category create and get', async () => {
    for (const [i, name] of str.entries()) {
      console.log('name and i: ', name, ' ', i)
      const response = await app.inject({
        method: 'POST',
        url: '/category/service',
        headers: {
          Authorization: jwt,
        },
        payload: {
          name: name,
          description: name,
        },
      })

      const parsedResponse = JSON.parse(response.body)

      console.log(
        'parsedResponse ',
        parsedResponse,
        parsedResponse.serviceCategoryDescription,
        '   ',
        name,
        name === parsedResponse.serviceCategoryDescription,
      )

      assert.deepStrictEqual(parsedResponse.serviceCategoryName, name)
      assert.deepStrictEqual(parsedResponse.serviceCategoryDescription, name)
      assert.deepStrictEqual(response.statusCode, 201)
      const getResponse = await app.inject({
        method: 'GET',
        url: '/category/service/' + parsedResponse.serviceCategoryID,
        headers: {
          Authorization: jwt,
        },
      })
      const parsedGetResponse = JSON.parse(getResponse.body)

      assert.deepStrictEqual(parsedGetResponse.serviceCategoryName, name)
      assert.deepStrictEqual(parsedGetResponse.serviceCategoryDescription, str[i])
      assert.deepStrictEqual(getResponse.statusCode, 200)

      const newName = crypto.randomBytes(i + 3).toString('hex')
      const newDescription = crypto.randomBytes(i + 8).toString('hex')

      const patchResponse = await app.inject({
        method: 'PATCH',
        url: '/category/service/' + parsedResponse.serviceCategoryID,
        headers: {
          Authorization: jwt,
        },
        payload: {
          name: newName,
          description: newDescription,
        },
      })

      const parsedPatchResponse = JSON.parse(patchResponse.body)

      assert.deepStrictEqual(parsedPatchResponse.serviceCategoryName, newName)
      assert.deepStrictEqual(parsedPatchResponse.serviceCategoryDescription, newDescription)
      assert.deepStrictEqual(patchResponse.statusCode, 201)

      const deletedResponse = await app.inject({
        method: 'DELETE',
        url: '/category/service/' + parsedResponse.serviceCategoryID,
        headers: {
          Authorization: jwt,
        },
      })

      const deletedParsedResponse = JSON.parse(deletedResponse.body)

      assert.deepStrictEqual(deletedParsedResponse.serviceCategoryName, newName)
      assert.deepStrictEqual(deletedParsedResponse.serviceCategoryDescription, newDescription)
      assert.deepStrictEqual(deletedResponse.statusCode, 200)
    }
  })
})
