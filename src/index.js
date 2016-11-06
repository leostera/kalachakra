import {
  tick as now,
  log,
  atom,
} from 'scheduler/utils'

export type Time = number

export type Predicate = Function

// Wrapper around a function
export type Task = {
  run(): void;
  defer(): Promise;
  delay(offset: Time): Task;
  time: Time;
  fn: Predicate;
}
const task = (fn: Predicate): Task => ({
  time: 0,
  fn: fn,
  run: () => {
    try       { return fn() }
    catch (e) { return e    }
  },
  defer: function () {
    return Promise.resolve().then(this.run)
  },
  delay: function (t) {
    this.time += t
    return this
  },
})

// Time-Ordered Priority Queue
// this is really just a list of Tasks sorted by their .time
export type Timeline = {
  add(time: Time, task: Task): void;
  get(from: Time, to: Time): Task[];
  empty(): boolean;
  next(): Time;
}
const timeline = (): Timeline => {
  const tasks: Task[] = []

  const add = (t, x) => { tasks.push(x.delay(t)) }
  const get = (a, b) => [tasks.shift()]
  const empty = () => tasks.length === 0
  const next = () => empty() ? Infinity : tasks[0].time

  return {
    add: add,
    get: get,
    empty: empty,
    next: next,
  }
}

export type Timer = {
  clear(): void;
}
const timer = (fn: Predicate, t: Time): Timer => {
  let id = setTimeout(fn, t)
  return {
    clear: () => clearTimeout(id)
  }
}

// Self-referencing Timeline consumer
export type Scheduler = {
  schedule(when: Time, task: Task): Task;
}
const scheduler = (): Scheduler => {
  const __timeline = timeline()
  let __clock
  let last_run = -1

  const schedule = (w, t) => {
    let next_run = now()
    __timeline.add(next_run, t)
    reschedule(run(last_run, next_run), last_run-next_run)
    last_run = next_run
    return t
  }

  const reschedule = (fn, when) => {
    let delay = Math.max(0, when)
    __clock = setTimeout(fn, delay)
  }

  const run = (from: Time, to: Time) => () => {
    Promise.resolve().then( () => {
      log("Should I Run?", !__timeline.empty())
      if( __timeline.empty() ) return

      __timeline
        .get(from, to)
        .map( x => x.defer() )

      let next  = __timeline.next()
      let delay = next-to
      reschedule(run(to, next), delay)
    } )
  }

  return { schedule }
}

export {
  task,
  timeline,
  scheduler,
}
