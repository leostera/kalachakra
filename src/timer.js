import type {
  Time,
} from 'kalachakra/task'

export type Timer = {
  clear(): void;
}

const timer = (fn: Function, t: Time): Timer => {
  const id = setTimeout(fn, t)
  return {
    clear: () => clearTimeout(id)
  }
}

export {
  timer,
}
