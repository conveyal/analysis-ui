// @flow

import type {Feed, GTFSStop} from '../types'

export default function getStopsFromFeeds (feeds: Feed[]): GTFSStop[] {
  return [].concat(
    ...feeds.map(feed =>
      feed.stops.map(gtfsStop => ({
        stop_id: `${feed.id}:${gtfsStop.stop_id}`,
        stop_lat: gtfsStop.stop_lat,
        stop_lon: gtfsStop.stop_lon,
        stop_name: gtfsStop.stop_name
      }))
    )
  )
}
