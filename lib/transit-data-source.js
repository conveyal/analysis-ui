/** use the graphql api to get data needed for modifications */

import authenticatedFetch, {parseJSON} from './utils/authenticated-fetch'

const query = `
query dataQuery($bundleId: String, $routeIds: [String]) {
  bundle (bundle_id: [$bundleId]) {
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

  availableBundles: bundle {
    id,
    name,
    status,
    centerLat,
    centerLon
  }
}
`

/** query to get detailed information on a particular route */
// TODO avoid copy paste here
const routeQuery = `
query routeQuery($bundleId: String, $routeIds: [String]) {
  bundle (bundle_id: [$bundleId]) {
    feeds {
      feed_id,
      routes(route_id: $routeIds) {
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
    }
  }
}`

class TransitDataSource {
  constructor () {
    this.callbacks = []
    this.data = {
      bundles: [],
      feeds: {}
    }
  }

  getDataForModifications ({ modifications, bundleId, forceCompleteUpdate = false }) {
    let completeFetch = bundleId !== this.bundleId || forceCompleteUpdate
    this.bundleId = bundleId

    // for every route referenced in the scenario we get the patterns
    let routes = new Set()

    for (let modification of modifications) {
      if (modification.type === 'remove-trips' || modification.type === 'remove-stops' || modification.type === 'adjust-speed' ||
        modification.type === 'adjust-dwell-time' || modification.type === 'convert-to-frequency' || modification.type === 'add-stops') {
        // NB we are in fact getting all routes in every feed that have this route ID, which means we're pulling down a bit more data than we need to but
        // it's pretty benign
        if (modification.routes !== null) modification.routes.forEach((r) => routes.add(r))
      }
    }

    // make the request
    let vars = {
      bundleId,
      routeIds: [...routes]
    }

    if (completeFetch) {
      authenticatedFetch(`/api/graphql?query=${encodeURIComponent(query)}&variables=${encodeURIComponent(JSON.stringify(vars))}`)
        .then(parseJSON)
        .then((res) => {
          // turn it into a bunch of maps
          const feeds = {}

          if (res.bundle && res.bundle.length > 0) {
            res.bundle[0].feeds.forEach((feed) => {
              let routes = new Map()

              feed.routes.forEach((r) => routes.set(r.route_id, r))
              // detailRoutes will overwrite less detailed routes
              feed.detailRoutes.forEach((r) => routes.set(r.route_id, r))

              let stops = new Map(feed.stops.map((s) => [s.stop_id, s]))

              feeds[feed.feed_id] = { routes, stops, feed_id: feed.feed_id }
            })
          }

          // make sure the bundle ID hasn't changed in the meantime from a concurrent request
          if (bundleId === this.bundleId) {
            this.data = { feeds, bundles: res.availableBundles || [] }
            this.triggerUpdate()
          }
        })
    } else {
      // partial fetch, fetch only routes that are not already in the data.
      let routesToFetch = [...routes].filter((r) => {
        return !Object.values(this.data.feeds).includes((feed) => {
          return feed.routes.has(r) && feed.routes.get(r).patterns != null
        })
      })

      let vars = {
        bundleId,
        routeIds: routesToFetch
      }

      authenticatedFetch(`/api/graphql?query=${encodeURIComponent(routeQuery)}&variables=${encodeURIComponent(JSON.stringify(vars))}`)
        .then(parseJSON)
        .then((res) => {
          // if another request has changed the bundle out from under us, bail
          if (bundleId !== this.bundleId) return

          if (res.bundle && res.bundle.length > 0) {
            for (let feed of res.bundle[0].feeds) {
              for (let route of feed.routes) {
                // it's safe to modify the data object directly, because this is only additive; we're adding keys that no
                // one is using yet. It won't invalidate the state of any component using the existing data, so it's safe
                // to relax immutability requirements.
                this.data.feeds[feed.feed_id].routes.set(route.route_id, route)
              }
            }

            // we clone the top-level data object to signal that it has changed
            // either redux or react (not sure which) doesn't re-render compoennts/trigger updates
            // if the items in the store shallow-equal each other.
            // This is a cheap operation because we're not cloning the data itself, just the references to it in the top-level object.
            this.data = Object.assign({}, this.data)

            this.triggerUpdate()
          } else {
            console.error('No bundles were returned.')
          }
        })
    }
  }

  subscribe (cb) {
    this.callbacks.push(cb)
  }

  /** call subscribed callbacks */
  triggerUpdate () {
    this.callbacks.forEach((cb) => cb(this.data))
  }
}

export default new TransitDataSource()
