import { FastifyInstance } from 'fastify'
import {
  CreateCustomerType,
  CreateDriverType,
  PatchCompanyType,
  PatchDriverType,
  addCustomerBody,
  addDriverBody,
  getCompanyByOrgNumber,
  getCompanyByOrgNumberType,
  getDriverByEmail,
  getDriverByEmailType,
  patchCompanyBody,
  patchDriverBody,
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
  editCompanyDetails,
  deleteCompany,
  Driver,
  Company,
  deleteDriver,
  // DriverCreate,
  editDriverDetails,
  createNewDriver,
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
            company: Company
            driver: Driver
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
      const editedCompany: Company | undefined = await editCompanyDetails(companyDetails)

      reply.status(201).send({
        message: 'Company details edited',
        editedCompany,
      })
    },
  )

  //Delete Company and drivers
  fastify.delete<{ Params: getCompanyByOrgNumberType }>(
    '/:orgNumber',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_driver')
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

  /**
   * -----------------
   * DRIVERS
   * -----------------
   * */

  //Create Private Driver
  fastify.post<{ Body: CreateDriverType; Reply: object }>(
    '/driver',
    {
      preHandler: async (request, reply, done) => {
        console.log(request.user)
        fastify.authorize(request, reply, PermissionTitle('create_customer'))
        done()
        return reply
      },
      schema: {
        body: addDriverBody,
      },
    },
    async (req, rep) => {
      const {
        companyOrgNumber,
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

      const driverDetails = {
        customerOrgNumber: CustomerOrgNumber(companyOrgNumber),
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

      const createdDriver: Driver | undefined = await createNewDriver(driverDetails)
      return rep.status(201).send({
        message: 'Driver Created',
        data: createdDriver,
      })
    },
  )

  //edit driver
  fastify.patch<{ Body: PatchDriverType; Reply: object }>(
    '/driver',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('update_driver')
        fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        body: patchDriverBody,
      },
    },
    async (request, reply) => {
      const {
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
      } = request.body

      const driverDetails = {
        driverExternalNumber: driverExternalNumber
          ? DriverExternalNumber(driverExternalNumber)
          : undefined,
        driverGDPRAccept: driverGDPRAccept ? DriverGDPRAccept(driverGDPRAccept) : undefined,
        driverISWarrantyDriver: driverISWarrantyDriver
          ? DriverISWarrantyCustomer(driverISWarrantyDriver)
          : undefined,
        driverAcceptsMarketing: driverAcceptsMarketing
          ? DriverAcceptsMarketing(driverAcceptsMarketing)
          : undefined,
        driverFirstName: driverFirstName ? DriverFirstName(driverFirstName) : undefined,
        driverLastName: driverLastName ? DriverLastName(driverLastName) : undefined,
        driverEmail: driverLastName ? DriverEmail(driverEmail) : undefined,
        driverPhoneNumber: driverPhoneNumber ? DriverPhoneNumber(driverPhoneNumber) : undefined,
        driverAddress: driverAddress ? DriverAddress(driverAddress) : undefined,
        driverZipCode: driverZipCode ? DriverZipCode(driverZipCode) : undefined,
        driverAddressCity: driverAddressCity ? DriverAddressCity(driverAddressCity) : undefined,
        driverHasCard: driverHasCard ? DriverHasCard(driverHasCard) : undefined,
        driverCardValidTo: driverCardValidTo
          ? DriverCardValidTo(new Date(driverCardValidTo))
          : undefined,
        driverCardNumber: driverCardNumber ? CustomerCardNumber(driverCardNumber) : undefined,
        driverKeyNumber: driverKeyNumber ? DriverKeyNumber(driverKeyNumber) : undefined,
        driverNotesShared: driverNotesShared ? DriverNotesShared(driverNotesShared) : undefined,
        driverNotes: driverNotes ? DriverNotes(driverNotes) : undefined,
        driverCountry: driverCountry ? DriverCountry(driverCountry) : undefined,
      }
      const editedCompany: Driver | undefined =
        //@ts-ignore //@Andre Please check
        await editDriverDetails(driverDetails)

      reply.status(201).send({
        message: 'Driver details edited',
        editedCompany,
      })
    },
  )

  //delete driver
  fastify.delete<{ Params: getDriverByEmailType }>(
    '/driver/:driverEmail',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_company')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: getDriverByEmail,
      },
    },
    async (request, reply) => {
      const { driverEmail } = request.params
      const deletedDriver: DriverEmail | undefined = await deleteDriver(DriverEmail(driverEmail))
      if (deletedDriver == null) {
        return reply.status(404).send({ message: "Driver doesn't exist!" })
      }
      return reply
        .status(200)
        .send({ message: 'Driver deleted', deletedDriverEmail: deletedDriver })
    },
  )
}

export default customers
