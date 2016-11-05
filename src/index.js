//@flow

import {
  tick as now,
  log,
  atom,
} from 'scheduler/utils'

type Time = number

type Predicate = Function

// Wrapper around a function
type Task = {
  run(): void;
  defer(): Promise;
}
const task = (fn) => ({
  fn: fn,
  run: () => {
    try {
      return fn()
    } catch (e) {
      throw e;
    }
  },
  defer: function () {
    Promise.resolve().then(this.run)
  }
})

// Time-Ordered Priority Queue
type Timeline = {
  add(time: Time, task: Task): void;
  get(from: Time, to: Time): Task[];
}
const timeline = (): Timeline => {
  const tasks = []

  const add = (t, x) => {
    tasks.push({time: t, task: x})
  }

  const get = (a, b) => [tasks.pop()]

  return {
    add: add,
    get: get
  }
}

// Self-referencing Timeline consumer
type Scheduler = {
  schedule(when: Time, task: Task): Task;
  run(): void;
}
const scheduler = (): Scheduler => {
  const __timeline = timeline()
  let last_run = -1

  const schedule = (w, t) => {
    __timeline.add(w, t)
  }

  const run = () => {
    // Get all the tasks in the timeline between
    // the last run and right now
    __timeline
      .get(last_run, now())
      .map( x => x.defer() )
  }

  return { schedule, run }
}
