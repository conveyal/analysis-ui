import Leaflet from 'leaflet'

import {MB_TOKEN} from 'lib/constants'
const MB_URL = 'https://api.mapbox.com/styles/v1/conveyal'
const MB_STYLE =
  process.env.NEXT_PUBLIC_MAPBOX_STYLE || 'conveyal/cjwu7oipd0bf41cqqv15huoim' // based off "Light"

/**
 * Allow passing a style to get the full Leaflet url.
 */
export function getTileUrl(style = MB_STYLE) {
  // TODO does not appear to be called anywhere (MWC 2020-07-02)
  return `${MB_URL}/${style}/tiles/256/{z}/{x}/{y}@2x?access_token=${MB_TOKEN}`
}

/**
 * There were universal settings for Leaflet that made importing it from a local
 * file instead of the library a good idea.
 */
export default Leaflet
