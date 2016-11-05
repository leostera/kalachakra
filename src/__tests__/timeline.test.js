import { task, timeline } from 'scheduler'

test('run executes the predicate', () => {
  let t = task( () => 3 ).run()
  expect(t).toBe(3)
})
