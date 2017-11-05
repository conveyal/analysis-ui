import {createSelector} from 'reselect'

import selectCurrentBundle from './current-bundle'

const scenarioHasMatchingBundle = ({
  bundleId,
  scenarioId,
  scenarios
}) => scenario => scenario.bundleId === bundleId && scenario._id !== scenarioId

export default createSelector(
  state => state.scenario.scenarios,
  (state, props) => props.params.scenarioId,
  selectCurrentBundle,
  (scenarios, scenarioId, bundle) => {
    if (bundle) {
      return scenarios
        .filter(scenarioHasMatchingBundle({bundleId: bundle._id, scenarioId}))
        .map(scenario => {
          return {value: scenario._id, label: scenario.name}
        })
    } else {
      return []
    }
  }
)
