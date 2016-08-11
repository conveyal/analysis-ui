/** display a scenario */

import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import {load} from './actions/scenario'
import DeepEqualComponent from './components/deep-equal'
import Icon from './components/icon'

function mapStateToProps (state, props) {
  const {scenario} = state
  const {params} = props
  const currentBundle = scenario.currentBundle
  const scenarioId = params.scenarioId
  const currentScenario = scenario.scenariosById[scenarioId]

  return {
    bundleName: currentBundle ? currentBundle.name : '',
    id: params.scenarioId,
    isLoaded: !!currentScenario && !!currentBundle,
    name: currentScenario ? currentScenario.name : '',
    projectId: params.projectId
  }
}

function mapDispatchToProps (dispatch) {
  return {
    load: (id) => dispatch(load(id))
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

  render () {
    const {bundleName, children, id, isLoaded, name, projectId} = this.props
    return (
      <div className='Scenario'>
        <div
          className='ScenarioTitle'
          ><Icon type='code-fork' />
          <Link
            title='Show scenario modifications'
            to={`/projects/${projectId}/scenarios/${id}`}
            ><span>{name}: {bundleName}</span>
          </Link>
          <Link
            className='pull-right'
            title='Edit scenario'
            to={`/projects/${projectId}/scenarios/${id}/edit`}
            ><Icon type='pencil' />
          </Link>
          <Link
            className='pull-right'
            to={`/projects/${projectId}/scenarios/${id}/import-shapefile`}
            title='Import shapefile'
            ><Icon type='globe' />
          </Link>
          <Link
            className='pull-right'
            to={`/projects/${projectId}/scenarios/${id}/import-modifications`}
            title='Import modifications from another scenario'
            ><Icon type='upload' />
          </Link>
        </div>
        {isLoaded && <div className='ScenarioContent'>{children}</div>}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scenario)
