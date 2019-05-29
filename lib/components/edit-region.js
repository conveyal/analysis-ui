import {faSpinner, faTrash} from '@fortawesome/free-solid-svg-icons'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import React from 'react'
import {useDispatch} from 'react-redux'

import {deleteRegion, save} from 'lib/actions/region'
import {RouteTo} from 'lib/constants'
import message from 'lib/message'
import reprojectCoordinates from 'lib/utils/reproject-coordinates'

import {Application, Dock} from './base'
import {Button} from './buttons'
import Icon from './icon'
import {Text} from './input'

const EditBounds = dynamic(() => import('./map/edit-bounds'), {ssr: false})

const cardinalDirections = ['North', 'South', 'East', 'West']

/**
 * Bounds editor will automatically fit map to bounds.
 */
export default function EditRegion(p) {
  const dispatch = useDispatch()
  const router = useRouter()
  const [region, setRegion] = React.useState(p.region)
  const [saving, setSaving] = React.useState(false)

  // Delete region action
  const _delete = React.useCallback(() => {
    if (window.confirm(message('region.deleteConfirmation'))) {
      dispatch(deleteRegion(region._id)).then(() => {
        router.push(RouteTo.regions)
      })
    }
  }, [dispatch, router, region._id])

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

  // Has been edited
  const hasBeenEdited = p.region !== region

  const spin = saving || !region.statusCode || region.statusCode !== 'DONE'
  const buttonText = spin ? (
    <>
      <Icon icon={faSpinner} spin />{' '}
      {message(`region.statusCode.${p.region.statusCode}`)}
    </>
  ) : (
    message('region.editAction')
  )

  const Map = () => (
    <EditBounds
      bounds={region.bounds}
      save={bounds => setRegion(r => ({...r, bounds}))}
    />
  )

  const onChangeName = React.useCallback(e => {
    const name = e.target.value
    setRegion(r => ({...r, name}))
  }, [])

  const onChangeDescription = React.useCallback(e => {
    const description = e.target.value
    setRegion(r => ({...r, description}))
  }, [])

  return (
    <Application map={Map}>
      <Dock>
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
      </Dock>
    </Application>
  )
}
