import {Collection, ObjectID} from 'mongodb'
import fpOmit from 'lodash/fp/omit'

import {IUser} from 'lib/user'

import {connectToDatabase} from './connect'

function getAccessGroup(session: IUser) {
  if (session.adminTempAccessGroup && session.adminTempAccessGroup.length > 0) {
    return session.adminTempAccessGroup
  }
  return session.accessGroup
}

// Omit _id during updates
const omitId = fpOmit(['_id'])

/**
 * Ensure that all operations are only performed if the user has access.
 */
export default class AuthenticatedCollection {
  accessGroup: string
  collection: Collection
  session: IUser

  static async initialize(
    collectionName: string,
    session: IUser
  ): Promise<AuthenticatedCollection> {
    const {db} = await connectToDatabase()
    return new AuthenticatedCollection(db.collection(collectionName), session)
  }

  constructor(collection: Collection, session: IUser) {
    this.accessGroup = getAccessGroup(session)
    this.collection = collection
    this.session = session
  }

  hasAccess(document: void | any) {
    return document && document.accessGroup === this.accessGroup
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
        accessGroup: this.session.accessGroup
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
          ...omitId(newValues),
          nonce: new ObjectID().toString(),
          updatedBy: this.session.email
        }
      }
    )
  }
}
