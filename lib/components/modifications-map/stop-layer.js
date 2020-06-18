import React from 'react'
import {CircleMarker} from 'react-leaflet'

const STOP_RADIUS = 4

export default function StopLayer(p) {
  const routeStops = React.useMemo(
    () => getUniqueStops(p.feed, p.modification),
    [p.feed, p.modification]
  )

  const showUnselected = !!p.unselectedColor

  const isSelected = (s) =>
    p.modification.stops == null
      ? p.nullIsWildcard
      : p.modification.stops.includes(s.stop_id)

  return (
    <>
      {showUnselected &&
        routeStops
          .filter((s) => !isSelected(s))
          .map((s) => (
            <CircleMarker
              center={[s.stop_lat, s.stop_lon]}
              key={s.stop_id}
              color={p.unselectedColor}
              onClick={() => p.onSelect && p.onSelect(s)}
              radius={STOP_RADIUS}
            />
          ))}
      {routeStops.filter(isSelected).map((s) => (
        <CircleMarker
          center={[s.stop_lat, s.stop_lon]}
          key={s.stop_id}
          color={p.selectedColor}
          onClick={() => p.onSelect && p.onSelect(s)}
          radius={STOP_RADIUS}
        />
      ))}
    </>
  )
}

function getUniqueStops(feed, modification) {
  if (!feed || modification.routes == null) return []
  const route = feed.routes.find((r) => r.route_id === modification.routes[0])
  if (!route || !route.patterns) return []
  let patterns = route.patterns

  if (modification.trips !== null) {
    patterns = patterns.filter((p) =>
      p.trips.find((t) => modification.trips.includes(t.trip_id))
    )
  }

  return getUniqueStopsForPatterns({
    patterns,
    stopsById: feed.stopsById
  })
}

function getUniqueStopsForPatterns({patterns, stopsById}) {
  const routeStopIds = new Set()
  patterns.forEach((p) => {
    p.stops.forEach((s) => routeStopIds.add(s.stop_id))
  })
  const stops = []
  routeStopIds.forEach((sid) => stops.push(stopsById[sid]))
  return stops
}
