import {
  Alert,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack
} from '@chakra-ui/core'
import {useRouter} from 'next/router'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {deleteBundle, saveBundle} from 'lib/actions'
import message from 'lib/message'
import {routeTo} from 'lib/router'

import ConfirmButton from './confirm-button'
import Select from './select'

const getOptionLabel = (b) =>
  `${b.name}${b.status === 'DONE' ? '' : `: ${b.status}`}`

/**
 * Edit bundle is keyed by the bundle ID and will be completely unmounted and
 * recreated when that changes.
 */
export default function EditBundle(p) {
  const dispatch = useDispatch()
  const router = useRouter()
  const bundles = useSelector((s) => s.region.bundles)

  const {regionId} = router.query
  const [bundleId, setBundleId] = React.useState(router.query.bundleId)
  const originalBundle = bundles.find((b) => b._id === bundleId)
  const [bundle, setBundle] = React.useState(originalBundle)

  // If this bundle has project's associated with it. Disable deletion.
  const disableDelete = p.bundleProjects.length > 0

  function _deleteBundle() {
    return dispatch(deleteBundle(bundleId)).then(() => {
      const {as, href} = routeTo('bundles', {regionId})
      router.push(href, as)
    })
  }

  function _saveBundle() {
    dispatch(saveBundle(bundle)).then((b) => setBundle(b))
  }

  function selectBundle(result) {
    setBundleId(result._id)
    const {as, href} = routeTo('bundleEdit', {regionId, bundleId: result._id})
    router.push(href, as)
  }

  function setName(e) {
    if (e.target.value && e.target.value.length > 0) {
      setBundle({...bundle, name: `${e.target.value}`})
    }
  }

  function setFeedName(feedId, e) {
    if (bundle && e.target.value && e.target.value.length > 0) {
      setBundle({
        ...bundle,
        feeds: bundle.feeds.map((f) => {
          if (f.feedId === feedId) {
            return {
              ...f,
              name: e.target.value
            }
          }
          return f
        })
      })
    }
  }

  return (
    <Stack spacing={8}>
      <FormControl>
        <FormLabel>{message('bundle.select')}</FormLabel>

        <Box>
          <Select
            options={bundles}
            getOptionLabel={getOptionLabel}
            getOptionValue={(b) => b._id}
            onChange={selectBundle}
            value={bundles.find((b) => b._id === bundleId)}
          />
        </Box>
      </FormControl>

      {bundle && bundleId === router.query.bundleId && (
        <Stack spacing={4}>
          <Heading size='md'>{message('bundle.edit')}</Heading>

          {bundle.status === 'PROCESSING_GTFS' && (
            <Alert status='info'>{message('bundle.processing')}</Alert>
          )}

          {bundle.status === 'ERROR' && (
            <Alert status='error'>
              {message('bundle.failure')}
              <br />
              {bundle.statusText}
            </Alert>
          )}

          <FormControl>
            <FormLabel htmlForm='bundleName'>
              {message('bundle.name')}
            </FormLabel>
            <Input
              id='bundleName'
              name='Name'
              onChange={setName}
              placeholder='Bundle name'
              value={bundle.name}
            />
          </FormControl>

          {bundle.feeds &&
            bundle.feeds.map((feed, index) => (
              <FormControl key={feed.feedId}>
                <FormLabel htmlFor={feed.feedId}>
                  {`${message('bundle.feed')} #${index + 1}`}
                </FormLabel>
                <Input
                  id={feed.feedId}
                  onChange={(e) => setFeedName(feed.feedId, e)}
                  placeholder='Feed name'
                  value={feed.name}
                />
              </FormControl>
            ))}

          <Button
            block
            disabled={bundle === originalBundle}
            onClick={_saveBundle}
            size='lg'
            title={message('bundle.save')}
            variantColor='yellow'
          >
            {message('bundle.save')}
          </Button>

          {disableDelete ? (
            <Alert status='info'>
              {message('bundle.deleteDisabled', {
                projects: p.bundleProjects.length
              })}
            </Alert>
          ) : (
            <ConfirmButton
              action={message('bundle.delete')}
              block
              description={message('bundle.deleteConfirmation')}
              leftIcon='delete'
              onConfirm={_deleteBundle}
              size='lg'
              variantColor='red'
            />
          )}
        </Stack>
      )}
    </Stack>
  )
}
