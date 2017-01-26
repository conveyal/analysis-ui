import React, {PropTypes} from 'react'

import DeepEqual from '../deep-equal'
import Icon from '../icon'

export default class ModificationTitle extends DeepEqual {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    editModification: PropTypes.func.isRequired,
    modification: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    replaceModification: PropTypes.func.isRequired,
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

  _editModification = (e) => {
    this.props.editModification(this.props.modification)
  }

  render () {
    const {active, modification, showOnMap} = this.props
    const showIcon = showOnMap ? 'eye' : 'eye-slash'
    return (
      <div
        className={`ModificationTitle ${active ? 'active' : ''}`}
        onClick={this._editModification}
        title='Edit Modification'
        >
        <span>{modification.name}</span>
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
