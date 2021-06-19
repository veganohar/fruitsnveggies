const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
const lodashId = require("lodash-id")
db._.mixin(lodashId)

module.exports = db;