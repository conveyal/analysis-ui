import {CSSReset, ThemeProvider, theme} from '@chakra-ui/core'
import React from 'react'

const ConveyalTheme = {
  ...theme,
  fontWeights: {
    normal: 400,
    medium: 500,
    bold: 500
  }
}

export default function ChakraTheme({children}) {
  return (
    <ThemeProvider theme={ConveyalTheme}>
      <CSSReset />
      {children}
    </ThemeProvider>
  )
}
