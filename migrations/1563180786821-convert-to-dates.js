const handler = require('../db/migration-handler')

const collections = [
  'aggregationAreas',
  'bookmarks',
  'bundles',
  'modifications',
  'opportunityDatasets',
  'projects',
  'regional-analyses',
  'regions'
]

module.exports.up = handler(async function(db) {
  for (const collectionName of collections) {
    const collection = db.collection(collectionName)
    const cursor = collection.find()
    while (await cursor.hasNext()) {
      const doc = await cursor.next()
      const _id = doc._id
      if (typeof doc.createdAt === 'number') {
        await collection.updateOne(
          {_id},
          {
            $set: {
              createdAt: new Date(doc.createdAt)
            }
          }
        )
      }

      if (typeof doc.updatedAt === 'number') {
        await collection.updateOne(
          {_id},
          {
            $set: {
              updatedAt: new Date(doc.updatedAt)
            }
          }
        )
      }
    }
  }
})

module.exports.down = handler(async function() {})
