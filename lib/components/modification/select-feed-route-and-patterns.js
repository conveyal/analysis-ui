import React, {PureComponent} from 'react'

import SelectPatterns from './select-patterns'
import SelectFeedAndRoutes from './select-feed-and-routes'

/**
 * Select a (group of) patterns from the GTFS feed
 */
export default class SelectFeedRouteAndPatterns extends PureComponent {
  _selectTrips = ({trips}) => {
    const {selectedFeed, routes} = this.props
    this.props.onChange({
      feed: selectedFeed ? selectedFeed.id : null,
      routes,
      trips
    })
  }

  _selectFeedAndRoutes = ({feed, routes}) => {
    this.props.onChange({feed, routes, trips: null})
  }

  render() {
    const {
      allowMultipleRoutes,
      feeds,
      routePatterns,
      routes,
      selectedFeed,
      trips
    } = this.props
    return (
      <div>
        <SelectFeedAndRoutes
          allowMultipleRoutes={allowMultipleRoutes}
          feeds={feeds}
          onChange={this._selectFeedAndRoutes}
          selectedFeed={selectedFeed}
          selectedRouteIds={routes}
        />

        {routes && routes.length < 2 && routePatterns.length > 0 && (
          <SelectPatterns
            onChange={this._selectTrips}
            routePatterns={routePatterns}
            trips={trips}
          />
        )}
      </div>
    )
  }
}
