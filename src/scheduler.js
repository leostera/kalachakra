import type {
  Time,
  Task,
} from 'kalachakra/task'

import {
  tick as now
} from 'kalachakra/utils'

import {
  timer,
} from 'kalachakra/timer'

import {
  timeline,
} from 'kalachakra/timeline'

// Self-referencing Timeline consumer
export type Scheduler = {
  schedule(when: Time, task: Task<mixed>): Task<mixed>;
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
  scheduler,
}
