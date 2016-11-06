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
      if( tasks[to].time >= until ) break
    }
    return to >= 0 ? tasks.splice(0,to) : []
  }

  const empty = () => tasks.length === 0
  const next  = () => (empty() ? 0 : tasks[0].time)

  return {
    add,
    get,
    empty,
    next,
  }
}

export type Timer = {
  clear(): void;
}
const timer = (fn: Predicate, t: Time): Timer => {
  const id = setTimeout(fn, t)
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

  let clock
  let last_arrival = 0

  const schedule = (w, t) => {
    const this_run = w < 0 ? now() : w
    __timeline.add(this_run, t)
    loop(this_run)
    return t
  }

  const loop = (now) => {
    if( __timeline.empty() ) return

    const next_arrival = __timeline.next()
    const delay = Math.max(0, next_arrival-now)

    if(next_arrival < last_arrival) unschedule()
    if(!clock) clock = timer(run, delay)

    last_arrival = next_arrival
  }

  const unschedule = () => {
    clock && clock.clear && clock.clear()
    clock = null
  }

  const run = () => {
    unschedule()
    __timeline
      .get(now())
      .map( x => x.defer() )
    loop(now())
  }

  return { schedule }
}

export {
  task,
  timeline,
  scheduler,
}

window.scheduler = scheduler
window.task = task
window.log = log
window.now = now
