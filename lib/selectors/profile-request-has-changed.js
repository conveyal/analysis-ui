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
  (state) => state.queryString,
  (state) => get(state, 'analysis.requestsSettings', []),
  (state) => get(state, 'analysis.resultsSettings', []),
  (lonlat, qs, requestSettings, resultsSettings) => {
    // Check primary request settings
    if (
      hasChanged(
        {
          ...requestSettings[0],
          fromLat: lonlat.lat,
          fromLon: lonlat.lon,
          projectId: qs.projectId,
          variantIndex: parseInt(qs.variantIndex == null ? -1 : qs.variantIndex)
        },
        resultsSettings[0]
      )
    )
      return true

    // Check secondary request settings
    if (
      qs.comparisonProjectId &&
      hasChanged(
        {
          ...(requestSettings[1] || requestSettings[0]), // if copying
          fromLat: lonlat.lat,
          fromLon: lonlat.lon,
          projectId: qs.comparisonProjectId,
          variantIndex: parseInt(
            qs.comparisonVariantIndex == null ? -1 : qs.comparisonVariantIndex
          )
        },
        resultsSettings[1]
      )
    )
      return true

    return false
  }
)
