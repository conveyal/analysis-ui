import {useRouter} from 'next/router'
import React from 'react'
import {useDispatch} from 'react-redux'

import {create} from 'lib/actions/region'
import CreateRegion from 'lib/components/create-region'
import MapLayout from 'lib/layouts/map'
import {routeTo} from 'lib/router'

export default function CreateRegionPage() {
  const dispatch = useDispatch()
  const router = useRouter()

  function _create(r) {
    return dispatch(create(r)).then((region) => {
      const {as, href} = routeTo('projects', {regionId: region._id})
      router.push(href, as)
    })
  }

  return <CreateRegion create={_create} />
}

CreateRegionPage.Layout = MapLayout
