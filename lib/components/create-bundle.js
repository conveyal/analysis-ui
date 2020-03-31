import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text
} from '@chakra-ui/core'
import {faCheck} from '@fortawesome/free-solid-svg-icons'
import get from 'lodash/get'
import {useRouter} from 'next/router'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {addBundle} from 'lib/actions'
import fetch from 'lib/actions/fetch'
import {API} from 'lib/constants'
import {SPACING_FORM} from 'lib/constants/chakra'
import message from 'lib/message'
import {routeTo} from 'lib/router'
import selectBundles from 'lib/selectors/bundles'

import Icon from './icon'
import InnerDock from './inner-dock'
import P from './p'
import Select from './select'

// how often to poll when waiting for a bundle to be read on the server.
const POLL_TIMEOUT_MS = 10000
const STATUS_DONE = 'DONE'
const STATUS_ERROR = 'ERROR'
const isValid = d =>
  d.name && (d.osmId || d.osm) && (d.feedGroup || d.feedGroupId)
const getOsmLabel = b => (b.regionId === b.osmId ? 'Region' : b.name)

/**
 * Create bundle form.
 */
export default function CreateBundle(p) {
  const dispatch = useDispatch()
  const router = useRouter()
  const bundles = useSelector(selectBundles)

  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState()
  const [formData, setFormData] = React.useState({
    name: ''
  })

  const {regionId} = p

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

    if (isValid(formData)) {
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

          <Text>{message('bundle.explanation')}</Text>

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
            isInvalid={formData.name.length < 1}
          >
            <FormLabel htmlFor='bundleName'>{message('bundle.name')}</FormLabel>
            <Input
              id='bundleName'
              name='bundleName'
              onChange={e => setFormData(d => ({...d, name: e.target.value}))}
              placeholder='Name'
            />
          </FormControl>

          <FormControl isDisabled={uploading}>
            <FormLabel htmlFor='osmId'>
              Use existing OpenStreetMap data from
            </FormLabel>
            <Box>
              <Select
                isClearable
                options={bundles}
                getOptionLabel={getOsmLabel}
                getOptionValue={b => b.osmId}
                onChange={r =>
                  setFormData(d => ({...d, osmId: get(r, 'osmId')}))
                }
                value={bundles.find(b => b.osmId === formData.osmId)}
              />
            </Box>
          </FormControl>

          {formData.osmId || (
            <FormControl isDisabled={uploading}>
              <FormLabel htmlFor='osm'>
                or upload new OpenStreetMap data
              </FormLabel>
              <Input
                id='osm'
                name='osm'
                type='file'
                onChange={e => setFormData(d => ({...d, osm: e.target.value}))}
              />
              <FormHelperText>Must be in PBF format.</FormHelperText>
            </FormControl>
          )}

          <FormControl isDisabled={uploading}>
            <FormLabel htmlFor='feedGroupId'>Use existing GTFS data</FormLabel>
            <Box>
              <Select
                isClearable
                options={bundles}
                getOptionLabel={b => b.name}
                getOptionValue={b => b.feedGroupId}
                onChange={r =>
                  setFormData(d => ({...d, feedGroupId: get(r, 'feedGroupId')}))
                }
                value={bundles.find(
                  b => b.feedGroupId === formData.feedGroupId
                )}
              />
            </Box>
          </FormControl>

          {formData.feedGroupId || (
            <FormControl isDisabled={uploading} isRequired>
              <FormLabel htmlFor='feedGroup'>
                {message('bundle.files')}
              </FormLabel>
              <Input
                id='feedGroup'
                multiple
                name='feedGroup'
                onChange={e =>
                  setFormData(d => ({...d, feedGroup: e.target.value}))
                }
                type='file'
              />
              <FormHelperText>One or more .zip files</FormHelperText>
            </FormControl>
          )}

          {!uploading && !error && (
            <Alert status='info'>{message('bundle.notice')}</Alert>
          )}

          <input type='hidden' name='regionId' value={regionId} />

          <Button
            iconLeft='check'
            isDisabled={isValid(formData)}
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
