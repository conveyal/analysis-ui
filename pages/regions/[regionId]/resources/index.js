import {useRouter} from 'next/router'
import React from 'react'
import {useSelector} from 'react-redux'

import {ButtonLink} from 'lib/components/buttons'
import InnerDock from 'lib/components/inner-dock'
import Select from 'lib/components/select'
import withInitialFetch from 'lib/with-initial-fetch'

function Resources(p) {
  const router = useRouter()
  const resources = useSelector(state => state.resources)

  function selectResource(resource) {}

  return (
    <InnerDock className='block'>
      <legend>Resources</legend>
      <ButtonLink
        block
        to='resourceUpload'
        regionId={p.regionId}
        style='success'
      >
        Upload New Resource
      </ButtonLink>
      <br />
      <Select
        getOptionLabel={r => `${r.contentType} -- ${r.name}`}
        getOptionValue={r => r._id}
        onChange={selectResource}
        options={resources}
      />
    </InnerDock>
  )
}

async function initialFetch() {
  return {
    resources: []
  }
}

export default withInitialFetch(Resources, initialFetch)
