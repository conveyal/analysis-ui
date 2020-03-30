const handler = require('../db/migration-handler')

module.exports.up = handler(async function(db) {
  const bundles = db.collection('bundles')
  const cursor = bundles.find()
  while (await cursor.hasNext()) {
    const bundle = await cursor.next()
    await bundles.updateOne(
      {
        _id: bundle._id
      },
      {
        $set: {
          osmId: bundle.regionId // all old osms are keyed by region id
        }
      }
    )
  }
})

module.exports.down = function(next) {
  console.log('Nothing to do')
  next()
}
