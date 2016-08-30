'use strict'

const source = require('common-tags').source
const eol = require('os').EOL

const removeRegexp = new RegExp(`<\\/?div>(${eol})?`, 'g')

module.exports = function (available, local, processed) {
  let report =  source`
    Dumps available
    ===============

    <div>
    ${available.map(dump => `* ${dump}`)}
    </div>

    Dumps available locally
    =======================

    <div>
    ${local}
    </div>

    Days processed
    ===============

    <div>
    ${processed.map(dump => `* ${dump.targetDay}, from ${dump.snapshotDay}`)}
    </div>
  `
  return report.replace(removeRegexp, '')
}
