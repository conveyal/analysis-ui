/** select stops on a particular route */

import React, { Component } from 'react'
import L from 'leaflet'
import uuid from 'uuid'
import DrawPolygon from './draw-polygon'
import inside from 'turf-inside'
import point from 'turf-point'

import colors from './colors'

// convenience
const GTFS_API = 'http://localhost:4567'

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

    this.state = { stops: [], patterns: [] }

    this.updateState(props)

    this.layer = L.featureGroup()
    this.id = uuid.v4()
    this.props.addLayer(this.id, this.layer)

    this.newSelection = this.newSelection.bind(this)
    this.addToSelection = this.addToSelection.bind(this)
    this.removeFromSelection = this.removeFromSelection.bind(this)
    this.clearSelection = this.clearSelection.bind(this)
  }

  updateState (props) {
    // get all the stops for the feed and all the patterns for the route
    Promise.all([
      fetch(`${GTFS_API}/stops?feed=${props.feed}`).then(res => res.json()),
      // TODO multiple routes
      fetch(`${GTFS_API}/patterns?feed=${props.feed}&route=${props.routes[0]}`).then(res => res.json())
    ]).then(([allStops, patterns]) => {
      // filter down the stops to only what's relevant
      let selectedPatterns = this.props.trips == null ? 
        patterns :
        patterns.filter(p => {
          for (let t of p.trips) {
            if (this.props.trips.indexOf(t) > -1) return true
          }
          return false
        })

      let stops = []

      selectedPatterns.forEach(p => {
        p.orderedStops.forEach(sid => stops.push(allStops.find(s => s.stop_id === sid)))
      })

      this.setState(Object.assign({}, this.state, { stops, patterns }))
    })
  }

  /** get the currently selected stop IDs, handling things like wildcards etc. */
  getSelectedStopIds () {
    let stops
    if (this.props.stops) stops = this.props.stops
    else if (this.props.nullIsWildcard) stops = this.state.stops.map(s => s.stop_id)
    else stops = []
    return stops
  }

  componentWillReceiveProps(newProps) {
    this.updateState(newProps)
  }

  selectStops (callback) {
    this.control = new DrawPolygon(poly => {
      // find the stops
      // need to also filter by pattern
      let stops = this.state.stops.filter(s => inside(point([s.stop_lon, s.stop_lat]), poly))
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
    this.state.stops.forEach(s => {
      let marker = L.circleMarker(L.latLng(s.stop_lat, s.stop_lon),
        stops.indexOf(s.stop_id) > -1 ?
          this.props.selectedStopMarker :
          this.props.unselectedStopMarker)

      this.layer.addLayer(marker)
    })

    return <div>
      <button onClick={this.newSelection}>New selection</button>
      <button onClick={this.addToSelection}>Add to selection</button>
      <button onClick={this.removeFromSelection}>Remove from selection</button>
      <button onClick={this.clearSelection}>Clear selection</button>
      <ul>
        {(() => {
          if (this.state.stops == null || this.state.stops.length === 0) return []
          else if (stops.length === this.state.stops.length) return <li>(all stops)</li>
          else return stops.map(sid => {
            let stop = this.state.stops.find(s => s.stop_id === sid)
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
