import {Heading} from '@chakra-ui/core'
import React from 'react'

export default function H5({children, ...p}) {
  return (
    <Heading as='h5' fontSize='14px' fontWeight='500' my='10px' {...p}>
      {children}
    </Heading>
  )
}
