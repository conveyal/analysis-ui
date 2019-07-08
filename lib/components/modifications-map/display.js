import React from 'react'
import {useLeaflet} from 'react-leaflet'
import {useSelector} from 'react-redux'

import * as C from 'lib/constants'
import colors from 'lib/constants/colors'
import useOnMount from 'lib/hooks/use-on-mount'
import selectModificationBounds from 'lib/selectors/modification-bounds'

import AddTripPatternLayer from './add-trip-pattern-layer'
import AdjustSpeedLayer from './adjust-speed-layer'
import PatternLayer from './pattern-layer'
import RerouteLayer from './reroute-layer'
import StopLayer from './stop-layer'

export default function Display(p) {
  const bounds = useSelector(selectModificationBounds)
  const leaflet = useLeaflet()

  // Zoom to bounds on bounds change
  useOnMount(() => {
    if (bounds) leaflet.map.fitBounds(bounds)
  })

  const m = p.modification
  switch (m.type) {
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
            color={colors.NEUTRAL}
            dim={p.dim}
            feed={p.feed}
            modification={m}
          />
          <StopLayer
            feed={p.feed}
            modification={m}
            selectedColor={colors.REMOVED}
          />
        </>
      )
    case C.ADJUST_DWELL_TIME:
      return (
        <>
          <PatternLayer
            color={colors.NEUTRAL}
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
      return (
        <RerouteLayer
          dim={p.dim}
          feed={p.feed}
          modification={m}
          showAddedSegment
        />
      )
    case C.ADD_TRIP_PATTERN:
      return (
        <AddTripPatternLayer
          dim={p.dim}
          bidirectional={m.bidirectional}
          segments={m.segments}
        />
      )
  }
}
