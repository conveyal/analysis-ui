import throttle from 'lodash/throttle'
import get from 'lodash/get'
import {stringify} from 'querystring'

import fetch from './fetch'

const DELAY_MS = 400
const TOKEN = process.env.MAPBOX_ACCESS_TOKEN
const BASE_URL = 'https://api.mapbox.com'
const PATH = '/geocoding/v5/mapbox.places'
const getURL = (s, q) => `${BASE_URL}${PATH}/${encodeURIComponent(s)}.json?${q}`

/**
 * Using callbacks in order to handle throttling appropriately.
 */
export default throttle(function mapboxSearch(s, options = {}, cb) {
  if (get(s, 'length') < 3) return cb([])

  const querystring = stringify({
    access_token: TOKEN,
    autocomplete: false,
    ...options
  })

  fetch(getURL(s, querystring))
    .then((r) => r.json())
    .then((json) => cb(json.features))
    .catch((e) => {
      console.error(e)
      cb([])
    })
}, DELAY_MS)
