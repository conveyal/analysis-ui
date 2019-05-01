import Link from 'next/link'
import React from 'react'

import Icon from './icon'
import Tip from './tip'

export default function LinkWithTip({children, className, tip, href, ...p}) {
  return (
    <Tip className={className} tip={tip || p.title || p.name}>
      {href ? (
        <Link href={href}>{children}</Link>
      ) : (
        <a tabIndex={0} type='button' {...p}>
          {children}
        </a>
      )}
    </Tip>
  )
}

export const IconLink = ({icon, href}) => (
  <Link href={href}>
    <Icon icon={icon} fixedWidth />
  </Link>
)
