import pointInPolygon from '@turf/boolean-point-in-polygon'
import {point} from '@turf/helpers'
import React from 'react'
import {useSelector} from 'react-redux'

import selectRouteStops from 'lib/selectors/route-stops'

import DrawPolygon from './draw-polygon'

/**
 * Select stops using a polygon select
 */
export default function StopSelectPolygon(p) {
  const routeStops = useSelector(selectRouteStops)
  function onPolygon(polygon) {
    const selectedStops = routeStops
      .filter((s) => pointInPolygon(point([s.stop_lon, s.stop_lat]), polygon))
      .map((s) => s.stop_id)

    switch (p.action) {
      case 'add':
        p.update([...new Set([...p.currentStops, ...selectedStops])])
        break
      case 'new':
        p.update(selectedStops)
        break
      case 'remove':
        p.update(p.currentStops.filter((sid) => !selectedStops.includes(sid)))
        break
    }
  }

  return <DrawPolygon activateOnMount onPolygon={onPolygon} />
}
