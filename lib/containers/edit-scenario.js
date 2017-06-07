// @flow
import {connect} from 'react-redux'
import {goBack, push} from 'react-router-redux'

import {create, deleteScenario, saveToServer} from '../actions/scenario'
import EditScenario from '../components/edit-scenario'

import selectProjectId from '../selectors/current-project-id'
import selectScenario from '../selectors/current-scenario'
import selectScenarioId from '../selectors/current-scenario-id'

function mapStateToProps (state, props) {
  const id = selectScenarioId(state, props)
  const currentScenario = selectScenario(state, props) || {}
  const currentBundle = state.scenario.bundlesById[currentScenario.bundleId] || {}
  return {
    bundles: state.scenario.bundles,
    bundleId: currentBundle.id,
    bundleName: currentBundle.name,
    id,
    isEditing: !!id,
    name: currentScenario.name,
    variants: currentScenario.variants,
    projectId: selectProjectId(state, props)
  }
}

function mapDispatchToProps (dispatch: Dispatch, props) {
  const {params} = props
  return {
    close: () => dispatch(goBack()),
    create: (opts) => dispatch(create(opts)),
    deleteScenario: () => dispatch([deleteScenario(params), push(`/projects/${params.projectId}`)]),
    goToCreateBundle: () => dispatch(push(`/projects/${params.projectId}/bundles/create`)),
    goToEditBundle: (bundleId) => dispatch(push(`/projects/${params.projectId}/bundles/${bundleId}/edit`)),
    save: (opts) => dispatch(saveToServer(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditScenario)
