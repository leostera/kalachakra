import type { Time, Predicate } from 'scheduler'

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

export { task }
