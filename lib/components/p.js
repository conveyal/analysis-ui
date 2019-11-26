import {Box} from '@chakra-ui/core'
import React from 'react'

export default function P({children, ...p}) {
  return (
    <Box as='p' mb='10px' {...p}>
      {children}
    </Box>
  )
}
