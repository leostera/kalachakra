export type Time = number

// Wrapper around a function
export type Task<T> = {
  run(): void;
  defer(): Promise<T>;
  delay(offset: Time): Task<T>;
  time: Time;
  fn: Function;
}

const task = (fn: Function): Task<mixed> => ({
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

export {
  task
}
