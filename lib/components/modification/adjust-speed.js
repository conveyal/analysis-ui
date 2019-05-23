import {faExclamationCircle} from '@fortawesome/free-solid-svg-icons'
import React, {Component} from 'react'

import message from 'lib/message'

import {Button, Group} from '../buttons'
import {MAP_STATE_HOP_SELECTION} from '../../constants'
import Icon from '../icon'
import {Group as FormGroup, NumberInput} from '../input'

import SelectFeedRouteAndPatterns from './select-feed-route-and-patterns'

/**
 * Adjust speed on a route
 */
export default class AdjustSpeedComponent extends Component {
  onSelectorChange = value => {
    const {feed, routes, trips} = value
    this.props.updateAndRetrieveFeedData({feed, routes, trips, hops: null})
  }

  newSelection = () => {
    const {modification, setMapState} = this.props
    setMapState({
      state: MAP_STATE_HOP_SELECTION,
      modification,
      action: 'new'
    })
  }

  addToSelection = () => {
    const {modification, setMapState} = this.props
    setMapState({
      state: MAP_STATE_HOP_SELECTION,
      modification,
      action: 'add'
    })
  }

  removeFromSelection = () => {
    const {modification, setMapState} = this.props
    setMapState({
      state: MAP_STATE_HOP_SELECTION,
      modification,
      action: 'remove'
    })
  }

  clearSegment = () => {
    this.props.update({hops: null})
  }

  /** set the factor by which we are scaling, or the speed which we are replacing */
  setScale = e => {
    this.props.update({scale: e.currentTarget.value})
  }

  render() {
    const {feeds, modification, routePatterns, selectedFeed} = this.props
    return (
      <form>
        <SelectFeedRouteAndPatterns
          allowMultipleRoutes
          feeds={feeds}
          onChange={this.onSelectorChange}
          routePatterns={routePatterns}
          routes={modification.routes}
          selectedFeed={selectedFeed}
          trips={modification.trips}
        />

        {modification.routes && (
          <FormGroup>
            <label htmlFor='Segment'>Segment</label>
            <Group justified>
              <Button onClick={this.newSelection}>
                {message('common.select')}
              </Button>
              <Button onClick={this.addToSelection}>
                {message('common.addTo')}
              </Button>
              <Button onClick={this.removeFromSelection}>
                {message('common.removeFrom')}
              </Button>
              <Button onClick={this.clearSegment}>
                {message('common.clear')}
              </Button>
            </Group>
            <div className='alert alert-info' role='alert'>
              <Icon icon={faExclamationCircle} />
              {message('report.adjustSpeed.selectInstructions')}
            </div>
          </FormGroup>
        )}

        <NumberInput
          label={message('report.adjustSpeed.scaleLabel')}
          name={message('report.adjustSpeed.scaleLabel')}
          min={0}
          onChange={this.setScale}
          step='any'
          value={modification.scale}
        />
      </form>
    )
  }
}
