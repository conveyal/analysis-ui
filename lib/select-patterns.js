/** Select a pattern, given routes and and a feed id */

import React, { Component } from 'react'
import uuid from 'uuid'
import L from 'leaflet'
import colors from './colors'

const GTFS_API = 'http://localhost:4567'

export default class SelectPatterns extends Component {
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

    this.onMouseOverPattern = this.onMouseOverPattern.bind(this)
    this.onMouseOutPattern = this.onMouseOutPattern.bind(this)
    this.selectPatterns = this.selectPatterns.bind(this)

    this.state = { patterns: [] }

    this.layer = L.featureGroup()
    this.id = uuid.v4()
    this.props.addLayer(this.id, this.layer)
  }

  /** show the pattern being hovered over on the map */
  onMouseOverPattern (e) {
    if (this.activeLayer != null) this.layer.removeLayer(this.activeLayer)
    let p = this.props.data.get(this.props.feed).get(this.props.routes[0]).patterns.find(p => p.pattern_id === e.target.value)
    this.activeLayer = L.geoJson({
      type: 'Feature',
      properties: {},
      geometry: p.geometry
    }, this.props.activePatternOptions)
    this.layer.addLayer(this.activeLayer)
  }

  /** remove the hovered pattern from the map */
  onMouseOutPattern (e) {
    if (this.activeLayer != null) this.layer.removeLayer(this.activeLayer)
    this.activeLayer = null
  }

  selectPatterns (e) {
    let patterns = Array.prototype.map.call(e.target.querySelectorAll('option:checked'), o => o.value)
    // convert to trip IDs as pattern IDs are not stable

    let trips = []
    let allPatterns = this.props.data.get(this.props.feed).get(this.props.routes[0]).patterns
    patterns.forEach(pid => {
      let p = allPatterns.find(p => p.pattern_id === pid)
      p.trips.forEach(t => trips.push(t.trip_id))
    })

    this.props.onChange(trips)
  }

  render () {
    // render selected patterns on the map
    this.layer.clearLayers()
    this.activeLayer = null

    let allPatterns = this.props.data.get(this.props.feed).get(this.props.routes[0]).patterns
    let patterns = allPatterns
    if (this.props.trips !== null) {
      patterns = allPatterns.filter(p => {
        for (let trip of p.trips) {
          if (this.props.trips.findIndex((t) => t === trip.trip_id) > -1) return true
        }
        return false
      })
    }

    patterns.forEach(p => {
      this.layer.addLayer(L.geoJson({
        type: 'Feature',
        properties: {},
        geometry: p.geometry
      }, this.props.selectedPatternOptions))
    })

    return <select multiple onChange={this.selectPatterns}>
      {allPatterns.map(p => {
        // if trips is null it is a glob selector for all trips on the route
        let checked = this.props.trips == null || p.trips.findIndex((tid) => this.props.trips.findIndex((ptrip) => ptrip.trip_id === tid) > -1) > -1

        return checked ?
          <option value={p.pattern_id} selected onMouseOver={this.onMouseOverPattern} onMouseOut={this.onMouseOutPattern} key={p.pattern_id}>{p.name}</option> :
          <option value={p.pattern_id} onMouseOver={this.onMouseOverPattern} onMouseOut={this.onMouseOutPattern} key={p.pattern_id}>{p.name}</option>
      })}
    </select>
  }

  componentWillUnmount () {
    this.props.removeLayer(this.id)
  }
}
