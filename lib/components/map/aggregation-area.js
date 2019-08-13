import React from 'react'
import {useSelector} from 'react-redux'

import selectAggregationAreaOutline from 'lib/selectors/aggregation-area-outline'

import GeoJSON from './geojson'

/**
 * Display an aggregation area as an outline on the map
 */
export default function AggregationArea() {
  const data = useSelector(selectAggregationAreaOutline)
  return <GeoJSON data={data} />
}
