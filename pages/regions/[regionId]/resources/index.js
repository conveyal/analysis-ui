import React from 'react'
import {useDispatch} from 'react-redux'

import {
  deleteResource,
  downloadResource,
  loadAllResources
} from 'lib/actions/resources'
import {Button, ButtonLink} from 'lib/components/buttons'
import InnerDock from 'lib/components/inner-dock'
import Select from 'lib/components/select'
import downloadData from 'lib/utils/download-data'
import withInitialFetch from 'lib/with-initial-fetch'

function Resources(p) {
  const [activeResource, setActiveResource] = React.useState()
  const dispatch = useDispatch()

  function _download() {
    dispatch(downloadResource(activeResource)).then(value => {
      if (activeResource.offline) {
        downloadData(value, activeResource.filename, activeResource.type)
      } else {
        window.open(value)
      }
    })
  }

  function _delete() {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      dispatch(deleteResource(activeResource))
    }
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
        getOptionLabel={r => `${r.name}: ${r.contentType}`}
        getOptionValue={r => r._id}
        onChange={resource => setActiveResource(resource)}
        options={p.resources}
      />
      <br />
      {activeResource && (
        <>
          <h6>Name: {activeResource.name}</h6>
          <Button block style='success' onClick={_download}>
            Download
          </Button>
          <Button block style='danger' onClick={_delete}>
            Delete
          </Button>
        </>
      )}
    </InnerDock>
  )
}

async function initialFetch(store, query) {
  return {
    resources: await store.dispatch(loadAllResources(query))
  }
}

export default withInitialFetch(Resources, initialFetch)
