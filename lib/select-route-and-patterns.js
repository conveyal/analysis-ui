/** Select a (group of) patterns from the GTFS feed */

import React, { Component } from 'react'
import L from 'leaflet'
import uuid from 'uuid'
import colors from './colors'
import SelectPatterns from './select-patterns'
import SelectRoutes from './select-routes'

export default class SelectRouteAndPatterns extends Component {
  static defaultProps = {
    /** The options of selected patterns on the map */
    selectedPatternOptions: {
      style: {
        color: colors.NEUTRAL,
        weight: 3
      }
    },

    /** the options for active patterns on the map (hover) */
    activePatternOptions: {
      style: {
        color: colors.ACTIVE,
        weight: 5
      }
    }
  };

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

      {this.props.routes && this.props.routes.length === 1 ?
        <SelectPatterns addLayer={this.props.addLayer} removeLayer={this.props.removeLayer} onChange={this.selectTrips}
          feed={this.props.feed} routes={this.props.routes} trips={this.props.trips} data={this.props.data}
          activePatternOptions={this.props.activePatternOptions} selectedPatternOptions={this.props.selectedPatternOptions} /> : <span/>
      }

    </div>
  }

  componentWillUnmount () {
    this.props.removeLayer(this.id)
  }
}
