import {useRouter} from 'next/router'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {loadAllResources} from 'lib/actions/resources'
import {ButtonLink} from 'lib/components/buttons'
import InnerDock from 'lib/components/inner-dock'
import Select from 'lib/components/select'
import {routeTo} from 'lib/router'
import withInitialFetch from 'lib/with-initial-fetch'

const selectResources = s => s.resources

function Resources(p) {
  const resources = useSelector(selectResources)
  const router = useRouter()

  function _goToResource(resource) {
    const {as, href} = routeTo('resourceEdit', {
      regionId: p.regionId,
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
      />
    </InnerDock>
  )
}

async function initialFetch(store, query) {
  return {
    resources: await store.dispatch(loadAllResources(query))
  }
}

export default withInitialFetch(Resources, initialFetch)
