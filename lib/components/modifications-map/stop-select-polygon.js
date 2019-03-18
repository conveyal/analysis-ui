// @flow
import pointInPolygon from '@turf/boolean-point-in-polygon'
import {point} from '@turf/helpers'
import React from 'react'

import type {GTFSStop} from '../../types'

import DrawPolygon from './draw-polygon'

type Props = {
  routeStops: GTFSStop[],
  selectStops: (string[]) => void
}

/**
 * Select stops using a polygon select
 */
export default function StopSelectPolygon (props: Props) {
  function _onPolygon (polygon) {
    props.selectStops(
      props.routeStops
        .filter(s => pointInPolygon(point([s.stop_lon, s.stop_lat]), polygon))
        .map(s => s.stop_id)
    )
  }

  return (
    <DrawPolygon
      activateOnMount
      onPolygon={_onPolygon}
    />
  )
}
