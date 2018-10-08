// @flow
import reprojectCoordinates from '../utils/reproject-coordinates'

export const CREATING_ID = '__CREATING_REGION__'

const ne = reprojectCoordinates([39.02345, -76.81503])
const sw = reprojectCoordinates([38.77764, -77.25723])

export const DEFAULT_BOUNDS = {
  north: ne.lat,
  east: ne.lng,
  south: sw.lat,
  west: sw.lng
}
