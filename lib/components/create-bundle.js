import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
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

/**
 * Create bundle form.
 */
export default function CreateBundle() {
  const dispatch = useDispatch()
  const router = useRouter()
  const bundles = useSelector(selectBundles)
  const region = useSelector(selectCurrentRegion)

  const [reuseOsm, setReuseOsm] = React.useState(true)
  const [reuseGtfs, setReuseGtfs] = React.useState(true)
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: ''
  })
  const onChange = (propName) => (e) => {
    // Since `target` will not exist if used in the function call below, extract
    // value first.
    const value = e.target.value
    setFormData((d) => ({...d, [propName]: value}))
  }

  const isValid = () =>
    formData.name &&
    ((reuseOsm && formData.osmId) || (!reuseOsm && formData.osm)) &&
    ((reuseGtfs && formData.feedGroupId) || (!reuseGtfs && formData.feedGroup))

  const regionId = region._id
  const bounds = region.bounds

  /**
   * Check if the upload has completed
   */
  function checkUploadState(_id) {
    dispatch(fetch({url: `${API.Bundle}/${_id}`}))
      .then((bundle) => {
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

    if (reuseGtfs) body.delete('feedGroup')
    else body.delete('feedGroupId')

    if (reuseOsm) body.delete('osm')
    else body.delete('osmId')

    if (isValid()) {
      setUploading(true)
      setError()

      dispatch(
        fetch({
          url: API.Bundle,
          options: {body, method: 'post'}
        })
      )
        .then((bundle) => {
          setTimeout(() => checkUploadState(bundle._id), POLL_TIMEOUT_MS)
        })
        .catch(() => setUploading(false))
    }
  }

  return (
    <InnerDock style={{width: '640px'}}>
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

        <Text>{message('bundle.createDescription')}</Text>
      </Stack>

      <Stack
        as='form'
        encType='multipart/form-data'
        onSubmit={submit}
        opacity={uploading ? 0.4 : 1}
        pointerEvents={uploading ? 'none' : 'auto'}
        pl={8}
        pr={8}
        spacing={8}
      >
        <FormControl isRequired isInvalid={formData.name.length < 1}>
          <FormLabel htmlFor='bundleName'>{message('bundle.name')}</FormLabel>
          <Input
            id='bundleName'
            name='bundleName'
            onChange={onChange('name')}
            placeholder='Name'
          />
        </FormControl>

        <Tabs isFitted onChange={(i) => setReuseOsm(i === 0)}>
          <TabList>
            <Tab>{message('bundle.osm.existingTitle')}</Tab>
            <Tab>{message('bundle.osm.uploadNewTitle')}</Tab>
          </TabList>

          <TabPanels>
            <TabPanel pt={4}>
              <Select
                id='osmId'
                name='osmId'
                onChange={onChange('osmId')}
                placeholder={message('bundle.osm.existingLabel')}
              >
                {bundles.map((b) => (
                  <option key={b._id} value={b.osmId}>
                    {b.name}
                  </option>
                ))}
              </Select>
            </TabPanel>
            <TabPanel>
              <Stack spacing={4} pt={4}>
                <Heading size='sm'>
                  {message('bundle.osmconvertDescription')}
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
                  {message('bundle.osmConvertCommand', {
                    north: bounds.north,
                    south: bounds.south,
                    east: bounds.east,
                    west: bounds.west
                  })}
                </Code>

                <Heading size='sm'>
                  {message('bundle.osmosisDescription')}
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
                  {message('bundle.osmosisCommand', {
                    north: bounds.north,
                    south: bounds.south,
                    east: bounds.east,
                    west: bounds.west
                  })}
                </Code>

                <FormControl>
                  <FormLabel htmlFor='osm'>
                    {message('bundle.osm.uploadNewLabel')}
                  </FormLabel>
                  <Input
                    accept='.pbf'
                    id='osm'
                    name='osm'
                    type='file'
                    onChange={onChange('osm')}
                  />
                </FormControl>
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Tabs isFitted onChange={(i) => setReuseGtfs(i === 0)}>
          <TabList>
            <Tab>{message('bundle.gtfs.existingTitle')}</Tab>
            <Tab>{message('bundle.gtfs.uploadNewTitle')}</Tab>
          </TabList>

          <TabPanels>
            <TabPanel pt={4}>
              <Select
                id='feedGroupId'
                name='feedGroupId'
                onChange={onChange('feedGroupId')}
                placeholder={message('bundle.gtfs.existingLabel')}
              >
                {bundles.map((b) => (
                  <option key={b._id} value={b.feedGroupId}>
                    {b.name}
                  </option>
                ))}
              </Select>
            </TabPanel>
            <TabPanel pt={4}>
              <FormControl>
                <FormLabel htmlFor='feedGroup'>
                  {message('bundle.gtfs.uploadNewLabel')}
                </FormLabel>
                <Input
                  accept='.zip'
                  id='feedGroup'
                  multiple
                  name='feedGroup'
                  onChange={onChange('feedGroup')}
                  type='file'
                />
              </FormControl>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <input type='hidden' name='regionId' value={regionId} />

        <Stack spacing={4}>
          {!uploading && !error && (
            <Alert status='info'>
              <AlertIcon />
              {message('bundle.notice')}
            </Alert>
          )}

          <Button
            isDisabled={!isValid()}
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
    </InnerDock>
  )
}
