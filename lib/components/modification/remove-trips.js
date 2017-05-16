// @flow
import React, {Component} from 'react'

import SelectFeedRouteAndPatterns from './select-feed-route-and-patterns'

import type {Feed, Modification, Pattern} from '../../types'

type Props = {
  feeds: Feed[],
  modification: Modification,
  routePatterns: Pattern[],
  selectedFeed: Feed,
  update(any): void
}

/**
 * Select routes or trips to remove
 */
export default class RemoveTrips extends Component<void, Props, void> {
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
