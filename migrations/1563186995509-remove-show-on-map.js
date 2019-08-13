const handler = require('../db/migration-handler')

module.exports.up = handler(function(db) {
  const modifications = db.collection('modifications')
  return modifications.updateMany(
    {showOnMap: {$exists: true}},
    {$unset: {showOnMap: ''}}
  )
})

module.exports.down = handler(async function() {})
