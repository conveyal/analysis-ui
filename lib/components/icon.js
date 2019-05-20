import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'

import Tip from './tip'

// Must import directly to prevent FOUC
import '../../static/fontawesome.css'

export default function Icon(p) {
  // Prevent snapshots from including the SVG strings
  if (process.env.NODE_ENV === 'test') {
    return <i type={p.icon.iconName} />
  }

  return <FontAwesomeIcon fixedWidth {...p} />
}

export const IconTip = ({className, href, onClick, tip, ...p}) => (
  <Tip className={className} tip={tip}>
    {href ? (
      <Link href={href}>
        <a>
          <Icon {...p} />
        </a>
      </Link>
    ) : (
      <a onClick={onClick}>
        <Icon {...p} />
      </a>
    )}
  </Tip>
)
