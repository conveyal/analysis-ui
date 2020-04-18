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

module.exports.up = handler(async function (db) {
  let updates = 0
  for (const collectionName of collections) {
    console.time(collectionName)
    const collection = db.collection(collectionName)
    const cursor = collection.find()

    while (await cursor.hasNext()) {
      const doc = await cursor.next()
      const _id = doc._id
      console.time(_id)
      if (typeof doc.createdAt === 'number') {
        await collection.updateOne(
          {_id},
          {
            $set: {
              createdAt: new Date(doc.createdAt)
            }
          }
        )
        console.log(`${updates++}: ${_id} converted createdAt to date`)
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
        console.log(`${updates++}: ${_id} converted updatedAt to date`)
      }
      console.timeEnd(_id)
    }

    console.timeEnd(collectionName)
  }
})

module.exports.down = handler(async function () {})
