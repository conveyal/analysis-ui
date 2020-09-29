import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import omit from 'lodash/omit'
import {createSelector} from 'reselect'

import selectProfileRequestLonLat from './profile-request-lonlat'

import {activeOpportunityDatasetId} from '../modules/opportunity-datasets/selectors'

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
  (state) => get(state, 'analysis.travelTimeSurface'),
  (state) => get(state, 'analysis.comparisonTravelTimeSurface'),
  activeOpportunityDatasetId,
  (
    lonlat,
    copyRequestSettings,
    requestsSettings,
    resultsSettings,
    tts,
    ctts,
    opportunitDatasetId
  ) => {
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
          ...(copyRequestSettings
            ? requestsSettings[0]
            : get(requestsSettings, '[1]', {})), // if copying
          fromLat: lonlat.lat,
          fromLon: lonlat.lon,
          projectId: get(requestsSettings, '[1].projectId'),
          variantIndex: get(requestsSettings, '[1].variantIndex')
        },
        resultsSettings[1]
      )
    ) {
      return true
    }

    // If the accessibility was calculated server side, check for opportunity changes
    if (
      get(resultsSettings, '[0].decayFunction.type') !== 'step' &&
      get(requestsSettings, '[0].destinationPointSetIds[0]') !==
        opportunitDatasetId
    ) {
      return true
    }
    if (
      get(resultsSettings, '[1].decayFunction.type') !== 'step' &&
      get(requestsSettings, '[1].destinationPointSetIds[0]') !==
        opportunitDatasetId
    ) {
      return true
    }

    return false
  }
)
