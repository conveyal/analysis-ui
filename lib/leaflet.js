import Leaflet from 'leaflet'

/**
 * There were universal settings for Leaflet that made importing it from a local
 * file instead of the library a good idea.
 */
export default Leaflet

const MAPTILER_KEY = process.env.MAPTILER_KEY
export function getTileUrl(map = 'positron') {
  return `https://api.maptiler.com/maps/${map}/256/{z}/{x}/{y}@2x.png?key=${MAPTILER_KEY}`
}
