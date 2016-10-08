/* globals jest */

import Leaflet from 'leaflet'

Leaflet.geoJson = jest.fn(() => { return { _leaflet_id: 1 } })

export default Leaflet
