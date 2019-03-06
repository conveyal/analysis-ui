// @flow

/** select stops on a particular route */

import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import React, {Component} from 'react'

import {MAP_STATE_STOP_SELECTION} from '../../constants'
import type {
  GTFSStop,
  Modification,
  MapState,
  Stop
} from '../../types'

const defaultBtnClass = 'btn btn-sm btn-default'
const disabledButtonClass = `${defaultBtnClass} disabled`

type Props = {
  modification: Modification,
  routeStops: Stop[],
  selectedStops: GTFSStop[],
  setMapState(MapState): void,
  update: (any) => void
}

export default class SelectStops extends Component {
  props: Props

  newSelection = (e: Event & {currentTarget: HTMLInputElement}) => {
    e.preventDefault()
    const {modification, routeStops, setMapState} = this.props
    setMapState({
      state: MAP_STATE_STOP_SELECTION,
      action: 'new',
      modification,
      routeStops
    })
  }

  addToSelection = (e: Event & {currentTarget: HTMLInputElement}) => {
    e.preventDefault()
    const {modification, routeStops, setMapState} = this.props
    setMapState({
      state: MAP_STATE_STOP_SELECTION,
      action: 'add',
      modification,
      routeStops
    })
  }

  removeFromSelection = (e: Event & {currentTarget: HTMLInputElement}) => {
    e.preventDefault()
    const {modification, routeStops, setMapState} = this.props
    setMapState({
      state: MAP_STATE_STOP_SELECTION,
      action: 'remove',
      modification,
      routeStops
    })
  }

  clearSelection = (e: Event & {currentTarget: HTMLInputElement}) => {
    e.preventDefault()
    this.props.update({stops: null})
  }

  /**
   * The New button is active while no stops are selected.  Upon at least 1 stop
   * being selected, the "Add to", "Remove from" and "Clear" buttons then become
   * active and the "New button becomes disabled."
   */
  render () {
    const {selectedStops} = this.props
    const someStopsSelected = selectedStops.length > 0

    return (
      <div>
        <div className='form-group'>
          <label htmlFor='Selection'>Selection</label>
          <div className='btn-group btn-group-justified'>
            <a
              className={someStopsSelected ? disabledButtonClass : defaultBtnClass}
              onClick={this.newSelection}
              tabIndex={0}
            >
              New
            </a>
            <a
              className={someStopsSelected ? defaultBtnClass : disabledButtonClass}
              onClick={this.addToSelection}
              tabIndex={0}
            >
              Add to
            </a>
            <a
              className={someStopsSelected ? defaultBtnClass : disabledButtonClass}
              onClick={this.removeFromSelection}
              tabIndex={0}
            >
              Remove from
            </a>
            <a
              className={someStopsSelected ? defaultBtnClass : disabledButtonClass}
              onClick={this.clearSelection}
              tabIndex={0}
            >
              Clear
            </a>
          </div>
        </div>
        {!someStopsSelected &&
          <div className='alert alert-info' role='alert'>
            <Icon type='exclamation-circle' />
            {message('modification.selectStopInstructions')}
          </div>}
        {someStopsSelected && <SelectedStops selectedStops={selectedStops} />}
      </div>
    )
  }
}

function SelectedStops ({selectedStops}) {
  return (
    <ul>
      {selectedStops.map(stop => (
        <li data-id={stop.stop_id} key={stop.stop_id}>
          {stop.stop_name}
        </li>
      ))}
    </ul>
  )
}
