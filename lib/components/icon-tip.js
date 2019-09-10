import React from 'react'

import Icon from './icon'
import Link from './link'
import Tip from './tip'

export default function IconTip(p) {
  return (
    <Tip className={p.className} tip={p.tip}>
      {p.link ? (
        <Link {...p.link}>
          <a name={p.name || p.tip} id={p.id}>
            <Icon icon={p.icon} />
          </a>
        </Link>
      ) : (
        <a onClick={p.onClick} name={p.name || p.tip} id={p.id}>
          <Icon icon={p.icon} />
        </a>
      )}
    </Tip>
  )
}
