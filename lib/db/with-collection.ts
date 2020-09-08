import {NextApiResponse, NextApiRequest} from 'next'

import auth0 from 'lib/auth0'
import {errorToPOJO, getQueryAsString} from 'lib/utils/api'

import AuthenticatedCollection from './authenticated-collection'

type Handler = (
  req: NextApiRequest,
  res: NextApiResponse,
  collection: AuthenticatedCollection
) => Promise<void>

/**
 * Create a common handler for AuthenticatedCollections that:
 * 1. Catch and handle errors that may occur during initialization.
 * 2. Ensure the user is authenticated.
 */
export default function withCollection(handler: Handler) {
  return auth0.requireAuthentication(
    async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        const collectionName = getQueryAsString(req.query.collection)
        const collection = await AuthenticatedCollection.initialize(
          req,
          res,
          collectionName
        )
        await handler(req, res, collection)
      } catch (e) {
        res.status(400).json(errorToPOJO(e))
      }
    }
  )
}
