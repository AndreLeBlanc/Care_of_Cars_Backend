import { FastifyInstance } from 'fastify'

import {
  CreateEmployeeSchema,
  CreateEmployeeSchemaType,
  EmployeeIDSchema,
  EmployeeIDSchemaType,
  EmployeeMessageSchema,
  EmployeeMessageSchemaType,
  ListEmployeesReplySchema,
  ListEmployeesReplySchemaType,
  ListEmployeesSchema,
  ListEmployeesSchemaType,
  SelectedEmployeeSchema,
  SelectedEmployeeSchemaType,
} from './employeesSchema.js'

import { Currency } from 'dinero.js'

import {
  EmployeeComment,
  EmployeeHourlyRate,
  EmployeeHourlyRateCurrency,
  EmployeeID,
  EmployeePersonalNumber,
  EmployeePin,
  EmploymentNumber,
  PermissionTitle,
  ShortUserName,
  Signature,
  StoreID,
} from '../../schema/schema.js'

import { Limit, Offset, Page, Search } from '../../plugins/pagination.js'

import {
  CreateEmployee,
  Employee,
  EmployeePaginated,
  deleteEmployee,
  getEmployee,
  getEmployeesPaginate,
  putEmployee,
} from '../../services/employeeService.js'

export const employees = async (fastify: FastifyInstance) => {
  fastify.put<{
    Body: CreateEmployeeSchemaType
    Reply: (EmployeeMessageSchemaType & SelectedEmployeeSchemaType) | EmployeeMessageSchemaType
  }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('put_employee'))
        done()
        return reply
      },
      schema: {
        body: CreateEmployeeSchema,
        response: {
          201: { ...EmployeeMessageSchema, ...SelectedEmployeeSchema },
          504: EmployeeMessageSchema,
        },
      },
    },
    async (req, rep) => {
      const {} = req.body

      const storeIDs: StoreID[] = req.body.storeID.map((store) => StoreID(store))
      const employeeID = req.body.employeeID ? EmployeeID(req.body.employeeID) : undefined
      const employee: CreateEmployee = {
        employeeID: employeeID,
        shortUserName: ShortUserName(req.body.shortUserName),
        employmentNumber: EmploymentNumber(req.body.employmentNumber),
        employeePersonalNumber: EmployeePersonalNumber(req.body.employeePersonalNumber),
        signature: Signature(req.body.signature),
        employeeHourlyRate: req.body.employeeHourlyRate
          ? EmployeeHourlyRate(req.body.employeeHourlyRate)
          : undefined,
        employeeHourlyRateCurrency: req.body.EmployeeHourlyRateCurrency
          ? EmployeeHourlyRateCurrency(req.body.EmployeeHourlyRateCurrency as Currency)
          : undefined,
        employeePin: EmployeePin(req.body.employeePin),
        employeeComment: EmployeeComment(req.body.employeeComment),
      }

      const createdEmployee: Employee | undefined = await putEmployee(
        storeIDs,
        employee,
        employeeID,
      )
      if (putEmployee != null) {
        return rep.status(201).send({
          message: 'Employee Created/updated successfully',

          ...createdEmployee,
        })
      } else {
        return rep.status(504).send({
          message: 'Fail to create or update employee',
        })
      }
    },
  )

  fastify.delete<{
    Params: EmployeeIDSchemaType
    Reply:
      | { message: EmployeeMessageSchemaType; employee: SelectedEmployeeSchemaType }
      | EmployeeMessageSchemaType
  }>(
    '/:employeeID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_employee')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: EmployeeIDSchema,
        response: {
          201: { message: EmployeeMessageSchema, employee: SelectedEmployeeSchema },
          404: EmployeeMessageSchema,
        },
      },
    },
    async (request, reply) => {
      const deletedEmployee: Employee | undefined = await deleteEmployee(
        EmployeeID(request.params.employeeID),
      )
      if (deletedEmployee == null) {
        return reply.status(404).send({ message: "Employee doesn't exist!" })
      }
      return reply.status(200).send({ message: 'Employee deleted', ...deletedEmployee })
    },
  )

  fastify.get<{
    Params: EmployeeIDSchemaType
    Reply:
      | (EmployeeMessageSchemaType & { employee: SelectedEmployeeSchemaType })
      | EmployeeMessageSchemaType
  }>(
    '/:employeeID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_employee')
        await fastify.authorize(request, reply, permissionName)
        done()
        return reply
      },
      schema: {
        params: EmployeeIDSchema,
        response: {
          201: { EmployeeMessageSchema, employee: SelectedEmployeeSchema },
          404: EmployeeMessageSchema,
        },
      },
    },
    async (request, reply) => {
      const fetchedEmployee: Employee | undefined = await getEmployee(
        EmployeeID(request.params.employeeID),
      )
      if (fetchedEmployee == null) {
        return reply.status(404).send({ message: "Employee doesn't exist!" })
      }
      return reply.status(200).send({ message: 'Employee fetched', ...fetchedEmployee })
    },
  )

  fastify.get<{
    Querystring: ListEmployeesSchemaType
    Reply: ListEmployeesReplySchemaType | EmployeeMessageSchemaType
  }>(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('list_employees')
        const authorizeStatus: boolean = await fastify.authorize(request, reply, permissionName)
        if (!authorizeStatus) {
          return reply.status(403).send({
            message: `Permission denied, user doesn't have permission ${permissionName}`,
          })
        }
        done()
        return reply
      },
      schema: {
        querystring: ListEmployeesSchema,
        response: { 200: ListEmployeesReplySchema, 403: EmployeeMessageSchema },
      },
    },
    async function (request) {
      const { search = '', storeID, limit, page, offset } = request.query
      const brandedStore = StoreID(storeID)
      const brandedSearch = Search(search)
      const brandedLimit = limit ? Limit(limit) : undefined
      const brandedPage = page ? Page(page) : undefined
      const brandedOffset = offset ? Offset(offset) : undefined
      const employees: EmployeePaginated | undefined = await getEmployeesPaginate(
        brandedStore,
        brandedSearch,
        brandedLimit,
        brandedPage,
        brandedOffset,
      )
      return {
        message: 'Employees',
        ...employees,
      }
    },
  )
}
