import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text
} from '@chakra-ui/core'
import {faDatabase, faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import {useRouter} from 'next/router'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {addBundle} from 'lib/actions'
import fetch from 'lib/actions/fetch'
import {API} from 'lib/constants'
import message from 'lib/message'
import {routeTo} from 'lib/router'
import selectBundles from 'lib/selectors/bundles'
import selectCurrentRegion from 'lib/selectors/current-region'

import A from './a'
import Code from './code'
import Icon from './icon'
import InnerDock from './inner-dock'

// how often to poll when waiting for a bundle to be read on the server.
const POLL_TIMEOUT_MS = 10000
const STATUS_DONE = 'DONE'
const STATUS_ERROR = 'ERROR'
const isValid = d =>
  d.name && (d.osmId || d.osm) && (d.feedGroup || d.feedGroupId)

/**
 * Create bundle form.
 */
export default function CreateBundle() {
  const dispatch = useDispatch()
  const router = useRouter()
  const bundles = useSelector(selectBundles)
  const region = useSelector(selectCurrentRegion)

  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: ''
  })
  const onChange = propName => e => {
    // Since `target` will not exist if used in the function call below, extract
    // value first.
    const value = e.target.value
    setFormData(d => ({...d, [propName]: value}))
  }

  const regionId = region._id
  const bounds = region.bounds

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
          const {href, as} = routeTo('bundleEdit', {bundleId: _id, regionId})
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
    <InnerDock style={{width: '640px'}}>
      <form encType='multipart/form-data' onSubmit={submit}>
        <Stack p={8} spacing={8}>
          <Heading size='lg'>
            <Icon icon={faDatabase} /> {message('bundle.create')}
          </Heading>

          {uploading && (
            <Alert status='info'>
              <AlertIcon />
              <Stack spacing={2}>
                <AlertTitle>{message('bundle.processing')}</AlertTitle>
                <AlertDescription>{uploading}</AlertDescription>
              </Stack>
            </Alert>
          )}

          {error && (
            <Alert status='error'>
              <AlertIcon /> {error}
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
              onChange={onChange('name')}
              placeholder='Name'
            />
          </FormControl>

          <Stack spacing={4}>
            <Heading size='md'>OpenStreetMap</Heading>

            <Text>
              Reuse existing OSM data from other bundles or upload new data.
            </Text>

            <Heading size='sm'>
              Crop with osmconvert
              <A
                href='http://docs.analysis.conveyal.com/en/latest/prepare-inputs/index.html#preparing-the-osm-data'
                ml={1}
                rel='noopener noreferrer'
                target='_blank'
              >
                <Icon icon={faInfoCircle} />
              </A>
            </Heading>

            <Code>
              {message('region.osmConvertCommand', {
                north: bounds.north,
                south: bounds.south,
                east: bounds.east,
                west: bounds.west
              })}
            </Code>

            <Heading size='sm'>
              Crop and filter with osmosis
              <A
                href='http://docs.analysis.conveyal.com/en/latest/prepare-inputs/index.html#preparing-the-osm-data'
                ml={1}
                rel='noopener noreferrer'
                target='_blank'
              >
                <Icon icon={faInfoCircle} />
              </A>
            </Heading>
            <Code>
              {message('region.osmosisCommand', {
                north: bounds.north,
                south: bounds.south,
                east: bounds.east,
                west: bounds.west
              })}
            </Code>

            {formData.osm || (
              <FormControl isDisabled={uploading}>
                <FormLabel htmlFor='osmId'>
                  Use existing OpenStreetMap data from
                </FormLabel>
                <Select id='osmId' name='osmId' onChange={onChange('osmId')}>
                  <option selected></option>
                  {bundles.map(b => (
                    <option key={b._id} value={b.osmId}>
                      {b.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}

            {formData.osmId || (
              <FormControl isDisabled={uploading}>
                <FormLabel htmlFor='osm'>
                  Upload new OpenStreetMap data
                </FormLabel>
                <Input
                  accept='.pbf'
                  id='osm'
                  name='osm'
                  type='file'
                  onChange={onChange('osm')}
                />
                <FormHelperText>Must be in PBF format.</FormHelperText>
              </FormControl>
            )}
          </Stack>

          <Stack spacing={4}>
            <Heading size='md'>GTFS</Heading>

            <Text>
              Reuse existing GTFS from other bundles or upload new GTFS.
            </Text>

            {formData.feedGroup || (
              <FormControl isDisabled={uploading}>
                <FormLabel htmlFor='feedGroupId'>
                  Use existing GTFS data
                </FormLabel>
                <Select
                  id='feedGroupId'
                  name='feedGroupId'
                  onChange={onChange('feedGroupId')}
                >
                  <option selected />
                  {bundles.map(b => (
                    <option key={b._id} value={b.feedGroupId}>
                      {b.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}

            {formData.feedGroupId || (
              <FormControl isDisabled={uploading}>
                <FormLabel htmlFor='feedGroup'>
                  Upload new {message('bundle.files')}
                </FormLabel>
                <Input
                  accept='.zip'
                  id='feedGroup'
                  multiple
                  name='feedGroup'
                  onChange={onChange('feedGroup')}
                  type='file'
                />
                <FormHelperText>One or more .zip files</FormHelperText>
              </FormControl>
            )}
          </Stack>

          <input type='hidden' name='regionId' value={regionId} />

          <Stack spacing={4}>
            {!uploading && !error && (
              <Alert status='info'>
                <AlertIcon />
                {message('bundle.notice')}
              </Alert>
            )}

            <Button
              isDisabled={!isValid(formData)}
              isLoading={uploading}
              leftIcon='check'
              loadingText={message('common.processing')}
              size='lg'
              type='submit'
              variantColor='green'
            >
              {message('common.create')}
            </Button>
          </Stack>
        </Stack>
      </form>
    </InnerDock>
  )
}
