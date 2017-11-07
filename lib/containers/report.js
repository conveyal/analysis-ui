// @flow
import {connect} from 'react-redux'

import Report from '../components/report'
import {load as loadScenario} from '../actions/scenario'
import {load as loadProject} from '../actions/project'
import selectCurrentBundle from '../selectors/current-bundle'
import selectFeedScopedStops from '../selectors/feed-scoped-stops'
import selectModifications from '../selectors/modifications'
import selectScenarioTimetables from '../selectors/scenario-timetables'
import selectVariants from '../selectors/variants'

function mapStateToProps (state, props) {
  const {scenario} = state
  let {scenarioId, projectId, variantId} = props.params
  const variants = selectVariants(state, props)
  variantId = parseInt(variantId)
  const modifications = selectModifications(state, props)
  return {
    modifications: modifications.filter(m => m.variants[variantId]),
    scenarioId,
    projectId,
    scenario: scenario.currentScenario,
    variant: variants[variantId],
    bundle: selectCurrentBundle(state, props),
    feedsById: scenario.feedsById,
    scenarioTimetables: scenario.feedsById
      ? selectScenarioTimetables(state)
      : [],
    feedScopedStops: scenario.feedsById
      ? selectFeedScopedStops(state)
      : []
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    loadScenario: id => dispatch(loadScenario(id)),
    loadProject: id => dispatch(loadProject(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Report)
