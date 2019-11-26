import {Box} from '@chakra-ui/core'
import React from 'react'

export default function Alert({onClear, style, text, ...p}) {
  if (!text) return null
  return (
    <Box className={`alert alert-${style || 'info'}`} {...p}>
      {onClear && (
        <a className='close' onClick={onClear}>
          &times;
        </a>
      )}
      <span
        dangerouslySetInnerHTML={{
          __html: text
        }}
      />
    </Box>
  )
}
