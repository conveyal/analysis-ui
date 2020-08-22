import {NextApiResponse, NextApiRequest} from 'next'

import auth0, {getAccessGroup} from 'lib/auth0'
import {connectToDatabase} from 'lib/db'

export default auth0.requireAuthentication(async function regions(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const accessGroup = await getAccessGroup(req)
  const {db} = await connectToDatabase()
  const regions = await db
    .collection('regions')
    .find({accessGroup}, {sort: {name: 1}})
    .toArray()
  res.json(regions)
})
