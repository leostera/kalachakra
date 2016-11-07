import {
  log
} from 'kalachakra/utils'

import type { Time, Predicate } from 'kalachakra'
import type { Task } from 'kalachakra/task'

// Time-Ordered Priority Queue
// this is really just a list of Tasks sorted by their .time

export type Timeline = {
  add(time: Time, task: Task): void;
  get(until: Time): Task[];
  empty(): boolean;
  next(): Time;
}
const timeline = (): Timeline => {
  let tasks: Task[] = []

  const byTime = (a,b) => a.time - b.time

  const add = (t, x) => {
    tasks.push(x.delay(t))
    tasks = tasks.sort(byTime)
  }

  const get = (until) => {
    const l = tasks.length
    let to=-1
    while( ++to < l ) {
      if( tasks[to].time > until ) break
    }
    return to >= 0 ? tasks.splice(0,to) : []
  }

  const empty = () => tasks.length === 0
  const next  = () => empty() ? Infinity : tasks[0].time

  return {
    add: add,
    get: get,
    empty: empty,
    next: next,
  }
}

export { timeline }
