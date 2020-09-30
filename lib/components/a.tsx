import {PseudoBox, PseudoBoxProps} from '@chakra-ui/core'
import {forwardRef} from 'react'

import {CB_HEX, CB_DARK} from '../constants'

type AProps = PseudoBoxProps & {
  href?: string
}

export default forwardRef<typeof PseudoBox, AProps>(({children, ...p}, ref) => {
  return (
    <PseudoBox as='a' color={CB_HEX} _hover={{color: CB_DARK}} ref={ref} {...p}>
      {children}
    </PseudoBox>
  )
})
