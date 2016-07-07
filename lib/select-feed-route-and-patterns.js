/** Select a (group of) patterns from the GTFS feed */

import React, {Component, PropTypes} from 'react'

import SelectPatterns from './select-patterns'
import SelectFeedAndRoutes from './select-feed-and-routes'

export default class SelectFeedRouteAndPatterns extends Component {
  static propTypes = {
    feed: PropTypes.object,
    feeds: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    routes: PropTypes.array.isRequired,
    trips: PropTypes.array // trips can be null indicating a wildcard
  }

  selectTrips = ({ patterns, trips }) => {
    this.props.onChange(Object.assign({}, this.props, { patterns, trips }))
  }

  selectFeedAndRoutes = ({ routes, feed }) => {
    this.props.onChange(Object.assign({}, this.props, { routes, feed, trips: null }))
  }

  render () {
    const {feed, feeds, routes, trips} = this.props
    return (
      <div>
        <SelectFeedAndRoutes
          feed={feed}
          feeds={feeds}
          onChange={this.selectFeedAndRoutes}
          selectedRouteId={routes && routes[0]}
          />

        {routes && routes.length === 1 &&
          <SelectPatterns
            feed={feed}
            onChange={this.selectTrips}
            route={routes[0]}
            trips={trips}
            />
        }
      </div>
    )
  }
}
