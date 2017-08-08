/** select stops on a particular route */

import React, {Component, PropTypes} from 'react'

import {MAP_STATE_STOP_SELECTION} from '../../constants'

export default class SelectStops extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    routeStops: PropTypes.array.isRequired,
    selectedStops: PropTypes.array.isRequired,

    setMapState: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  }

  newSelection = e => {
    e.preventDefault()
    const {modification, routeStops, setMapState} = this.props
    setMapState({
      state: MAP_STATE_STOP_SELECTION,
      action: 'new',
      modification,
      routeStops
    })
  }

  addToSelection = e => {
    e.preventDefault()
    const {modification, routeStops, setMapState} = this.props
    setMapState({
      state: MAP_STATE_STOP_SELECTION,
      action: 'add',
      modification,
      routeStops
    })
  }

  removeFromSelection = e => {
    e.preventDefault()
    const {modification, routeStops, setMapState} = this.props
    setMapState({
      state: MAP_STATE_STOP_SELECTION,
      action: 'remove',
      modification,
      routeStops
    })
  }

  clearSelection = e => {
    e.preventDefault()
    this.props.update({stops: null})
  }

  render () {
    const {selectedStops} = this.props
    return (
      <div>
        <div className='form-group'>
          <label htmlFor='Selection'>Selection</label>
          <div className='btn-group btn-group-justified'>
            <a
              className='btn btn-sm btn-default'
              onClick={this.newSelection}
              tabIndex={0}
            >
              New
            </a>
            <a
              className='btn btn-sm btn-default'
              onClick={this.addToSelection}
              tabIndex={0}
            >
              Add to
            </a>
            <a
              className='btn btn-sm btn-default'
              onClick={this.removeFromSelection}
              tabIndex={0}
            >
              Remove from
            </a>
            <a
              className='btn btn-sm btn-default'
              onClick={this.clearSelection}
              tabIndex={0}
            >
              Clear
            </a>
          </div>
        </div>
        {selectedStops.length > 0 &&
          <SelectedStops selectedStops={selectedStops} />}
      </div>
    )
  }
}

function SelectedStops ({selectedStops}) {
  return (
    <ul>
      {selectedStops.map(stop =>
        <li data-id={stop.stop_id} key={stop.stop_id}>
          {stop.stop_name}
        </li>
      )}
    </ul>
  )
}
