import {
  check as verify,
  forall,
  nat,
} from 'jsverify'

import { log } from 'kalachakra/utils'

import { task } from 'kalachakra'

const options = {
  quiet: true,
  tests: 1000
}

const check = (name, predicate) => {
  test(name, () => {
    let r = verify( predicate, options )
    expect(r).toBe(true)
  })
}

const check_async = (name, predicate) => {
  test(name, async () => {
    let r = await verify( predicate, options )
    expect(r).toBe(true)
  })
}

check('run executes the predicate',
  forall('integer -> integer', 'integer', nat(100),
    (f, x, t) => task( () => f(x) ).run() == f(x) ))

check('run catches error from the predicate',
  forall('integer -> integer', 'integer', nat(100),
    (f, x, t) => task( () => { throw f(x) } ).run() == f(x) ))

check_async('defer executes the predicate',
  forall('integer -> integer', 'integer', nat(100),
    (f, x, t) => {
      return task( () => f(x) )
        .defer()
        .then( y => y==f(x) )}))

check_async('defer catches error from the predicate',
  forall('integer -> integer', 'integer', nat(100),
    (f, x, t) => {
      return task( () => { throw f(x) } )
        .defer()
        .then( y => y==f(x) )}))
