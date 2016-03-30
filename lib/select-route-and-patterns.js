/** Select a (group of) patterns from the GTFS feed */

import React, { Component, PropTypes } from 'react'
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

  constructor (props) {
    super(props)

    this.selectRoutes = this.selectRoutes.bind(this)
    this.selectTrips = this.selectTrips.bind(this)
  }

  selectTrips (trips) {
    this.props.onChange(Object.assign({}, this.props, { trips }))
  }

  selectRoutes ({ routes, feed }) {
    this.props.onChange(Object.assign({}, this.props, { routes, feed, trips: null }))
  }

  render () {
    return <div>
      <SelectRoutes routes={this.props.routes} feed={this.props.feed} onChange={this.selectRoutes} data={this.props.data} />

      {this.props.routes && this.props.routes.length === 1
        ? <SelectPatterns addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} onChange={this.selectTrips} feed={this.props.feed} routes={this.props.routes} trips={this.props.trips} data={this.props.data} />
        : <span/>
      }

    </div>
  }
}
