import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  CloseButton,
  Stack
} from '@chakra-ui/core'
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import {useDispatch} from 'react-redux'

import {createResource} from 'lib/actions/resources'
import A from 'lib/components/a'
import Icon from 'lib/components/icon'
import {File, Select, Text} from 'lib/components/input'
import InnerDock from 'lib/components/inner-dock'
import Link from 'lib/components/link'
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
        setFile()
        setName('')
        const {as} = routeTo('resourceEdit', {
          regionId: resource.regionId,
          resourceId: resource._id
        })
        setStatus(
          <span>
            Finished uploading! <A href={as}>View resource.</A>
          </span>
        )
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
          <A>
            <Icon icon={faChevronLeft} />
          </A>
        </Link>
        <span>Upload Resource</span>
      </legend>
      <Stack spacing={4}>
        <Box>
          Accepts <code>{EXTS.join(',')}</code> files.
        </Box>
        {error && (
          <Alert status='error'>
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {status && (
          <Alert status='info'>
            <AlertIcon />
            <AlertDescription>{status}</AlertDescription>
          </Alert>
        )}
        <Box>
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
        </Box>
        <Button
          block
          disabled={uploading || !file || !name}
          onClick={upload}
          variantColor='green'
        >
          Upload Resource
        </Button>
      </Stack>
    </InnerDock>
  )
}

UploadResource.getInitialProps = getInitialAuth
