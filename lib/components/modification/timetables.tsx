import {Alert, AlertIcon, Button, Heading, Stack} from '@chakra-ui/core'
import {useState} from 'react'
import {useSelector} from 'react-redux'

import {DEFAULT_SEGMENT_SPEED} from 'lib/constants/timetables'
import CopyTimetable from 'lib/containers/copy-timetable'
import selectSegmentDistances from 'lib/selectors/segment-distances'
import {create as createTimetable} from 'lib/utils/timetable'

import Modal, {ModalTitle} from '../modal'

import TimetableComponent from './timetable'

export default function Timetables({
  modificationStops,
  numberOfStops,
  timetables,
  update
}) {
  const [showCopyModal, setShowCopyModal] = useState(false)
  const segmentDistances = useSelector(selectSegmentDistances)

  /** add a timetable */
  const _create = () => {
    const length = timetables.length
    const speeds =
      length > 0
        ? timetables[0].segmentSpeeds
        : segmentDistances.map(() => DEFAULT_SEGMENT_SPEED)
    update({
      timetables: [...timetables, createTimetable(speeds, length)]
    })
  }

  const _createFromOther = (timetable) => {
    setShowCopyModal(false)
    update({
      timetables: [...timetables, timetable]
    })
  }

  /** update a timetable */
  const _update = (index, newTimetableProps) => {
    const newTimetables = [...timetables]
    newTimetables[index] = {
      ...timetables[index],
      ...newTimetableProps
    }
    update({timetables: newTimetables})
  }

  const _remove = (index) => {
    const newTimetables = [...timetables]
    newTimetables.splice(index, 1)
    update({timetables: newTimetables})
  }

  return (
    <Stack spacing={4}>
      <Heading size='md'>Timetables ({timetables.length})</Heading>
      {timetables.length === 0 && (
        <Alert status='error'>
          <AlertIcon /> Modification needs at least 1 timetable
        </Alert>
      )}
      <Button
        isFullWidth
        leftIcon='small-add'
        onClick={_create}
        variantColor='green'
      >
        Add new timetable
      </Button>
      <Button
        isFullWidth
        leftIcon='copy'
        onClick={() => setShowCopyModal(true)}
        variantColor='green'
      >
        Copy existing timetable
      </Button>
      {timetables.map((tt, i) => (
        <TimetableComponent
          key={`timetable-${i}`}
          modificationStops={modificationStops}
          numberOfStops={numberOfStops}
          remove={() => _remove(i)}
          segmentDistances={segmentDistances}
          timetable={tt}
          update={(timetable) => _update(i, timetable)}
        />
      ))}
      {showCopyModal && (
        <Modal onRequestClose={() => setShowCopyModal(false)}>
          <ModalTitle>Copy Existing Timetable</ModalTitle>
          <CopyTimetable create={_createFromOther} />
        </Modal>
      )}
    </Stack>
  )
}
