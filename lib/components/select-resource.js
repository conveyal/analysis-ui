import {useRouter} from 'next/router'
import React from 'react'
import {useSelector} from 'react-redux'

import {ButtonLink} from 'lib/components/buttons'
import InnerDock from 'lib/components/inner-dock'
import Select from 'lib/components/select'
import {routeTo} from 'lib/router'

const selectResources = s => s.resources

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
        getOptionLabel={r => `${r.name} [${r.type}]`}
        getOptionValue={r => r._id}
        onChange={_goToResource}
        options={resources}
        value={resources.find(r => r._id === p.resourceId)}
      />
      {p.children}
    </InnerDock>
  )
}
