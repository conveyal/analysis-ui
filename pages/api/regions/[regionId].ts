import {NextApiResponse, NextApiRequest} from 'next'

import auth0, {getSession} from 'lib/auth0'
import AuthenticatedCollection from 'lib/db/authenticated-collection'

export default auth0.requireAuthentication(async function regions(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const session = await getSession(req)
  const collection = await AuthenticatedCollection.initialize(
    'regions',
    session
  )
  const regionId: string = Array.isArray(req.query.regionId)
    ? req.query.regionId[0]
    : req.query.regionId

  switch (req.method) {
    case 'GET': {
      try {
        const region = await collection.findOne(regionId)
        if (!region) {
          res.status(404).end()
        } else {
          res.json(region)
        }
      } catch (e) {
        res.status(400).json({message: 'Error getting region.', error: e})
      }
      break
    }
    case 'PUT': {
      try {
        const updateResult = await collection.update(regionId, req.body)
        if (!updateResult || !updateResult.ok) {
          res.status(404).json({message: 'Region does not exist.'})
        } else {
          res.json(updateResult.value)
        }
      } catch (e) {
        res.status(400).json({message: 'Error updating region.', error: e})
      }
      break
    }
    case 'DELETE': {
      try {
        const result = await collection.remove(regionId)
        if (result) {
          res.status(200).json({message: 'Region has been deleted.'})
        } else {
          res.status(400).json({message: 'Region deletion has failed'})
        }
      } catch (e) {
        res.status(400).json({message: 'Error deleting region.', error: e})
      }
      break
    }
    default: {
      res.setHeader('Allow', ['DELETE', 'GET', 'PUT'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  }
})
