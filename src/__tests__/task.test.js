import {
  check as verify,
  forall,
  nat,
} from 'jsverify'

import { log } from 'scheduler/utils'

import { task } from 'scheduler'

const check = (name, predicate) => {
  test(name, () => {
    let r = verify( predicate )
    expect(r).toBe(true)
  })
}

check('run executes the predicate',
  forall('json -> json', 'json', nat(100),
    (f, x, t) => task( () => f(x) ).run() == f(x) ))

check('run catches error from the predicate',
  forall('json -> json', 'json', nat(100),
    (f, x, t) => task( () => { throw f(x) } ).run() == f(x) ))

test('defer executes the predicate', async () => {
  let t = await task( () => 3).defer()
  expect(t).toBe(3)
})

test('defer catches error from the predicate', async () => {
  let t = await task( () => { throw 3 } ).defer()
  expect(t).toBe(3)
})
