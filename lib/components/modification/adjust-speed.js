/**
 * Adjust speed on a route
 */

import React, { Component, PropTypes } from 'react'

import {Button, Group} from '../buttons'
import {MAP_STATE_HOP_SELECTION} from '../../constants'
import {Group as FormGroup, Number} from '../input'
import SelectFeedRouteAndPatterns from './select-feed-route-and-patterns'

export default class AdjustSpeed extends Component {
  static propTypes = {
    feeds: PropTypes.array.isRequired,
    feedsById: PropTypes.object.isRequired,
    modification: PropTypes.object.isRequired,
    setMapState: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  }

  onSelectorChange = (value) => {
    const {feed, routes, trips} = value
    this.props.update({feed, routes, trips, hops: null})
  }

  newSelection = (e) => {
    const {modification, setMapState} = this.props
    setMapState({
      state: MAP_STATE_HOP_SELECTION,
      modification,
      action: 'new'
    })
  }

  addToSelection = (e) => {
    const {modification, setMapState} = this.props
    setMapState({
      state: MAP_STATE_HOP_SELECTION,
      modification,
      action: 'add'
    })
  }

  removeFromSelection = (e) => {
    const {modification, setMapState} = this.props
    setMapState({
      state: MAP_STATE_HOP_SELECTION,
      modification,
      action: 'remove'
    })
  }

  clearSegment = (e) => {
    this.props.update({hops: null})
  }

  /** set the factor by which we are scaling, or the speed which we are replacing */
  setScale = (e) => {
    this.props.update({scale: e.target.value})
  }

  render () {
    const {feeds, feedsById, modification} = this.props
    return (
      <form>
        <SelectFeedRouteAndPatterns
          feeds={feeds}
          onChange={this.onSelectorChange}
          routes={modification.routes}
          selectedFeed={feedsById[modification.feed]}
          trips={modification.trips}
          />

        {modification.routes &&
          <FormGroup>
            <label htmlFor='Segment'>Segment</label>
            <Group justified>
              <Button onClick={this.newSelection}>Select</Button>
              <Button onClick={this.addToSelection}>Add to</Button>
              <Button onClick={this.removeFromSelection}>Remove from</Button>
              <Button onClick={this.clearSegment}>Clear</Button>
            </Group>
          </FormGroup>
        }

        <Number
          label='Scale'
          name='Scale'
          min={0}
          onChange={this.setScale}
          step='any'
          value={modification.scale}
          />
      </form>
    )
  }
}
