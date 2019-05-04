import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import toStartCase from 'lodash/startCase'
import Link from 'next/link'
import React from 'react'

import {RouteTo} from 'lib/constants'

import {Collapsible} from '../panel'
import Icon from '../icon'

export default function ModificationGroup(p) {
  function toggleMapDisplay(m) {
    p.updateModification({...m, showOnMap: !m.showOnMap})
  }

  return (
    <Collapsible
      defaultExpanded={p.modifications.length < 5}
      heading={() => toStartCase(p.type)}
    >
      <div className='list-group'>
        {p.modifications.map(modification => (
          <Link
            href={{
              pathname: RouteTo.modificationEdit,
              query: {
                modificationId: modification._id,
                projectId: p.projectId,
                regionId: p.regionId
              }
            }}
            key={modification._id}
          >
            <a className='list-group-item' style={{cursor: 'pointer'}}>
              {modification.name}

              <span
                className='pull-right'
                onClick={e => {
                  e.stopPropagation()
                  e.preventDefault()
                  toggleMapDisplay(modification)
                }}
              >
                <Icon icon={modification.showOnMap ? faEye : faEyeSlash} />
              </span>
            </a>
          </Link>
        ))}
      </div>
    </Collapsible>
  )
}
