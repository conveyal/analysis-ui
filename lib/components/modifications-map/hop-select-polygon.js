import React from 'react'
import pointInPolygon from '@turf/boolean-point-in-polygon'
import {point} from '@turf/helpers'

import DrawPolygon from './draw-polygon'
import GTFSStopGridLayer from './gtfs-stop-gridlayer'

/**
 * Select stops using a polygon select
 */
export default function HopSelectPolygon(p) {
  const onPolygon = React.useCallback(
    polygon => {
      p.selectHops(
        p.hopStops
          .filter(
            hop =>
              pointInPolygon(
                point([hop[0].stop_lon, hop[0].stop_lat]),
                polygon
              ) &&
              pointInPolygon(point([hop[1].stop_lon, hop[1].stop_lat]), polygon)
          )
          .map(hop => [hop[0].stop_id, hop[1].stop_id])
      )
    },
    [p]
  )

  return (
    <>
      <DrawPolygon activateOnMount onPolygon={onPolygon} />
      <GTFSStopGridLayer stops={p.allStops} />
    </>
  )
}
