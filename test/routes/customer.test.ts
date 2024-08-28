import { FastifyInstance } from 'fastify'

import { after, before, describe, it } from 'node:test'
import { buildApp } from '../../src/app.js'
import { initDrizzle } from '../../src/config/db-connect.js'

import assert, { deepStrictEqual } from 'assert'

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
        customerOrgNumber: '409852',
        customerCompanyName: 'volvo AB',
        companyReference: 'XYZ',
        companyPhone: '60042343534',
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
        driverEmail: 'mahan.bani@abcinc.com',
        driverPhoneNumber: '64920123532',
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
          customerOrgNumber: '409852',
          customerCompanyName: 'volvo AB',
          companyReference: 'XYZ',
          companyEmail: 'admin@abcinc.com',
          companyPhone: '64920123532',
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
          driverEmail: 'mahan.bani@abcinc.com',
          driverPhoneNumber: '64920123532',
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

    deepStrictEqual(parsedResponse.data.company.customerOrgNumber, '409852')
    deepStrictEqual(parsedResponse.data.company.customerCompanyName, 'volvo AB')
    deepStrictEqual(parsedResponse.data.company.companyEmail, 'admin@abcinc.com')
    deepStrictEqual(parsedResponse.data.company.companyPhone, '60042343534')
    deepStrictEqual(parsedResponse.data.company.companyAddress, 'Some Road, Some Where')
    deepStrictEqual(parsedResponse.data.company.companyZipCode, '74934')
    deepStrictEqual(parsedResponse.data.company.companyAddressCity, 'LOK')
    deepStrictEqual(parsedResponse.data.company.companyCountry, 'IN')

    deepStrictEqual(
      parsedResponse.data.driver.driverExternalNumber,
      response.data.driver.driverExternalNumber,
    )
    assert(parsedResponse.data.driver.driverID != null)
    deepStrictEqual(
      parsedResponse.data.driver.driverGDPRAccept,
      response.data.driver.driverGDPRAccept,
    )
    deepStrictEqual(
      parsedResponse.data.driver.driverISWarrantyDriver,
      response.data.driver.driverISWarrantyDriver,
    )
    deepStrictEqual(
      parsedResponse.data.driver.driverAcceptsMarketing,
      response.data.driver.driverAcceptsMarketing,
    )
    deepStrictEqual(
      parsedResponse.data.driver.driverFirstName,
      response.data.driver.driverFirstName,
    )
    deepStrictEqual(parsedResponse.data.driver.driverLastName, response.data.driver.driverLastName)
    deepStrictEqual(parsedResponse.data.driver.driverEmail, response.data.driver.driverEmail)
    deepStrictEqual(
      parsedResponse.data.driver.driverPhoneNumber,
      response.data.driver.driverPhoneNumber,
    )
    deepStrictEqual(parsedResponse.data.driver.driverAddress, response.data.driver.driverAddress)
    deepStrictEqual(parsedResponse.data.driver.driverZipCode, response.data.driver.driverZipCode)
    deepStrictEqual(
      parsedResponse.data.driver.driverAddressCity,
      response.data.driver.driverAddressCity,
    )
    deepStrictEqual(parsedResponse.data.driver.driverCountry, response.data.driver.driverCountry)
    deepStrictEqual(parsedResponse.data.driver.driverHasCard, response.data.driver.driverHasCard)
    deepStrictEqual(request.statusCode, 201)

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

    deepStrictEqual(parsedPostResponse.data.company.customerOrgNumber, '5593921082')
    deepStrictEqual(parsedPostResponse.data.company.customerCompanyName, 'Vendfox solutions ab')
    deepStrictEqual(parsedPostResponse.data.company.companyEmail, 'andre@vendfox.com')
    deepStrictEqual(parsedPostResponse.data.company.companyPhone, '0762757764')
    deepStrictEqual(parsedPostResponse.data.company.companyAddress, 'Norrtäljegatan 15a')
    deepStrictEqual(parsedPostResponse.data.company.companyZipCode, '75327')
    deepStrictEqual(parsedPostResponse.data.company.companyAddressCity, 'Uppsala')
    deepStrictEqual(parsedPostResponse.data.company.companyCountry, 'SWeden')

    deepStrictEqual(
      parsedPostResponse.data.driver.driverExternalNumber,
      expectedResponse.data.driver.driverExternalNumber,
    )
    deepStrictEqual(
      parsedPostResponse.data.driver.driverGDPRAccept,
      expectedResponse.data.driver.driverGDPRAccept,
    )
    deepStrictEqual(
      parsedPostResponse.data.driver.driverISWarrantyDriver,
      expectedResponse.data.driver.driverISWarrantyDriver,
    )
    deepStrictEqual(
      parsedPostResponse.data.driver.driverAcceptsMarketing,
      expectedResponse.data.driver.driverAcceptsMarketing,
    )
    deepStrictEqual(
      parsedPostResponse.data.driver.driverFirstName,
      expectedResponse.data.driver.driverFirstName,
    )
    deepStrictEqual(
      parsedPostResponse.data.driver.driverLastName,
      expectedResponse.data.driver.driverLastName,
    )
    deepStrictEqual(
      parsedPostResponse.data.driver.driverEmail,
      expectedResponse.data.driver.driverEmail,
    )
    deepStrictEqual(
      parsedPostResponse.data.driver.driverPhoneNumber,
      expectedResponse.data.driver.driverPhoneNumber,
    )
    deepStrictEqual(
      parsedPostResponse.data.driver.driverAddress,
      expectedResponse.data.driver.driverAddress,
    )
    deepStrictEqual(
      parsedPostResponse.data.driver.driverZipCode,
      expectedResponse.data.driver.driverZipCode,
    )
    deepStrictEqual(
      parsedPostResponse.data.driver.driverAddressCity,
      expectedResponse.data.driver.driverAddressCity,
    )
    deepStrictEqual(
      parsedPostResponse.data.driver.driverCountry,
      expectedResponse.data.driver.driverCountry,
    )
    deepStrictEqual(
      parsedPostResponse.data.driver.driverHasCard,
      expectedResponse.data.driver.driverHasCard,
    )
    deepStrictEqual(postResponse.statusCode, 201)

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

    deepStrictEqual(parsedPatchResponse.comp.customerOrgNumber, '5593921082')
    deepStrictEqual(parsedPatchResponse.comp.customerCompanyName, 'Vendfox solutions AB')
    deepStrictEqual(parsedPatchResponse.comp.companyEmail, 'andre.leblanc@zoho.com')
    deepStrictEqual(parsedPatchResponse.comp.companyPhone, '0762757764')
    deepStrictEqual(parsedPatchResponse.comp.companyAddress, 'köpmangatan')
    deepStrictEqual(parsedPatchResponse.comp.companyZipCode, '75323')
    deepStrictEqual(parsedPatchResponse.comp.companyAddressCity, 'Stockholm')
    deepStrictEqual(parsedPatchResponse.comp.companyCountry, 'Sweden')

    const getResponse = await app.inject({
      method: 'GET',
      url: '/customer/409852',
      headers: {
        Authorization: jwt,
      },
    })

    const parsedgetResponse = JSON.parse(getResponse.body)

    deepStrictEqual(parsedgetResponse.comp.customerOrgNumber, '409852')
    deepStrictEqual(parsedgetResponse.comp.customerCompanyName, 'volvo AB')
    deepStrictEqual(parsedgetResponse.comp.companyEmail, 'admin@abcinc.com')
    deepStrictEqual(parsedgetResponse.comp.companyPhone, '60042343534')
    deepStrictEqual(parsedgetResponse.comp.companyAddress, 'Some Road, Some Where')
    deepStrictEqual(parsedgetResponse.comp.companyZipCode, '74934')
    deepStrictEqual(parsedgetResponse.comp.companyAddressCity, 'LOK')
    deepStrictEqual(parsedgetResponse.comp.companyCountry, 'IN')

    const getResponse2 = await app.inject({
      method: 'GET',
      url: '/customer/5593921082',
      headers: {
        Authorization: jwt,
      },
    })

    const parsedgetResponse2 = JSON.parse(getResponse2.body)

    deepStrictEqual(parsedgetResponse2.comp.customerOrgNumber, '5593921082')
    deepStrictEqual(parsedgetResponse2.comp.customerCompanyName, 'Vendfox solutions AB')
    deepStrictEqual(parsedgetResponse2.comp.companyEmail, 'andre.leblanc@zoho.com')
    deepStrictEqual(parsedgetResponse2.comp.companyPhone, '0762757764')
    deepStrictEqual(parsedgetResponse2.comp.companyAddress, 'köpmangatan')
    deepStrictEqual(parsedgetResponse2.comp.companyZipCode, '75323')
    deepStrictEqual(parsedgetResponse2.comp.companyAddressCity, 'Stockholm')
    deepStrictEqual(parsedgetResponse2.comp.companyCountry, 'Sweden')

    const additionalDriverRequest = await app.inject({
      method: 'POST',
      url: '/customer/driver',
      headers: {
        Authorization: jwt,
      },
      payload: {
        customerOrgNumber: '409852',
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

    deepStrictEqual(additionalDriver.data.customerOrgNumber, '409852')
    deepStrictEqual(additionalDriver.data.driverExternalNumber, '0943094')
    deepStrictEqual(additionalDriver.data.driverGDPRAccept, true)
    deepStrictEqual(additionalDriver.data.driverISWarrantyDriver, true)
    deepStrictEqual(additionalDriver.data.driverAcceptsMarketing, true)
    deepStrictEqual(additionalDriver.data.driverFirstName, 'Mahan')
    deepStrictEqual(additionalDriver.data.driverLastName, 'Putri')
    deepStrictEqual(additionalDriver.data.driverEmail, 'newGuy.putri@abcinc.com')
    assert.notEqual(additionalDriver.data.driverID, null)
    assert(additionalDriver.data.driverID > 0)
    deepStrictEqual(additionalDriver.data.driverPhoneNumber, '1234234')
    deepStrictEqual(additionalDriver.data.driverAddress, '234123')
    deepStrictEqual(additionalDriver.data.driverZipCode, '32112')
    deepStrictEqual(additionalDriver.data.driverAddressCity, '23')
    deepStrictEqual(additionalDriver.data.driverCountry, 'UK')
    deepStrictEqual(additionalDriver.data.driverHasCard, false)
    deepStrictEqual(additionalDriverRequest.statusCode, 201)

    const additionalDriverGetRequest = await app.inject({
      method: 'GET',
      url: '/customer/driver/' + additionalDriver.data.driverID,
      headers: {
        Authorization: jwt,
      },
    })
    const ParsedadditionalDriverGetRequest = JSON.parse(additionalDriverGetRequest.body)

    deepStrictEqual(ParsedadditionalDriverGetRequest.driver.customerOrgNumber, '409852')
    deepStrictEqual(ParsedadditionalDriverGetRequest.driver.driverExternalNumber, '0943094')
    deepStrictEqual(ParsedadditionalDriverGetRequest.driver.driverGDPRAccept, true)
    deepStrictEqual(ParsedadditionalDriverGetRequest.driver.driverISWarrantyDriver, true)
    deepStrictEqual(ParsedadditionalDriverGetRequest.driver.driverAcceptsMarketing, true)
    deepStrictEqual(ParsedadditionalDriverGetRequest.driver.driverFirstName, 'Mahan')
    deepStrictEqual(ParsedadditionalDriverGetRequest.driver.driverLastName, 'Putri')
    deepStrictEqual(ParsedadditionalDriverGetRequest.driver.driverEmail, 'newGuy.putri@abcinc.com')
    assert.notEqual(ParsedadditionalDriverGetRequest.driver.driverID, null)
    assert(ParsedadditionalDriverGetRequest.driver.driverID > 0)
    deepStrictEqual(ParsedadditionalDriverGetRequest.driver.driverPhoneNumber, '1234234')
    deepStrictEqual(ParsedadditionalDriverGetRequest.driver.driverAddress, '234123')
    deepStrictEqual(ParsedadditionalDriverGetRequest.driver.driverZipCode, '32112')
    deepStrictEqual(ParsedadditionalDriverGetRequest.driver.driverAddressCity, '23')
    deepStrictEqual(ParsedadditionalDriverGetRequest.driver.driverCountry, 'UK')
    deepStrictEqual(ParsedadditionalDriverGetRequest.driver.driverHasCard, false)
    deepStrictEqual(additionalDriverGetRequest.statusCode, 200)

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

    deepStrictEqual(additionalDriverVendfox.driver.customerOrgNumber, '5593921082')
    deepStrictEqual(additionalDriverVendfox.driver.driverExternalNumber, '0943094')
    deepStrictEqual(additionalDriverVendfox.driver.driverGDPRAccept, true)
    deepStrictEqual(additionalDriverVendfox.driver.driverISWarrantyDriver, true)
    deepStrictEqual(additionalDriverVendfox.driver.driverAcceptsMarketing, true)
    deepStrictEqual(additionalDriverVendfox.driver.driverFirstName, 'Mahan')
    deepStrictEqual(additionalDriverVendfox.driver.driverLastName, 'Putri')
    deepStrictEqual(additionalDriverVendfox.driver.driverEmail, 'newGuy.putri@abcinc.com')
    deepStrictEqual(additionalDriverVendfox.driver.driverPhoneNumber, '1234234')
    deepStrictEqual(additionalDriverVendfox.driver.driverAddress, '234123')
    deepStrictEqual(additionalDriverVendfox.driver.driverZipCode, '32112')
    deepStrictEqual(additionalDriverVendfox.driver.driverAddressCity, '23')
    deepStrictEqual(additionalDriverVendfox.driver.driverCountry, 'UK')
    deepStrictEqual(additionalDriverVendfox.driver.driverHasCard, false)
    deepStrictEqual(additionalDriverPatchRequest.statusCode, 201)

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

    deepStrictEqual(additionalDriverNoCompany.driver.customerOrgNumber, undefined)
    deepStrictEqual(additionalDriverNoCompany.driver.driverExternalNumber, '0943094')
    deepStrictEqual(additionalDriverNoCompany.driver.driverGDPRAccept, true)
    deepStrictEqual(additionalDriverNoCompany.driver.driverISWarrantyDriver, true)
    deepStrictEqual(additionalDriverNoCompany.driver.driverAcceptsMarketing, true)
    deepStrictEqual(additionalDriverNoCompany.driver.driverFirstName, 'Mahan')
    deepStrictEqual(additionalDriverNoCompany.driver.driverLastName, 'Putri')
    deepStrictEqual(additionalDriverNoCompany.driver.driverEmail, 'newGuy.putri@abcinc.com')
    deepStrictEqual(additionalDriverNoCompany.driver.driverPhoneNumber, '1234234')
    deepStrictEqual(additionalDriverNoCompany.driver.driverAddress, '234123')
    deepStrictEqual(additionalDriverNoCompany.driver.driverZipCode, '32112')
    deepStrictEqual(additionalDriverNoCompany.driver.driverAddressCity, '24')
    deepStrictEqual(additionalDriverNoCompany.driver.driverCountry, 'UK')
    deepStrictEqual(additionalDriverNoCompany.driver.driverHasCard, false)
    deepStrictEqual(additionalDriverNoCompanyRequest.statusCode, 201)

    const additionalDriverNoCompanyGetRequest = await app.inject({
      method: 'GET',
      url: '/customer/driver/' + additionalDriverNoCompany.driver.driverID,
      headers: {
        Authorization: jwt,
      },
    })
    const ParsedadditionalDriverNoCompanyGetRequest = JSON.parse(
      additionalDriverNoCompanyGetRequest.body,
    )
    deepStrictEqual(ParsedadditionalDriverNoCompanyGetRequest.driver.customerOrgNumber, undefined)
    deepStrictEqual(
      ParsedadditionalDriverNoCompanyGetRequest.driver.driverExternalNumber,
      '0943094',
    )
    deepStrictEqual(ParsedadditionalDriverNoCompanyGetRequest.driver.driverGDPRAccept, true)
    deepStrictEqual(ParsedadditionalDriverNoCompanyGetRequest.driver.driverISWarrantyDriver, true)
    deepStrictEqual(ParsedadditionalDriverNoCompanyGetRequest.driver.driverAcceptsMarketing, true)
    deepStrictEqual(ParsedadditionalDriverNoCompanyGetRequest.driver.driverFirstName, 'Mahan')
    deepStrictEqual(ParsedadditionalDriverNoCompanyGetRequest.driver.driverLastName, 'Putri')
    deepStrictEqual(
      ParsedadditionalDriverNoCompanyGetRequest.driver.driverEmail,
      'newGuy.putri@abcinc.com',
    )
    deepStrictEqual(ParsedadditionalDriverNoCompanyGetRequest.driver.driverPhoneNumber, '1234234')
    deepStrictEqual(ParsedadditionalDriverNoCompanyGetRequest.driver.driverAddress, '234123')
    deepStrictEqual(ParsedadditionalDriverNoCompanyGetRequest.driver.driverZipCode, '32112')
    deepStrictEqual(ParsedadditionalDriverNoCompanyGetRequest.driver.driverAddressCity, '24')
    deepStrictEqual(ParsedadditionalDriverNoCompanyGetRequest.driver.driverCountry, 'UK')
    deepStrictEqual(ParsedadditionalDriverNoCompanyGetRequest.driver.driverHasCard, false)
    deepStrictEqual(additionalDriverNoCompanyGetRequest.statusCode, 200)

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

    deepStrictEqual(privateDriver.data.customerOrgNumber, undefined)
    deepStrictEqual(privateDriver.data.driverGDPRAccept, false)
    deepStrictEqual(privateDriver.data.driverISWarrantyDriver, true)
    deepStrictEqual(privateDriver.data.driverAcceptsMarketing, true)
    deepStrictEqual(privateDriver.data.driverFirstName, 'sdfsdf')
    deepStrictEqual(privateDriver.data.driverLastName, 'sdf')
    deepStrictEqual(privateDriver.data.driverEmail, 'newGuy.putri@lulzec.com')
    deepStrictEqual(privateDriver.data.driverPhoneNumber, '0183212342')
    deepStrictEqual(privateDriver.data.driverAddress, '234123')
    deepStrictEqual(privateDriver.data.driverZipCode, '32112')
    deepStrictEqual(privateDriver.data.driverAddressCity, '24')
    deepStrictEqual(privateDriver.data.driverCountry, 'AF')
    deepStrictEqual(privateDriver.data.driverHasCard, false)
    deepStrictEqual(privateDriverRequest.statusCode, 201)

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

    deepStrictEqual(privateDriverGotJob.driver.driverID, privateDriver.data.driverID)
    deepStrictEqual(privateDriverGotJob.driver.customerOrgNumber, '5593921082')
    deepStrictEqual(privateDriverGotJob.driver.driverGDPRAccept, false)
    deepStrictEqual(privateDriverGotJob.driver.driverISWarrantyDriver, true)
    deepStrictEqual(privateDriverGotJob.driver.driverAcceptsMarketing, true)
    deepStrictEqual(privateDriverGotJob.driver.driverFirstName, 'sdfsdf')
    deepStrictEqual(privateDriverGotJob.driver.driverLastName, 'sdf')
    deepStrictEqual(privateDriverGotJob.driver.driverEmail, 'newGuy.putri@lulzec.com')
    deepStrictEqual(privateDriverGotJob.driver.driverPhoneNumber, '0183212342')
    deepStrictEqual(privateDriverGotJob.driver.driverAddress, '234123')
    deepStrictEqual(privateDriverGotJob.driver.driverZipCode, '32112')
    deepStrictEqual(privateDriverGotJob.driver.driverAddressCity, '23')
    deepStrictEqual(privateDriverGotJob.driver.driverCountry, 'AF')
    deepStrictEqual(privateDriverGotJob.driver.driverHasCard, false)
    deepStrictEqual(privateDriverRequest.statusCode, 201)
  })
})
