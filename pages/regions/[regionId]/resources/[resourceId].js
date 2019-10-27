import {faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import React from 'react'
import {useDispatch} from 'react-redux'

import {
  deleteResource,
  loadResource,
  loadResourceData
} from 'lib/actions/resources'
import {Button} from 'lib/components/buttons'
import Icon from 'lib/components/icon'
import InnerDock from 'lib/components/inner-dock'
import Link from 'lib/components/link'
import downloadData from 'lib/utils/download-data'
import {routeTo} from 'lib/router'
import withInitialFetch from 'lib/with-initial-fetch'

const GeoJSON = dynamic(() => import('lib/components/map/geojson'), {
  ssr: false
})

function dateFromObjectId(objectId) {
  return new Date(parseInt(objectId.substring(0, 8), 16) * 1000)
}

function EditResource(p) {
  const dispatch = useDispatch()
  const router = useRouter()
  const [resourceData, setResourceData] = React.useState()
  const {resource, setMapChildren} = p

  // Load the resource data on client side mount
  React.useEffect(() => {
    dispatch(loadResourceData(resource)).then(setResourceData)
  }, [dispatch, resource])

  // Show the resource on the map
  React.useEffect(() => {
    if (resourceData) {
      setMapChildren(<GeoJSON data={resourceData} />)
    }

    return () => setMapChildren(<React.Fragment />)
  }, [resourceData, setMapChildren])

  function _download() {
    downloadData(resourceData, resource.filename, resource.type)
  }

  function _delete() {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      dispatch(deleteResource(resource)).then(() => {
        const {as, href} = routeTo('resources', {regionId: resource.regionId})
        router.push(href, as)
      })
    }
  }

  return (
    <InnerDock className='block'>
      <legend>
        <Link to='resources' {...p.query}>
          <a>
            <Icon icon={faChevronLeft} />
          </a>
        </Link>
        <span>{resource.name}</span>
      </legend>
      <p>
        <strong>Type:</strong> {resource.type} <br />
      </p>
      <p>
        <strong>Created At:</strong>{' '}
        {dateFromObjectId(resource._id).toLocaleString()} <br />
        <strong>Created By:</strong> {resource.createdBy}
      </p>
      <Button
        block
        disabled={!resourceData}
        style='success'
        onClick={_download}
      >
        Download
      </Button>
      <Button block style='danger' onClick={_delete}>
        Delete
      </Button>
    </InnerDock>
  )
}

async function initialFetch(store, query) {
  return {
    resource: await store.dispatch(loadResource(query.resourceId))
  }
}

export default withInitialFetch(EditResource, initialFetch)
