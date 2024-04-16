import { FastifyInstance } from 'fastify'
import { CreateCustomerType, addCustomerBody } from './customerSchema.js'
import { PermissionTitle } from '../../services/permissionService.js'
import {
  createCompany,
  CustomerOrgNumber,
  CustomerCompanyName,
  CompanyReference,
  CompanyAddress,
  CompanyZipCode,
  CompanyAddressCity,
  CompanyCountry,
  DriverExternalNumber,
  DriverGDPRAccept,
  DriverISWarrantyCustomer,
  DriverAcceptsMarketing,
  DriverFirstName,
  DriverLastName,
  DriverEmail,
  DriverPhoneNumber,
  DriverAddress,
  DriverZipCode,
  DriverAddressCity,
  DriverCountry,
  DriverHasCard,
  DriverCardValidTo,
  CustomerCardNumber,
  DriverKeyNumber,
  DriverNotesShared,
  DriverNotes,
} from '../../services/customerService.js'

export const customers = async (fastify: FastifyInstance) => {
  //Create Customers
  fastify.post<{ Body: CreateCustomerType; Reply: object }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, PermissionTitle('create_customer'))
        done()
        return reply
      },
      schema: {
        body: addCustomerBody,
      },
    },
    async (req, rep) => {
      const { body } = req

      const {
        companyOrgNumber,
        companyName,
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
        customerOrgNumber: CustomerOrgNumber(companyOrgNumber),
        customerCompanyName: CustomerCompanyName(companyName),
        companyReference: CompanyReference(companyReference),
        companyAddress: CompanyAddress(companyAddress),
        companyZipCode: CompanyZipCode(companyZipCode),
        companyAddressCity: CompanyAddressCity(companyAddressCity),
        companyCountry: CompanyCountry(companyCountry),
      }

      const driverDetails = {
        driverExternalNumber: DriverExternalNumber(driverExternalNumber),
        driverGDPRAccept: DriverGDPRAccept(driverGDPRAccept),
        driverISWarrantyDriver: DriverISWarrantyCustomer(driverISWarrantyDriver),
        driverAcceptsMarketing: DriverAcceptsMarketing(driverAcceptsMarketing),
        driverFirstName: DriverFirstName(driverFirstName),
        driverLastName: DriverLastName(driverLastName),
        driverEmail: DriverEmail(driverEmail),
        driverPhoneNumber: DriverPhoneNumber(driverPhoneNumber),
        driverAddress: DriverAddress(driverAddress),
        driverZipCode: DriverZipCode(driverZipCode),
        driverAddressCity: DriverAddressCity(driverAddressCity),
        driverHasCard: DriverHasCard(driverHasCard),
        driverCardValidTo: DriverCardValidTo(driverCardValidTo as any),
        driverCardNumber: CustomerCardNumber(driverCardNumber),
        driverKeyNumber: DriverKeyNumber(driverKeyNumber),
        driverNotesShared: DriverNotesShared(driverNotesShared),
        driverNotes: DriverNotes(driverNotes),
        driverCountry: DriverCountry(driverCountry),
      }
      const returnValue = await createCompany(companyDetails, driverDetails)
      return rep.status(201).send({
        message: 'company added',
        ...returnValue,
      })
    },
  )
}

export default customers
