import {faCaretDown, faCaretRight} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import Icon from './icon'

export function Panel({children, className = '', ...p}) {
  const extraClassName = className ? ` ${className}` : ''
  return (
    <div className={`panel panel-default${extraClassName}`} {...p}>
      {children}
    </div>
  )
}

export function Collapsible({defaultExpanded = true, children, heading}) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)

  return (
    <Panel>
      <Heading
        onClick={() => setExpanded((e) => !e)}
        style={{cursor: 'pointer'}}
      >
        {heading()}
        <span className='pull-right'>
          <Icon icon={expanded ? faCaretDown : faCaretRight} />
        </span>
      </Heading>
      {expanded && children}
    </Panel>
  )
}

export function Heading({children, className = '', ...p}) {
  const withClassName =
    'panel-heading clearfix' + ' ' + (className ? className : '')
  return (
    <div className={withClassName} {...p}>
      {children}
    </div>
  )
}

export function Body({children, ...p}) {
  return (
    <div className='panel-body' {...p}>
      {children}
    </div>
  )
}
