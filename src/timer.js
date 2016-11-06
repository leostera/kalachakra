import type { Time, Predicate } from 'scheduler'

export type Timer = {
  clear(): void;
}

const timer = (fn: Predicate, t: Time): Timer => {
  const id = setTimeout(fn, t)
  return {
    clear: () => clearTimeout(id)
  }
}

export { timer }
