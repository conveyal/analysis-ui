/**
 * Adjust speed on a route
 */

import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'

import {Button, Group} from './components/buttons'
import {Group as FormGroup, Number, Text} from './components/input'
import SelectRouteAndPatterns from './select-route-and-patterns'

export default class AdjustSpeed extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired
  }

  onNameChange = (e) => {
    this.props.replaceModification(Object.assign({}, this.props.modification, { name: e.target.value }))
  }

  onSelectorChange = (value) => {
    let { feed, routes, trips } = value
    let modification = Object.assign({}, this.props.modification, { feed, routes, trips, hops: null })
    this.props.replaceModification(modification)
  }

  newSelection = (e) => {
    this.props.setMapState({
      state: 'hop-selection',
      modification: this.props.modification,
      action: 'new'
    })
  }

  addToSelection = (e) => {
    this.props.setMapState({
      state: 'hop-selection',
      modification: this.props.modification,
      action: 'add'
    })
  }

  removeFromSelection = (e) => {
    this.props.setMapState({
      state: 'hop-selection',
      modification: this.props.modification,
      action: 'remove'
    })
  }

  clearSegment = (e) => {
    this.props.replaceModification(Object.assign({}, this.props.modification, { hops: null }))
  }

  /** set the factor by which we are scaling, or the speed which we are replacing */
  setScale = (e) => {
    this.props.replaceModification(Object.assign({}, this.props.modification, { scale: e.target.value }))
  }

  render () {
    const {modification} = this.props
    return (
      <form>
        <Text
          name='Name'
          onChange={this.onNameChange}
          value={modification.name}
          />

        <SelectRouteAndPatterns
          data={this.props.data}
          feed={modification.feed}
          onChange={this.onSelectorChange}
          routes={modification.routes}
          trips={modification.trips}
          />

        {this.renderSelectionButtons()}

        <Number
          label='Scale'
          name='Scale'
          onChange={this.setScale}
          step='any'
          value={modification.scale}
          />
      </form>
    )
  }

  renderSelectionButtons () {
    if (this.props.modification.routes != null) {
      return (
        <FormGroup>
          <label>Segment</label>
          <Group justified>
            <Button onClick={this.newSelection}>Select</Button>
            <Button onClick={this.addToSelection}>Add to</Button>
            <Button onClick={this.removeFromSelection}>Remove from</Button>
            <Button onClick={this.clearSegment}>Clear</Button>
          </Group>
        </FormGroup>
      )
    }
  }
}

/** create a new modification */
export function create (data) {
  return {
    id: uuid.v4(),
    scale: 1,
    feed: [...data.feeds.keys()][0],
    routes: null,
    trips: null,
    hops: null,
    type: 'adjust-speed',
    expanded: true,
    showOnMap: true
  }
}
