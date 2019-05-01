import {faCaretDown, faCaretRight} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import Icon from './icon'

/**
 * A simple collapsible element for hiding children
 */
export default function Collapsible(p) {
  const [expanded, setExpanded] = React.useState(p.defaultExpanded)

  return (
    <div>
      <div role='heading'>
        <a
          className='CollapsibleButton'
          onClick={() => setExpanded(ex => !ex)}
          role='button'
          tabIndex={0}
        >
          <Icon icon={expanded ? faCaretDown : faCaretRight} fixedWidth />
          <strong>{p.title}</strong>
        </a>
      </div>
      {expanded && p.children}
    </div>
  )
}
