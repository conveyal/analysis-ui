/* globals jest */

import Leaflet from 'leaflet'
import uniqueId from 'lodash.uniqueid'

const makeUniqueLeafletIdFn = (prefix) => {
  return () => {
    return {
      _leaflet_id: uniqueId(prefix)
    }
  }
}

Leaflet.geoJson = jest.fn(makeUniqueLeafletIdFn('geoJson'))
Leaflet.marker = jest.fn(makeUniqueLeafletIdFn('marker'))

export default Leaflet
