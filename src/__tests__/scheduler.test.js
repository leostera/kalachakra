import {
  tick as now,
  log,
} from 'scheduler/utils'

import {
  task,
  scheduler
} from 'scheduler'

test('adds tasks', async () => {
  let t = (x) => task( () => log("What! I'm ALIVE", x) )
  let s = scheduler()
  s.schedule(now(), t(1))
  s.schedule(now(), t(2).delay(1000))
  s.schedule(now(), t(3).delay(1000))
  s.schedule(now(), t(4).delay(1000))
  s.schedule(now(), t(5).delay(1000))
  s.schedule(now(), t(6).delay(1000))
  s.schedule(now(), t(7).delay(1000))
  s.schedule(now(), t(8).delay(1000))
})
