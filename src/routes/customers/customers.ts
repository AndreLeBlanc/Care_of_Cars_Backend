import { FastifyInstance } from 'fastify'

import { Either, match } from '../../utils/helper.js'

import {
  AddCustomerBodySchema,
  CreateCustomerType,
  CreateDriverBodySchema,
  CreateDriverType,
  GetCompanyByOrgNumberSchema,
  GetCompanyByOrgNumberSchemaType,
  GetDriverByIDSchema,
  GetDriverByIDSchemaType,
  ListCustomersQueryParamSchema,
  ListCustomersQueryParamSchemaType,
  ListDriversCompanyQueryParamSchema,
  ListDriversCompanyQueryParamSchemaType,
  ListDriversQueryParamSchema,
  ListDriversQueryParamSchemaType,
  PatchCompanyBodySchema,
  PatchCompanyType,
  PatchDriverBodySchema,
  PatchDriverType,
} from './customerSchema.js'

import {
  Company,
  CustomerCompanyCreate,
  CustomersPaginate,
  Driver,
  DriverCreate,
  DriversPaginate,
  createCompany,
  createNewDriver,
  deleteCompany,
  deleteDriver,
  editCompanyDetails,
  editDriverDetails,
  getCompanyById,
  getCustomersPaginate,
  getDriverById,
  getDriversPaginate,
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

import {
  CompanyAddress,
  CompanyAddressCity,
  CompanyCountry,
  CompanyReference,
  CompanyZipCode,
  CustomerCardNumber,
  CustomerCompanyName,
  CustomerOrgNumber,
  DriverAcceptsMarketing,
  DriverAddress,
  DriverAddressCity,
  DriverCardValidTo,
  DriverCountry,
  DriverEmail,
  DriverExternalNumber,
  DriverFirstName,
  DriverGDPRAccept,
  DriverHasCard,
  DriverID,
  DriverISWarrantyCustomer,
  DriverKeyNumber,
  DriverLastName,
  DriverNotes,
  DriverNotesShared,
  DriverPhoneNumber,
  DriverZipCode,
  PermissionTitle,
} from '../../schema/schema.js'

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
    async function (request, res) {
      const { search = '', limit = 10, page = 1 } = request.query
      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)
      const customersList: Either<string, CustomersPaginate> = await getCustomersPaginate(
        brandedSearch,
        brandedLimit,
        brandedPage,
        offset,
      )

      match(
        customersList,
        (customers: CustomersPaginate) => {
          const message: ResponseMessage = fastify.responseMessage(
            ModelName('Customers'),
            ResultCount(customers.data.length),
          )
          const requestUrl: RequestUrl = RequestUrl(
            request.protocol + '://' + request.hostname + request.url,
          )
          const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
            requestUrl,
            Page(customers.totalPage),
            Page(page),
          )
          const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
            requestUrl,
            Page(customers.totalPage),
            Page(page),
          )

          return res.code(200).send({
            message: message,
            totalItems: customers.totalItems,
            nextUrl: nextUrl,
            previousUrl: previousUrl,
            totalPage: customers.totalPage,
            page: page,
            limit: limit,
            data: customers.data,
          })
        },
        (err) => {
          res.code(504).send({ message: err })
        },
      )
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
        body: AddCustomerBodySchema,
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

      const createdDriver: Either<string, { company: Company; driver: Driver }> =
        await createCompany(companyDetails, driverDetails)
      match(
        createdDriver,
        (driver: { company: Company; driver: Driver }) => {
          return rep.status(201).send({
            message: 'company / driver created',
            data: driver,
          })
        },
        (err) => {
          return rep.status(504).send({ message: err })
        },
      )
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
        body: PatchCompanyBodySchema,
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
      const editedCompany: Either<string, Company> = await editCompanyDetails(companyDetails)

      match(
        editedCompany,
        (comp: Company) => {
          reply.status(201).send({
            message: 'Company details edited',
            comp,
          })
        },
        (err) => {
          reply.status(504).send({ message: err })
        },
      )
    },
  )

  //Get company by Id
  fastify.get<{ Params: GetCompanyByOrgNumberSchemaType }>(
    '/:orgNumber',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_company_by_id')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: GetCompanyByOrgNumberSchema,
      },
    },
    async (request, reply) => {
      const { orgNumber } = request.params
      const companyDetails: Either<string, Company> = await getCompanyById(
        CustomerOrgNumber(orgNumber),
      )
      match(
        companyDetails,
        (comp: Company) => {
          return reply.status(200).send({ message: 'Company found', comp })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  //Delete Company and drivers
  fastify.delete<{ Params: GetCompanyByOrgNumberSchemaType }>(
    '/:orgNumber',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_company')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: GetCompanyByOrgNumberSchema,
      },
    },
    async (request, reply) => {
      const { orgNumber } = request.params
      const deletedCompany: Either<string, CustomerOrgNumber> = await deleteCompany(
        CustomerOrgNumber(orgNumber),
      )
      match(
        deletedCompany,
        (comp: CustomerOrgNumber) => {
          return reply.status(200).send({ message: 'Company deleted', orgNumber: comp })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
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
    async function (request, res) {
      const { search = '', limit = 10, page = 1 } = request.query
      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)

      const drivers: Either<string, DriversPaginate> = await getDriversPaginate(
        brandedSearch,
        brandedLimit,
        brandedPage,
        offset,
      )

      match(
        drivers,
        (driverList: DriversPaginate) => {
          const message: ResponseMessage = fastify.responseMessage(
            ModelName('Drivers'),
            ResultCount(driverList.data.length),
          )
          const requestUrl: RequestUrl = RequestUrl(
            request.protocol + '://' + request.hostname + request.url,
          )
          const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
            requestUrl,
            Page(driverList.totalPage),
            Page(page),
          )
          const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
            requestUrl,
            Page(driverList.totalPage),
            Page(page),
          )

          return res.code(200).send({
            message: message,
            totalItems: driverList.totalItems,
            nextUrl: nextUrl,
            previousUrl: previousUrl,
            totalPage: driverList.totalPage,
            page: page,
            limit: limit,
            data: driverList.data,
          })
        },
        (err) => {
          res.code(504).send({ message: err })
        },
      )
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
    async function (request, res) {
      const { search = '', limit = 10, page = 1, companyOrgNumber } = request.query
      const brandedSearch = Search(search)
      const brandedLimit = Limit(limit)
      const brandedPage = Page(page)
      const offset: Offset = fastify.findOffset(brandedLimit, brandedPage)
      const drivers: Either<string, DriversPaginate> = await getDriversPaginate(
        brandedSearch,
        brandedLimit,
        brandedPage,
        offset,
        CustomerOrgNumber(companyOrgNumber),
      )

      match(
        drivers,
        (drivers: DriversPaginate) => {
          const message: ResponseMessage = fastify.responseMessage(
            ModelName('Company Drivers'),
            ResultCount(drivers.data.length),
          )
          const requestUrl: RequestUrl = RequestUrl(
            request.protocol + '://' + request.hostname + request.url,
          )
          const nextUrl: NextPageUrl | undefined = fastify.findNextPageUrl(
            requestUrl,
            Page(drivers.totalPage),
            Page(page),
          )
          const previousUrl: PreviousPageUrl | undefined = fastify.findPreviousPageUrl(
            requestUrl,
            Page(drivers.totalPage),
            Page(page),
          )

          return {
            message: message,
            totalItems: drivers.totalItems,
            nextUrl: nextUrl,
            previousUrl: previousUrl,
            totalPage: drivers.totalPage,
            page: page,
            limit: limit,
            data: drivers.data,
          }
        },
        (err) => {
          res.code(504).send({ message: err })
        },
      )
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
        body: CreateDriverBodySchema,
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
        customerOrgNumber: companyOrgNumber ? CustomerOrgNumber(companyOrgNumber) : undefined,
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
        driverCardValidTo: driverCardValidTo
          ? DriverCardValidTo(new Date(driverCardValidTo))
          : undefined,
        driverCardNumber: driverCardNumber ? CustomerCardNumber(driverCardNumber) : undefined,
        driverKeyNumber: driverKeyNumber ? DriverKeyNumber(driverKeyNumber) : undefined,
        driverNotesShared: driverNotesShared ? DriverNotesShared(driverNotesShared) : undefined,
        driverNotes: DriverNotes(driverNotes),
        driverCountry: DriverCountry(driverCountry),
      }

      const createdDriver: Either<string, Driver> = await createNewDriver(driverDetails)
      match(
        createdDriver,
        (driver: Driver) => {
          return rep.status(201).send({
            message: 'Driver Created',
            data: driver,
          })
        },
        (err) => {
          return rep.status(504).send({
            message: err,
          })
        },
      )
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
        body: PatchDriverBodySchema,
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
      const editedDriver: Either<string, Driver> = await editDriverDetails(driverDetails)

      match(
        editedDriver,
        (driver: Driver) => {
          reply.status(201).send({
            message: 'Driver details edited',
            driver,
          })
        },
        (err) => {
          reply.status(404).send({
            message: err,
          })
        },
      )
    },
  )

  //Get by driver email
  fastify.get<{ Params: GetDriverByIDSchemaType }>(
    '/driver/:driverID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_driver_by_id')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: GetDriverByIDSchema,
      },
    },
    async (request, reply) => {
      const { driverID } = request.params
      const driverDetails: Either<string, Driver> = await getDriverById(DriverID(driverID))
      match(
        driverDetails,
        (driver: Driver) => {
          return reply.status(200).send({ message: 'Drivers details found', driver })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  //delete driver
  fastify.delete<{ Params: GetDriverByIDSchemaType }>(
    '/driver/:driverID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_company')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: GetDriverByIDSchema,
      },
    },
    async (request, reply) => {
      const { driverID } = request.params
      const deletedDriver: Either<string, DriverID> = await deleteDriver(DriverID(driverID))
      match(
        deletedDriver,
        (deleted: DriverID) => {
          return reply.status(200).send({ message: 'Driver deleted', deletedDriverEmail: deleted })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )
}

export default customers
