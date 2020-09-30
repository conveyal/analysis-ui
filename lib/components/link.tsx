import {PseudoBox} from '@chakra-ui/core'
import NextLink from 'next/link'

import {routeTo} from 'lib/router'

export default function Link({children, to, ...p}) {
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
    <Link to={to} {...p}>
      <PseudoBox as='a' className={className} color='blue.500' _hover={_hover}>
        {children}
      </PseudoBox>
    </Link>
  )
}
