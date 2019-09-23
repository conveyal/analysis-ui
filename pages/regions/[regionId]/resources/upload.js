import React from 'react'
import {useDispatch} from 'react-redux'

import {createResource} from 'lib/actions/resources'
import {Button} from 'lib/components/buttons'
import {File, Text} from 'lib/components/input'
import InnerDock from 'lib/components/inner-dock'
import getInitialAuth from 'lib/get-initial-auth'

export default function UploadResource(p) {
  const dispatch = useDispatch()
  const [status, setStatus] = React.useState()
  const [errors, setErrors] = React.useState()
  const [file, setFile] = React.useState()
  const [name, setName] = React.useState('')
  const [uploading, setUploading] = React.useState(false)

  function upload() {
    setStatus('Uploading resource...')
    setUploading(true)
    dispatch(createResource({name, file, regionId: p.query.regionId}))
      .then(() => {
        setErrors()
        setStatus('Finished uploading resource...')
      })
      .catch(e => {
        setStatus()
        setErrors(e)
      })
      .finally(() => {
        setUploading(false)
      })
  }

  return (
    <InnerDock className='block'>
      <legend>Upload Resource</legend>
      <p>Accepts `.json` and `.geojson` files.</p>
      {errors && <div className='alert alert-danger'>{errors}</div>}
      {status && <div className='alert alert-info'>{status}</div>}
      <Text label='Name' onChange={e => setName(e.currentTarget.value)} />
      <File
        accept='.json,.geojson'
        label='Select file'
        onChange={e => setFile(e.target.files[0])}
      />
      <Button block disabled={uploading} onClick={upload} style='success'>
        Upload Resource
      </Button>
    </InnerDock>
  )
}

UploadResource.getInitialProps = getInitialAuth
