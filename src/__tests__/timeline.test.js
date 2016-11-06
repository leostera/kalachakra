import { task, timeline } from 'scheduler'

test('get returns the right tasks', () => {
  let add = (n, tl) => tl.add(n, task( () => n ))
  let tl = timeline()
  add(1, tl)
  add(2, tl)
  add(3, tl)
  let tasks = tl.get(1)
  expect(tasks.length).toBe(1)
})
