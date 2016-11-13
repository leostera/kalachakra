import {
  tick as now,
  log,
} from 'kalachakra/utils'

import {
  task,
  scheduler
} from 'kalachakra'

jest.useFakeTimers()
test('adds tasks', async () => {
  let t = (x) => task( () => log("What! I'm ALIVE", x) )
  let t1 = t(1)
  let t2 = t(2)
  let s = scheduler()
  let n = now()
  s.schedule(n+123, t1)
  s.schedule(n, t2)
  jest.runOnlyPendingTimers()
})
