import { FastifyInstance } from 'fastify'

import {
  CreateCustomerType,
  CreateDriverType,
  ListCustomersQueryParamSchema,
  ListCustomersQueryParamSchemaType,
  ListDriversCompanyQueryParamSchema,
  ListDriversCompanyQueryParamSchemaType,
  ListDriversQueryParamSchema,
  ListDriversQueryParamSchemaType,
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
  CompanyAddress,
  CompanyAddressCity,
  CompanyCountry,
  CompanyReference,
  CompanyZipCode,
  CustomerCardNumber,
  CustomerCompanyCreate,
  CustomerCompanyName,
  CustomerOrgNumber,
  DriverAcceptsMarketing,
  DriverAddress,
  DriverAddressCity,
  DriverCardValidTo,
  DriverCountry,
  DriverCreate,
  DriverEmail,
  DriverExternalNumber,
  DriverFirstName,
  DriverGDPRAccept,
  DriverHasCard,
  DriverISWarrantyCustomer,
  DriverKeyNumber,
  DriverLastName,
  DriverNotes,
  DriverNotesShared,
  DriverPhoneNumber,
  DriverZipCode,
  createCompany,
  deleteCompany,
  Driver,
  Company,
  deleteDriver,
  editDriverDetails,
  createNewDriver,
  getCustomersPaginate,
  CustomersPaginate,
  DriversPaginate,
  getDriversPaginate,
  getDriverById,
  getCompanyById,
  editCompanyDetails,
} from '../../services/customerService.js'
import {
  Limit,
  ModelName,
  NextPageUrl,
  Offset,
  Page,
  PreviousPageUrl,
  RequestUrl,
  ResponseMessage,
  ResultCount,
  Search,
} from '../../plugins/pagination.js'

export const customers = async (fastify: FastifyInstance) => {
  //Get customers
  fastify.get<{ Querystring: ListCustomersQueryParamSchemaType }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('list_users')
        const authorizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        querystring: ListCustomersQueryParamSchema,
      },
    },
    async function (request, _) {
      let { search = '', limit = 10, page = 1 } = request.query
      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)
      const result: CustomersPaginate = await getCustomersPaginate(
        brandedSearch,
        brandedLimit,
        brandedPage,
        offset,
      )

      const message: ResponseMessage = fastify.responseMessage(
        ModelName('Customers'),
        ResultCount(result.data.length),
      )
      const requestUrl: RequestUrl = RequestUrl(
        request.protocol + '://' + request.hostname + request.url,
      )
      const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
        requestUrl,
        Page(result.totalPage),
        Page(page),
      )
      const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
        requestUrl,
        Page(result.totalPage),
        Page(page),
      )

      return {
        message: message,
        totalItems: result.totalItems,
        nextUrl: nextUrl,
        previousUrl: previousUrl,
        totalPage: result.totalPage,
        page: page,
        limit: limit,
        data: result.data,
      }
    },
  )

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
            company: Company
            driver: Driver
          }
        | undefined = await createCompany(companyDetails, driverDetails)
      return rep.status(201).send({
        message: 'company / driver created',
        data: createdDriver,
        customerAdded: true,
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
        customerEdited: true,
      })
    },
  )

  //Get company by Id
  fastify.get<{ Params: getCompanyByOrgNumberType }>(
    '/:orgNumber',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_company_by_id')
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
      const companyDetails: Company | undefined = await getCompanyById(CustomerOrgNumber(orgNumber))
      if (companyDetails == null) {
        return reply.status(404).send({ message: "Company doesn't exist!" })
      }
      return reply.status(200).send({ message: 'Company found', companyDetails })
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

  /**
   * -----------------
   * DRIVERS
   * -----------------
   * */

  //Get drivers
  fastify.get<{ Querystring: ListDriversQueryParamSchemaType }>(
    '/all-drivers',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('list_drivers')
        const authorizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        querystring: ListDriversQueryParamSchema,
      },
    },
    async function (request, _) {
      let { search = '', limit = 10, page = 1 } = request.query
      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)

      const result: DriversPaginate = await getDriversPaginate(
        brandedSearch,
        brandedLimit,
        brandedPage,
        offset,
      )

      const message: ResponseMessage = fastify.responseMessage(
        ModelName('Drivers'),
        ResultCount(result.data.length),
      )
      const requestUrl: RequestUrl = RequestUrl(
        request.protocol + '://' + request.hostname + request.url,
      )
      const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
        requestUrl,
        Page(result.totalPage),
        Page(page),
      )
      const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
        requestUrl,
        Page(result.totalPage),
        Page(page),
      )

      return {
        message: message,
        totalItems: result.totalItems,
        nextUrl: nextUrl,
        previousUrl: previousUrl,
        totalPage: result.totalPage,
        page: page,
        limit: limit,
        data: result.data,
      }
    },
  )

  //Get drivers by orgNumber
  fastify.get<{ Querystring: ListDriversCompanyQueryParamSchemaType }>(
    '/company-drivers',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('list_company_drivers')
        const authorizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply
            .status(403)
            .send({ message: `Permission denied, user doesn't have permission ${permissionName}` })
        }
        done()
        return reply
      },
      schema: {
        querystring: ListDriversCompanyQueryParamSchema,
      },
    },
    async function (request, _) {
      let { search = '', limit = 10, page = 1, companyOrgNumber } = request.query
      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)
      const result: DriversPaginate = await getDriversPaginate(
        brandedSearch,
        brandedLimit,
        brandedPage,
        offset,
        companyOrgNumber,
      )

      const message: ResponseMessage = fastify.responseMessage(
        ModelName('Company Drivers'),
        ResultCount(result.data.length),
      )
      const requestUrl: RequestUrl = RequestUrl(
        request.protocol + '://' + request.hostname + request.url,
      )
      const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
        requestUrl,
        Page(result.totalPage),
        Page(page),
      )
      const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
        requestUrl,
        Page(result.totalPage),
        Page(page),
      )

      return {
        message: message,
        totalItems: result.totalItems,
        nextUrl: nextUrl,
        previousUrl: previousUrl,
        totalPage: result.totalPage,
        page: page,
        limit: limit,
        data: result.data,
      }
    },
  )

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
        driverCreated: true,
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

      const driverDetails: DriverCreate = {
        driverExternalNumber: driverExternalNumber
          ? DriverExternalNumber(driverExternalNumber)
          : undefined,
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
        driverNotes: DriverNotes(driverNotes),
        driverCountry: DriverCountry(driverCountry),
        driverCardValidTo: driverCardValidTo
          ? DriverCardValidTo(new Date(driverCardValidTo))
          : undefined,
        driverCardNumber: driverCardNumber ? CustomerCardNumber(driverCardNumber) : undefined,
        driverKeyNumber: driverKeyNumber ? DriverKeyNumber(driverKeyNumber) : undefined,
        driverNotesShared: driverNotesShared ? DriverNotesShared(driverNotesShared) : undefined,
      }
      const editedCompany: Driver | undefined = await editDriverDetails(driverDetails)

      if (editedCompany) {
        reply.status(201).send({
          message: 'Driver details edited',
          editedCompany,
          driverEdited: true,
        })
      } else {
        reply.status(201).send({
          message: 'Failed to edit drivers details',
          editedCompany,
        })
      }
    },
  )

  //Get by driver email
  fastify.get<{ Params: getDriverByEmailType }>(
    '/driver/:driverEmail',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_driver_by_id')
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
      const driverDetails: Driver | undefined = await getDriverById(DriverEmail(driverEmail))
      if (driverDetails == null) {
        return reply.status(404).send({ message: "Driver doesn't exist!" })
      }
      return reply.status(200).send({ message: 'Drivers details found', driverDetails })
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
