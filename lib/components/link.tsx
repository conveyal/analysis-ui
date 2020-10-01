import {Link} from '@chakra-ui/core'
import NextLink from 'next/link'

import {routeTo} from 'lib/router'

export default function InternalLink({children, to, ...p}) {
  const {as, href, query} = routeTo(to, p)
  return (
    <NextLink as={as} href={{pathname: href, query}} passHref>
      {children}
    </NextLink>
  )
}

const _hover = {color: 'blue.700'}
export function ALink({children, className = '', to, ...p}) {
  return (
    <InternalLink to={to} {...p}>
      <Link className={className} color='blue.500' _hover={_hover}>
        {children}
      </Link>
    </InternalLink>
  )
}

export function ExternalLink({children, href}) {
  return (
    <Link color='blue.500' _hover={_hover} href={href} isExternal>
      {children}
    </Link>
  )
}
