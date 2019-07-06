import NextLink from 'next/link'
import React from 'react'

import {routeTo} from 'lib/router'

export default function Link({children, to, ...p}) {
  const {as, href, query} = routeTo(to, p)
  return (
    <NextLink as={as} href={{pathname: href, query}} passHref prefetch>
      {children}
    </NextLink>
  )
}
