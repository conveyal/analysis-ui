/** use the graphql api to get data needed for modifications */

import {setBundles, setFeeds} from './'
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
    fetchedFeeds = []
    if (json.bundle && json.bundle.length > 0) {
      json.bundle[0].feeds.forEach((feed) => {
        let {checksum, detailRoutes, feed_id, routes, stops} = feed
        routes = routes.map(labelRoute)
        detailRoutes = detailRoutes.map(labelRoute)

        const routesById = {}
        const addToRoutes = (route) => { routesById[route.route_id] = route }
        routes.forEach(addToRoutes)
        // detailRoutes will overwrite less detailed routes
        detailRoutes.forEach(addToRoutes)

        const stopsById = {}
        stops.forEach((stop) => { stopsById[stop.stop_id] = stop })
        fetchedFeeds.push({
          id: feed_id,
          routes: Object.values((routesById)).sort(routeSorter),
          routesById,
          stops,
          stopsById,
          checksum
        })
      })
    }
    fetchedBundles = json.availableBundles || []
    return [
      setBundles(fetchedBundles),
      setFeeds(fetchedFeeds)
    ]
  }
}

async function getUnfetchedRoutes ({
  bundleId,
  routeIds
}) {
  // partial fetch, fetch only routes that are not already fetched.
  const unfetchedRouteIds = getUnfetchedRouteIds({fetchedFeeds, routeIds})
  // no routes found that haven't been fetched
  if (unfetchedRouteIds.length > 0) {
    const response = await authenticatedFetch(query.compose(query.route, {bundleId, routeIds}))
    const json = await parseJSON(response)
    // if another request has changed the bundle out from under us, bail
    if (bundleId === currentBundleId) {
      if (json.bundle && json.bundle.length > 0) {
        json.bundle[0].feeds.forEach((feed) => {
          const fetchedFeed = fetchedFeeds.find((f) => f.id === feed.feed_id)
          feed.routes.forEach((route) => {
            fetchedFeed.routesBydId[route.route_id] = labelRoute(route)
          })
          fetchedFeed.routes = Object.values(fetchedFeed.routesBydId).sort(routeSorter)
        })

        return [
          setBundles(fetchedBundles),
          setFeeds(fetchedFeeds)
        ]
      } else {
        console.error('No bundles were returned.')
        window.alert('No bundles were returned.')
      }
    }
  }
}

function labelRoute (r) {
  r.label = getRouteLabel(r)
  return r
}

function getRouteLabel (r) {
  return (r.route_short_name ? r.route_short_name + ' ' : '') + (r.route_long_name ? r.route_long_name : '')
}

function routeSorter (r0, r1) {
  const name0 = r0.route_short_name ? r0.route_short_name : r0.route_long_name
  const name1 = r1.route_short_name ? r1.route_short_name : r1.route_long_name

  // if name0 is e.g. 35 Mountain View Transit Center, parseInt will return 35, stripping the text
  const num0 = parseInt(name0, 10)
  const num1 = parseInt(name1, 10)

  if (!isNaN(num0) && !isNaN(num1)) return num0 - num1
  // numbers before letters
  else if (!isNaN(num0) && isNaN(num1)) return -1
  else if (isNaN(num0) && !isNaN(num1)) return 1

  // no numbers, sort by name
  else if (name0 < name1) return -1
  else if (name0 === name1) return 0
  else return 1
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
      return feed.routesById[r] && feed.routesById[r].patterns != null
    }) == null
  })
}
