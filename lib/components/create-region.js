import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack
} from '@chakra-ui/core'
import {faMap} from '@fortawesome/free-solid-svg-icons'
import dynamic from 'next/dynamic'
import React from 'react'

import {SPACING_FORM} from 'lib/constants/chakra'
import {DEFAULT_BOUNDS} from 'lib/constants/region'
import {MapChildrenContext} from 'lib/layouts/map'
import message from 'lib/message'
import reprojectCoordinates from 'lib/utils/reproject-coordinates'

import EditBoundsForm from './edit-bounds-form'
import Icon from './icon'
import InnerDock from './inner-dock'

const EditBounds = dynamic(() => import('./map/edit-bounds'), {ssr: false})

/**
 * Create a region.
 */
export default function CreateRegion(p) {
  const [error, setError] = React.useState()
  const [uploading, setUploading] = React.useState(false)
  const [bounds, setBounds] = React.useState(DEFAULT_BOUNDS)
  const [description, setDescription] = React.useState('')
  const [name, setName] = React.useState('')
  const setMapChildren = React.useContext(MapChildrenContext)

  // Ready to submit form?
  const readyToCreate = name && name.length > 0

  // Render into map
  React.useEffect(() => {
    setMapChildren(() => <EditBounds bounds={bounds} save={setBounds} />)
    return () => setMapChildren(() => <React.Fragment />)
  }, [bounds, setMapChildren, setBounds])

  // Create/save will keep checking load status and redirect to the region page
  function _create() {
    const nw = reprojectCoordinates({lat: bounds.north, lon: bounds.west})
    const se = reprojectCoordinates({lat: bounds.south, lon: bounds.east})
    const b = {north: nw.lat, west: nw.lon, south: se.lat, east: se.lon}

    // Validate the bounds
    const boundsIsNaN =
      isNaN(b.north) || isNaN(b.south) || isNaN(b.east) || isNaN(b.west)
    if (boundsIsNaN) {
      setError('Bounds must be valid coordinates.')
      return
    }

    setUploading(true)

    p.create({name, description, bounds}).catch((e) => {
      setError(e)
      setUploading(false)
    })
  }

  return (
    <InnerDock>
      <Stack as='form' p={SPACING_FORM} spacing={SPACING_FORM}>
        <Heading size='md'>
          <Icon icon={faMap} /> <span> {message('region.createAction')}</span>
        </Heading>

        {error && <Alert status='danger'>{error}</Alert>}

        <FormControl
          isDisabled={uploading}
          isRequired
          isInvalid={name.length < 1}
        >
          <FormLabel>{message('region.name')}</FormLabel>
          <Input
            name={message('region.name')}
            onChange={(e) => setName(e.target.value)}
            placeholder={message('region.name')}
            type='text'
            value={name}
          />
        </FormControl>

        <FormControl isDisabled={uploading}>
          <FormLabel>{message('region.description')}</FormLabel>
          <Input
            onChange={(e) => setDescription(e.target.value)}
            placeholder={message('region.description')}
            type='text'
            value={description}
          />
        </FormControl>

        <EditBoundsForm
          bounds={bounds}
          isDisabled={uploading}
          onChange={(d, v) => setBounds((b) => ({...b, [d]: v}))}
        />

        <Button
          block
          isDisabled={!readyToCreate}
          isLoading={uploading}
          leftIcon='check'
          loadingText='Creating region...'
          onClick={_create}
          name={message('region.createAction')}
          size='lg'
          variantColor='green'
        >
          {message('region.createAction')}
        </Button>
      </Stack>
    </InnerDock>
  )
}
