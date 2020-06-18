import dynamic from 'next/dynamic'
import React from 'react'
import {GeoJSON} from 'react-leaflet'

import * as C from 'lib/constants'
import colors from 'lib/constants/colors'

const AddTripPatternLayer = dynamic(() => import('./add-trip-pattern-layer'))
const AdjustSpeedLayer = dynamic(() => import('./adjust-speed-layer'))
const PatternLayer = dynamic(() => import('./pattern-layer'))
const RerouteLayer = dynamic(() => import('./reroute-layer'))
const StopLayer = dynamic(() => import('./stop-layer'))

export default function Display(p) {
  const m = p.modification
  switch (m.type) {
    case C.ADD_STREETS:
      return (
        <GeoJSON
          data={{
            type: 'Feature',
            geometry: {
              type: 'MultiLineString',
              coordinates: m.lineStrings
            }
          }}
          style={{
            color: colors.ADDED,
            opacity: p.dim ? 0.5 : 1,
            weight: C.NEW_LINE_WEIGHT
          }}
        />
      )
    case C.MODIFY_STREETS:
      return (
        <GeoJSON
          data={{
            type: 'GeometryCollection',
            geometries: m.polygons.map((p) => ({
              type: 'Polygon',
              coordinates: [p]
            }))
          }}
          style={{
            color: colors.MODIFIED,
            opacity: p.dim ? 0.5 : 1
          }}
        />
      )
    case C.REMOVE_TRIPS:
      return (
        <PatternLayer
          color={colors.REMOVED}
          dim={p.dim}
          feed={p.feed}
          modification={m}
        />
      )
    case C.CONVERT_TO_FREQUENCY:
      return (
        <PatternLayer
          color={colors.MODIFIED}
          dim={p.dim}
          feed={p.feed}
          modification={m}
        />
      )
    case C.REMOVE_STOPS:
      return (
        <>
          <PatternLayer
            color={colors.NEUTRAL_LIGHT}
            dim={p.dim}
            feed={p.feed}
            modification={m}
          />
          <StopLayer
            feed={p.feed}
            modification={m}
            selectedColor={colors.REMOVED}
            unselectedColor={colors.NEUTRAL_LIGHT}
          />
        </>
      )
    case C.ADJUST_DWELL_TIME:
      return (
        <>
          <PatternLayer
            color={colors.NEUTRAL_LIGHT}
            dim={p.dim}
            feed={p.feed}
            modification={m}
          />
          <StopLayer
            feed={p.feed}
            modification={m}
            nullIsWildcard
            selectedColor={colors.MODIFIED}
          />
        </>
      )
    case C.ADJUST_SPEED:
      return <AdjustSpeedLayer dim={p.dim} feed={p.feed} modification={m} />
    case C.REROUTE:
      return <RerouteLayer dim={p.dim} feed={p.feed} modification={m} />
    case C.ADD_TRIP_PATTERN:
      return (
        <AddTripPatternLayer
          dim={p.dim}
          bidirectional={m.bidirectional}
          segments={m.segments}
        />
      )
    default:
      return null
  }
}
