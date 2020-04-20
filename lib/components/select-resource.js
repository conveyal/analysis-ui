import {Box, Button, Stack} from '@chakra-ui/core'
import {useRouter} from 'next/router'
import React from 'react'
import {useSelector} from 'react-redux'

import msg from 'lib/message'

import InnerDock from 'lib/components/inner-dock'
import Select from 'lib/components/select'
import {routeTo} from 'lib/router'

const selectResources = (s) => s.resources

export default function SelectResource(p) {
  const resources = useSelector(selectResources)
  const router = useRouter()

  function _goToResource(resource) {
    const {as, href} = routeTo('resourceEdit', {
      regionId: resource.regionId,
      resourceId: resource._id
    })
    router.push(href, as)
  }

  function _upload() {
    const {as, href} = routeTo('resourceUpload', {regionId: p.regionId})
    router.push(href, as)
  }

  return (
    <InnerDock className='block'>
      <legend>{msg('resources.title')}</legend>
      <Stack spacing={4}>
        <Button block onClick={_upload} variantColor='green'>
          {msg('resources.uploadAction')}
        </Button>
        <Box>
          <Select
            getOptionLabel={(r) => `${r.name} [${r.type}]`}
            getOptionValue={(r) => r._id}
            onChange={_goToResource}
            options={resources}
            value={resources.find((r) => r._id === p.resourceId)}
          />
        </Box>
      </Stack>
      {p.children}
    </InnerDock>
  )
}
