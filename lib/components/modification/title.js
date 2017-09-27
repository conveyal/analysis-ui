// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {PureComponent} from 'react'

import type {Modification} from '../../types'

type Props = {
  active: boolean,
  goToEditModification: (id: string) => void,
  modification: Modification,
  name: string,
  showOnMap: boolean,
  updateModification: (modification: any) => void
}

export default class ModificationTitle extends PureComponent {
  props: Props

  _toggleMapDisplay = (e: Event) => {
    e.stopPropagation()
    const {modification, showOnMap, updateModification} = this.props
    updateModification({
      ...modification,
      showOnMap: !showOnMap
    })
  }

  _goToEditModification = () => {
    this.props.goToEditModification(this.props.modification.id)
  }

  render () {
    const {active, modification, showOnMap} = this.props
    const showIcon = showOnMap ? 'eye' : 'eye-slash'
    return (
      <div className={`ModificationTitle ${active ? 'active' : ''}`}>
        <a
          onClick={this._goToEditModification}
          tabIndex={0}
          title='Edit Modification'
        >
          {modification.name}
        </a>
        <a
          className={`ShowOnMap pull-right ${showOnMap ? 'active' : 'dim'} fa-btn`}
          onClick={this._toggleMapDisplay}
          tabIndex={0}
          title='Toggle map display'
        >
          <Icon type={showIcon} />
        </a>
      </div>
    )
  }
}
