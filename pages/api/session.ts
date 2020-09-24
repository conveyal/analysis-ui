import {NextApiRequest, NextApiResponse} from 'next'

import initAuth0, {getUser} from 'lib/auth0'

export default function session(req, res) {
  const auth0 = initAuth0(req)
  auth0.requireAuthentication(
    async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        res.json(await getUser(req))
      } catch (error) {
        console.error(error)
        res.status(error.status || 500).end(error.message)
      }
    }
  )(req, res)
}
