const handler = require('../db/migration-handler')

module.exports.up = handler(async function (db) {
  db.renameCollection('bookmarks', 'presets')
})

module.exports.down = handler(async function (db) {
  db.renameCollection('presets', 'bookmarks')
})
