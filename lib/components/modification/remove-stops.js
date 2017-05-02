/** Remove stops from a route */

import React, {Component, PropTypes} from 'react'

import {Number as InputNumber} from '../input'
import SelectFeedRouteAndPatterns from './select-feed-route-and-patterns'
import SelectStops from './select-stops'
import messages from '../../utils/messages'

export default class RemoveStops extends Component {
  static propTypes = {
    feeds: PropTypes.array.isRequired,
    modification: PropTypes.object.isRequired,
    routePatterns: PropTypes.array.isRequired,
    routeStops: PropTypes.array.isRequired,
    selectedFeed: PropTypes.object,
    selectedStops: PropTypes.array.isRequired,
    setMapState: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  }

  onPatternSelectorChange = ({feed, routes, trips}) => {
    const {update} = this.props
    update({
      feed,
      routes,
      trips,
      stops: []
    })
  }

  changeRemoveSeconds = (e) => {
    const {update} = this.props
    const secondsSavedAtEachStop = e.target.value
    update({ secondsSavedAtEachStop })
  }

  render () {
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

        {modification.routes && selectedFeed &&
          <SelectStops
            modification={modification}
            routeStops={routeStops}
            selectedStops={selectedStops}
            setMapState={setMapState}
            update={update}
            />
        }

        <InputNumber
          label={messages.modification.removeStops.removeSeconds}
          units={messages.report.units.second}
          onChange={this.changeRemoveSeconds}
          value={modification.secondsSavedAtEachStop}
        />
      </form>
    )
  }
}
