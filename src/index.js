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
  let tasks: Task[] = []

  const byTime = (a,b) => b.time + a.time

  const add = (t, x) => {
    tasks.push(x.delay(t))
    tasks = tasks.sort(byTime)
  }

  // @todo: since this is sorted, [0] will be the most urgent
  // element, so we just need to iterate until we find a `.time`
  // that is bigger than b, then we break the loop, and return
  // that slice
  const get = (a, b) => {
    let t = tasks.splice(0,1)
    log.ns("Timeline#get",t[0].time)
    return t
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
  let clock
  let last_run = -1

  let p = log.ns("Scheduler =>")

  const schedule = (w, t) => {
    p(`Scheduling ${t} to run on ${w}`)
    let next_run = w || now()
    __timeline.add(next_run, t)
    reschedule(run(last_run, next_run), last_run-next_run)
    last_run = next_run
    return t
  }

  const reschedule = (fn, when) => {
    let delay = Math.max(0, when)
    p(`Rescheduling run in ${delay}`)
    clock = timer(fn, delay)
  }

  const unschedule = () => {
    clock && clock.clear && clock.clear()
    clock = null
  }

  const run = (from: Time, to: Time) => () => {
    Promise.resolve().then( () => {
      p("Should I Run?", !__timeline.empty())
      if( __timeline.empty() ) return

      // Execute all the tasks that should run in this run
      __timeline
        .get(from, to)
        .map( x => x.defer() )

      let next_arrival  = __timeline.next()
      if( next_arrival < last_arrival)
        unschedule()

      let delay = next_arrival-to
      reschedule(run(to, next_arrival), delay)

      last_arrival = next_arrival
    } )
  }

  return { schedule, toString: () => '[zazen Scheduler]' }
}

export {
  task,
  timeline,
  scheduler,
}

window.now = now
window.scheduler = scheduler
window.timeline = timeline
window.task = task

window.s0 = scheduler()
window.t0 = (new Array(1000)).fill(1)
              .map( x => Math.random() )
              .map( n => () => log(n) )
              .map( f => task(f) )
              .map( t => s0.schedule( null, t ) )
