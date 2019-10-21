import {faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import {useDispatch} from 'react-redux'

import {createResource} from 'lib/actions/resources'
import Alert from 'lib/components/alert'
import {Button} from 'lib/components/buttons'
import Icon from 'lib/components/icon'
import {File, Text} from 'lib/components/input'
import InnerDock from 'lib/components/inner-dock'
import Link from 'lib/components/link'
import getInitialAuth from 'lib/get-initial-auth'

const EXTS = ['.json'] // later: csv, pbf, zip

export default function UploadResource(p) {
  const dispatch = useDispatch()
  const [status, setStatus] = React.useState()
  const [error, setError] = React.useState()
  const [file, setFile] = React.useState()
  const [name, setName] = React.useState('')
  const [uploading, setUploading] = React.useState(false)

  function upload() {
    setStatus('Uploading resource...')
    setUploading(true)
    dispatch(createResource({name, file, regionId: p.query.regionId}))
      .then(() => {
        setError()
        setStatus('Finished uploading resource!')
      })
      .catch(e => {
        console.error(e)
        setStatus()
        setError(e.message)
      })
      .finally(() => {
        setUploading(false)
      })
  }

  return (
    <InnerDock className='block'>
      <legend>
        <Link to='resources' {...p.query}>
          <a>
            <Icon icon={faChevronLeft} />
          </a>
        </Link>
        <span>Upload Resource</span>
      </legend>
      <p>
        Accepts <code>{EXTS.join(',')}</code> files.
      </p>
      <Alert style='danger' text={error} />
      <Alert text={status} onClear={() => setStatus()} />
      <Text label='Name' onChange={e => setName(e.currentTarget.value)} />
      <File
        accept={EXTS.join(',')}
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
