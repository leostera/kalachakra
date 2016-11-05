import { task, timeline } from 'scheduler'

test('adds tasks', () => {
  let t = task( () => 3 )
  let tl = timeline()
  tl.add(1, t)
  let tasks = tl.get(-1,2)
  expect(tasks.length).toBe(1)
})
