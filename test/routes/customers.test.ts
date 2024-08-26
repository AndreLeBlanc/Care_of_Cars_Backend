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
    assert(parsedResponse.data.driver.driverID != null)
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
        customerOrgNumber: '5593921082',
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
          customerOrgNumber: '5593921082',
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

    assert.deepStrictEqual(parsedPostResponse.data.company.customerOrgNumber, '5593921082')
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
        customerOrgNumber: '5593921082',
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

    assert.deepStrictEqual(parsedPatchResponse.comp.customerOrgNumber, '5593921082')
    assert.deepStrictEqual(parsedPatchResponse.comp.customerCompanyName, 'Vendfox solutions AB')
    assert.deepStrictEqual(parsedPatchResponse.comp.companyEmail, 'andre.leblanc@zoho.com')
    assert.deepStrictEqual(parsedPatchResponse.comp.companyPhone, '0762757764')
    assert.deepStrictEqual(parsedPatchResponse.comp.companyAddress, 'köpmangatan')
    assert.deepStrictEqual(parsedPatchResponse.comp.companyZipCode, '75323')
    assert.deepStrictEqual(parsedPatchResponse.comp.companyAddressCity, 'Stockholm')
    assert.deepStrictEqual(parsedPatchResponse.comp.companyCountry, 'Sweden')

    const getResponse = await app.inject({
      method: 'GET',
      url: '/customer/123456',
      headers: {
        Authorization: jwt,
      },
    })

    const parsedgetResponse = JSON.parse(getResponse.body)

    assert.deepStrictEqual(parsedgetResponse.comp.customerOrgNumber, '123456')
    assert.deepStrictEqual(parsedgetResponse.comp.customerCompanyName, 'ABC INC')
    assert.deepStrictEqual(parsedgetResponse.comp.companyEmail, 'admin@abcinc.com')
    assert.deepStrictEqual(parsedgetResponse.comp.companyPhone, '018234432')
    assert.deepStrictEqual(parsedgetResponse.comp.companyAddress, 'Some Road, Some Where')
    assert.deepStrictEqual(parsedgetResponse.comp.companyZipCode, '74934')
    assert.deepStrictEqual(parsedgetResponse.comp.companyAddressCity, 'LOK')
    assert.deepStrictEqual(parsedgetResponse.comp.companyCountry, 'IN')

    const getResponse2 = await app.inject({
      method: 'GET',
      url: '/customer/5593921082',
      headers: {
        Authorization: jwt,
      },
    })

    const parsedgetResponse2 = JSON.parse(getResponse2.body)
    assert.deepStrictEqual(parsedgetResponse2.comp.customerOrgNumber, '5593921082')
    assert.deepStrictEqual(parsedgetResponse2.comp.customerCompanyName, 'Vendfox solutions AB')
    assert.deepStrictEqual(parsedgetResponse2.comp.companyEmail, 'andre.leblanc@zoho.com')
    assert.deepStrictEqual(parsedgetResponse2.comp.companyPhone, '0762757764')
    assert.deepStrictEqual(parsedgetResponse2.comp.companyAddress, 'köpmangatan')
    assert.deepStrictEqual(parsedgetResponse2.comp.companyZipCode, '75323')
    assert.deepStrictEqual(parsedgetResponse2.comp.companyAddressCity, 'Stockholm')
    assert.deepStrictEqual(parsedgetResponse2.comp.companyCountry, 'Sweden')

    const additionalDriverRequest = await app.inject({
      method: 'POST',
      url: '/customer/driver',
      headers: {
        Authorization: jwt,
      },
      payload: {
        customerOrgNumber: '123456',
        driverExternalNumber: '0943094',
        driverGDPRAccept: true,
        driverISWarrantyDriver: true,
        driverAcceptsMarketing: true,
        driverFirstName: 'Mahan',
        driverLastName: 'Putri',
        driverEmail: 'newGuy.putri@abcinc.com',
        driverPhoneNumber: '1234234',
        driverAddress: '234123',
        driverZipCode: '32112',
        driverAddressCity: '23',
        driverCountry: 'UK',
        driverHasCard: false,
        driverCardNumber: 'XXXX-XXXX-XXXX',
        driverCardValidTo: '2024-12-31',
        driverKeyNumber: 'XXXX',
        driverNotesShared: '',
        driverNotes: '',
      },
    })
    const additionalDriver = JSON.parse(additionalDriverRequest.body)

    assert.deepStrictEqual(additionalDriver.data.customerOrgNumber, '123456')
    assert.deepStrictEqual(additionalDriver.data.driverExternalNumber, '0943094')
    assert.deepStrictEqual(additionalDriver.data.driverGDPRAccept, true)
    assert.deepStrictEqual(additionalDriver.data.driverISWarrantyDriver, true)
    assert.deepStrictEqual(additionalDriver.data.driverAcceptsMarketing, true)
    assert.deepStrictEqual(additionalDriver.data.driverFirstName, 'Mahan')
    assert.deepStrictEqual(additionalDriver.data.driverLastName, 'Putri')
    assert.deepStrictEqual(additionalDriver.data.driverEmail, 'newGuy.putri@abcinc.com')
    assert.notEqual(additionalDriver.data.driverID, null)
    assert(additionalDriver.data.driverID > 0)
    assert.deepStrictEqual(additionalDriver.data.driverPhoneNumber, '1234234')
    assert.deepStrictEqual(additionalDriver.data.driverAddress, '234123')
    assert.deepStrictEqual(additionalDriver.data.driverZipCode, '32112')
    assert.deepStrictEqual(additionalDriver.data.driverAddressCity, '23')
    assert.deepStrictEqual(additionalDriver.data.driverCountry, 'UK')
    assert.deepStrictEqual(additionalDriver.data.driverHasCard, false)
    assert.strictEqual(additionalDriverRequest.statusCode, 201)

    const additionalDriverPatchRequest = await app.inject({
      method: 'PATCH',
      url: '/customer/driver',
      headers: {
        Authorization: jwt,
      },
      payload: {
        driverID: additionalDriver.data.driverID,
        customerOrgNumber: '5593921082',
        driverExternalNumber: '0943094',
        driverGDPRAccept: true,
        driverISWarrantyDriver: true,
        driverAcceptsMarketing: true,
        driverFirstName: 'Mahan',
        driverLastName: 'Putri',
        driverEmail: 'newGuy.putri@abcinc.com',
        driverPhoneNumber: '1234234',
        driverAddress: '234123',
        driverZipCode: '32112',
        driverAddressCity: '23',
        driverCountry: 'UK',
        driverHasCard: false,
        driverCardNumber: 'XXXX-XXXX-XXXX',
        driverCardValidTo: '2024-12-31',
        driverKeyNumber: 'XXXX',
        driverNotesShared: '',
        driverNotes: '',
      },
    })
    const additionalDriverVendfox = JSON.parse(additionalDriverPatchRequest.body)

    assert.deepStrictEqual(additionalDriverVendfox.driver.customerOrgNumber, '5593921082')
    assert.deepStrictEqual(additionalDriverVendfox.driver.driverExternalNumber, '0943094')
    assert.deepStrictEqual(additionalDriverVendfox.driver.driverGDPRAccept, true)
    assert.deepStrictEqual(additionalDriverVendfox.driver.driverISWarrantyDriver, true)
    assert.deepStrictEqual(additionalDriverVendfox.driver.driverAcceptsMarketing, true)
    assert.deepStrictEqual(additionalDriverVendfox.driver.driverFirstName, 'Mahan')
    assert.deepStrictEqual(additionalDriverVendfox.driver.driverLastName, 'Putri')
    assert.deepStrictEqual(additionalDriverVendfox.driver.driverEmail, 'newGuy.putri@abcinc.com')
    assert.deepStrictEqual(additionalDriverVendfox.driver.driverPhoneNumber, '1234234')
    assert.deepStrictEqual(additionalDriverVendfox.driver.driverAddress, '234123')
    assert.deepStrictEqual(additionalDriverVendfox.driver.driverZipCode, '32112')
    assert.deepStrictEqual(additionalDriverVendfox.driver.driverAddressCity, '23')
    assert.deepStrictEqual(additionalDriverVendfox.driver.driverCountry, 'UK')
    assert.deepStrictEqual(additionalDriverVendfox.driver.driverHasCard, false)
    assert.strictEqual(additionalDriverPatchRequest.statusCode, 201)

    const additionalDriverNoCompanyRequest = await app.inject({
      method: 'PATCH',
      url: '/customer/driver',
      headers: {
        Authorization: jwt,
      },
      payload: {
        driverID: additionalDriver.data.driverID,
        driverExternalNumber: '0943094',
        driverGDPRAccept: true,
        driverISWarrantyDriver: true,
        driverAcceptsMarketing: true,
        driverFirstName: 'Mahan',
        driverLastName: 'Putri',
        driverEmail: 'newGuy.putri@abcinc.com',
        driverPhoneNumber: '1234234',
        driverAddress: '234123',
        driverZipCode: '32112',
        driverAddressCity: '24',
        driverCountry: 'UK',
        driverHasCard: false,
        driverCardNumber: 'XXXX-XXXX-XXXX',
        driverCardValidTo: '2024-12-31',
        driverKeyNumber: 'XXXX',
        driverNotesShared: '',
        driverNotes: '',
      },
    })
    const additionalDriverNoCompany = JSON.parse(additionalDriverNoCompanyRequest.body)

    assert.deepStrictEqual(additionalDriverNoCompany.driver.customerOrgNumber, undefined)
    assert.deepStrictEqual(additionalDriverNoCompany.driver.driverExternalNumber, '0943094')
    assert.deepStrictEqual(additionalDriverNoCompany.driver.driverGDPRAccept, true)
    assert.deepStrictEqual(additionalDriverNoCompany.driver.driverISWarrantyDriver, true)
    assert.deepStrictEqual(additionalDriverNoCompany.driver.driverAcceptsMarketing, true)
    assert.deepStrictEqual(additionalDriverNoCompany.driver.driverFirstName, 'Mahan')
    assert.deepStrictEqual(additionalDriverNoCompany.driver.driverLastName, 'Putri')
    assert.deepStrictEqual(additionalDriverNoCompany.driver.driverEmail, 'newGuy.putri@abcinc.com')
    assert.deepStrictEqual(additionalDriverNoCompany.driver.driverPhoneNumber, '1234234')
    assert.deepStrictEqual(additionalDriverNoCompany.driver.driverAddress, '234123')
    assert.deepStrictEqual(additionalDriverNoCompany.driver.driverZipCode, '32112')
    assert.deepStrictEqual(additionalDriverNoCompany.driver.driverAddressCity, '24')
    assert.deepStrictEqual(additionalDriverNoCompany.driver.driverCountry, 'UK')
    assert.deepStrictEqual(additionalDriverNoCompany.driver.driverHasCard, false)
    assert.strictEqual(additionalDriverNoCompanyRequest.statusCode, 201)

    const privateDriverRequest = await app.inject({
      method: 'POST',
      url: '/customer/driver',
      headers: {
        Authorization: jwt,
      },
      payload: {
        driverGDPRAccept: false,
        driverISWarrantyDriver: true,
        driverAcceptsMarketing: true,
        driverFirstName: 'sdfsdf',
        driverLastName: 'sdf',
        driverEmail: 'newGuy.putri@lulzec.com',
        driverPhoneNumber: '0183212342',
        driverAddress: '234123',
        driverZipCode: '32112',
        driverAddressCity: '24',
        driverCountry: 'AF',
        driverHasCard: false,
        driverCardNumber: 'XXXX-XXXX-XXXX',
        driverCardValidTo: '2025-01-01',
        driverKeyNumber: 'XXXX',
        driverNotesShared: '',
        driverNotes: '',
      },
    })
    const privateDriver = JSON.parse(privateDriverRequest.body)

    assert.deepStrictEqual(privateDriver.data.customerOrgNumber, undefined)
    assert.deepStrictEqual(privateDriver.data.driverGDPRAccept, false)
    assert.deepStrictEqual(privateDriver.data.driverISWarrantyDriver, true)
    assert.deepStrictEqual(privateDriver.data.driverAcceptsMarketing, true)
    assert.deepStrictEqual(privateDriver.data.driverFirstName, 'sdfsdf')
    assert.deepStrictEqual(privateDriver.data.driverLastName, 'sdf')
    assert.deepStrictEqual(privateDriver.data.driverEmail, 'newGuy.putri@lulzec.com')
    assert.deepStrictEqual(privateDriver.data.driverPhoneNumber, '0183212342')
    assert.deepStrictEqual(privateDriver.data.driverAddress, '234123')
    assert.deepStrictEqual(privateDriver.data.driverZipCode, '32112')
    assert.deepStrictEqual(privateDriver.data.driverAddressCity, '24')
    assert.deepStrictEqual(privateDriver.data.driverCountry, 'AF')
    assert.deepStrictEqual(privateDriver.data.driverHasCard, false)
    assert.strictEqual(privateDriverRequest.statusCode, 201)

    const driverGotJobRequest = await app.inject({
      method: 'PATCH',
      url: '/customer/driver',
      headers: {
        Authorization: jwt,
      },
      payload: {
        driverID: privateDriver.data.driverID,
        customerOrgNumber: '5593921082',
        driverGDPRAccept: false,
        driverISWarrantyDriver: true,
        driverAcceptsMarketing: true,
        driverFirstName: 'sdfsdf',
        driverLastName: 'sdf',
        driverEmail: 'newGuy.putri@lulzec.com',
        driverPhoneNumber: '0183212342',
        driverAddress: '234123',
        driverZipCode: '32112',
        driverAddressCity: '23',
        driverCountry: 'AF',
        driverHasCard: false,
        driverCardNumber: 'XXXX-XXXX-XXXX',
        driverCardValidTo: '2025-01-01',
        driverKeyNumber: 'XXXX',
        driverNotesShared: '',
        driverNotes: '',
      },
    })

    const privateDriverGotJob = JSON.parse(driverGotJobRequest.body)

    console.log('privateDriverGotJob')
    console.log('privateDriverGotJob')
    console.log(privateDriverGotJob)
    console.log('privateDriverGotJob')

    assert.deepStrictEqual(privateDriverGotJob.driver.driverID, privateDriver.data.driverID)
    assert.deepStrictEqual(privateDriverGotJob.driver.customerOrgNumber, '5593921082')
    assert.deepStrictEqual(privateDriverGotJob.driver.driverGDPRAccept, false)
    assert.deepStrictEqual(privateDriverGotJob.driver.driverISWarrantyDriver, true)
    assert.deepStrictEqual(privateDriverGotJob.driver.driverAcceptsMarketing, true)
    assert.deepStrictEqual(privateDriverGotJob.driver.driverFirstName, 'sdfsdf')
    assert.deepStrictEqual(privateDriverGotJob.driver.driverLastName, 'sdf')
    assert.deepStrictEqual(privateDriverGotJob.driver.driverEmail, 'newGuy.putri@lulzec.com')
    assert.deepStrictEqual(privateDriverGotJob.driver.driverPhoneNumber, '0183212342')
    assert.deepStrictEqual(privateDriverGotJob.driver.driverAddress, '234123')
    assert.deepStrictEqual(privateDriverGotJob.driver.driverZipCode, '32112')
    assert.deepStrictEqual(privateDriverGotJob.driver.driverAddressCity, '23')
    assert.deepStrictEqual(privateDriverGotJob.driver.driverCountry, 'AF')
    assert.deepStrictEqual(privateDriverGotJob.driver.driverHasCard, false)
    assert.strictEqual(privateDriverRequest.statusCode, 201)
  })
})
