import React from 'react'
import {FeatureGroup, CircleMarker} from 'react-leaflet'

export default function StopLayer(p) {
  const routeStops = React.useMemo(
    () => getUniqueStops(p.feed, p.modification),
    [p.feed, p.modification]
  )

  const isSelected = s =>
    (p.nullIsWildcard && p.modification.stops == null) ||
    (p.modification.stops && p.modification.stops.includes(s.stop_id))

  return (
    <FeatureGroup>
      {routeStops.map(s => (
        <CircleMarker
          center={[s.stop_lat, stop.stop_lon]}
          key={s.stop_id}
          color={isSelected(s) ? p.selectedColor : p.unselectedColor}
          onClick={() => p.onSelect && p.onSelect(s)}
          radius={4}
        />
      ))}
    </FeatureGroup>
  )
}

function getUniqueStops(feed, modification) {
  if (!feed || modification.routes == null) return []
  const route = feed.routes.find(r => r.route_id === modification.routes[0])
  if (!route || !route.patterns) return []
  let patterns = route.patterns

  if (modification.trips !== null) {
    patterns = patterns.filter(p =>
      p.trips.find(t => modification.trips.includes(t.trip_id))
    )
  }

  return getUniqueStopsForPatterns({
    patterns,
    stopsById: feed.stopsById
  })
}

function getUniqueStopsForPatterns({patterns, stopsById}) {
  const routeStopIds = new Set()
  patterns.forEach(p => {
    p.stops.forEach(s => routeStopIds.add(s.stop_id))
  })
  const stops = []
  routeStopIds.forEach(sid => stops.push(stopsById[sid]))
  return stops
}
