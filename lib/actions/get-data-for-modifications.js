/** use the graphql api to get data needed for modifications */

import {updateData} from './'
import * as query from '../graphql/query'
import authenticatedFetch, {parseJSON} from '../utils/authenticated-fetch'

let currentBundleId = null // TODO this should be handled more gracefully
let fetchedBundles = null // TODO this data should be passed in
let fetchedFeeds = null

export default function getDataForModifications ({
  bundleId,
  forceCompleteUpdate = false,
  modifications
}) {
  currentBundleId = bundleId
  const routeIds = getUniqueRouteIdsFromModifications(modifications)
  const shouldGetAllRoutesAndStops = forceCompleteUpdate || bundleId !== currentBundleId
  if (shouldGetAllRoutesAndStops) {
    return getAllRoutesAndStops({bundleId, routeIds})
  } else {
    return getUnfetchedRoutes({bundleId, routeIds})
  }
}

async function getAllRoutesAndStops ({
  bundleId,
  routeIds
}) {
  const response = await authenticatedFetch(query.compose(query.data, {bundleId, routeIds}))
  const json = await parseJSON(response)

  // make sure the bundle ID hasn't changed in the meantime from a concurrent request
  if (bundleId === currentBundleId) {
    // turn it into a bunch of maps
    fetchedFeeds = {}
    if (json.bundle && json.bundle.length > 0) {
      json.bundle[0].feeds.forEach((feed) => {
        const {feed_id, checksum} = feed
        const routes = new Map()
        feed.routes.forEach((r) => routes.set(r.route_id, r))
        // detailRoutes will overwrite less detailed routes
        feed.detailRoutes.forEach((r) => routes.set(r.route_id, r))

        const stops = new Map(feed.stops.map((s) => [s.stop_id, s]))
        fetchedFeeds[feed_id] = {
          feed_id,
          routes,
          stops,
          checksum
        }
      })
    }
    fetchedBundles = json.availableBundles || []
    return updateData({bundles: fetchedBundles, feeds: fetchedFeeds})
  }
}

async function getUnfetchedRoutes ({
  bundleId,
  routeIds
}) {
  // partial fetch, fetch only routes that are not already in the data.
  const unfetchedRouteIds = getUnfetchedRouteIds({fetchedFeeds, routeIds})
  // no routes found that haven't been fetched
  if (unfetchedRouteIds.length > 0) {
    const response = await authenticatedFetch(query.compose(query.route, {bundleId, routeIds}))
    const json = await parseJSON(response)
    // if another request has changed the bundle out from under us, bail
    if (bundleId === currentBundleId) {
      if (json.bundle && json.bundle.length > 0) {
        for (let {feed_id, routes} of json.bundle[0].feeds) {
          for (let route of routes) {
            // it's safe to modify the data object directly, because this is only additive; we're adding keys that no
            // one is using yet. It won't invalidate the state of any component using the existing data, so it's safe
            // to relax immutability requirements.
            fetchedFeeds[feed_id].routes.set(route.route_id, route)
          }
        }

        // we clone the top-level data object to signal that it has changed
        // either redux or react (not sure which) doesn't re-render components/trigger updates
        // if the items in the store shallow-equal each other.
        // This is a cheap operation because we're not cloning the data itself, just the references to it in the top-level object.
        return updateData({
          bundles: fetchedBundles,
          feeds: Object.assign({}, fetchedFeeds)
        })
      } else {
        console.error('No bundles were returned.')
        window.alert('No bundles were returned.')
      }
    }
  }
}

function getUniqueRouteIdsFromModifications (modifications) { // TODO: this can be done at the reducer
  // for every route referenced in the scenario we get the patterns
  const routes = new Set()
  for (const modification of modifications) {
    if (modification.type === 'remove-trips' ||
      modification.type === 'remove-stops' ||
      modification.type === 'adjust-speed' ||
      modification.type === 'adjust-dwell-time' ||
      modification.type === 'convert-to-frequency' ||
      modification.type === 'add-stops') {
      // NB we are in fact getting all routes in every feed that have this route ID, which means we're pulling down a bit more data than we need to but
      // it's pretty benign
      if (modification.routes !== null) modification.routes.forEach((r) => routes.add(r))
    }
  }
  return [...routes]
}

function getUnfetchedRouteIds ({
  fetchedFeeds,
  routeIds
}) {
  return routeIds.filter((r) => {
    return Object.values(fetchedFeeds).find((feed) => {
      return feed.routes.has(r) && feed.routes.get(r).patterns != null
    }) == null
  })
}
