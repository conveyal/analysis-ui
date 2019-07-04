import NextLink from 'next/link'
import React from 'react'

import {routeTo} from 'lib/router'

export default function Link({children, to, ...p}) {
  const {as, href} = routeTo(to, p)
  return (
    <NextLink as={as} href={href} passHref prefetch>
      {children}
    </NextLink>
  )
}
