const handler = require('../db/migration-handler')

module.exports.up = handler(async function (db) {
  await db.renameCollection('bookmarks', 'presets')
})

module.exports.down = handler(async function (db) {
  const collections = await db.collections()
  if (collections.find((c) => c.collectionName === 'presets') != null) {
    await db.renameCollection('presets', 'bookmarks')
  }
})
