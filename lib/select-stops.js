/** select stops on a particular route */

import React, { Component } from 'react'
import L from 'leaflet'
import uuid from 'uuid'
import DrawPolygon from './draw-polygon'
import inside from 'turf-inside'
import point from 'turf-point'

import colors from './colors'

export default class SelectStops extends Component {
  static defaultProps = {
    unselectedStopMarker: {
      radius: 4,
      color: colors.NEUTRAL
    },
    selectedStopMarker: {
      radius: 4,
      color: colors.MODIFIED
    },
    nullIsWildcard: false
  };

  constructor (props) {
    super(props)

    this.layer = L.featureGroup()
    this.id = uuid.v4()
    this.props.addLayer(this.id, this.layer)

    this.newSelection = this.newSelection.bind(this)
    this.addToSelection = this.addToSelection.bind(this)
    this.removeFromSelection = this.removeFromSelection.bind(this)
    this.clearSelection = this.clearSelection.bind(this)

    this.state = { routeStops: [] }

    this.updateState(props)
  }

  /** get the currently selected stop IDs, handling things like wildcards etc. */
  getSelectedStopIds () {
    let stops
    if (this.props.stops) stops = this.props.stops
    else if (this.props.nullIsWildcard) stops = this.state.stops.map((s) => s.stop_id)
    else stops = []
    return stops
  }

  componentWillReceiveProps (newProps) {
    this.updateState(newProps)
  }

  updateState (props) {
    let routeStopIds = new Set()
    let patterns = this.props.data.get(props.feed).routes.get(props.routes[0]).patterns

    // data has not yet been fetched
    if (patterns === undefined) {
      this.setState({ routeStops: [] })
      return
    }

    if (props.trips !== null) {
      patterns = patterns.filter((p) => {
        for (let trip of p.trips) {
          if (props.trips.indexOf(trip.trip_id) > -1) return true
        }
        return false
      })
    }

    patterns.forEach((p) => {
      p.stops.forEach((s) => routeStopIds.add(s.stop_id))
    })

    let routeStops = [...routeStopIds].map((sid) => props.data.get(this.props.feed).stops.get(sid))

    this.setState(Object.assign({}, this.state, { routeStops }))
  }

  selectStops (callback) {
    this.control = new DrawPolygon(poly => {
      // find the stops
      // need to also filter by pattern
      let stops = this.state.routeStops.filter(s => inside(point([s.stop_lon, s.stop_lat]), poly))
      callback(stops)
    })
    this.props.addControl(this.id, this.control)
  }

  newSelection (e) {
    this.selectStops(stops => {
      this.props.onChange(stops.map(s => s.stop_id))
    })
  }

  addToSelection (e) {
    this.selectStops(stops => {
      this.props.onChange(this.getSelectedStopIds().concat(stops.map(s => s.stop_id)))
    })
  }

  removeFromSelection (e) {
    this.selectStops(stops => {
      let selectedStopIds = stops.map(s => s.stop_id)
      // retain only the stops that were _not_ selected
      this.props.onChange(this.getSelectedStopIds().filter(sid => selectedStopIds.indexOf(sid) === -1))
    })
  }

  clearSelection (e) {
    this.props.onChange([])
  }

  render () {
    // draw all the stops on the map, with the selected ones highlighted
    this.layer.clearLayers()

    let stops = this.getSelectedStopIds()

    // draw all of the stops on the map
    for (let s of this.state.routeStops) {
      let marker = L.circleMarker(L.latLng(s.stop_lat, s.stop_lon),
        stops.findIndex((stop) => s.stop_id === stop) > -1 ?
          this.props.selectedStopMarker :
          this.props.unselectedStopMarker)

      this.layer.addLayer(marker)
    }

    return <div>
      <button onClick={this.newSelection}>New selection</button>
      <button onClick={this.addToSelection}>Add to selection</button>
      <button onClick={this.removeFromSelection}>Remove from selection</button>
      <button onClick={this.clearSelection}>Clear selection</button>
      <ul>
        {(() => {
          if (this.state.routeStops.length === stops.length) return <li>(all stops)</li>
          else return stops.map((sid) => {
            let stop = this.props.data.get(this.props.feed).stops.get(sid)
            return <li data-id={stop.stop_id} key={stop.stop_id}>{stop.stop_name}</li>
          })
        })()}
      </ul>
    </div>
  }

  componentWillUnmount () {
    this.props.removeLayer(this.id)
  }
}
