import { FastifyInstance } from 'fastify'
import customersConfig from './customers.config.js'
import { CreateCustomerType, addCustomerBody } from './customerSchema.js'
import { PermissionTitle } from '../../services/permissionService.js'
import { createCompany, CustomerOrgNumber,
  CustomerCompanyName,
  CompanyReference,
  CompanyAddress,
  CompanyZipCode,
  CompanyAddressCity,
  CompanyCountry } from '../../services/customerService.js',

export const customers = async (fastify: FastifyInstance) => {
  //Create Customers
  fastify.post<{ Body: CreateCustomerType; Reply: object }>(
    customersConfig.endpoints.v1.createCustomer,
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, PermissionTitle('create_customer'))
        done()
        return reply
      },
      schema: {
        body: addCustomerBody,
        response: {
          201: {},
        },
      },
    },
    async (req, rep) => {
      const { body } = req

      const {
        customerOrgNumber,
        customerCompanyName,
        companyAddress,
        companyAddressCity,
        companyCountry,
        companyZipCode,
        companyReference,
        driverExternalNumber,
        driverGDPRAccept,
        driverISWarrantyDriver,
        driverAcceptsMarketing,
        driverFirstName,
        driverLastName,
        driverEmail,
        driverPhoneNumber,
        driverAddress,
        driverZipCode,
        driverAddressCity,
        driverCountry,
        driverHasCard,
        driverCardNumber,
        driverCardValidTo,
        driverKeyNumber,
        driverNotesShared,
        driverNotes,
      } = body

      const companyDetails = {
        customerOrgNumber: CustomerOrgNumber(customerOrgNumber),
        customerCompanyName: CustomerCompanyName(customerCompanyName),
        companyReference: CompanyReference(companyReference),
        companyAddress: CompanyAddress(companyAddress),
        companyZipCode: CompanyZipCode(companyZipCode),
        companyAddressCity: CompanyAddressCity(companyAddressCity),
        companyCountry: CompanyCountry(companyCountry)}

      const driverDetails = {
        driverExternalNumber,
        driverGDPRAccept,
        driverISWarrantyDriver,
        driverAcceptsMarketing,
        driverFirstName,
        driverLastName,
        driverEmail,
        driverPhoneNumber,
        driverAddress,
        driverZipCode,
        driverAddressCity,
        driverCountry,
        driverHasCard,
        driverCardNumber,
        driverCardValidTo,
        driverKeyNumber,
        driverNotesShared,
        driverNotes,
      }
      const returnValue = await createCompany(companyDetails, driverDetails)
      rep.status(201).send(returnValue)
    },
  )
}

export default customers
