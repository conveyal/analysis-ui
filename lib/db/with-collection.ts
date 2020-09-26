import {NextApiResponse, NextApiRequest} from 'next'

import initAuth0, {getUser} from 'lib/auth0'
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
  return function apiHandler(
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<void> {
    const auth0 = initAuth0(req)
    return auth0.requireAuthentication(
      async (req: NextApiRequest, res: NextApiResponse) => {
        try {
          const name = getQueryAsString(req.query.collection)
          const user = await getUser(req)
          const collection = await AuthenticatedCollection.initFromUser(
            name,
            user
          )
          await handler(req, res, collection)
        } catch (e) {
          res.status(400).json(errorToPOJO(e))
        }
      }
    )(req, res)
  }
}
