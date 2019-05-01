import {faCaretDown, faCaretRight} from '@fortawesome/free-solid-svg-icons'
import toStartCase from 'lodash/startCase'
import React from 'react'

import Icon from '../icon'

import ModificationTitle from './title'

export default function ModificationGroup(p) {
  const [expanded, setExpanded] = React.useState(p.modifications.length < 5)

  const icon = expanded ? faCaretDown : faCaretRight
  const showOrHide = expanded ? 'Hide' : 'Show'

  return (
    <div className='ModificationGroup'>
      <div className='ModificationGroupTitle'>
        <a
          onClick={() => setExpanded(ex => !ex)}
          tabIndex={0}
          title={`${showOrHide} modification group`}
        >
          <Icon icon={icon} fixedWidth /> {toStartCase(p.type)}
        </a>
      </div>
      {expanded && (
        <div className='ModificationTitles'>
          {p.modifications.map(modification => (
            <ModificationTitle
              goToEditModification={() =>
                p.goToEditModification(modification._id)
              }
              key={`modification-${modification._id}`}
              modification={modification}
              updateModification={p.updateModification}
            />
          ))}
        </div>
      )}
    </div>
  )
}
