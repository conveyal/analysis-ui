import {ApolloServer, gql} from 'apollo-server-micro'
import mongodb from 'mongodb'

import auth0 from 'lib/auth0'
import Regions from 'lib/data-sources/regions'

const AUTH_DISABLED = process.env.NEXT_PUBLIC_AUTH_DISABLED === 'true' // used client side also
const DEFAULT_USER = {accessGroup: 'local', email: 'local'}

const defaultDB = process.env.MONGODB_DB || 'analysis'
const MongoClient = mongodb.MongoClient
const client = new MongoClient(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
client.connect()

const dataSources = () => ({
  regions: new Regions(client.db(defaultDB).collection('regions'))
})

const typeDefs = gql`
  type Query {
    regions: [Region!]!
  }
  type Region {
    _id: ID
    createdBy: String
    name: String
  }
  type Bookmark {
    _id: ID
    regionId: String
  }
`
const resolvers = {
  Query: {
    regions(parent, args, context) {
      return context.dataSources.regions.collection
        .find({accessGroup: context.user.accessGroup}, {sort: {name: 1}})
        .toArray()
    }
  }
}

const apolloServer = new ApolloServer({
  context: async ({req}) => {
    if (AUTH_DISABLED) return {user: DEFAULT_USER}
    const session = await auth0.getSession(req)
    if (!session || !session.user) throw new Error('Must be logged in.')
    return {
      user: {
        accessGroup: session.user['http://conveyal/accessGroup'],
        email: session.user.name
      }
    }
  },
  dataSources,
  resolvers,
  typeDefs
})

export default apolloServer.createHandler({
  path: '/api/graphql'
})

// Apollo parses the body on it's own
export const config = {
  api: {
    bodyParser: false
  }
}
