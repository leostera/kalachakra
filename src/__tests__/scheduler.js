import {
  task,
  scheduler
} from 'scheduler'

test('adds tasks', () => {
  let t = task( () => 3 )
  let s = scheduler()
  s.schedule(1, t)
})
