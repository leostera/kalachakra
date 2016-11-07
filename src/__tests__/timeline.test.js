import { log } from 'kalachakra/utils'

import { task, timeline } from 'kalachakra'

const add = (n, tl) => tl.add(n, task( () => n ))

test('add delays task', () => {
  const tl = timeline()
  const t1 = task( () => true )
  expect(t1.time).toBe(0)
  tl.add(1, t1)
  expect(t1.time).toBe(1)
})

test('add sorts elements when adding them', () => {
  const tl = timeline()
  add(1, tl)
  add(2, tl)
  add(3, tl)
  const tasks = tl.get(3)
  expect(tasks[0].time).toBe(1)
  expect(tasks[1].time).toBe(2)
  expect(tasks[2].time).toBe(3)
})

test('get returns the right tasks', () => {
  const tl = timeline()
  add(1, tl)
  add(2, tl)
  add(3, tl)
  const tasks = tl.get(1)
  expect(tasks.length).toBe(1)
})

test('get returns no more tasks than available', () => {
  const tl = timeline()
  add(1, tl)
  add(2, tl)
  add(3, tl)
  const tasks = tl.get(5)
  expect(tasks.length).toBe(3)
})

test('get drains the timeline', () => {
  const tl = timeline()
  add(1, tl)
  tl.get(1)
  const tasks = tl.get(1)
  expect(tasks.length).toBe(0)
})

test('get returns an empty list if it is empty', () => {
  const tl = timeline()
  expect(tl.get(1).length).toBe(0)
})

test('empty returns true if the timeline is empty', () => {
  const tl = timeline()
  expect(tl.empty()).toBe(true)
})

test('empty returns false if the timeline is not empty', () => {
  const tl = timeline()
  add(1, tl)
  expect(tl.empty()).toBe(false)
})

test("next returns the next tasks's time", () => {
  const tl = timeline()
  add(1, tl)
  expect(tl.next()).toBe(1)
})

test("next returns Infinity if timeline is empty", () => {
  const tl = timeline()
  expect(tl.next()).toBe(Infinity)
})
