/** Remove stops from a route */

import React, {Component, PropTypes} from 'react'

import {Number as InputNumber} from '../input'
import SelectFeedRouteAndPatterns from './select-feed-route-and-patterns'
import SelectStops from './select-stops'
import messages from '../../utils/messages'

export default class RemoveStops extends Component {
  static propTypes = {
    feeds: PropTypes.array.isRequired,
    feedsById: PropTypes.object.isRequired,
    modification: PropTypes.object.isRequired,
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
    const {feeds, feedsById, modification, setMapState, update} = this.props
    const selectedFeed = feedsById[modification.feed]
    return (
      <form>
        <SelectFeedRouteAndPatterns
          feeds={feeds}
          onChange={this.onPatternSelectorChange}
          routes={modification.routes}
          selectedFeed={selectedFeed}
          trips={modification.trips}
          />

        {modification.routes && selectedFeed &&
          <SelectStops
            feed={selectedFeed}
            modification={modification}
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
