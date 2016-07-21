/** Remove stops from a route */

import React, {Component, PropTypes} from 'react'

import SelectFeedRouteAndPatterns from './select-feed-route-and-patterns'
import SelectStops from './select-stops'

export default class RemoveStops extends Component {
  static propTypes = {
    feeds: PropTypes.array.isRequired,
    feedsById: PropTypes.object.isRequired,
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired
  }

  onPatternSelectorChange = ({feed, routes, trips}) => {
    const {modification, replaceModification} = this.props
    replaceModification({
      ...modification,
      feed,
      routes,
      trips,
      stops: []
    })
  }

  render () {
    const {feeds, feedsById, modification, replaceModification, setMapState} = this.props
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
            replaceModification={replaceModification}
            setMapState={setMapState}
            />
        }
      </form>
    )
  }
}
