import {NextApiRequest, NextApiResponse} from 'next'

import auth0, {getUser} from 'lib/auth0'

export default auth0.requireAuthentication(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      res.json(await getUser(req))
    } catch (error) {
      console.error(error)
      res.status(error.status || 500).end(error.message)
    }
  }
)
