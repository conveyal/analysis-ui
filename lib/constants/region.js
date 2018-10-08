// @flow
import reprojectCoordinates from '../utils/reproject-coordinates'

export const CREATING_ID = '__CREATING_REGION__'

const ne = reprojectCoordinates([39.02345139405932, -76.81503295898438])
const sw = reprojectCoordinates([38.777640223073355, -77.25723266601562])

export const DEFAULT_BOUNDS = {
  north: ne.lat,
  east: ne.lng,
  south: sw.lat,
  west: sw.lng
}
