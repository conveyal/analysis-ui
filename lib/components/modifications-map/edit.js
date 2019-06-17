import lonlat from '@conveyal/lonlat'
import get from 'lodash/get'
import dynamic from 'next/dynamic'
import React from 'react'
import {CircleMarker, GeoJSON} from 'react-leaflet'
import {useSelector} from 'react-redux'

import * as C from 'lib/constants'
import colors from 'lib/constants/colors'
import selectQualifiedStops from 'lib/selectors/qualified-stops-from-segments'
import selectSegments from 'lib/selectors/segments'
import selectStopsFromAllFeeds from 'lib/selectors/stops-from-all-feeds'
import * as reroute from 'lib/utils/update-add-stops-terminus'

const GTFSStopGridLayer = dynamic(() => import('./gtfs-stop-gridlayer'))
const HopSelectPolygon = dynamic(() => import('./hop-select-polygon'))
const StopLayer = dynamic(() => import('./stop-layer'))
const StopSelectPolygon = dynamic(() => import('./stop-select-polygon'))
const TransitEditor = dynamic(() => import('./transit-editor'))

export default function Edit(p) {
  const allStops = useSelector(selectStopsFromAllFeeds)
  const qualifiedStops = useSelector(selectQualifiedStops)
  const segments = useSelector(selectSegments)
  const m = p.modification

  switch (p.mapState.state) {
    case C.MAP_STATE_HIGHLIGHT_SEGMENT: {
      const segment = segments[p.mapState.segmentIndex]
      return (
        <GeoJSON
          data={segment.geometry.coordinates.map(lonlat.toLeaflet)}
          color={colors.HIGHLIGHT}
          weight={6}
        />
      )
    }
    case C.MAP_STATE_HIGHTLIGHT_STOP: {
      const stop = qualifiedStops[p.mapState.stopIndex]
      return (
        <CircleMarker
          center={[stop.lat, stop.lon]}
          fillOpacity={1}
          color={colors.ACTIVE}
          radius={5}
        />
      )
    }
    case C.MAP_STATE_STOP_SELECTION:
      return (
        <StopSelectPolygon
          action={p.mapState.action}
          currentStops={p.modification.stops}
          update={stops => {
            p.updateModification({stops})
            p.setMapState()
          }}
        />
      )
    case C.MAP_STATE_HOP_SELECTION:
      return (
        <>
          <GTFSStopGridLayer stops={allStops} />
          <HopSelectPolygon
            action={p.mapState.action}
            allStops={allStops}
            currentHops={p.modification.hops}
            update={hops => {
              p.updateModification({hops})
              p.setMapState()
            }}
          />
        </>
      )
    case C.MAP_STATE_TRANSIT_EDITOR:
      return (
        <>
          <GTFSStopGridLayer stops={allStops} />
          <TransitEditor
            allowExtend={p.mapState.allowExtend}
            allStops={allStops}
            extendFromEnd={p.mapState.extendFromEnd}
            followRoad={!!p.mapState.followRoad}
            modification={m}
            spacing={p.mapState.spacing}
            updateModification={p.updateModification}
          />
        </>
      )
    case C.MAP_STATE_SELECT_FROM_STOP:
      return (
        <StopLayer
          feed={p.feed}
          modification={p.modification}
          nullIsWildCard
          onSelect={s => {
            p.updateModification({
              fromStop: s.stop_id,
              segments: reroute.segmentsFromStop(
                s,
                get(p.modification, 'segments', []),
                `${get(p.modification, 'feed')}:${s.stop_id}`
              )
            })
            p.setMapState()
          }}
          selectedColor={colors.ACTIVE}
        />
      )
    case C.MAP_STATE_SELECT_TO_STOP:
      return (
        <StopLayer
          feed={p.feed}
          modification={p.modification}
          nullIsWildCard
          onSelect={s => {
            p.updateModification({
              toStop: s.stop_id,
              segments: reroute.segmentsToStop(
                s,
                get(p.modification, 'segments', []),
                `${get(p.modification, 'feed')}:${s.stop_id}`
              )
            })
            p.setMapState()
          }}
          selectedColor={colors.ACTIVE}
        />
      )
  }
}
