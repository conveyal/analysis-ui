import {Alert, AlertIcon, Button, Heading, Stack} from '@chakra-ui/core'
import memoize from 'lodash/memoize'
import React, {PureComponent} from 'react'

import {DEFAULT_SEGMENT_SPEED} from 'lib/constants/timetables'
import CopyTimetable from 'lib/containers/copy-timetable'
import {create as createTimetable} from 'lib/utils/timetable'

import Modal, {ModalTitle} from '../modal'

import TimetableComponent from './timetable'

export default class Timetables extends PureComponent {
  state = {
    showCopyModal: false
  }

  /** add a timetable */
  _create = () => {
    const {timetables, segmentDistances, update} = this.props
    const length = timetables.length
    const speeds =
      length > 0
        ? timetables[0].segmentSpeeds
        : segmentDistances.map(() => DEFAULT_SEGMENT_SPEED)
    update({
      timetables: [...timetables, createTimetable(speeds, length)]
    })
  }

  _createFromOther = (timetable) => {
    const {timetables, update} = this.props
    this._hideCopyModal()
    update({
      timetables: [...timetables, timetable]
    })
  }

  _hideCopyModal = () => {
    this.setState({showCopyModal: false})
  }

  _showCopyModal = () => {
    this.setState({
      showCopyModal: true
    })
  }

  /** update a timetable */
  _update = memoize((index) => (newTimetableProps) => {
    const timetables = [...this.props.timetables]
    timetables[index] = {
      ...timetables[index],
      ...newTimetableProps
    }
    this.props.update({timetables})
  })

  _remove = memoize((index) => () => {
    const timetables = [...this.props.timetables]
    timetables.splice(index, 1)
    this.props.update({timetables})
  })

  render() {
    const {
      bidirectional,
      modificationStops,
      numberOfStops,
      qualifiedStops,
      projectTimetables,
      segmentDistances,
      setMapState,
      timetables
    } = this.props
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
          onClick={this._create}
          variantColor='green'
        >
          Add new timetable
        </Button>
        <Button
          isFullWidth
          leftIcon='copy'
          onClick={this._showCopyModal}
          variantColor='green'
        >
          Copy existing timetable
        </Button>
        {timetables.map((tt, i) => (
          <TimetableComponent
            bidirectional={bidirectional}
            key={`timetable-${i}`}
            modificationStops={modificationStops}
            numberOfStops={numberOfStops}
            qualifiedStops={qualifiedStops}
            remove={this._remove(i)}
            projectTimetables={projectTimetables}
            segmentDistances={segmentDistances}
            setMapState={setMapState}
            timetable={tt}
            update={this._update(i)}
          />
        ))}
        {this.state.showCopyModal && (
          <Modal onRequestClose={this._hideCopyModal}>
            <ModalTitle>Copy Existing Timetable</ModalTitle>
            <CopyTimetable create={this._createFromOther} />
          </Modal>
        )}
      </Stack>
    )
  }
}
