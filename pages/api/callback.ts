import {NextApiRequest, NextApiResponse} from 'next'

import initAuth0 from 'lib/auth0'

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const auth0 = initAuth0(req)
    await auth0.handleCallback(req, res, {
      redirectTo: Array.isArray(req.query.redirectTo)
        ? req.query.redirectTo[0]
        : req.query.redirectTo
    })
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
}
