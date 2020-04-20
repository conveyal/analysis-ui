const handler = require('../db/migration-handler')

module.exports.up = handler(function (db) {
  return db.collection('regions').updateMany(
    {},
    {
      $unset: {
        bookmarks: '', // in own collection now
        customOsm: '', // Everything is `customOsm` now
        aggregationAreas: '', // in own collection now
        projects: '', // Accidentally stored in some collections
        bundles: '', // accidentally stored in some collections
        r5Version: '', // Unused
        statusCode: '', // Change makes obsolete
        statusMessage: '' // change makes obsolete
      }
    }
  )
})

module.exports.down = handler(function () {})
