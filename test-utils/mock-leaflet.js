/* globals jest */

import Leaflet from 'leaflet'
import uniqueId from 'lodash.uniqueid'

// add a div to jsdom for enzyme to mount to
const div = document.createElement('div')
div.id = 'test'
document.body.appendChild(div)

// implementation for creating leaflet objects
const makeUniqueLeafletIdFn = (prefix) => {
  return () => {
    return {
      _leaflet_id: uniqueId(prefix)
    }
  }
}

// mock these things w/ jest so that it can be verified that
// elements are to be created by react-leaflet
Leaflet.geoJson = jest.fn(makeUniqueLeafletIdFn('geoJson'))
Leaflet.marker = jest.fn(makeUniqueLeafletIdFn('marker'))

export default Leaflet
