// @flow
import inside from '@turf/inside'
import {point} from '@turf/helpers'
import memoize from 'memoize-one'
import React from 'react'

import type {Feature, GTFSStop} from '../../types'

import DrawPolygon from './draw-polygon'

type Props = {
  routeStops: GTFSStop[],
  selectStops: (string[]) => void
}

/**
 * Select stops using a polygon select
 */
export default function StopSelectPolygon (props: Props) {
  return (
    <DrawPolygon
      activateOnMount
      onPolygon={_onPolygon(props.routeStops, props.selectStops)}
    />
  )
}

const _onPolygon = memoize((routeStops, selectStops) => (polygon: Feature) => {
  selectStops(
    routeStops
      .filter(s => inside(point([s.stop_lon, s.stop_lat]), polygon))
      .map(s => s.stop_id)
  )
})
