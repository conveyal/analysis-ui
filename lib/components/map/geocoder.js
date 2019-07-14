import lonlat from '@conveyal/lonlat'
import get from 'lodash/get'
import React from 'react'
import Select from 'react-select/async'

import mapboxSearch from 'lib/utils/mapbox-search'

import {selectStyles} from '../select'

const geocoderStyle = {
  position: 'absolute',
  top: '10px',
  left: '10px',
  width: '296px',
  zIndex: '1000'
}

export default function Geocoder(p) {
  function panToResult(r) {
    const map = p.getMap()
    if (r && map) {
      if (r.bbox) {
        const [west, south, east, north] = r.bbox
        const bounds = [[south, west], [north, east]]
        map.fitBounds(bounds)
      } else {
        map.setView([r.center[1], r.center[0]], 19)
      }
      map.fire('geocode', r)
    }
  }

  function searchWithProximity(t, callback) {
    const map = p.getMap()
    mapboxSearch(
      t,
      {
        proximity: map ? lonlat.toString(map.getCenter()) : ''
      },
      callback
    )
  }

  return (
    <div style={geocoderStyle}>
      <Select
        isDisabled={p.disabled}
        getOptionLabel={f => get(f, 'place_name')}
        getOptionValue={f => get(f, 'id')}
        loadOptions={searchWithProximity}
        onChange={panToResult}
        placeholder='Search map...'
        styles={selectStyles}
      />
    </div>
  )
}
