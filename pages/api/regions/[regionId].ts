import {NextApiResponse, NextApiRequest} from 'next'

import auth0, {getAccessGroup} from 'lib/auth0'
import {connectToDatabase} from 'lib/db'

export default auth0.requireAuthentication(async function regions(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const accessGroup = await getAccessGroup(req)
  const {db} = await connectToDatabase()
  const region = await db
    .collection('regions')
    .findOne({_id: req.query.regionId})

  if (!region) {
    res.statusCode = 404
    res.json({message: 'Region does not exist.'})
  } else if (region.accessGroup !== accessGroup) {
    res.statusCode = 403
    res.json({message: 'User does not have access to this region.'})
  } else {
    res.json(region)
  }
})
