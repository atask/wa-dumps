'use strict'

const waSnap = require('wa-snap')
const swearing = require('swearing')
const sources = require('./wa-sources.json')

console.log('Re-dumping databases:')
swearing.each(sources, source => {
  return waSnap.snapshot
    .createSnapshot({
      targetDayString: source.day,
      waPath: source.wa,
      msgstorePath: source.msgstore
    })
    .then(snapshot => {
      // TODO: save snapshot
    })
}).then(() => {
  console.log('Done.')
}).catch(err => {
  console.error(`Error: ${err}`)
  process.exitCode = 1
})
