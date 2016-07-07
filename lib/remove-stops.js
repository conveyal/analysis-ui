/** Remove stops from a route */

import React, { Component, PropTypes } from 'react'

import {Text} from './components/input'
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

  onNameChange = (e) => {
    this.props.replaceModification(Object.assign({}, this.props.modification, { name: e.target.value }))
  }

  onPatternSelectorChange = (value) => {
    let { feed, routes, trips } = value
    let modification = Object.assign({}, this.props.modification, { feed, routes, trips, stops: [] })
    this.props.replaceModification(modification)
  }

  render () {
    const {feeds, feedsById, modification} = this.props
    return (
      <form>
        <Text
          name='Name'
          onChange={this.onNameChange}
          value={modification.name}
          />

        <SelectFeedRouteAndPatterns
          feed={feedsById[modification.feed]}
          feeds={feeds}
          onChange={this.onPatternSelectorChange}
          routes={modification.routes}
          trips={modification.trips}
          />

        {modification.routes &&
          <SelectStops
            feed={feedsById[modification.feed]}
            modification={modification}
            replaceModification={this.props.replaceModification}
            setMapState={this.props.setMapState}
            />
        }
      </form>
    )
  }
}
