import {
  tick as now,
  log,
} from 'kalachakra/utils'

import {
  task,
  scheduler
} from 'kalachakra'

test('adds tasks', async () => {
  let t = (x) => task( () => log("What! I'm ALIVE", x) )
  let t1 = t(1)
  t1.what = "I should go last, even though I'm scheduled first"
  let t2 = t(2)
  t2.what = "I should go first, even though I'm scheduled last"
  let s = scheduler()
  s.schedule(now()+12341234, t1)
  s.schedule(now(), t2)
})
