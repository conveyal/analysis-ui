import {
  Alert,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  useToast,
  FormErrorMessage,
  ModalHeader,
  Stack,
  ModalFooter
} from '@chakra-ui/core'
import {faTrash} from '@fortawesome/free-solid-svg-icons'
import fpGet from 'lodash/fp/get'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import {memo, useCallback, useEffect, useState} from 'react'

import {usePresets} from 'lib/hooks/use-collection'
import useInput from 'lib/hooks/use-controlled-input'

import {ObjectToTable} from './analysis/profile-request-display'
import {ConfirmDialog} from './confirm-button'
import Editable from './editable'
import Select from './select'
import IconButton from './icon-button'

// Number precision
const isWithinTolerance = (n1: number, n2: number) => Math.abs(n1 - n2) < 1e-6

// Select `get`s
const getId = fpGet('_id')
const getOptionLabel = fpGet('name')

// For input validation
const hasName = (n) => n && n.length > 0

/**
 * Presets contain many more parameters than we use in the UI. Only check the ones from there.
 */
function findPreset(settings, presets = []) {
  const keys = Object.keys(settings || {})
  return presets.find(
    ({profileRequest}) =>
      keys.find((k) => {
        if (typeof profileRequest[k] === 'number') {
          return !isWithinTolerance(profileRequest[k], settings[k])
        }
        return !isEqual(profileRequest[k], settings[k])
      }) == null
  )
}

type Props = {
  currentSettings: Record<string, unknown>
  isDisabled: boolean
  isComparison?: boolean
  onChange: (any) => void
  regionId: string
}

/**
 * Form controls for selecting, creating, and managing presets.
 */
export default memo<Props>(function PresetChooser({
  currentSettings,
  isDisabled,
  isComparison = false,
  onChange,
  regionId
}) {
  const presets = usePresets({query: {regionId}, options: {sort: {name: 1}}})
  const toast = useToast()
  const createPreset = useDisclosure()
  const managePresets = useDisclosure()

  const [preset, setPreset] = useState()
  const id = 'select-preset-' + isComparison

  // Check the presets to see if they match any settings
  useEffect(() => {
    setPreset(findPreset(currentSettings, presets.data))
  }, [presets, currentSettings, setPreset])

  function _selectPreset(e) {
    const preset = presets.data.find((b) => b._id === e._id)
    if (preset) {
      onChange(preset.profileRequest)
    }
  }

  // Create a new preset based on current settings and show a toast on success.
  const _createPreset = useCallback(
    async (presetName) => {
      const res = await presets.create({
        name: presetName,
        profileRequest: currentSettings,
        regionId
      })
      if (res.ok) {
        presets.revalidate()
        toast({
          title: 'Created new preset',
          position: 'top',
          status: 'success'
        })
      }
    },
    [currentSettings, presets, regionId, toast]
  )

  return (
    <FormControl isDisabled={isDisabled} isInvalid={presets.error}>
      <Flex justify='space-between'>
        <FormLabel htmlFor={id}>Presets</FormLabel>
        <Box>
          {get(presets, 'data.length') > 0 && (
            <Button
              isDisabled={isDisabled}
              onClick={managePresets.onOpen}
              mr={2}
              rightIcon='edit'
              size='xs'
            >
              Manage
            </Button>
          )}
          <Button
            isDisabled={isDisabled}
            onClick={createPreset.onOpen}
            rightIcon='small-add'
            size='xs'
            variantColor='green'
          >
            New
          </Button>
        </Box>
      </Flex>
      <Box>
        {get(presets, 'data.length') > 0 ? (
          <Select
            name={id}
            inputId={id}
            isDisabled={isDisabled}
            key={getId(preset)}
            getOptionLabel={getOptionLabel}
            getOptionValue={getId}
            options={presets.data}
            onChange={_selectPreset}
            value={preset}
          />
        ) : (
          <Alert status='info'>Save presets to be used later.</Alert>
        )}
      </Box>
      {presets.error && (
        <FormErrorMessage>Error loading presets.</FormErrorMessage>
      )}
      {managePresets.isOpen && (
        <ManagePresets presets={presets} onClose={managePresets.onClose} />
      )}
      {createPreset.isOpen && (
        <CreatePreset create={_createPreset} onClose={createPreset.onClose} />
      )}
    </FormControl>
  )
})

/**
 * Modal for creating new presets.
 */
function CreatePreset({create, onClose}) {
  const nameInput = useInput({test: hasName, value: ''})
  const [isCreating, setIsCreating] = useState(false)

  async function _create() {
    setIsCreating(true)
    await create(nameInput.value)
    onClose()
  }

  return (
    <Modal isOpen={true} onClose={onClose} initialFocusRef={nameInput.ref}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create preset</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={nameInput.isInvalid} isRequired>
            <FormLabel htmlFor={nameInput.id}>Name</FormLabel>
            <Input {...nameInput} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            leftIcon='small-add'
            isDisabled={nameInput.isInvalid}
            isLoading={isCreating}
            onClick={_create}
            variantColor='green'
          >
            Create preset
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

/**
 * Modal for managing presets.
 */
function ManagePresets({presets, onClose}) {
  const [filter, setFilter] = useState('')
  const toast = useToast()
  const {data, remove} = presets

  // Remove a preset and show a toast on success
  const _removePreset = useCallback(
    async (_id) => {
      const res = await remove(_id)
      if (res.ok) {
        toast({
          title: 'Deleted preset',
          position: 'top',
          status: 'success'
        })
      }
    },
    [remove, toast]
  )

  // Handle changes to the filter
  const [filteredPresets, setFilteredPresets] = useState([])
  useEffect(() => {
    const filterLcase = filter != null ? filter.toLowerCase() : ''
    setFilteredPresets(
      data.filter(
        (p) => filter === null || p.name.toLowerCase().indexOf(filterLcase) > -1
      )
    )
  }, [data, filter, setFilteredPresets])

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Presets</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <InputGroup flex='1'>
              <InputLeftElement pr={2}>
                <Icon name='search' />
              </InputLeftElement>
              <Input
                placeholder='Filter presets'
                onChange={(e) => setFilter(e.target.value)}
                type='text'
                value={filter}
                variant='flushed'
              />
            </InputGroup>
            {filteredPresets.map((p) => (
              <Box key={p._id}>
                <Preset
                  preset={p}
                  remove={_removePreset}
                  update={presets.update}
                />
              </Box>
            ))}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

function Preset({preset, remove, update}) {
  const removeAction = useDisclosure()
  return (
    <Stack spacing={3}>
      <Flex align='center' justify='space-between'>
        <Box flex='1' fontSize='lg' mr={2} overflow='hidden'>
          <Editable
            isValid={hasName}
            onChange={(name) => update(preset._id, {name})}
            value={preset.name}
          />
        </Box>
        <IconButton
          icon={faTrash}
          label='Delete preset'
          onClick={removeAction.onOpen}
          variantColor='red'
        />
      </Flex>
      <Box>
        <details>
          <summary>Values</summary>
          <ObjectToTable object={preset.profileRequest} />
        </details>
      </Box>
      <Divider />
      {removeAction.isOpen && (
        <ConfirmDialog
          action='Delete preset'
          description='Are you sure you want to delete this preset?'
          onClose={removeAction.onClose}
          onConfirm={() => remove(preset._id)}
        />
      )}
    </Stack>
  )
}
