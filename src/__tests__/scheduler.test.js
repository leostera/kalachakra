import {
  tick as now,
  log,
} from 'scheduler/utils'

import {
  task,
  scheduler
} from 'scheduler'

test('adds tasks', async () => {
  let t = task( () => log("Oh God I'm being called!") )
  let s = scheduler()
  s.schedule(now(), t)
  s.schedule(now(), t)
  s.schedule(now(), t)
  s.schedule(now(), t)
  s.run()
})
