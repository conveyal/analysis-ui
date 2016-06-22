/** Select a (group of) patterns from the GTFS feed */

import React, {Component, PropTypes} from 'react'

import SelectPatterns from './select-patterns'
import SelectRoutes from './select-routes'

export default class SelectRouteAndPatterns extends Component {
  static propTypes = {
    addLayer: PropTypes.func,
    data: PropTypes.object.isRequired,
    feed: PropTypes.string,
    removeLayer: PropTypes.func,
    routes: PropTypes.array,
    trips: PropTypes.array, // trips can be null indicating a wildcard
    onChange: PropTypes.func.isRequired
  }

  selectTrips = ({ patterns, trips }) => {
    this.props.onChange(Object.assign({}, this.props, { patterns, trips }))
  }

  selectRoutes = ({ routes, feed }) => {
    this.props.onChange(Object.assign({}, this.props, { routes, feed, trips: null }))
  }

  render () {
    return (
      <div>
        <SelectRoutes
          data={this.props.data}
          feed={this.props.feed}
          onChange={this.selectRoutes}
          routes={this.props.routes}
          />

        {this.renderSelectPatterns()}
      </div>
    )
  }

  renderSelectPatterns () {
    if (this.props.routes && this.props.routes.length === 1) {
      return <SelectPatterns
        addLayer={this.props.addLayer}
        data={this.props.data}
        feed={this.props.feed}
        onChange={this.selectTrips}
        removeLayer={this.props.removeLayer}
        routes={this.props.routes}
        trips={this.props.trips}
        />
    }
  }
}
