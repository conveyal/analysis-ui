import {PseudoBox} from '@chakra-ui/core'
import React from 'react'

import {CB_HEX, CB_DARK} from '../constants'

export default React.forwardRef(({children, ...p}, ref) => {
  return (
    <PseudoBox as='a' color={CB_HEX} _hover={{color: CB_DARK}} ref={ref} {...p}>
      {children}
    </PseudoBox>
  )
})
