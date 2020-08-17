import {MongoDataSource} from 'apollo-datasource-mongodb'

interface RegionDocument {
  _id: string
  name: string
}

interface Context {
  accessGroup: string
}

export default class Region extends MongoDataSource<RegionDocument, Context> {}
