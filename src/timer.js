import type { Time, Predicate } from 'kalachakra'

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
