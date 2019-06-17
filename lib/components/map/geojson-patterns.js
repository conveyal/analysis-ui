import React from 'react'
import {GeoJSON} from 'react-leaflet'
import uuid from 'uuid'

export default function Patterns(p) {
  const {patterns} = p
  const geometry = React.useMemo(
    () => ({
      key: uuid.v4(),
      type: 'FeatureCollection',
      features: patterns.map(pat => ({
        type: 'Feature',
        geometry: pat.geometry
      }))
    }),
    [patterns]
  )

  return (
    <GeoJSON data={geometry} color={p.color} key={geometry.key} weight={3} />
  )
}
