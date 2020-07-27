import {PseudoBox, Stack} from '@chakra-ui/core'
import React from 'react'
import {format} from 'd3-format'

import {isLight} from 'lib/utils/rgb-color-contrast'

const textFormat = format(',.0f')

/** Display a map legend */
export default function Legend({breaks, colors, min}) {
  const formatText = (i) => {
    const bottom = i === 0 && min <= breaks[0] ? min : breaks[i - 1]
    const top = breaks[i]
    const text =
      bottom === top ? bottom : `${textFormat(bottom)} to ${textFormat(top)}`
    if (colors[i].opacity === 0) return `${text} (transparent)`
    return text
  }
  return (
    <Stack borderTop='1px solid #E2E8F0' spacing={0}>
      {breaks.map((_, i) => (
        <PseudoBox
          backgroundColor={`rgba(${colors[i].r}, ${colors[i].g}, ${colors[i].b}, 1)`}
          color={isLight(colors[i]) ? '#000' : '#fff'}
          _last={{
            roundedBottom: 'md'
          }}
          px={3}
          py={1}
          key={`break-${i}`}
        >
          {formatText(i)}
        </PseudoBox>
      ))}
    </Stack>
  )
}
