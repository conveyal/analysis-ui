import {CSSReset, ThemeProvider} from '@chakra-ui/core'
import React from 'react'

export default function ChakraTheme(p) {
  return (
    <ThemeProvider>
      <CSSReset />
      {p.children}
    </ThemeProvider>
  )
}
