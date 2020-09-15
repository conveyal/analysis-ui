import {IncomingMessage, ServerResponse} from 'http'
import {Collection, ObjectID, FindOneOptions, FilterQuery} from 'mongodb'
import fpOmit from 'lodash/fp/omit'

import {getSession} from 'lib/auth0'
import {IUser} from 'lib/user'

import {connectToDatabase} from './connect'

/**
 * When the `adminTempAccessGroup` is set, use that instead.
 */
function getAccessGroup(session: IUser) {
  if (session.adminTempAccessGroup && session.adminTempAccessGroup.length > 0) {
    return session.adminTempAccessGroup
  }
  return session.accessGroup
}

// Omit _id, createdAt, createdBy, and accessGroup during updates
const omitImmutable = fpOmit(['_id', 'accessGroup', 'createdAt', 'createdBy'])

// Enabled collections
const collections = {
  presets: {
    // previously known as bookmarks
    singular: 'preset'
  },
  modifications: {
    singular: 'modification'
  },
  projects: {
    singular: 'project'
  },
  regions: {
    singular: 'region'
  }
}

/**
 * Ensure that all operations are only performed if the user has access.
 */
export default class AuthenticatedCollection {
  accessGroup: string // If admin, this may be the `adminTempAccessGroup`
  collection: Collection
  name: string
  singularName: string
  session: IUser

  /**
   * Async factory method for creating an AuthenticatedCollection at an HTTP endpoint. Can be
   * used in `getServerSideProps` or in `/pages/api/...` endpoints.
   */
  static async initialize(
    req: IncomingMessage,
    res: ServerResponse,
    collectionName: string
  ) {
    if (collections[collectionName] === undefined) {
      throw new Error(`Collection '${collectionName}' is not enabled.`)
    }

    let session = null
    try {
      session = await getSession(req)
    } catch (e) {
      console.error('Error while retrieving the session.', e)
    }
    if (session == null) {
      res.writeHead(302, {
        Location: '/api/login'
      })
      res.end()
      return
    }

    const {db} = await connectToDatabase()
    return new AuthenticatedCollection(
      collectionName,
      db.collection(collectionName),
      session
    )
  }

  constructor(name: string, collection: Collection, session: IUser) {
    this.accessGroup = getAccessGroup(session)
    this.collection = collection
    this.name = name
    this.singularName = collections[name].singular
    this.session = session
  }

  create(data: any) {
    return this.collection.insertOne({
      ...data,
      // Common fields
      _id: new ObjectID().toString(),
      accessGroup: this.accessGroup,
      nonce: new ObjectID().toString(),
      createdBy: this.session.email,
      updatedBy: this.session.email
    })
  }

  findAll() {
    return this.collection.find(
      {
        accessGroup: this.accessGroup
      },
      {
        sort: {
          name: 1
        }
      }
    )
  }

  findOne(_id: string) {
    return this.collection.findOne({
      accessGroup: this.accessGroup,
      _id
    })
  }

  /**
   * Always override access group to ensure user has permissions.
   */
  findWhere(query: FilterQuery<any> = {}, options?: FindOneOptions<any>) {
    return this.collection.find(
      {
        ...query,
        accessGroup: this.accessGroup
      },
      options
    )
  }

  remove(_id: string) {
    return this.collection.deleteOne({
      accessGroup: this.accessGroup,
      _id
    })
  }

  update(_id: string, newValues: any) {
    return this.collection.findOneAndUpdate(
      {
        _id,
        accessGroup: this.accessGroup,
        nonce: newValues.nonce
      },
      {
        $set: {
          ...omitImmutable(newValues),
          nonce: new ObjectID().toString(),
          updatedBy: this.session.email
        }
      }
    )
  }
}
