/** display a scenario */

import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {push} from 'react-router-redux'

import {load} from './actions/scenario'
import {Button} from './components/buttons'
import DeepEqualComponent from './components/deep-equal'
import DockContentTitle from './components/dock-content-title'
import Icon from './components/icon'

function mapStateToProps (state, props) {
  const {scenario} = state
  const {params} = props
  const currentBundle = scenario.currentBundle || {}
  const scenarioId = params.scenarioId
  const currentScenario = scenario.scenariosById[scenarioId] || {}

  return {
    bundleName: currentBundle.name,
    id: params.scenarioId,
    isLoaded: !!currentScenario,
    name: currentScenario.name,
    projectId: params.projectId
  }
}

function mapDispatchToProps (dispatch) {
  return {
    load: (id) => dispatch(load(id)),
    push: (opts) => dispatch(push(opts))
  }
}

class Scenario extends DeepEqualComponent {
  static propTypes = {
    bundleName: PropTypes.string,
    id: PropTypes.string.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    name: PropTypes.string,
    projectId: PropTypes.string.isRequired
  }

  componentDidMount () {
    const {load, id} = this.props
    load(id)
  }

  componentWillMount () {
    // TODO: Add scenario map component
  }

  componentWillUnmount () {
    // TODO: Remove scenario map component
  }

  componentWillReceiveProps (newProps) {
    const {load, id} = this.props
    const isNewScenarioId = id !== newProps.id
    if (isNewScenarioId) {
      load(newProps.id)
    }
  }

  _goToEditScenario = () => {
    const {id, projectId, push} = this.props
    push(`/projects/${projectId}/scenarios/${id}/edit`)
  }

  _goToImportModifications = () => {
    const {id, projectId, push} = this.props
    push(`/projects/${projectId}/scenarios/${id}/import-modifications`)
  }

  _goToImportShapefile = () => {
    const {id, projectId, push} = this.props
    push(`/projects/${projectId}/scenarios/${id}/import-shapefile`)
  }

  render () {
    const {bundleName, children, id, isLoaded, projectId, name} = this.props
    return (
      <div>
        <DockContentTitle>
          <Link to={`/projects/${projectId}/scenarios/${id}`}><Icon type='code-fork' /> {name}: {bundleName}</Link>
          <Button
            className='pull-right'
            onClick={this._goToEditScenario}
            title='Edit scenario'
            ><Icon type='pencil' />
          </Button>
          <Button
            className='pull-right'
            onClick={this._goToImportShapefile}
            title='Import shapefile'
            ><Icon type='globe' />
          </Button>
          <Button
            className='pull-right'
            onClick={this._goToImportModifications}
            title='Import modifications from another scenario'
            ><Icon type='upload' />
          </Button>
        </DockContentTitle>

        {isLoaded && children}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scenario)
