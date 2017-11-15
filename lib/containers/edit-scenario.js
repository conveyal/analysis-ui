// @flow
import {connect} from 'react-redux'
import {goBack, push} from 'react-router-redux'

import {create, deleteScenario, saveToServer} from '../actions/scenario'
import EditScenario from '../components/edit-scenario'

import selectBundle from '../selectors/current-bundle'
import selectRegionId from '../selectors/current-region-id'
import selectScenario from '../selectors/current-scenario'
import selectScenarioId from '../selectors/current-scenario-id'
import selectVariants from '../selectors/variants'

function mapStateToProps (state, props) {
  const _id = selectScenarioId(state, props)
  const currentScenario = selectScenario(state, props) || {}
  const currentBundle = selectBundle(state, props) || {}
  return {
    bundles: state.scenario.bundles,
    bundleId: currentBundle._id,
    bundleName: currentBundle.name,
    _id,
    isEditing: !!_id,
    name: currentScenario.name,
    variants: selectVariants(state, props),
    regionId: selectRegionId(state, props),
    scenario: currentScenario
  }
}

function mapDispatchToProps (dispatch: Dispatch, props) {
  return {
    close: () => dispatch(goBack()),
    create: opts => dispatch(create(opts)),
    deleteScenario: ({scenarioId, regionId}) =>
      dispatch([deleteScenario(scenarioId), push(`/regions/${regionId}`)]),
    goToCreateBundle: regionId =>
      dispatch(push(`/regions/${regionId}/bundles/create`)),
    save: opts => dispatch(saveToServer(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditScenario)
