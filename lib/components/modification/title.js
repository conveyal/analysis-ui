import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import Icon from '../icon'

export default function ModificationTitle(p) {
  function toggleMapDisplay(e) {
    e.stopPropagation()
    p.updateModification({
      ...p.modification,
      showOnMap: !p.modification.showOnMap
    })
  }

  const showIcon = p.modification.showOnMap ? faEye : faEyeSlash
  return (
    <div className='ModificationTitle'>
      <a
        onClick={p.goToEditModification}
        tabIndex={0}
        title='Edit Modification'
      >
        {p.modification.name}
      </a>
      <a
        className={`ShowOnMap pull-right ${
          p.modification.showOnMap ? 'active' : 'dim'
        } fa-btn`}
        onClick={toggleMapDisplay}
        tabIndex={0}
        title='Toggle map display'
      >
        <Icon icon={showIcon} fixedWidth />
      </a>
    </div>
  )
}
