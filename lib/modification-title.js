import React, {PropTypes} from 'react'
import {Link} from 'react-router'

import DeepEqual from './components/deep-equal'
import Icon from './components/icon'

export default class Modification extends DeepEqual {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    modification: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    replaceModification: PropTypes.func.isRequired,
    scenarioId: PropTypes.string.isRequired,
    showOnMap: PropTypes.bool.isRequired
  }

  _toggleMapDisplay = (e) => {
    e.stopPropagation()
    const {modification, replaceModification, showOnMap} = this.props
    replaceModification({
      ...modification,
      showOnMap: !showOnMap
    })
  }

  render () {
    const {active, modification, projectId, scenarioId, showOnMap} = this.props
    const showIcon = showOnMap ? 'eye' : 'eye-slash'
    return (
      <div
        className={`ModificationTitle ${active ? 'active' : ''}`}
        >
        <Link
          title='Edit modification'
          to={`/projects/${projectId}/scenarios/${scenarioId}/modifications/${modification.id}`}
          ><span>{modification.name}</span>
        </Link>
        <a
          className={`ShowOnMap pull-right ${showOnMap ? 'active' : 'dim'} fa-btn`}
          onClick={this._toggleMapDisplay}
          title='Toggle map display'
          ><Icon type={showIcon} />
        </a>
      </div>
    )
  }
}
