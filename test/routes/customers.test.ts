import { FastifyInstance } from 'fastify'

import { after, before, describe, it } from 'node:test'
import { buildApp } from '../../src/app.js'
import { initDrizzle } from '../../src/config/db-connect.js'

import assert from 'assert'

let jwt = ''
describe('Customer Route', () => {
  let app: FastifyInstance

  before(async () => {
    await initDrizzle()
    app = await buildApp({ logger: false })
    await new Promise((f) => setTimeout(f, 1500))

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

  it('', async () => {
    const request = await app.inject({
      method: 'POST',
      url: '/customer',
      headers: {
        Authorization: jwt,
      },
      payload: {
        customerOrgNumber: '123456',
        customerCompanyName: 'ABC INC',
        companyReference: 'XYZ',
        companyPhone: '018234432',
        companyEmail: 'admin@abcinc.com',
        companyAddress: 'Some Road, Some Where',
        companyZipCode: '74934',
        companyAddressCity: 'LOK',
        companyCountry: 'IN',
        driverExternalNumber: '0943094',
        driverGDPRAccept: true,
        driverISWarrantyDriver: true,
        driverAcceptsMarketing: true,
        driverFirstName: 'Mahan',
        driverLastName: 'Putri',
        driverEmail: 'mahan.putri@abcinc.com',
        driverPhoneNumber: '12345678',
        driverAddress: 'smae',
        driverZipCode: 'sae',
        driverAddressCity: '23',
        driverCountry: 'SW',
        driverHasCard: true,
        driverCardNumber: 'XXXX-XXXX-XXXX',
        driverCardValidTo: '2024-04-18',
        driverKeyNumber: 'XXXX',
        driverNotesShared: 'some note!',
        driverNotes: 'some note!',
      },
    })

    const response = {
      message: 'company / driver created',
      data: {
        company: {
          customerOrgNumber: '123456',
          customerCompanyName: 'ABC INC',
          companyReference: 'XYZ',
          companyEmail: 'admin@abcinc.com',
          companyPhone: '12345678',
          companyAddress: 'Some Road, Some Where',
          companyZipCode: '74934',
          companyAddressCity: 'LOK',
          companyCountry: 'IN',
          createdAt: '2024-04-18T10:56:45.437Z',
          updatedAt: '2024-04-18T10:56:45.437Z',
        },
        driver: {
          driverExternalNumber: '0943094',
          driverGDPRAccept: true,
          driverISWarrantyDriver: true,
          driverAcceptsMarketing: true,
          driverFirstName: 'Mahan',
          driverLastName: 'Putri',
          driverEmail: 'mahan.putri@abcinc.com',
          driverPhoneNumber: '12345678',
          driverAddress: 'smae',
          driverZipCode: 'sae',
          driverAddressCity: '23',
          driverCountry: 'SW',
          driverHasCard: true,
          driverCardNumber: 'XXXX-XXXX-XXXX',
          driverCardValidTo: '2024-04-18T00:00:00.000Z',
          driverKeyNumber: 'XXXX',
          driverNotesShared: 'some note!',
          driverNotes: 'some note!',
          createdAt: '2024-04-18T10:56:45.440Z',
          updatedAt: '2024-04-18T10:56:45.440Z',
        },
      },
    }
    const parsedResponse = JSON.parse(request.body)

    assert.deepStrictEqual(parsedResponse.data.company.customerOrgNumber, '123456')
    assert.deepStrictEqual(parsedResponse.data.company.customerCompanyName, 'ABC INC')
    assert.deepStrictEqual(parsedResponse.data.company.companyEmail, 'admin@abcinc.com')
    assert.deepStrictEqual(parsedResponse.data.company.companyPhone, '018234432')
    assert.deepStrictEqual(parsedResponse.data.company.companyAddress, 'Some Road, Some Where')
    assert.deepStrictEqual(parsedResponse.data.company.companyZipCode, '74934')
    assert.deepStrictEqual(parsedResponse.data.company.companyAddressCity, 'LOK')
    assert.deepStrictEqual(parsedResponse.data.company.companyCountry, 'IN')

    assert.deepStrictEqual(
      parsedResponse.data.driver.driverExternalNumber,
      response.data.driver.driverExternalNumber,
    )
    assert.deepStrictEqual(
      parsedResponse.data.driver.driverGDPRAccept,
      response.data.driver.driverGDPRAccept,
    )
    assert.deepStrictEqual(
      parsedResponse.data.driver.driverISWarrantyDriver,
      response.data.driver.driverISWarrantyDriver,
    )
    assert.deepStrictEqual(
      parsedResponse.data.driver.driverAcceptsMarketing,
      response.data.driver.driverAcceptsMarketing,
    )
    assert.deepStrictEqual(
      parsedResponse.data.driver.driverFirstName,
      response.data.driver.driverFirstName,
    )
    assert.deepStrictEqual(
      parsedResponse.data.driver.driverLastName,
      response.data.driver.driverLastName,
    )
    assert.deepStrictEqual(parsedResponse.data.driver.driverEmail, response.data.driver.driverEmail)
    assert.deepStrictEqual(
      parsedResponse.data.driver.driverPhoneNumber,
      response.data.driver.driverPhoneNumber,
    )
    assert.deepStrictEqual(
      parsedResponse.data.driver.driverAddress,
      response.data.driver.driverAddress,
    )
    assert.deepStrictEqual(
      parsedResponse.data.driver.driverZipCode,
      response.data.driver.driverZipCode,
    )
    assert.deepStrictEqual(
      parsedResponse.data.driver.driverAddressCity,
      response.data.driver.driverAddressCity,
    )
    assert.deepStrictEqual(
      parsedResponse.data.driver.driverCountry,
      response.data.driver.driverCountry,
    )
    assert.deepStrictEqual(
      parsedResponse.data.driver.driverHasCard,
      response.data.driver.driverHasCard,
    )
    assert.strictEqual(request.statusCode, 201)

    const postResponse = await app.inject({
      method: 'POST',
      url: '/customer',
      headers: {
        Authorization: jwt,
      },
      payload: {
        customerOrgNumber: '5593921082/',
        customerCompanyName: 'Vendfox solutions ab',
        companyReference: 'André Le Blanc',
        companyEmail: 'andre@vendfox.com',
        companyPhone: '0762757764',
        companyAddress: 'Norrtäljegatan 15a',
        companyZipCode: '75327',
        companyAddressCity: 'Uppsala',
        companyCountry: 'SWeden',
        driverExternalNumber: '12353453',
        driverGDPRAccept: false,
        driverISWarrantyDriver: false,
        driverAcceptsMarketing: false,
        driverFirstName: 'André',
        driverLastName: 'Le Blanc',
        driverEmail: 'andre@vendfox.com',
        driverPhoneNumber: '0762757764',
        driverAddress: 'Norrtäljegatan 15a',
        driverZipCode: '75327',
        driverAddressCity: 'Uppsala',
        driverCountry: 'Sweden',
        driverHasCard: false,
        driverCardNumber: 'XXXX-XXXX-XXXX',
        driverCardValidTo: '2024-04-18',
        driverKeyNumber: 'XXXX',
        driverNotesShared: 'I added myself and my company',
        driverNotes: 'Discount webdev agency',
      },
    })

    const expectedResponse = {
      message: 'company / driver created',
      data: {
        company: {
          customerOrgNumber: '5593921082/',
          customerCompanyName: 'Vendfox solutions ab',
          companyEmail: 'andre@vendfox.com',
          companyPhone: '0762757764',
          companyAddress: 'Norrtäljegatan 15a',
          companyZipCode: '75327',
          companyAddressCity: 'Uppsala',
          companyAddressCountry: 'SWeden',
          createdAt: '2024-04-18T10:56:45.437Z',
          updatedAt: '2024-04-18T10:56:45.437Z',
        },
        driver: {
          driverExternalNumber: '12353453',
          driverGDPRAccept: false,
          driverISWarrantyDriver: false,
          driverAcceptsMarketing: false,
          driverFirstName: 'André',
          driverLastName: 'Le Blanc',
          driverEmail: 'andre@vendfox.com',
          driverPhoneNumber: '0762757764',
          driverAddress: 'Norrtäljegatan 15a',
          driverZipCode: '75327',
          driverAddressCity: 'Uppsala',
          driverCountry: 'Sweden',
          driverHasCard: false,
          driverCardNumber: 'XXXX-XXXX-XXXX',
          driverCardValidTo: '2024-04-18',
          driverKeyNumber: 'XXXX',
          driverNotesShared: 'I added myself and my company',
          driverNotes: 'Discount webdev agency',
          createdAt: '2024-04-18T10:56:45.440Z',
          updatedAt: '2024-04-18T10:56:45.440Z',
        },
      },
    }
    const parsedPostResponse = JSON.parse(postResponse.body)

    assert.deepStrictEqual(parsedPostResponse.data.company.customerOrgNumber, '5593921082/')
    assert.deepStrictEqual(
      parsedPostResponse.data.company.customerCompanyName,
      'Vendfox solutions ab',
    )
    assert.deepStrictEqual(parsedPostResponse.data.company.companyEmail, 'andre@vendfox.com')
    assert.deepStrictEqual(parsedPostResponse.data.company.companyPhone, '0762757764')
    assert.deepStrictEqual(parsedPostResponse.data.company.companyAddress, 'Norrtäljegatan 15a')
    assert.deepStrictEqual(parsedPostResponse.data.company.companyZipCode, '75327')
    assert.deepStrictEqual(parsedPostResponse.data.company.companyAddressCity, 'Uppsala')
    assert.deepStrictEqual(parsedPostResponse.data.company.companyCountry, 'SWeden')

    assert.deepStrictEqual(
      parsedPostResponse.data.driver.driverExternalNumber,
      expectedResponse.data.driver.driverExternalNumber,
    )
    assert.deepStrictEqual(
      parsedPostResponse.data.driver.driverGDPRAccept,
      expectedResponse.data.driver.driverGDPRAccept,
    )
    assert.deepStrictEqual(
      parsedPostResponse.data.driver.driverISWarrantyDriver,
      expectedResponse.data.driver.driverISWarrantyDriver,
    )
    assert.deepStrictEqual(
      parsedPostResponse.data.driver.driverAcceptsMarketing,
      expectedResponse.data.driver.driverAcceptsMarketing,
    )
    assert.deepStrictEqual(
      parsedPostResponse.data.driver.driverFirstName,
      expectedResponse.data.driver.driverFirstName,
    )
    assert.deepStrictEqual(
      parsedPostResponse.data.driver.driverLastName,
      expectedResponse.data.driver.driverLastName,
    )
    assert.deepStrictEqual(
      parsedPostResponse.data.driver.driverEmail,
      expectedResponse.data.driver.driverEmail,
    )
    assert.deepStrictEqual(
      parsedPostResponse.data.driver.driverPhoneNumber,
      expectedResponse.data.driver.driverPhoneNumber,
    )
    assert.deepStrictEqual(
      parsedPostResponse.data.driver.driverAddress,
      expectedResponse.data.driver.driverAddress,
    )
    assert.deepStrictEqual(
      parsedPostResponse.data.driver.driverZipCode,
      expectedResponse.data.driver.driverZipCode,
    )
    assert.deepStrictEqual(
      parsedPostResponse.data.driver.driverAddressCity,
      expectedResponse.data.driver.driverAddressCity,
    )
    assert.deepStrictEqual(
      parsedPostResponse.data.driver.driverCountry,
      expectedResponse.data.driver.driverCountry,
    )
    assert.deepStrictEqual(
      parsedPostResponse.data.driver.driverHasCard,
      expectedResponse.data.driver.driverHasCard,
    )
    assert.strictEqual(postResponse.statusCode, 201)

    const postPatchResponse = await app.inject({
      method: 'PATCH',
      url: '/customer',
      headers: {
        Authorization: jwt,
      },
      payload: {
        customerOrgNumber: '5593921082/',
        customerCompanyName: 'Vendfox solutions AB',
        companyEmail: 'andre.leblanc@zoho.com',
        companyPhone: '0762757764',
        companyAddress: 'köpmangatan',
        companyZipCode: '75323',
        companyAddressCity: 'Stockholm',
        companyCountry: 'Sweden',
      },
    })
    const parsedPatchResponse = JSON.parse(postPatchResponse.body)

    console.log('parsedPatchResponse')
    console.log('parsedPatchResponse')
    console.log(parsedPatchResponse)
    console.log('parsedPatchResponse')
    console.log('parsedPatchResponse')
    assert.deepStrictEqual(parsedPatchResponse.comp.customerOrgNumber, '5593921082/')
    assert.deepStrictEqual(parsedPatchResponse.comp.customerCompanyName, 'Vendfox solutions AB')
    assert.deepStrictEqual(parsedPatchResponse.comp.companyEmail, 'andre.leblanc@zoho.com')
    assert.deepStrictEqual(parsedPatchResponse.comp.companyPhone, '0762757764')
    assert.deepStrictEqual(parsedPatchResponse.comp.companyAddress, 'köpmangatan')
    assert.deepStrictEqual(parsedPatchResponse.comp.companyZipCode, '75323')
    assert.deepStrictEqual(parsedPatchResponse.comp.companyAddressCity, 'Stockholm')
    assert.deepStrictEqual(parsedPatchResponse.comp.companyCountry, 'Sweden')
  })
})
