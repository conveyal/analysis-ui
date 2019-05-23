import React from 'react'
import Tip from '../tip'

export default function Icon(p) {
  return <span fixedWidth {...p} />
}

export const IconTip = ({className, href, onClick, tip, ...p}) => (
  <Tip className={className} tip={tip}>
    <a href={href} onClick={onClick}>
      <Icon {...p} />
    </a>
  </Tip>
)
