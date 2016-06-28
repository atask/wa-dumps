'use strict'

const waSnap = require('wa-snap')
const swearing = require('swearing')
const PromiseProxyNode = require('promiseproxy-node')
const fs = PromiseProxyNode('fs')
const sources = require('./wa-sources.json')

console.log('Re-dumping databases:')
swearing.each(sources, source => {
  return waSnap.snapshot
    .createSnapshot({
      targetDayString: source.day,
      waPath: source.wa,
      msgstorePath: source.msgstore
    })
    .then(snapshot => JSON.stringify(snapshot, null, 2))
    .then(json => fs.writeFile(source.out, json))
    .then(() => {
      console.log(`\t${source.day} -> ${source.out}`)
    })
}).then(() => {
  console.log('Done.')
}).catch(err => {
  console.error(`ERROR: ${err.message}`)
  process.exitCode = 1
})
