const Suite = require('benchmark').Suite
const log = console.log

const kalachakra = require('../../index')
const task = kalachakra.task
log(kalachakra)
const suite = new Suite()

suite
  .add('task#run', () => {
    const t = task( () => true )
    task.run()
  })
  .on('cycle', (event) => {
    log(event)
  })
  .on('complete', function() {
    log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run()
