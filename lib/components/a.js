import {PseudoBox} from '@chakra-ui/core'
import React from 'react'

import {CB_HEX, CB_DARK} from '../constants'

export default function A({children, ...p}) {
  return (
    <PseudoBox as='a' color={CB_HEX} _hover={{color: CB_DARK}} {...p}>
      {children}
    </PseudoBox>
  )
}
