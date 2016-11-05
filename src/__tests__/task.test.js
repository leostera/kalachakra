import { task } from 'scheduler'



test('run executes the predicate', () => {
  let t = task( () => 3 ).run()
  expect(t).toBe(3)
})

test('run catches error from the predicate', () => {
  let t = task( () => { throw 3; } ).run()
  expect(t).toBe(3)
})

test('defer executes the predicate', async () => {
  let t = await task( () => 3).defer()
  expect(t).toBe(3)
})

test('defer catches error from the predicate', async () => {
  let t = await task( () => { throw 3; } ).defer()
  expect(t).toBe(3)
})
