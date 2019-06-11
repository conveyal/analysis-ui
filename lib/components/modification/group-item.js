import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import React from 'react'

import {RouteTo} from 'lib/constants'

import Icon from '../icon'

export default function ModificationGroupItem(p) {
  return (
    <Link
      href={{
        pathname: RouteTo.modificationEdit,
        query: {
          modificationId: p.modification._id,
          projectId: p.projectId,
          regionId: p.regionId
        }
      }}
      key={p.modification._id}
    >
      <a className='list-group-item' style={{cursor: 'pointer'}}>
        {p.modification.name}

        <span
          className='pull-right'
          onClick={e => {
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
