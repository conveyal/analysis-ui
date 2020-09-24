import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import omit from 'lodash/omit'
import {createSelector} from 'reselect'

import selectProfileRequestLonLat from './profile-request-lonlat'

const omitKeys = [
  'maxTripDurationMinutes',
  'opportunityDatasetId',
  'travelTimePercentile'
]
const hasChanged = (a, b) => !isEqual(omit(a, omitKeys), omit(b, omitKeys))

/**
 * Compare the results vs the current settings.
 */
export default createSelector(
  selectProfileRequestLonLat,
  (state) => get(state, 'analysis.copyRequestSettings'),
  (state) => get(state, 'analysis.requestsSettings', []),
  (state) => get(state, 'analysis.resultsSettings', []),
  (lonlat, copyRequestSettings, requestsSettings, resultsSettings) => {
    // Check primary request settings
    if (
      hasChanged(
        {
          ...requestsSettings[0],
          fromLat: lonlat.lat,
          fromLon: lonlat.lon
        },
        resultsSettings[0]
      )
    )
      return true

    // Check secondary request settings
    if (
      (get(resultsSettings, '[1].projectId') ||
        get(requestsSettings, '[1].projectId')) &&
      hasChanged(
        {
          ...(copyRequestSettings ? requestsSettings[0] : requestsSettings[1]), // if copying
          fromLat: lonlat.lat,
          fromLon: lonlat.lon,
          projectId: requestsSettings[1].projectId,
          variantIndex: requestsSettings[1].variantIndex
        },
        resultsSettings[1]
      )
    ) {
      return true
    }

    return false
  }
)
