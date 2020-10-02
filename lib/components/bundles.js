import {Heading, Stack, Text} from '@chakra-ui/core'
import {faDatabase} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import message from 'lib/message'

import A from './a'
import ButtonLink from './button-link'
import Icon from './icon'
import InnerDock from './inner-dock'

const docLink = 'http://docs.conveyal.com/prepare-inputs'

export default function Bundles(p) {
  return (
    <InnerDock style={{width: '640px'}}>
      <Stack spacing={8} p={8}>
        <Heading size='lg'>
          <Icon icon={faDatabase} /> {message('nav.networkBundles')}
        </Heading>
        <Text>
          {message('bundle.explanation')}{' '}
          <A href={docLink} target='_blank' rel='noopener noreferrer'>
            Learn more here.
          </A>
        </Text>
        <ButtonLink
          leftIcon='add'
          query={{regionId: p.regionId}}
          size='lg'
          to='bundleCreate'
          variantColor='green'
        >
          {message('bundle.create')}
        </ButtonLink>
        {p.children}
      </Stack>
    </InnerDock>
  )
}
