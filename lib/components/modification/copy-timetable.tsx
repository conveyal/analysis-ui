import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalOverlay,
  Select,
  Stack,
  ModalHeader,
  useDisclosure
} from '@chakra-ui/core'
import get from 'lodash/get'
import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {v4 as uuidv4} from 'uuid'

import fetchAction from 'lib/actions/fetch'
import {API} from 'lib/constants'
import {DEFAULT_SEGMENT_SPEED} from 'lib/constants/timetables'
import message from 'lib/message'
import selectRegionId from 'lib/selectors/current-region-id'

// Simple Select > Options
const Options = ({options}) =>
  options.map((o) => (
    <option key={o._id} value={o._id}>
      {get(o, 'name', 'unnamed')}
    </option>
  ))

// Button that shows a modal for copying timetables into a modification
export default function CopyTimetableButton({create, intoModification}) {
  const {isOpen, onOpen, onClose} = useDisclosure()

  return (
    <>
      <Button isFullWidth leftIcon='copy' onClick={onOpen} variantColor='green'>
        Copy existing timetable
      </Button>

      {isOpen && (
        <Modal isOpen={true} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Copy timetable</ModalHeader>
            <ModalCloseButton />
            <CopyTimetableContent
              create={create}
              intoModification={intoModification}
              onClose={onClose}
            />
          </ModalContent>
        </Modal>
      )}
    </>
  )
}

function CopyTimetableContent({create, intoModification, onClose}) {
  const dispatch = useDispatch<any>()
  const [regions, setRegions] = useState([])
  const [loading, setLoading] = useState(true)
  const defaultRegionId = useSelector(selectRegionId)

  const [regionId, setRegionId] = useState(defaultRegionId)
  const [projectId, setProjectId] = useState(intoModification.projectId)
  const [modificationId, setModificationId] = useState(intoModification._id)
  const [timetableId, setTimetableId] = useState(null)

  useEffect(() => {
    dispatch(fetchAction({url: API.Timetables})).then((regions) => {
      setRegions(regions)
      setLoading(false)
    })
  }, [dispatch])

  if (loading) return <ModalBody>Loading...</ModalBody>
  // if not loading and the region does not exist that means there are no
  // timetables to select from. Show advisory message.
  if (regions.length === 0) {
    return (
      <ModalBody>
        <Alert status='warning'>
          <AlertIcon />
          No timetables available to copy from! Please create a timetable
          manually.
        </Alert>
      </ModalBody>
    )
  }

  const region = regions.find((r) => regionId === r._id) || regions[0]
  const projects = get(region, 'projects', [])
  const project = projects.find((p) => projectId === p._id) || projects[0]
  const modifications = get(project, 'modifications', [])
  const modification =
    modifications.find((m) => modificationId === m._id) || modifications[0]
  const timetables = get(modification, 'timetables', [])
  const timetable =
    timetables.find((t) => timetableId === t._id) || timetables[0]

  const _onConfirmTimetable = async () => {
    if (!timetable) {
      return
    }
    const numSegments = intoModification.segments
      ? intoModification.segments.length
      : 0

    await create({
      ...timetable,
      _id: uuidv4(),
      dwellTimes: timetable.dwellTimes.slice(0, numSegments),
      name: `Copy of ${timetable.name}`,
      phaseAtStop: null,
      phaseFromStop: null,
      segmentSpeeds:
        numSegments > timetable.segmentSpeeds.length
          ? Array(numSegments)
              .fill(DEFAULT_SEGMENT_SPEED)
              .map((v, i) => timetable.segmentSpeeds[i] || v)
          : timetable.segmentSpeeds.slice(0, numSegments)
    })

    onClose()
  }

  // we have timetables to select, show selectors
  return (
    <>
      <ModalBody>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Region</FormLabel>
            <Select
              onChange={(e) => setRegionId(e.target.value)}
              value={regionId}
            >
              <Options options={regions} />
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Project</FormLabel>
            <Select
              onChange={(e) => setProjectId(e.target.value)}
              value={projectId}
            >
              <Options options={projects} />
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Modification</FormLabel>
            <Select
              onChange={(e) => setModificationId(e.target.value)}
              value={modificationId}
            >
              <Options options={modifications} />
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Timetable</FormLabel>
            <Select
              onChange={(e) => setTimetableId(e.target.value)}
              value={timetableId}
            >
              <Options options={timetables} />
            </Select>
          </FormControl>

          {modification &&
            intoModification.segments.length !==
              modification.segments.length && (
              <Alert status='info'>
                <AlertIcon />
                {(intoModification.segments.length === 0 ||
                  modification.segments.length === 0) &&
                  message('modification.copyTimetable.noSegments', {
                    segmentSpeed: DEFAULT_SEGMENT_SPEED
                  })}
                {intoModification.segments.length >
                  modification.segments.length &&
                  modification.segments.length > 0 &&
                  message('modification.copyTimetable.curHasMoreSegments', {
                    numSegments: modification.segments.length,
                    segmentSpeed: DEFAULT_SEGMENT_SPEED
                  })}
                {intoModification.segments.length <
                  modification.segments.length &&
                  intoModification.segments.length > 0 &&
                  message('modification.copyTimetable.curHasLessSegments', {
                    numSegments: intoModification.segments.length
                  })}
              </Alert>
            )}
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button leftIcon='small-close' mr={2} onClick={onClose}>
          Cancel
        </Button>
        <Button
          leftIcon='small-add'
          onClick={_onConfirmTimetable}
          variantColor='green'
        >
          Copy into new timetable
        </Button>
      </ModalFooter>
    </>
  )
}
