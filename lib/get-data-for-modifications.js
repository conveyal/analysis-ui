/** use the graphql api to get data needed for modifications */

import dbg from 'debug'

const debug = dbg('scenario-editor:get-data-for-modifications')

const query = `
query dataQuery($bundleId: String, $routeIds: [String]) {
  bundle (bundle_id: $bundleId) {
    feeds {
      feed_id,
      routes {
        route_id
        route_short_name
        route_long_name
      }

      detailRoutes: routes(route_id: $routeIds) {
        route_id
        route_short_name
        route_long_name
        patterns {
          name,
          pattern_id,
          geometry,
          trips {
            trip_id,
            trip_short_name,
            trip_headsign,
            start_time,
            duration
          },
          stops {
            stop_id
          }
        }
      }

      stops {
        stop_id,
        stop_name,
        stop_lat,
        stop_lon
      }
    }
  }
}
`

export default function getDataForModifications ({ modifications, bundleId }) {
  // for every route referenced in the scenario we get the patterns
  let routes = new Set()

  for (let modification of modifications) {
    if (modification.type === 'remove-trips' || modification.type === 'remove-stops' || modification.type === 'adjust-speed' || modification.type === 'adjust-dwell-time') {
      // NB we are in fact getting all routes in every feed that have this route ID, which means we're pulling down a bit more data than we need to but
      // it's pretty benign
      if (modification.routes !== null) modification.routes.forEach(r => routes.add(r))
    }
  }

  // make the request
  let vars = {
    bundleId,
    routeIds: [...routes]
  }
  
  return fetch(`/graphql?query=${encodeURIComponent(query)}&variables=${encodeURIComponent(JSON.stringify(vars))}`)
    .then(res => res.json())
    .then(res => {
      // turn it into a bunch of maps
      return new Map(res.bundle.feeds.map(feed => {
        let routes = new Map()

        feed.routes.forEach(r => routes.set(r.route_id, r))
        // detailRoutes will overwrite less detailed routes
        feed.detailRoutes.forEach(r => routes.set(r.route_id, r))

        let stops = new Map(feed.stops.map((s) => [s.stop_id, s]))

        return [feed.feed_id, { routes, stops }]
      }))
    })

}
