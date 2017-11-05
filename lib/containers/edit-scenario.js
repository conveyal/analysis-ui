// @flow
import {connect} from 'react-redux'
import {goBack, push} from 'react-router-redux'

import {create, deleteScenario, saveToServer} from '../actions/scenario'
import EditScenario from '../components/edit-scenario'

import selectBundle from '../selectors/current-bundle'
import selectProjectId from '../selectors/current-project-id'
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
    projectId: selectProjectId(state, props),
    scenario: currentScenario
  }
}

function mapDispatchToProps (dispatch: Dispatch, props) {
  return {
    close: () => dispatch(goBack()),
    create: opts => dispatch(create(opts)),
    deleteScenario: ({scenarioId, projectId}) =>
      dispatch([deleteScenario(scenarioId), push(`/projects/${projectId}`)]),
    goToCreateBundle: projectId =>
      dispatch(push(`/projects/${projectId}/bundles/create`)),
    save: opts => dispatch(saveToServer(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditScenario)
