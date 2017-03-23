import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {create as createModification, setAndRetrieveData} from '../actions/modifications'
import Modifications from '../components/modification/list'
import activeModificationSelector from '../selectors/active-modification'

function mapStateToProps (state, props) {
  const defaultFeedId = state.scenario.feeds.length > 0
    ? state.scenario.feeds[0].id
    : ''

  return {
    activeModification: activeModificationSelector(state, props),
    bundleId: state.scenario.currentBundle.id,
    defaultFeedId,
    modifications: state.scenario.modifications || [],
    modificationsByType: state.scenario.modificationsByType || {},
    projectId: props.params.projectId,
    scenarioId: props.params.scenarioId,
    variants: state.scenario.variants
  }
}

function mapDispatchToProps (dispatch) {
  return {
    createModification: (opts) => dispatch(createModification(opts)),
    push: (url) => dispatch(push(url)),
    updateModification: (opts) => dispatch(setAndRetrieveData(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modifications)
