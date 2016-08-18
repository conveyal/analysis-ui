/** display a scenario */

import React, {PropTypes} from 'react'
import {Link} from 'react-router'

import DeepEqualComponent from './deep-equal'
import Icon from './icon'

export default class Scenario extends DeepEqualComponent {
  static propTypes = {
    addComponentToMap: PropTypes.func.isRequired,
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

  _dropSinglePointPin = (e) => {
    e.preventDefault()
    this.props.addComponentToMap()
  }

  render () {
    const {children, id, isLoaded, name, projectId} = this.props
    return (
      <div className='Scenario'>
        <div
          className='ScenarioTitle'
          ><Icon type='code-fork' />
          <Link
            title='Show scenario modifications'
            to={`/projects/${projectId}/scenarios/${id}`}
            ><span>{name}</span>
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
          <a
            className='pull-right'
            onClick={this._dropSinglePointPin}
            title='Show single point analysis'
            ><Icon type='crosshairs' />
          </a>
        </div>
        {isLoaded && <div className='ScenarioContent'>{children}</div>}
      </div>
    )
  }
}
