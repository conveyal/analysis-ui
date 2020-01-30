import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text
} from '@chakra-ui/core'
import get from 'lodash/get'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import React from 'react'
import {useDispatch} from 'react-redux'

import {deleteRegion, save} from 'lib/actions/region'
import message from 'lib/message'
import reprojectCoordinates from 'lib/utils/reproject-coordinates'

import EditBoundsForm from './edit-bounds-form'
import InnerDock from './inner-dock'

const EditBounds = dynamic(() => import('./map/edit-bounds'), {ssr: false})

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
  const {bounds} = region

  // Delete region action
  function _delete() {
    if (window.confirm(message('region.deleteConfirmation'))) {
      dispatch(deleteRegion(region._id)).then(() => {
        router.push('/')
      })
    }
  }

  // Save region action
  function _save() {
    setSaving(true)

    // Save will redirect back to main region page when complete
    const nw = reprojectCoordinates({lat: bounds.north, lon: bounds.west})
    const se = reprojectCoordinates({lat: bounds.south, lon: bounds.east})
    const newBounds = {north: nw.lat, west: nw.lon, south: se.lat, east: se.lon}
    dispatch(save({...region, bounds: newBounds})).then(r => {
      setRegion(r)
      setSaving(false)
    })
  }

  // Helper function to set a specific direction of the bounds
  function setBoundsFor(direction, newValue) {
    setRegion(r => ({...r, bounds: {...r.bounds, [direction]: newValue}}))
  }

  const spin = saving || !region.statusCode || region.statusCode !== 'DONE'

  function onChangeName(e) {
    const name = e.target.value
    setRegion(r => ({...r, name}))
  }

  function onChangeDescription(e) {
    const description = e.target.value
    setRegion(r => ({...r, description}))
  }

  // Render into map
  const {setMapChildren} = p
  React.useEffect(() => {
    setMapChildren(() => (
      <EditBounds
        bounds={bounds}
        save={b => setRegion(r => ({...r, bounds: b}))}
      />
    ))
    return () => setMapChildren(() => <React.Fragment />)
  }, [bounds, setRegion, setMapChildren])

  return (
    <InnerDock>
      <Stack p={4} spacing={4}>
        <Heading size='md'>{message('region.editTitle')}</Heading>

        <FormControl isRequired isInvalid={get(region, 'name.length') < 1}>
          <FormLabel>{message('region.name')}</FormLabel>
          <Input
            onChange={onChangeName}
            placeholder={message('region.name')}
            type='text'
            value={region.name}
          />
        </FormControl>

        <FormControl>
          <FormLabel>{message('region.description')}</FormLabel>
          <Input
            onChange={onChangeDescription}
            placeholder={message('region.description')}
            type='text'
            value={region.description || ''}
          />
        </FormControl>

        <EditBoundsForm
          bounds={bounds}
          isDisabled={saving}
          onChange={setBoundsFor}
        />

        <Text>
          <em>{message('region.updatesDisabled')}</em>
        </Text>

        <Button
          block
          isDisabled={!hasBeenEdited}
          isLoading={spin}
          onClick={_save}
          loadingText={message(`region.statusCode.${p.region.statusCode}`)}
          size='lg'
          variantColor='green'
        >
          {message('region.editAction')}
        </Button>

        <Button
          block
          leftIcon='delete'
          onClick={_delete}
          size='lg'
          variantColor='red'
        >
          {message('region.deleteAction')}
        </Button>
      </Stack>
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
