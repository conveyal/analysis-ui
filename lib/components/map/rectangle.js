import React from 'react'
import {Rectangle} from 'react-leaflet'

import {toLatLngBounds} from 'lib/utils/bounds'

export default function R(p) {
  return <Rectangle {...p} bounds={toLatLngBounds(p.bounds)} />
}
