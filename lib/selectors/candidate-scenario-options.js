import {createSelector} from 'reselect'

const scenarioHasMatchingBundle = ({bundleId, scenarioId, scenarios}) =>
  (scenario) =>
    scenario.bundleId === bundleId && scenario.id !== scenarioId

export default createSelector(
  (state) => state.scenario.scenarios,
  (state, props) => props.params.scenarioId,
  (state) => state.scenario.currentBundle,
  (scenarios, scenarioId, bundle) => {
    if (bundle) {
      return scenarios
        .filter(scenarioHasMatchingBundle({bundleId: bundle.id, scenarioId}))
        .map((scenario) => { return {value: scenario.id, label: scenario.name} })
    } else {
      return []
    }
  }
)
