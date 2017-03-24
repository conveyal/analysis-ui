/** Select routes or trips to remove */

import React, {Component, PropTypes} from 'react'

import SelectFeedRouteAndPatterns from './select-feed-route-and-patterns'

export default class RemoveTrips extends Component {
  static propTypes = {
    feeds: PropTypes.array.isRequired,
    modification: PropTypes.object.isRequired,
    routePatterns: PropTypes.array.isRequired,
    selectedFeed: PropTypes.object,
    update: PropTypes.func.isRequired
  }

  render () {
    const {feeds, modification, routePatterns, selectedFeed} = this.props
    const {routes, trips} = modification
    return (
      <SelectFeedRouteAndPatterns
        feeds={feeds}
        onChange={this.props.update}
        routePatterns={routePatterns}
        routes={routes}
        selectedFeed={selectedFeed}
        trips={trips}
        />
    )
  }
}
