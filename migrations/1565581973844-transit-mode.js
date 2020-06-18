const handler = require('../db/migration-handler')

module.exports.up = handler(async function (db) {
  const modifications = db.collection('modifications')
  const results = await modifications.updateMany(
    {
      type: 'add-trip-pattern',
      transitMode: null
    },
    {
      $set: {transitMode: 0}
    }
  )
  console.log(`Modified ${results.modifiedCount} modifications`)
})

module.exports.down = handler(function () {})
