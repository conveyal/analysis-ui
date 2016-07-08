/** Select a (group of) patterns from the GTFS feed */

import React, {Component, PropTypes} from 'react'

import SelectPatterns from './select-patterns'
import SelectFeedAndRoutes from './select-feed-and-routes'

export default class SelectFeedRouteAndPatterns extends Component {
  static propTypes = {
    feed: PropTypes.object,
    feeds: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    routes: PropTypes.array,
    selectedFeed: PropTypes.object,
    trips: PropTypes.array // trips can be null indicating a wildcard
  }

  selectTrips = ({ patterns, trips }) => {
    this.props.onChange(Object.assign({}, this.props, { patterns, trips }))
  }

  selectFeedAndRoutes = ({
    feed,
    routes
  }) => {
    this.props.onChange(Object.assign({}, this.props, { routes, feed, trips: null }))
  }

  render () {
    const {selectedFeed, feeds, routes, trips} = this.props
    const routePatterns = routes && routes.length === 1
      ? selectedFeed.routes.get(routes[0]).patterns
      : false
    return (
      <div>
        <SelectFeedAndRoutes
          feeds={feeds}
          onChange={this.selectFeedAndRoutes}
          selectedFeed={selectedFeed}
          selectedRouteId={routes && routes[0]}
          />

        {routePatterns &&
          <SelectPatterns
            onChange={this.selectTrips}
            routePatterns={routePatterns}
            trips={trips}
            />
        }
      </div>
    )
  }
}
