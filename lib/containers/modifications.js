// @flow
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {
  create as createModification,
  saveToServer as updateModification
} from '../actions/modifications'
import Modifications from '../components/modification/list'
import selectActiveModification from '../selectors/active-modification'
import selectBundleId from '../selectors/bundle-id'
import selectModificationsByType from '../selectors/modifications-by-type'
import selectRegionId from '../selectors/current-region-id'
import selectScenario from '../selectors/current-scenario'
import selectScenarioId from '../selectors/current-scenario-id'
import selectVariants from '../selectors/variants'

function mapStateToProps (state, props) {
  return {
    activeModification: selectActiveModification(state, props),
    bundleId: selectBundleId(state, props),
    modifications: state.scenario.modifications || [],
    modificationsByType: selectModificationsByType(state, props),
    regionId: selectRegionId(state, props),
    scenario: selectScenario(state, props),
    scenarioId: selectScenarioId(state, props),
    variants: selectVariants(state, props)
  }
}

export default connect(mapStateToProps, {
  createModification,
  push,
  updateModification
})(Modifications)
