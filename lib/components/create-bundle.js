import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack
} from '@chakra-ui/core'
import {faCheck} from '@fortawesome/free-solid-svg-icons'
import {useRouter} from 'next/router'
import React from 'react'
import {useDispatch} from 'react-redux'

import {addBundle} from 'lib/actions'
import fetch from 'lib/actions/fetch'
import {API} from 'lib/constants'
import {SPACING_FORM} from 'lib/constants/chakra'
import message from 'lib/message'
import {routeTo} from 'lib/router'

import Icon from './icon'
import InnerDock from './inner-dock'
import P from './p'

// how often to poll when waiting for a bundle to be read on the server.
const POLL_TIMEOUT_MS = 10000
const STATUS_DONE = 'DONE'
const STATUS_ERROR = 'ERROR'

/**
 * Create bundle form.
 */
export default function CreateBundle() {
  const dispatch = useDispatch()
  const router = useRouter()

  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState()
  const [name, setName] = React.useState('')
  const [osm, setOsm] = React.useState()
  const [gtfs, setGtfs] = React.useState()

  const {regionId} = router.query

  /**
   * Check if the upload has completed
   */
  function checkUploadState(_id) {
    dispatch(fetch({url: `${API.Bundle}/${_id}`}))
      .then(bundle => {
        if (bundle.status === STATUS_DONE) {
          // Add bundle to the store
          dispatch(addBundle(bundle))

          // Go to bundle list
          const {href, as} = routeTo('bundles', {regionId})
          router.push(href, as)
        } else if (bundle.status === STATUS_ERROR) {
          setUploading(false)
          setError(bundle.statusText)
        } else {
          setUploading(bundle.status)
          setTimeout(() => checkUploadState(_id), POLL_TIMEOUT_MS)
        }
      })
      .catch(() => {
        // this request failing does not imply that the bundle failed to upload
        setTimeout(() => checkUploadState(_id), POLL_TIMEOUT_MS)
      })
  }

  function submit(e) {
    // don't submit the form
    e.preventDefault()

    const body = new window.FormData(e.target)

    if (name && osm && gtfs) {
      setUploading(true)
      setError()

      dispatch(
        fetch({
          url: API.Bundle,
          options: {body, method: 'post'}
        })
      )
        .then(bundle => {
          setTimeout(() => checkUploadState(bundle._id), POLL_TIMEOUT_MS)
        })
        .catch(() => setUploading(false))
    }
  }

  return (
    <InnerDock>
      <form encType='multipart/form-data' onSubmit={submit}>
        <Stack p={SPACING_FORM} spacing={SPACING_FORM}>
          <Heading size='md'>{message('bundle.create')}</Heading>

          {uploading && (
            <Alert status='warning'>
              {message('bundle.processing')}
              <br />
              {uploading}
            </Alert>
          )}
          {error && (
            <Alert status='danger'>
              <P>
                <strong>{message('bundle.failure')}</strong>
              </P>
              <P>{error}</P>
            </Alert>
          )}

          <FormControl
            isDisabled={uploading}
            isRequired
            isInvalid={name.length < 1}
          >
            <FormLabel htmlFor='bundleName'>{message('bundle.name')}</FormLabel>
            <Input
              id='bundleName'
              name='bundleName'
              onChange={e => setName(e.target.value)}
              placeholder='Name'
            />
          </FormControl>

          <FormControl isDisabled={uploading} isRequired>
            <FormLabel htmlFor='osm'>
              {message('region.customOpenStreetMapData')}
            </FormLabel>
            <Input
              id='osm'
              name='osm'
              type='file'
              onChange={e => setOsm(e.target.value)}
            />
          </FormControl>

          <FormControl isDisabled={uploading} isRequired>
            <FormLabel htmlFor='gtfs'>{message('bundle.files')}</FormLabel>
            <Input
              id='gtfs'
              multiple
              name='gtfs'
              onChange={e => setGtfs(e.target.value)}
              type='file'
            />
          </FormControl>

          {!uploading && !error && (
            <Alert status='warning'>{message('bundle.notice')}</Alert>
          )}

          <input type='hidden' name='regionId' value={regionId} />

          <Button
            isDisabled={!name || !gtfs || !osm}
            isLoading={uploading}
            loadingText={message('common.processing')}
            size='lg'
            type='submit'
            variantColor='green'
          >
            <Icon icon={faCheck} />
            &nbsp;&nbsp;{message('common.create')}
          </Button>
        </Stack>
      </form>
    </InnerDock>
  )
}
