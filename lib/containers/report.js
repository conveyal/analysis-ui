// @flow
import {connect} from 'react-redux'

import Report from '../components/report'
import {load as loadScenario} from '../actions/scenario'
import {load as loadRegion} from '../actions/region'
import selectAllModificationFeedIds from '../selectors/all-modification-feed-ids'
import selectCurrentBundle from '../selectors/current-bundle'
import selectFeedScopedStops from '../selectors/feed-scoped-stops'
import selectModifications from '../selectors/modifications'
import selectScenarioTimetables from '../selectors/scenario-timetables'
import selectVariants from '../selectors/variants'

function mapStateToProps (state, props) {
  const {scenario} = state
  let {scenarioId, regionId, variantId} = props.params
  const variants = selectVariants(state, props)
  variantId = parseInt(variantId)
  const modifications = selectModifications(state, props)
  return {
    allFeedIds: selectAllModificationFeedIds(state, props),
    modifications: modifications.filter(m => m.variants[variantId]),
    scenarioId,
    regionId,
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
    loadRegion: id => dispatch(loadRegion(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Report)
