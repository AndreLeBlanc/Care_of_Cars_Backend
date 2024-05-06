import { FastifyInstance } from 'fastify'
import {
  CreateCustomerType,
  PatchCompanyType,
  addCustomerBody,
  getCompanyByOrgNumber,
  getCompanyByOrgNumberType,
  patchCompanyBody,
} from './customerSchema.js'
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
  CustomerCompanyCreate,
  DriverCreate,
  editCompanyDetails,
  deleteCompany,
} from '../../services/customerService.js'

export const customers = async (fastify: FastifyInstance) => {
  //Create Customers
  fastify.post<{ Body: CreateCustomerType; Reply: object }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('create_customer'))
        done()
        return reply
      },
      schema: {
        body: addCustomerBody,
      },
    },
    async (req, rep) => {
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
      } = req.body

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
        driverCardValidTo: DriverCardValidTo(new Date(driverCardValidTo)),
        driverCardNumber: CustomerCardNumber(driverCardNumber),
        driverKeyNumber: DriverKeyNumber(driverKeyNumber),
        driverNotesShared: DriverNotesShared(driverNotesShared),
        driverNotes: DriverNotes(driverNotes),
        driverCountry: DriverCountry(driverCountry),
      }

      const createdDriver:
        | {
            company: CustomerCompanyCreate
            driver: DriverCreate
          }
        | undefined = await createCompany(companyDetails, driverDetails)
      return rep.status(201).send({
        message: 'company / driver created',
        data: createdDriver,
      })
    },
  )

  //edit company
  fastify.patch<{ Body: PatchCompanyType; Reply: object }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('update_company')
        fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        body: patchCompanyBody,
      },
    },
    async (request, reply) => {
      const {
        customerOrgNumber,
        customerCompanyName,
        companyAddress,
        companyAddressCity,
        companyCountry,
        companyZipCode,
      } = request.body
      const companyDetails: CustomerCompanyCreate = {
        customerOrgNumber: CustomerOrgNumber(customerOrgNumber),
        customerCompanyName: CustomerCompanyName(customerCompanyName),
        companyAddress: companyAddress ? CompanyAddress(companyAddress) : undefined,
        companyZipCode: companyZipCode ? CompanyZipCode(companyZipCode) : undefined,
        companyAddressCity: companyAddressCity ? CompanyAddressCity(companyAddressCity) : undefined,
        companyCountry: companyCountry ? CompanyCountry(companyCountry) : undefined,
      }
      const editedDriver = await editCompanyDetails(companyDetails)

      reply.status(201).send({
        message: 'Company details edited',
        editedDriver,
      })
    },
  )

  //Delete Company and drivers
  fastify.delete<{ Params: getCompanyByOrgNumberType }>(
    '/:orgNumber',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_company')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: getCompanyByOrgNumber,
      },
    },
    async (request, reply) => {
      const { orgNumber } = request.params
      const deletedCompany: CustomerOrgNumber | undefined = await deleteCompany(
        CustomerOrgNumber(orgNumber),
      )
      if (deletedCompany == null) {
        return reply.status(404).send({ message: "Company doesn't exist!" })
      }
      return reply.status(200).send({ message: 'Company deleted', orgNumber: deletedCompany })
    },
  )
}

export default customers
