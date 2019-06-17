import {faSpinner, faTrash} from '@fortawesome/free-solid-svg-icons'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import React from 'react'
import {useDispatch} from 'react-redux'

import {deleteRegion, save} from 'lib/actions/region'
import {RouteTo} from 'lib/constants'
import message from 'lib/message'
import reprojectCoordinates from 'lib/utils/reproject-coordinates'

import {Button} from './buttons'
import Icon from './icon'
import InnerDock from './inner-dock'
import {Text} from './input'

const EditBounds = dynamic(import('./map/edit-bounds'), {ssr: false})

const cardinalDirections = ['North', 'South', 'East', 'West']

/**
 * Bounds editor will automatically fit map to bounds.
 */
export function EditRegion(p) {
  const [region, setRegion] = React.useState(p.region)
  const [saving, setSaving] = React.useState(false)
  // Keep track if it has been edited
  const hasBeenEdited = p.region !== region
  // Dispatch and router passed as props for testing purposes
  const {dispatch, router} = p

  // Delete region action
  function _delete() {
    if (window.confirm(message('region.deleteConfirmation'))) {
      dispatch(deleteRegion(region._id)).then(() => {
        router.push(RouteTo.regions)
      })
    }
  }

  // Save region action
  const _save = React.useCallback(() => {
    setSaving(true)

    // Save will redirect back to main region page when complete
    const b = region.bounds
    const nw = reprojectCoordinates({lat: b.north, lon: b.west})
    const se = reprojectCoordinates({lat: b.south, lon: b.east})
    const bounds = {north: nw.lat, west: nw.lon, south: se.lat, east: se.lon}
    dispatch(save({...region, bounds})).then(() => {
      setSaving(false)

      router.push({
        pathname: RouteTo.regionSettings,
        query: {regionId: region._id}
      })
    })
  }, [dispatch, region, router])

  // Helper function to set a specific direction of the bounds
  const setBoundsFor = direction => e =>
    setRegion(r => ({...r, bounds: {...r.bounds, [direction]: e.target.value}}))

  const spin = saving || !region.statusCode || region.statusCode !== 'DONE'
  const buttonText = spin ? (
    <>
      <Icon icon={faSpinner} spin />{' '}
      {message(`region.statusCode.${p.region.statusCode}`)}
    </>
  ) : (
    message('region.editAction')
  )

  const onChangeName = React.useCallback(e => {
    const name = e.target.value
    setRegion(r => ({...r, name}))
  }, [])

  const onChangeDescription = React.useCallback(e => {
    const description = e.target.value
    setRegion(r => ({...r, description}))
  }, [])

  // Render into map
  const {setMapChildren} = p
  React.useEffect(() => {
    setMapChildren(() => (
      <EditBounds
        bounds={region.bounds}
        save={bounds => setRegion(r => ({...r, bounds}))}
      />
    ))
    return () => setMapChildren(() => <React.Fragment />)
  }, [region, setMapChildren, setRegion])

  return (
    <InnerDock className='block'>
      <legend>{message('region.editTitle')}</legend>
      <Text
        label={message('region.name') + '*'}
        name={message('region.name')}
        onChange={onChangeName}
        value={region.name}
      />
      <Text
        label={message('region.description')}
        name={message('region.description')}
        onChange={onChangeDescription}
        value={region.description || ''}
      />
      <h5>{message('region.bounds')}</h5>
      <div className='alert alert-warning'>
        {message('region.boundsNotice')}
        <a
          href='http://docs.analysis.conveyal.com/en/latest/analysis/methodology.html#spatial-resolution'
          rel='noopener noreferrer'
          target='_blank'
        >
          {' '}
          Learn more about spatial resolution here.
        </a>
      </div>
      {cardinalDirections.map(direction => (
        <Text
          key={`bound-${direction}`}
          label={`${direction} bound`}
          name={`${direction} bound`}
          onChange={setBoundsFor(direction.toLowerCase())}
          value={region.bounds[direction.toLowerCase()]}
        />
      ))}

      <p>
        <em>{message('region.updatesDisabled')}</em>
      </p>

      <Button
        block
        disabled={spin || !hasBeenEdited}
        onClick={_save}
        name={message('region.editAction')}
        style='success'
      >
        {buttonText}
      </Button>

      <Button block onClick={_delete} style='danger'>
        <Icon icon={faTrash} /> {message('region.deleteAction')}
      </Button>
    </InnerDock>
  )
}

/**
 * Export a connected, memoized version by default.
 */
export default React.memo(function ConnectedEditRegion(p) {
  const dispatch = useDispatch()
  const router = useRouter()

  return <EditRegion {...p} dispatch={dispatch} router={router} />
})
