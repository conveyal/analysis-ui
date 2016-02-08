/**
 * manage the leaflet map
 * we go outside react-leaflet to do this, for performance
 * components using the map should call addLayer and removeLayer to add/remove layers from the map
 */

import React, { Component, PropTypes } from 'react'
import L from 'leaflet'
import { connect } from 'react-redux'

function mapStateToProps (state) {
  return {
    layers: state.layers,
    controls: state.controls
  }
}

class FullscreenMap extends Component {
  static propTypes = {
    layers: PropTypes.instanceOf(Map).isRequired,
    controls: PropTypes.instanceOf(Map).isRequired
  };

  constructor (props) {
    super(props)
    this.rendered = false
  }

  componentWillReceiveProps (newProps) {
    console.log(`Last ID: ${L.Util.lastId}`)
    // naive: remove all layers and redraw
    // we may need to do some diffing, but let's start with the simplest possible thing.
    this.map.eachLayer(l => this.map.removeLayer(l))

    for (let l of newProps.layers.values()) {
      l.addTo(this.map)
    }

    let existingControls = this.controls || []
    let desiredControls = []
    for (let control of newProps.controls.values()) {
      desiredControls.push(control)
    }

    let controlsToRemove = existingControls.filter(c => !desiredControls.includes(c))
    let controlsToAdd = desiredControls.filter(c => !existingControls.includes(c))

    controlsToRemove.forEach(c => this.map.removeControl(c))
    controlsToAdd.forEach(c => this.map.addControl(c))

    this.controls = desiredControls
  }

  /** render method sets up leaflet on first invocation, then returns false to indicate that no more DOM trickery is desired */
  render () {
    // ok to hard-wire id, this is used as a singleton
    // react should re-use same div, meaning map will continue to work
    return <div id='map' style={{width: '100%', height: '100%', padding: '0px'}}></div>
  }

  /** create the leaflet map */
  componentDidMount () {
    // Downtown Kansas City, MO, US
    this.map = L.map('map').setView([39.0970, -94.6053], 12)
    
    // make sure that all the layers already set up are drawn
    this.componentWillReceiveProps(this.props)
  }
}

export default connect(mapStateToProps)(FullscreenMap)
