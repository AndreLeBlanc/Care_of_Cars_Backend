import { FastifyInstance } from 'fastify'

import { Either, match } from '../../utils/helper.js'

import {
  CheckInTimesSchema,
  CheckInTimesSchemaType,
  CreateEmployeeSchema,
  CreateEmployeeSchemaType,
  EmployeeIDCheckinSchema,
  EmployeeIDCheckinSchemaType,
  EmployeeIDSchema,
  EmployeeIDSchemaType,
  EmployeeMessageSchema,
  EmployeeMessageSchemaType,
  EmployeeSpceialHourByDateSchema,
  EmployeeSpceialHourByDateSchemaType,
  EmployeeSpceialHoursIDSchema,
  EmployeeSpceialHoursIDSchemaType,
  EmployeeTimeSchema,
  EmployeeTimeSchemaType,
  GetEmployeeWorkingHoursSchema,
  GetEmployeeWorkingHoursSchemaType,
  ListCheckInStatusSchema,
  ListCheckInStatusSchemaType,
  ListEmployeeWorkingHoursSchema,
  ListEmployeeWorkingHoursSchemaType,
  ListEmployeesReplySchema,
  ListEmployeesReplySchemaType,
  ListEmployeesSchema,
  ListEmployeesSchemaType,
  SelectedEmployeeSchema,
  SelectedEmployeeSchemaType,
  SpecialHoursSchema,
  SpecialHoursSchemaType,
  SpecialWorkingHoursSchema,
  SpecialWorkingHoursSchemaType,
  WorkingHoursTotalSchema,
  WorkingHoursTotalSchemaType,
} from './employeesSchema.js'

import { Currency } from 'dinero.js'

import {
  Absence,
  CheckedInStatus,
  EmployeeComment,
  EmployeeHourlyRate,
  EmployeeHourlyRateCurrency,
  EmployeeID,
  EmployeePersonalNumber,
  EmployeePin,
  EmployeeSpceialHoursID,
  EmploymentNumber,
  FridayBreak,
  FridayStart,
  FridayStop,
  GlobalQualID,
  LocalQualID,
  MondayBreak,
  MondayStart,
  MondayStop,
  PermissionTitle,
  SaturdayBreak,
  SaturdayStart,
  SaturdayStop,
  ShortUserName,
  Signature,
  StoreID,
  SundayBreak,
  SundayStart,
  SundayStop,
  ThursdayBreak,
  ThursdayStart,
  ThursdayStop,
  TuesdayBreak,
  TuesdayStart,
  TuesdayStop,
  UserID,
  WednesdayBreak,
  WednesdayStart,
  WednesdayStop,
  WorkTime,
  WorkTimeDescription,
} from '../../schema/schema.js'

import { Limit, Offset, Page, Search } from '../../plugins/pagination.js'

import {
  CheckInTimes,
  CreateEmployee,
  Employee,
  EmployeePaginated,
  ListCheckInStatus,
  SpecialWorkingHours,
  WorkingHours,
  WorkingHoursCreated,
  WorkingHoursIDTotal,
  checkInCheckOut,
  deleteEmployee,
  deleteEmployeeWorkingHours,
  getEmployee,
  getEmployeeSpecialWorkingHoursByDates,
  getEmployeeSpecialWorkingHoursByID,
  getEmployeeWorkingHours,
  getEmployeesPaginate,
  listCheckedinStatus,
  listWorkingEmployees,
  putEmployee,
  setEmployeeSpecialWorkingHours,
  setEmployeeWorkingHours,
} from '../../services/employeeService.js'
import { StoreIDSchema, StoreIDSchemaType } from '../stores/storesSchema.js'

export const employees = async (fastify: FastifyInstance) => {
  fastify.post<{
    Body: EmployeeIDCheckinSchemaType
    Reply: CheckInTimesSchemaType | EmployeeMessageSchemaType
  }>(
    '/checkin',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('checkin_checkout_employee'))
        done()
        return reply
      },
      schema: {
        body: EmployeeIDCheckinSchema,
        response: {
          201: { ...EmployeeMessageSchema, ...CheckInTimesSchema },
          504: EmployeeMessageSchema,
        },
      },
    },
    async (req, rep) => {
      const employeeID = EmployeeID(req.body.employeeID)
      const checkedInStatus = req.body.employeeCheckedOut as CheckedInStatus

      const checkinStatus: CheckInTimes | undefined = await checkInCheckOut(
        employeeID,
        checkedInStatus,
      )
      console.log('checkinStatus', checkinStatus)
      if (checkinStatus == null) {
        return rep.status(504).send({ message: "can't set employee checkin" })
      }
      return rep.status(201).send({ message: 'updated employee checkin', ...checkinStatus })
    },
  )

  fastify.get<{
    Params: StoreIDSchemaType
    Reply: ListCheckInStatusSchemaType | EmployeeMessageSchemaType
  }>(
    '/checkin/:storeID',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('list_checkin_status'))
        done()
        return reply
      },
      schema: {
        params: StoreIDSchema,
        response: {
          200: ListCheckInStatusSchema,
          404: EmployeeMessageSchema,
        },
      },
    },
    async (request, rep) => {
      const storeID = StoreID(request.params.storeID)

      const checkinStatusList: Either<string, ListCheckInStatus[]> = await listCheckedinStatus(
        storeID,
      )

      match(
        checkinStatusList,
        (statuses: ListCheckInStatus[]) => {
          return rep.status(200).send({
            message: 'employee checkin statuses',
            statuses: statuses.map((emp) => {
              return {
                employeeID: emp.employeeID,
                time: emp.time ? emp.time : undefined,
                status: emp.status,
              }
            }),
          })
        },
        (err) => {
          return rep.status(404).send({ message: err })
        },
      )
    },
  )

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
      const storeIDs: StoreID[] = req.body.storeID.map((store) => StoreID(store))
      const employeeID = req.body.employeeID ? EmployeeID(req.body.employeeID) : undefined
      const employee: CreateEmployee = {
        userID: UserID(req.body.userID),
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

      const createdEmployee: Either<string, Employee> = await putEmployee(
        storeIDs,
        employee,
        employeeID,
      )
      match(
        createdEmployee,
        (employee: Employee) => {
          return rep.status(201).send({
            message: 'Employee Created/updated successfully',
            ...employee,
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
          201: { EmployeeMessageSchema, employee: SelectedEmployeeSchema },
          404: EmployeeMessageSchema,
        },
      },
    },
    async (request, reply) => {
      const deletedEmployee: Either<string, Employee> = await deleteEmployee(
        EmployeeID(request.params.employeeID),
      )
      match(
        deletedEmployee,
        (employee: Employee) => {
          return reply.status(200).send({ message: 'Employee deleted', ...employee })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Params: EmployeeIDSchemaType
    Reply:
      | { message: EmployeeMessageSchemaType; employee: SelectedEmployeeSchemaType }
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
          200: { ...EmployeeMessageSchema, ...SelectedEmployeeSchema },
          404: EmployeeMessageSchema,
        },
      },
    },
    async (request, reply) => {
      const fetchedEmployee: Either<string, Employee> = await getEmployee(
        EmployeeID(request.params.employeeID),
      )
      match(
        fetchedEmployee,
        (employee: Employee) => {
          return reply.status(200).send({ message: 'Employee fetched', ...employee })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
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
    async function (request, reply) {
      const { search = '', storeID, limit, page, offset } = request.query
      const brandedStore = StoreID(storeID)
      const brandedSearch = Search(search)
      const brandedLimit = limit ? Limit(limit) : undefined
      const brandedPage = page ? Page(page) : undefined
      const brandedOffset = offset ? Offset(offset) : undefined
      const employees: Either<string, EmployeePaginated> = await getEmployeesPaginate(
        brandedStore,
        brandedSearch,
        brandedLimit,
        brandedPage,
        brandedOffset,
      )

      match(
        employees,
        (employeeList: EmployeePaginated) => {
          return reply.status(200).send({ message: 'Employee fetched', ...employeeList })
        },
        (err) => {
          return reply.status(404).send({ message: err })
        },
      )
    },
  )

  fastify.put<{
    Body: EmployeeTimeSchemaType
    Reply: (EmployeeMessageSchemaType & EmployeeTimeSchemaType) | EmployeeMessageSchemaType
  }>(
    '/workingHours',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('put_employee_workhours'))
        done()
        return reply
      },
      schema: {
        body: EmployeeTimeSchema,
        response: {
          201: { ...EmployeeMessageSchema, ...EmployeeTimeSchema },
          504: EmployeeMessageSchema,
        },
      },
    },
    async (req, rep) => {
      const storeID: StoreID = StoreID(req.body.storeID)
      const employeeID = EmployeeID(req.body.employeeID)
      const workingHours: WorkingHours = {
        mondayStart: req.body.mondayStart ? MondayStart(req.body.mondayStart) : undefined,
        mondayStop: req.body.mondayStop ? MondayStop(req.body.mondayStop) : undefined,
        mondayBreak: req.body.mondayBreak ? MondayBreak(req.body.mondayBreak) : undefined,
        tuesdayStart: req.body.tuesdayStart ? TuesdayStart(req.body.tuesdayStart) : undefined,
        tuesdayStop: req.body.tuesdayStop ? TuesdayStop(req.body.tuesdayStop) : undefined,
        tuesdayBreak: req.body.tuesdayBreak ? TuesdayBreak(req.body.tuesdayBreak) : undefined,
        wednesdayStart: req.body.wednesdayStart
          ? WednesdayStart(req.body.wednesdayStart)
          : undefined,
        wednesdayStop: req.body.wednesdayStop ? WednesdayStop(req.body.wednesdayStop) : undefined,
        wednesdayBreak: req.body.wednesdayBreak
          ? WednesdayBreak(req.body.wednesdayBreak)
          : undefined,
        thursdayStart: req.body.thursdayStart ? ThursdayStart(req.body.thursdayStart) : undefined,
        thursdayStop: req.body.thursdayStop ? ThursdayStop(req.body.thursdayStop) : undefined,
        thursdayBreak: req.body.thursdayBreak ? ThursdayBreak(req.body.thursdayBreak) : undefined,
        fridayStart: req.body.fridayStart ? FridayStart(req.body.fridayStart) : undefined,
        fridayStop: req.body.fridayStop ? FridayStop(req.body.fridayStop) : undefined,
        fridayBreak: req.body.fridayBreak ? FridayBreak(req.body.fridayBreak) : undefined,
        saturdayStart: req.body.saturdayStart ? SaturdayStart(req.body.saturdayStart) : undefined,
        saturdayStop: req.body.saturdayStop ? SaturdayStop(req.body.saturdayStop) : undefined,
        saturdayBreak: req.body.saturdayBreak ? SaturdayBreak(req.body.saturdayBreak) : undefined,
        sundayStart: req.body.sundayStart ? SundayStart(req.body.sundayStart) : undefined,
        sundayStop: req.body.sundayStop ? SundayStop(req.body.sundayStop) : undefined,
        sundayBreak: req.body.sundayBreak ? SundayBreak(req.body.sundayBreak) : undefined,
      }
      const createdWorkingHours: Either<string, WorkingHoursCreated> =
        await setEmployeeWorkingHours(employeeID, storeID, workingHours)
      match(
        createdWorkingHours,

        (workHours: WorkingHoursCreated) => {
          return rep.status(201).send({
            message: 'Employee work hours Created/updated successfully',

            ...workHours,
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

  fastify.put<{
    Body: SpecialWorkingHoursSchemaType
    Reply: (SpecialWorkingHoursSchemaType & EmployeeMessageSchemaType) | EmployeeMessageSchemaType
  }>(
    '/specialHours',
    {
      preHandler: async (request, reply, done) => {
        fastify.authorize(request, reply, PermissionTitle('put_employee_specialhours'))
        done()
        return reply
      },
      schema: {
        body: SpecialWorkingHoursSchema,
        response: {
          201: { ...EmployeeMessageSchema, ...SpecialWorkingHoursSchema },
          504: EmployeeMessageSchema,
        },
      },
    },
    async (req, rep) => {
      const specialHours: SpecialWorkingHours[] = req.body.specialHours.map((hours) => ({
        storeID: StoreID(hours.storeID),
        employeeID: EmployeeID(hours.employeeID),
        employeeSpecialHoursID: hours.employeeSpecialHoursID
          ? EmployeeSpceialHoursID(hours.employeeSpecialHoursID)
          : undefined,
        start: WorkTime(new Date(hours.start)),
        end: WorkTime(new Date(hours.end)),
        description: hours.description ? WorkTimeDescription(hours.description) : undefined,
        absence: Absence(hours.absence),
      }))

      const createdSpecialWorkingHours: Either<string, { specialHours: SpecialWorkingHours[] }> =
        await setEmployeeSpecialWorkingHours(specialHours)
      match(
        createdSpecialWorkingHours,

        (workHours: { specialHours: SpecialWorkingHours[] }) => {
          return rep.status(201).send({
            message: 'Employee special work hours Created/updated successfully',

            ...workHours,
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

  fastify.get<{
    Querystring: GetEmployeeWorkingHoursSchemaType
    Reply:
      | ({ message: EmployeeMessageSchemaType } & EmployeeTimeSchemaType)
      | EmployeeMessageSchemaType
  }>(
    '/workHours/',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_employee_working_hours')
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
        querystring: GetEmployeeWorkingHoursSchema,
        response: {
          200: { message: EmployeeMessageSchema, ...EmployeeTimeSchema },
          403: EmployeeMessageSchema,
        },
      },
    },
    async function (request, reply) {
      const employeeID = EmployeeID(request.query.employeeID)
      const storeID = StoreID(request.query.storeID)
      const hours: Either<string, WorkingHoursCreated> = await getEmployeeWorkingHours(
        employeeID,
        storeID,
      )
      match(
        hours,
        (workHours: WorkingHoursCreated) => {
          return reply.status(200).send({ message: 'employee working hours', ...workHours })
        },
        (err) => {
          return reply.status(403).send({ message: err })
        },
      )
    },
  )

  fastify.delete<{
    Querystring: GetEmployeeWorkingHoursSchemaType
    Reply:
      | ({ message: EmployeeMessageSchemaType } & EmployeeTimeSchemaType)
      | EmployeeMessageSchemaType
  }>(
    '/workHours',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('delete_employee_working_hours')
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
        querystring: GetEmployeeWorkingHoursSchema,
        response: {
          200: { message: EmployeeMessageSchema, ...EmployeeTimeSchema },
          403: EmployeeMessageSchema,
        },
      },
    },
    async function (request, reply) {
      const employeeID = EmployeeID(request.query.employeeID)
      const storeID = StoreID(request.query.storeID)
      const hours: Either<string, WorkingHoursCreated> = await deleteEmployeeWorkingHours(
        employeeID,
        storeID,
      )
      match(
        hours,
        (workHours: WorkingHoursCreated) => {
          return reply.status(200).send({ message: 'deleted employee working hours', ...workHours })
        },
        (err) => {
          return reply.status(403).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Querystring: EmployeeSpceialHoursIDSchemaType
    Reply:
      | ({ message: EmployeeMessageSchemaType } & SpecialHoursSchemaType)
      | EmployeeMessageSchemaType
  }>(
    '/specialHours',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle(
          'get_employee_special_working_hours',
        )
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
        querystring: EmployeeSpceialHoursIDSchema,
        response: {
          200: { message: EmployeeMessageSchema, ...SpecialHoursSchema },
          403: EmployeeMessageSchema,
        },
      },
    },
    async function (request, reply) {
      const hoursID = EmployeeSpceialHoursID(request.query.employeeSpceialHoursID)
      const hours: Either<string, SpecialWorkingHours> = await getEmployeeSpecialWorkingHoursByID(
        hoursID,
      )
      match(
        hours,
        (specialHours: SpecialWorkingHours) => {
          return reply.status(200).send({ message: 'employee working hours', ...specialHours })
        },
        (err) => {
          return reply.status(403).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Querystring: EmployeeSpceialHourByDateSchemaType
    Reply:
      | ({ message: EmployeeMessageSchemaType } & SpecialWorkingHoursSchemaType)
      | EmployeeMessageSchemaType
  }>(
    '/specialHoursByDate',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle(
          'get_employee_special_working_hours_by_date',
        )
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
        querystring: EmployeeSpceialHourByDateSchema,
        response: {
          200: { message: EmployeeMessageSchema, ...SpecialWorkingHoursSchema },
          403: EmployeeMessageSchema,
        },
      },
    },
    async function (request, reply) {
      const employeeID = EmployeeID(request.query.employeeID)
      const storeID = StoreID(request.query.storeID)
      const begin = WorkTime(new Date(request.query.begin))
      const end = WorkTime(new Date(request.query.end))
      const hours: Either<string, { specialHours: SpecialWorkingHours[] }> =
        await getEmployeeSpecialWorkingHoursByDates(storeID, employeeID, begin, end)
      match(
        hours,
        (specialHours: { specialHours: SpecialWorkingHours[] }) => {
          return reply
            .status(200)
            .send({ message: 'employee special working hours', ...specialHours })
        },
        (err) => {
          return reply.status(403).send({ message: err })
        },
      )
    },
  )

  fastify.delete<{
    Querystring: EmployeeSpceialHoursIDSchemaType
    Reply:
      | ({ message: EmployeeMessageSchemaType } & SpecialWorkingHoursSchemaType)
      | EmployeeMessageSchemaType
  }>(
    '/specialHours/:employeeSpecialHoursID',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle(
          'delete_employee_special_working_hours',
        )
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
        querystring: EmployeeSpceialHoursIDSchema,
        response: {
          200: { message: EmployeeMessageSchema, ...SpecialWorkingHoursSchema },
          403: EmployeeMessageSchema,
        },
      },
    },
    async function (request, reply) {
      const hoursID = EmployeeSpceialHoursID(request.query.employeeSpceialHoursID)
      const hours: Either<string, SpecialWorkingHours> = await getEmployeeSpecialWorkingHoursByID(
        hoursID,
      )
      match(
        hours,
        (specialHours: SpecialWorkingHours) => {
          return reply.status(200).send({ message: 'employee working hours', ...specialHours })
        },
        (err) => {
          return reply.status(403).send({ message: err })
        },
      )
    },
  )

  fastify.get<{
    Querystring: ListEmployeeWorkingHoursSchemaType
    Reply:
      | ({ message: EmployeeMessageSchemaType } & WorkingHoursTotalSchemaType)
      | EmployeeMessageSchemaType
  }>(
    '/availableEmployees',
    {
      preHandler: async (request, reply, done) => {
        const permissionName: PermissionTitle = PermissionTitle('get_employee_availablities')
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
        querystring: ListEmployeeWorkingHoursSchema,
        response: {
          200: { message: EmployeeMessageSchema, ...WorkingHoursTotalSchema },
          403: EmployeeMessageSchema,
        },
      },
    },
    async function (request, reply) {
      const storeID = StoreID(request.query.storeID)
      const startDay = WorkTime(new Date(request.query.startDay))
      const quals = request.query.quals
        ? request.query.quals.map((qualification) => GlobalQualID(qualification))
        : []
      const localQuals = request.query.localQuals
        ? request.query.localQuals.map((qualification) => LocalQualID(qualification))
        : []
      const hours: Either<string, WorkingHoursIDTotal> = await listWorkingEmployees(
        storeID,
        startDay,
        quals,
        localQuals,
      )

      console.log('hours')
      console.log('hours')
      console.log('hours')
      console.log('hours')
      console.log('hours')
      console.log('hours')
      console.log('hours')
      console.log('hours')
      console.log('hours')
      console.log('hours')
      console.log('hours')
      console.log('hours')
      console.log('hours')
      match(
        hours,
        (specialHours: WorkingHoursIDTotal) => {
          console.log(specialHours.employeeInfo)

          return reply
            .status(200)
            .send({ message: 'employee special working hours', ...specialHours })
        },
        (err) => {
          return reply.status(403).send({ message: err })
        },
      )
    },
  )
}
