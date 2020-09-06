import {NextApiResponse, NextApiRequest} from 'next'

import auth0, {getSession} from 'lib/auth0'
import AuthenticatedCollection from 'lib/db/authenticated-collection'

const getAsString = (p: string | string[]) => (Array.isArray(p) ? p[0] : p)

export default auth0.requireAuthentication(async function collection(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const session = await getSession(req)
  const collectionName = getAsString(req.query.collection)
  const collection = await AuthenticatedCollection.initialize(
    collectionName,
    session
  )

  switch (req.method) {
    case 'GET': {
      try {
        const documents = await collection.findAll().toArray()
        res.json(documents)
      } catch (e) {
        res.status(400).json({message: 'Error finding documents.', error: e})
      }
      break
    }
    case 'POST': {
      try {
        const document = await collection.create(req.body)
        res.status(201).json(document.ops[0])
      } catch (e) {
        res.status(400).json({message: 'Error creating document.', error: e})
      }
      break
    }
    default: {
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  }
})
