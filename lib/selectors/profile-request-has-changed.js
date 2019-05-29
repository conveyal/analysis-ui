import isEqual from 'lodash/isEqual'
import omit from 'lodash/omit'
import {createSelector} from 'reselect'

import get from '../utils/get'

const omitKeys = [
  'maxTripDurationMinutes',
  'opportunityDatasetId',
  'travelTimePercentile'
]
const empty = {}
const hasChanged = (a, b) => !isEqual(omit(a, omitKeys), omit(b, omitKeys))

export default createSelector(
  state => state.analysis,
  state => get(state, 'analysis.profileRequest', empty),
  state => get(state, 'analysis.displayedProfileRequest', empty),
  (a, pr, dpr) => {
    return hasChanged(
      {
        ...pr,
        comparisonProjectId: a.comparisonProjectId,
        comparisonVariant: a.comparisonVariant
      },
      dpr
    )
  }
)
