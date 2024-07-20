////import fc from 'fast-check'
//
//import { WorkDuration, WorkTime } from '../../src/schema/schema.js'
//
//import { describe, it } from 'node:test'
//import assert from 'assert'
//import { firstDayOfWeek } from '../../src/services/employeeService.js'
//
////import { timeStringToMS } from '../../src/utils/helper.js'
//
////describe('interValToMiliseconds Test', () => {
////  it('convert time to ms', async () => {
////    const milis0 = timeStringToMS('00:00:00')
////    assert.deepStrictEqual(milis0, 0)
////
////    const milis10 = timeStringToMS('10:00:00')
////    assert.deepStrictEqual(milis10, 36000000)
////
////    const milis12 = timeStringToMS('12:59:59')
////    assert.deepStrictEqual(milis12, 46799000)
////
////    const milisMid = timeStringToMS('23:59:59')
////    assert.deepStrictEqual(milisMid, 86399000)
////  })
////})
//
//describe('first  Day of the week Test', () => {
//  it('Cut off a worktime at the start of a week', async () => {
//    const startDay = WorkTime(new Date('2024-07-15'))
//    const start = WorkTime(new Date('2024-07-15'))
//    assert.deepStrictEqual(WorkDuration(1721045410), WorkDuration(1721045410)) //firstDayOfWeek(start, startDay), WorkDuration(1721045410))
//    assert.deepStrictEqual(firstDayOfWeek(start, startDay), WorkDuration(1720994400))
//  })
//})
//
