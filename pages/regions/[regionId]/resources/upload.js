import {faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import {useDispatch} from 'react-redux'

import {createResource} from 'lib/actions/resources'
import Alert from 'lib/components/alert'
import {Button} from 'lib/components/buttons'
import Icon from 'lib/components/icon'
import {File, Select, Text} from 'lib/components/input'
import InnerDock from 'lib/components/inner-dock'
import Link from 'lib/components/link'
import P from 'lib/components/p'
import getInitialAuth from 'lib/get-initial-auth'
import {routeTo} from 'lib/router'

const EXTS = ['.json'] // later: csv, pbf, zip
const TYPES = ['Lines', 'Points', 'Polygons']

export default function UploadResource(p) {
  const dispatch = useDispatch()
  const [status, setStatus] = React.useState()
  const [error, setError] = React.useState()
  const [file, setFile] = React.useState()
  const [name, setName] = React.useState('')
  const [uploading, setUploading] = React.useState(false)
  const [type, setType] = React.useState(TYPES[0])

  function upload() {
    setStatus('Uploading resource...')
    setUploading(true)
    dispatch(
      createResource({
        name,
        file,
        regionId: p.query.regionId,
        type
      })
    )
      .then(resource => {
        setError()
        setName('')
        const {as} = routeTo('resourceEdit', {
          regionId: resource.regionId,
          resourceId: resource._id
        })
        setStatus(`Finished uploading! <a href='${as}'>View resource.</a>`)
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
      <P>
        Accepts <code>{EXTS.join(',')}</code> files.
      </P>
      <Alert style='danger' text={error} />
      <Alert text={status} onClear={() => setStatus()} />
      <Text
        label='Name'
        onChange={e => setName(e.currentTarget.value)}
        value={name}
      />
      <File
        accept={EXTS.join(',')}
        label='Select file'
        onChange={e => setFile(e.target.files[0])}
      />
      <Select
        label='Type'
        onChange={e => setType(e.currentTarget.value)}
        value={type}
      >
        {TYPES.map(t => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </Select>
      <Button block disabled={uploading} onClick={upload} style='success'>
        Upload Resource
      </Button>
    </InnerDock>
  )
}

UploadResource.getInitialProps = getInitialAuth
