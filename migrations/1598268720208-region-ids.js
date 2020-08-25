const handler = require('../db/migration-handler')

module.exports.up = handler(function (db) {
  const bulk = db.collection('regions').initializeUnorderedBulkOp()
  bulk.find({_id: {$type: 'string'}}).update([
    {
      $set: {
        _id: {
          $convert: {
            input: '$_id',
            to: 'objectId'
          }
        }
      }
    }
  ])
  bulk.find({nonce: {$type: 'string'}}).update([
    {
      $set: {
        nonce: {
          $convert: {
            input: '$nonce',
            to: 'objectId'
          }
        }
      }
    }
  ])
  bulk.find({}).update({
    $unset: {
      createdAt: '', // can be retrieved from the _id
      updatedAt: '' // can be retreived from the nonce
    }
  })
  return bulk.execute()
})

module.exports.down = handler(function () {})
