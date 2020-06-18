import {Checkbox, Heading, Stack} from '@chakra-ui/core'
import React from 'react'

import message from 'lib/message'

export default function Variants({
  activeVariants,
  allVariants,
  setVariant,
  ...p
}) {
  return (
    <Stack spacing={4} {...p} mb={4}>
      <Heading size='md'>{message('variant.activeIn')}</Heading>
      <Stack spacing={2}>
        {allVariants.map((v, i) => (
          <Checkbox
            fontWeight='normal'
            isChecked={activeVariants[i]}
            key={`${i}-${v}`}
            name={v}
            onChange={(e) => setVariant(i, e.target.checked)}
            value={i}
          >
            {i + 1}. {v}
          </Checkbox>
        ))}
      </Stack>
    </Stack>
  )
}
