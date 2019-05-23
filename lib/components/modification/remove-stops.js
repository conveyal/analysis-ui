import React, {Component} from 'react'

import message from 'lib/message'

import {NumberInput} from '../input'

import SelectFeedRouteAndPatterns from './select-feed-route-and-patterns'
import SelectStops from './select-stops'

/**
 * Remove stops from a route
 */
export default class RemoveStopsComponent extends Component {
  onPatternSelectorChange = ({feed, routes, trips}) => {
    this.props.updateAndRetrieveFeedData({
      feed,
      routes,
      trips,
      stops: []
    })
  }

  changeRemoveSeconds = e => {
    const {update} = this.props
    const secondsSavedAtEachStop = e.currentTarget.value
    update({secondsSavedAtEachStop})
  }

  render() {
    const {
      feeds,
      modification,
      routePatterns,
      routeStops,
      selectedFeed,
      selectedStops,
      setMapState,
      update
    } = this.props
    return (
      <form>
        <SelectFeedRouteAndPatterns
          feeds={feeds}
          onChange={this.onPatternSelectorChange}
          routePatterns={routePatterns}
          routes={modification.routes}
          selectedFeed={selectedFeed}
          trips={modification.trips}
        />

        {modification.routes && selectedFeed && (
          <SelectStops
            modification={modification}
            routeStops={routeStops}
            selectedStops={selectedStops}
            setMapState={setMapState}
            update={update}
          />
        )}

        <NumberInput
          label={message('modification.removeStops.removeSeconds')}
          units={message('report.units.second')}
          onChange={this.changeRemoveSeconds}
          value={modification.secondsSavedAtEachStop}
        />
      </form>
    )
  }
}
