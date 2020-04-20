import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import Icon from '../icon'
import Link from '../link'

export default function ModificationGroupItem(p) {
  return (
    <Link
      to='modificationEdit'
      modificationId={p.modification._id}
      projectId={p.projectId}
      regionId={p.regionId}
    >
      <a className='list-group-item' style={{cursor: 'pointer'}}>
        <span>{p.modification.name}</span>

        <span
          className='pull-right'
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            if (p.onMap) p.hideFromMap()
            else p.showOnMap()
          }}
        >
          <Icon icon={p.onMap ? faEye : faEyeSlash} />
        </span>
      </a>
    </Link>
  )
}
