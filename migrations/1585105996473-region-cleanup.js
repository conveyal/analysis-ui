const handler = require('../db/migration-handler')

module.exports.up = handler(async function(db) {
  const regions = db.collection('regions')

  // TODO remove bookmarks, aggregationAreas, projects, bundles, all unused properties
})

module.exports.down = handler(function() {})
