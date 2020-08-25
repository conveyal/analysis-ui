import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast
} from '@chakra-ui/core'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import {useState, useCallback} from 'react'

import ConfirmButton from 'lib/components/confirm-button'
import EditBoundsForm from 'lib/components/edit-bounds-form'
import FullSpinner from 'lib/components/full-spinner'
import InnerDock from 'lib/components/inner-dock'
import {SPACING_FORM} from 'lib/constants/chakra'
import useInput from 'lib/hooks/use-controlled-input'
import useRegion from 'lib/hooks/use-region'
import MapLayout from 'lib/layouts/map'
import LogRocket from 'lib/logrocket'
import message from 'lib/message'
import {routeTo} from 'lib/router'
import reprojectCoordinates from 'lib/utils/reproject-coordinates'

const EditBounds = dynamic(() => import('lib/components/map/edit-bounds'), {
  ssr: false
})

const hasLength = (s: void | string) => s && s.length > 0

function putJSON(url: string, body) {
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}

export default function LoadRegion() {
  const router = useRouter()
  const {mutate, region} = useRegion(router.query.regionId as string, {
    revalidateOnFocus: false
  })
  if (!region) return <FullSpinner />
  return <EditRegion mutate={mutate} region={region} router={router} />
}

// Add the MapLayout
Object.assign(LoadRegion, {Layout: MapLayout})

/**
 * Use a separate component for the form due for the input hooks.
 */
function EditRegion(p) {
  const regionURL = `/api/regions/${p.region._id}`
  const [region, setRegion] = useState(p.region)
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  const nameInput = useInput({
    test: hasLength,
    value: region.name
  })
  const descriptionInput = useInput({value: region.description})

  // Delete region action
  async function _delete() {
    try {
      const res = await fetch(regionURL, {method: 'DELETE'})
      if (res.ok) {
        p.router.push('/')
        toast({
          title: 'Region deleted',
          description: 'Region has been successfully deleted.',
          position: 'top',
          status: 'success'
        })
      } else {
        const error = await res.json()
        toast({
          title: 'Error deleting region',
          description: error.message,
          position: 'top',
          status: 'error',
          isClosable: true,
          duration: null
        })
      }
    } catch (error) {
      toast({
        title: 'Error deleting region',
        description: error.message,
        position: 'top',
        status: 'error',
        isClosable: true,
        duration: null
      })
    }
  }

  // Save region action
  async function _save() {
    setSaving(true)

    // Save will redirect back to main region page when complete
    const nw = reprojectCoordinates({
      lat: region.bounds.north,
      lon: region.bounds.west
    })
    const se = reprojectCoordinates({
      lat: region.bounds.south,
      lon: region.bounds.east
    })
    const newBounds = {north: nw.lat, west: nw.lon, south: se.lat, east: se.lon}

    try {
      const res = await putJSON(regionURL, {
        ...region,
        bounds: newBounds,
        name: nameInput.value,
        description: descriptionInput.value
      })
      const json = await res.json()

      if (res.ok) {
        p.mutate(regionURL, json)
        const {href, as} = routeTo('projects', {regionId: region._id})
        p.router.push(href, as)
        toast({
          title: 'Region updated',
          description: 'Your changes have been saved.',
          position: 'top',
          status: 'success'
        })
      } else {
        toast({
          title: 'Error updating region',
          description: json.message,
          position: 'top',
          status: 'error',
          isClosable: true,
          duration: null
        })
      }
    } catch (e) {
      LogRocket.captureException(e)
      toast({
        title: 'Error updating region',
        description: e.message,
        position: 'top',
        status: 'error',
        isClosable: true,
        duration: null
      })
    } finally {
      setSaving(false)
    }
  }

  // Helper function to set a specific direction of the bounds
  const setBoundsFor = useCallback(
    (direction: string, newValue: number) => {
      setRegion((r) => ({...r, bounds: {...r.bounds, [direction]: newValue}}))
    },
    [setRegion]
  )

  return (
    <InnerDock>
      <EditBounds
        bounds={region.bounds}
        save={(b) => setRegion((r) => ({...r, bounds: b}))}
      />

      <Stack p={SPACING_FORM} spacing={SPACING_FORM}>
        <Heading size='md'>{message('region.editTitle')}</Heading>

        <FormControl isRequired isInvalid={nameInput.isInvalid}>
          <FormLabel htmlFor={nameInput.id}>{message('region.name')}</FormLabel>
          <Input {...nameInput} />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor={descriptionInput.id}>
            {message('region.description')}
          </FormLabel>
          <Input
            {...descriptionInput}
            placeholder={message('region.description')}
          />
        </FormControl>

        <EditBoundsForm
          bounds={region.bounds}
          isDisabled={saving}
          onChange={setBoundsFor}
        />

        <Button
          isFullWidth
          isLoading={saving}
          onClick={_save}
          loadingText={'Saving region'}
          size='lg'
          variantColor='green'
        >
          {message('region.editAction')}
        </Button>

        <ConfirmButton
          action={message('region.deleteAction')}
          description={message('region.deleteConfirmation')}
          isFullWidth
          leftIcon='delete'
          onConfirm={_delete}
          size='lg'
          variantColor='red'
        />
      </Stack>
    </InnerDock>
  )
}
