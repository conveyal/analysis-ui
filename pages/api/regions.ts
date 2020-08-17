import {NextApiResponse} from 'next'

import {getDB} from 'db/connect'

export default async (_, res: NextApiResponse) => {
  const db = await getDB()
  const regions = await db
    .collection('regions')
    .find({accessGroup: 'local'}, {sort: {name: 1}})
    .toArray()
  res.json(regions)
}
