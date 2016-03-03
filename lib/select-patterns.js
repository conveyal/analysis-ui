/** Select a (group of) patterns from the GTFS feed */

import React, { Component } from 'react'
import L from 'leaflet'
import uuid from 'uuid'
import colors from './colors'

// convenience
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

    this.state = { feeds: [], routes: [] }

    this.updateState(props)

    this.selectRoute = this.selectRoute.bind(this)
    this.selectPatterns = this.selectPatterns.bind(this)
    this.selectFeed = this.selectFeed.bind(this)
    this.onMouseOverPattern = this.onMouseOverPattern.bind(this)
    this.onMouseOutPattern = this.onMouseOutPattern.bind(this)

    this.layer = L.featureGroup()
    this.id = uuid.v4()
    this.props.addLayer(this.id, this.layer)
  }

  updateState (props) {
    fetch(`${GTFS_API}/feeds`).then(res => res.json())
      .then(feeds => this.setState(Object.assign({}, this.state, { feeds })))

    if (props.feed) {
      fetch(`${GTFS_API}/routes?feed=${props.feed}`).then(res => res.json())
        .then(routes => this.setState(Object.assign({}, this.state, { routes })))

      // if a single route is selected, fetch patterns
      if (props.routes && props.routes.length === 1) {
        fetch(`${GTFS_API}/patterns?feed=${props.feed}&route=${props.routes[0]}`).then(res => res.json())
          .then(patterns => this.setState(Object.assign({}, this.state, { patterns })))
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    this.updateState(nextProps)
  }

  selectFeed (e) {
    this.props.onChange(Object.assign({}, this.props, { feed: e.target.value, routes: null, trips: null }))
  }

  selectRoute (e) {
    this.props.onChange(Object.assign({}, this.props, { routes: e.target.value === '' ? null : [ e.target.value ], trips: null }))
  }

  selectPatterns (e) {
    let patterns = Array.prototype.map.call(e.target.querySelectorAll('option:checked'), o => o.value)
    // convert to trip IDs as pattern IDs are not stable

    let trips = []
    patterns.forEach(pid => {
      let p = this.state.patterns.find(p => p.pattern_id === pid)
      p.trips.forEach(t => trips.push(t))
    })

    this.props.onChange(Object.assign({}, this.props, { trips }))
  }

  /** show the pattern being hovered over on the map */
  onMouseOverPattern (e) {
    if (this.activeLayer != null) this.layer.removeLayer(this.activeLayer)
    let p = this.state.patterns.find(p => p.pattern_id === e.target.value)
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

  render () {
    // render selected patterns on the map
    this.layer.clearLayers()
    this.activeLayer = null

    if (this.props.routes && this.props.routes.length === 1 && this.state.patterns) {
      let patterns
      if (this.props.trips === null) {
        patterns = this.state.patterns
      } else {
        patterns = this.state.patterns.filter(p => {
          for (let trip of p.trips) {
            if (this.props.trips.indexOf(trip) > -1) return true
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
    }

    return <div>
      <select value={this.props.feed} onChange={this.selectFeed}>
        { this.state.feeds.map(f => <option value={f}>{f}</option>) }
      </select><br/>

      <select value={this.props.routes ? this.props.routes[0] : undefined} onChange={this.selectRoute}>
        <option></option>
        { this.state.routes.map(r => <option value={r.route_id}>{(r.route_short_name ? r.route_short_name + ' ' : '') + (r.route_long_name ? r.route_long_name : '')}</option>) }
      </select><br/>

      {(() => {
        if (this.props.routes && this.props.routes.length === 1 && this.state.patterns) {
          return <select multiple onChange={this.selectPatterns}>
            {this.state.patterns.map(p => {
              // if trips is null it is a glob selector for all trips on the route
              let checked = this.props.trips == null || p.trips.find(t => this.props.trips.indexOf(t) > -1) != null

              return checked ? 
                <option value={p.pattern_id} selected onMouseOver={this.onMouseOverPattern} onMouseOut={this.onMouseOutPattern}>{p.name}</option> :
                <option value={p.pattern_id} onMouseOver={this.onMouseOverPattern} onMouseOut={this.onMouseOutPattern}>{p.name}</option>
            })}
          </select>
        } else return <span/>
      })()}
    </div>
  }

  componentWillUnmount () {
    this.props.removeLayer(this.id)
  }
}