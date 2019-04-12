import pointInPolygon from '@turf/boolean-point-in-polygon'
import {point} from '@turf/helpers'
import React from 'react'

import DrawPolygon from './draw-polygon'

/**
 * Select stops using a polygon select
 */
export default function StopSelectPolygon (p) {
  const onPolygon = React.useCallback((polygon) => {
    p.selectStops(
      p.routeStops
        .filter(s => pointInPolygon(point([s.stop_lon, s.stop_lat]), polygon))
        .map(s => s.stop_id)
    )
  }, [p.selectStops, p.routeStops])

  return (
    <DrawPolygon
      activateOnMount
      onPolygon={onPolygon}
    />
  )
}
