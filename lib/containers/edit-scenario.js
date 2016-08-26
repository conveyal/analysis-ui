import {connect} from 'react-redux'
import {goBack, push} from 'react-router-redux'

import {create, deleteScenario, saveToServer} from '../actions/scenario'
import EditScenario from '../components/edit-scenario'

function mapStateToProps ({
  scenario
}, {
  params
}) {
  const currentScenario = scenario.scenariosById[params.scenarioId] || {}
  const currentBundle = scenario.bundlesById[currentScenario.bundleId] || {}
  return {
    bundles: scenario.bundles,
    bundleId: currentBundle.id,
    bundleName: currentBundle.name,
    id: params.scenarioId,
    isEditing: !!params.scenarioId,
    name: currentScenario.name,
    variants: currentScenario.variants,
    projectId: params.projectId
  }
}

function mapDispatchToProps (dispatch, props) {
  const {params} = props
  return {
    close: () => dispatch(goBack()),
    create: (opts) => dispatch(create(opts)),
    deleteScenario: () => [dispatch(deleteScenario(params)), dispatch(push(`/projects/${params.projectId}`))],
    goToCreateBundle: () => dispatch(push(`/projects/${params.projectId}/bundles/create`)),
    goToEditBundle: (bundleId) => dispatch(push(`/projects/${params.projectId}/bundles/${bundleId}/edit`)),
    save: (opts) => dispatch(saveToServer(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditScenario)
