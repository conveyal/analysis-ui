import {faPlus, faSave, faTrash} from '@fortawesome/free-solid-svg-icons'
import {useRouter} from 'next/router'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {deleteBundle, saveBundle} from 'lib/actions'
import {RouteTo} from 'lib/constants'
import message from 'lib/message'

import {Button} from './buttons'
import Icon from './icon'
import {Group, Text} from './input'
import Select from './select'

const getOptionLabel = b =>
  `${b.name}${b.status === 'DONE' ? '' : `: ${b.status}`}`

/**
 * Edit bundle is keyed by the bundle ID and will be completely unmounted and
 * recreated when that changes.
 */
export default function EditBundle(p) {
  const dispatch = useDispatch()
  const router = useRouter()
  const bundles = useSelector(s => s.region.bundles)

  const {regionId} = router.query
  const [bundleId, setBundleId] = React.useState(router.query.bundleId)
  const originalBundle = bundles.find(b => b._id === bundleId)
  const [bundle, setBundle] = React.useState(originalBundle)

  function _deleteBundle() {
    if (window.confirm(message('bundle.deleteConfirmation'))) {
      dispatch(deleteBundle(bundleId)).then(() => {
        router.push({
          pathname: RouteTo.bundles,
          query: {regionId}
        })
      })
    }
  }

  function goToCreateBundle() {
    router.push({
      pathname: RouteTo.bundleCreate,
      query: {regionId}
    })
  }

  function _saveBundle() {
    dispatch(saveBundle(bundle)).then(b => setBundle(b))
  }

  function selectBundle(result) {
    setBundleId(result._id)
    router.push({
      pathname: RouteTo.bundleEdit,
      query: {regionId, bundleId: result._id}
    })
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
        feeds: bundle.feeds.map(f => {
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
    <>
      <p>{message('bundle.explanation')}</p>

      <Group>
        <Button block onClick={goToCreateBundle} style='success'>
          <Icon icon={faPlus} /> Create a bundle
        </Button>
      </Group>

      <p className='text-center'>{message('bundle.select')}</p>

      <Group>
        <Select
          clearable={false}
          options={bundles}
          getOptionLabel={getOptionLabel}
          getOptionValue={b => b._id}
          onChange={selectBundle}
          value={bundles.find(b => b._id === bundleId)}
        />
      </Group>

      {bundle && bundleId === router.query.bundleId && (
        <>
          <h5>{message('bundle.edit')}</h5>

          {bundle.status === 'PROCESSING_GTFS' && (
            <div className='alert alert-warning'>
              {message('bundle.processing')}
            </div>
          )}

          {bundle.status === 'ERROR' && (
            <div className='alert alert-danger'>
              <p>{message('bundle.failure')}</p>
              <p>{bundle.errorCode}</p>
            </div>
          )}

          <Text
            label={message('bundle.name')}
            name='Name'
            onChange={setName}
            placeholder='Bundle name'
            value={bundle.name}
          />

          {bundle.feeds &&
            bundle.feeds.map((feed, index) => (
              <Text
                key={feed.feedId}
                label={`${message('bundle.feed')} #${index + 1}`}
                onChange={e => setFeedName(feed.feedId, e)}
                placeholder='Feed name'
                value={feed.name}
              />
            ))}

          <Button
            block
            disabled={bundle === originalBundle}
            onClick={_saveBundle}
            title={message('bundle.save')}
            style='success'
          >
            <Icon icon={faSave} /> {message('bundle.save')}
          </Button>

          <Button block style='danger' onClick={_deleteBundle}>
            <Icon icon={faTrash} /> {message('bundle.delete')}
          </Button>
        </>
      )}
    </>
  )
}
