'use strict'

const path = require('path')

const waUtil = require('wa-util')
const swearing = require('swearing')
const PromiseProxyNode = require('promiseproxy-node')
const fs = PromiseProxyNode('fs')
const moment = require('moment')

const dumpListTemplate = require('./template')
const available = require('./wa-available.json')
const sources = require('./wa-sources.json')

const now = moment().format('YMMDD-HHmmss')
const dayRegex = /whatsapp_(\d{8})/
const inDir = path.join(process.cwd(), 'dumps')

function dumpDb (source) {
  let outDir = path.join(`parsed-${now}`, source.targetDay)
  let snapshotDir = path.join(inDir, `whatsapp_${source.snapshotDay}`)
  let msgstorePath = path.join(snapshotDir, `msgstore_${source.snapshotDay}.db`)
  let waPath = path.join(snapshotDir, `wa_${source.snapshotDay}.db`)

  // create wa data load function
  let waLoad = waUtil.loadWaFromDbs.bind(null, {
    msgstorePath,
    waPath,
    targetDayString: source.targetDay
  })

  // create snap save function
  let snapSave = waUtil.saveDataToFs.bind(null, {
    dbDir: source.wa,
    targetDayString: source.targetDay,
    outDir
  })

  // create the snapshot
  return waUtil
    .saveSnapshot(waLoad, snapSave)
    .then(() => {
      console.log(source.targetDay + ' -> ' + outDir)
    })
}

function createDumpReport () {
  // get local dump day list
  let dumpsDir = path.join(process.cwd(), 'dumps')
  let local = fs.readdirSync(dumpsDir)
    .map(dump => {
      let [, dumpDay] = dayRegex.exec(dump)
      return dumpDay
    })

  let dumpListPath = `dumps-list-${now}.md`
  let dumpListMd = dumpListTemplate(available, local, sources)

  return fs.writeFile(dumpListPath, dumpListMd)
    .then(() => { console.log(`Wrote ${dumpListPath}`) })
}

console.log('Re-dumping databases:')
swearing.each(sources, dumpDb)
  .then(createDumpReport)
  .then(() => {
    console.log('Done.')
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`)
    process.exitCode = 1
  })
