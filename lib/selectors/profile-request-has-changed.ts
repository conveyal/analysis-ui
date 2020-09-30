import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import omit from 'lodash/omit'
import {createSelector} from 'reselect'

import selectProfileRequestLonLat from './profile-request-lonlat'

import {activeOpportunityDatasetId} from 'lib/modules/opportunity-datasets/selectors'

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
  activeOpportunityDatasetId,
  (
    lonlat,
    copyRequestSettings,
    requestsSettings,
    resultsSettings,
    opportunitDatasetId
  ) => {
    const [req1, req2] = requestsSettings
    const [res1, res2] = resultsSettings
    const position = {fromLat: lonlat.lat, fromLon: lonlat.lon}
    // Check primary request settings
    if (hasChanged({...req1, ...position}, res1)) return true

    // Check comparison request settings
    if (
      res2?.projectId ||
      (req2?.projectId &&
        hasChanged(
          {
            ...(copyRequestSettings ? req1 : req2 ?? {}), // if copying
            ...position,
            // even when copying comparison may have different project/scenario
            projectId: req2?.projectId,
            variantIndex: req2?.variantIndex
          },
          res2
        ))
    ) {
      return true
    }

    // If the accessibility was calculated server side, check for opportunity changes
    if (
      res1 &&
      get(res1, 'decayFunction.type', 'step') !== 'step' &&
      get(res1, 'destinationPointSetIds[0]') !== opportunitDatasetId
    ) {
      return true
    }
    if (
      res2 &&
      get(res2, 'decayFunction.type', 'step') !== 'step' &&
      get(res2, 'destinationPointSetIds[0]') !== opportunitDatasetId
    ) {
      return true
    }

    return false
  }
)
