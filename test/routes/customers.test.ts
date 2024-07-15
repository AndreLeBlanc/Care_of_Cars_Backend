//import { FastifyInstance } from 'fastify'
//
//import { after, before, describe, it } from 'node:test'
//import { buildApp } from '../../src/app.js'
//
//import assert from 'assert'
//
//describe('Customer Route', () => {
//  let app: FastifyInstance
//
//  before(async () => {
//    app = await buildApp({ logger: false })
//  })
//
//  after(async () => {
//    await app.close()
//  })
//  it('', async () => {
//    const request = await app.inject({
//      method: 'POST',
//      url: '/customer',
//      payload: {
//        companyOrgNumber: '123456',
//        companyName: 'ABC INC',
//        companyReference: 'XYZ',
//        companyEmail: 'admin@abcinc.com',
//        companyPhoneNumber: '12345678',
//        companyAddress: 'Some Road, Some Where',
//        companyZipCode: '74934',
//        companyAddressCity: 'LOK',
//        companyCountry: 'IN',
//        driverExternalNumber: '0943094',
//        driverGDPRAccept: true,
//        driverISWarrantyDriver: true,
//        driverAcceptsMarketing: true,
//        driverFirstName: 'Mahan',
//        driverLastName: 'Putri',
//        driverEmail: 'mahan.putri@abcinc.com',
//        driverPhoneNumber: '12345678',
//        driverAddress: 'smae',
//        driverZipCode: 'sae',
//        driverAddressCity: '23',
//        driverCountry: 'SW',
//        driverHasCard: true,
//        driverCardNumber: 'XXXX-XXXX-XXXX',
//        driverCardValidTo: '2024-04-18T10:46:53Z',
//        driverKeyNumber: 'XXXX',
//        driverNotesShared: 'some note!',
//        driverNotes: 'some note!',
//      },
//    })
//
//    const response = {
//      message: 'company / driver created',
//      data: {
//        company: {
//          companyOrgNumber: '123456',
//          companyName: 'ABC INC',
//          companyReference: 'XYZ',
//          companyEmail: 'admin@abcinc.com',
//          companyPhoneNumber: '12345678',
//          companyAddress: 'Some Road, Some Where',
//          companyZipCode: '74934',
//          companyAddressCity: 'LOK',
//          companyCountry: 'IN',
//          createdAt: '2024-04-18T10:56:45.437Z',
//          updatedAt: '2024-04-18T10:56:45.437Z',
//        },
//        driver: {
//          companyOrgNumber: '123456',
//          driverExternalNumber: '0943094',
//          driverGDPRAccept: true,
//          driverISWarrantyDriver: true,
//          driverAcceptsMarketing: true,
//          driverFirstName: 'Mahan',
//          driverLastName: 'Putri',
//          driverEmail: 'mahan.putri@abcinc.com',
//          driverPhoneNumber: '12345678',
//          driverAddress: 'smae',
//          driverZipCode: 'sae',
//          driverAddressCity: '23',
//          driverCountry: 'SW',
//          driverHasCard: true,
//          driverCardNumber: 'XXXX-XXXX-XXXX',
//          driverCardValidTo: '2024-04-18T10:46:53Z',
//          driverKeyNumber: 'XXXX',
//          driverNotesShared: 'some note!',
//          driverNotes: 'some note!',
//          createdAt: '2024-04-18T10:56:45.440Z',
//          updatedAt: '2024-04-18T10:56:45.440Z',
//        },
//      },
//    }
//    const parsedResponse = JSON.parse(request.body)
//    assert.equal(parsedResponse.message, 'company / driver created')
//    assert.deepStrictEqual(parsedResponse.data.driver, response.data.driver)
//    assert.strictEqual(request.statusCode, 201)
//  })
//})
//
//// This is not completed, will continue this once customer routes is completed....
//
