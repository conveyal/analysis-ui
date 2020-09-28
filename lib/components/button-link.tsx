import {Button as ChakraButton, ButtonProps} from '@chakra-ui/core'
import {forwardRef} from 'react'

import Link from './link'

type ButtonLinkProps = ButtonProps & {
  to: string
  query?: Record<string, string>
}

const ButtonLink = forwardRef<typeof ChakraButton, ButtonLinkProps>(
  ({children, to, query = {}, ...props}, ref) => {
    return (
      <Link to={to} {...query}>
        <ChakraButton ref={ref} {...props}>
          {children}
        </ChakraButton>
      </Link>
    )
  }
)

export default ButtonLink
