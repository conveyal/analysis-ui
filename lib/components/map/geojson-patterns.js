import React from 'react'

import GeoJSON from './geojson'

export default React.memo(function Patterns(p) {
  const geometry = {
    type: 'FeatureCollection',
    features: p.patterns.map(pat => ({
      type: 'Feature',
      geometry: pat.geometry
    }))
  }

  return <GeoJSON data={geometry} color={p.color} weight={3} />
})
