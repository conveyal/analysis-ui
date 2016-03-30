/** Import a shapefile. This more or less does what geom2gtfs used to. */

import React, { Component, PropTypes } from 'react'
import shp from 'shpjs'
import uuid from 'uuid'

// use the reflow functionality in transit editor layer
import TransitEditorLayer from 'leaflet-transit-editor'

import { updateTimes } from './timetable'

export default class ImportShapefile extends Component {
  static propTypes = {
    replaceModification: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.selectShapefile = this.selectShapefile.bind(this)
    this.shapefileRead = this.shapefileRead.bind(this)
    this.changeFreqProp = this.changeFreqProp.bind(this)
    this.changeNameProp = this.changeNameProp.bind(this)
    this.changeSpeedProp = this.changeSpeedProp.bind(this)
    this.create = this.create.bind(this)
    this.state = { shapefile: null }
  }

  shapefileRead (e) {
    console.log(`read ${e.target.result.byteLength} bytes`)
    let shapefile = shp.parseZip(e.target.result)
    let properties = []

    for (let key in shapefile.features[0].properties) {
      if (shapefile.features[0].properties.hasOwnProperty(key)) properties.push(key)
    }

    this.setState({ shapefile, properties, nameProp: properties[0], freqProp: properties[0], bidirectional: true, speedProp: properties[0] })
  }

  selectShapefile (e) {
    // read the shapefile
    let reader = new window.FileReader()
    reader.onloadend = this.shapefileRead
    reader.readAsArrayBuffer(e.target.files[0])
  }

  changeNameProp (e) {
    this.setState(Object.assign({}, this.state, { nameProp: e.target.value }))
  }

  changeFreqProp (e) {
    this.setState(Object.assign({}, this.state, { freqProp: e.target.value }))
  }

  changeSpeedProp (e) {
    this.setState(Object.assign({}, this.state, { speedProp: e.target.value }))
  }

  changeBidirectional (e) {
    this.setState(Object.assign({}, this.state, { bidirectional: e.target.checked }))
  }

  /** create and save modifications for each line */
  create () {
    let mods = this.state.shapefile.features.map((feat) => {
      let mod = {
        id: uuid.v4(),
        name: feat.properties[this.state.nameProp],
        geometry: feat.geometry,
        // no stops in the middle, we'll reflow shortly
        stops: feat.geometry.coordinates.map((s) => false),
        controlPoints: feat.geometry.coordinates.map((c) => true),
        stopIds: feat.geometry.coordinates.map((c) => null),
        bidirectional: this.state.bidirectional,
        type: 'add-trip-pattern'
      }

      if (mod.stops.length > 0) {
        mod.stops[0] = true
        mod.stops[mod.stops.length - 1] = true
      }

      let timetable = {
        // TODO don't hard-wire
        days: [true, true, true, true, true, true, true],
        speed: feat.properties[this.state.speedProp],
        headwaySecs: feat.properties[this.state.freqProp] * 60,
        dwellTime: 0,
        startTime: 5 * 3600,
        endTime: 22 * 3600
      }

      let layer = new TransitEditorLayer(mod)
      layer.reflowFrom(0)
      Object.assign(mod, layer.getModification())

      updateTimes(timetable, mod)

      mod.timetables = [timetable]

      return mod
    })

    mods.forEach((m) => this.props.replaceModification(m))
    this.props.close()
  }

  render () {
    return <div style={{ position: 'fixed', width: '90%', height: '90%', left: '5%', top: '5%', zIndex: 2500, background: '#fff' }}>
      Shapefile (zipped): <input type='file' onChange={this.selectShapefile} />

      {(() => {
        if (this.state.shapefile) {
          return <div>
            <label>Name property
              <select value={this.state.nameProp} onChange={this.changeNameProp} >
                {this.state.properties.map((p) => <option value={p}>{p}</option>)}
              </select>
            </label><br/>

            <label>Frequency property
              <select value={this.state.freqProp} onChange={this.changeFreqProp} >
                {this.state.properties.map((p) => <option value={p}>{p}</option>)}
              </select>
            </label><br/>

            <label>Speed property
              <select value={this.state.speedProp} onChange={this.changeSpeedProp} >
                {this.state.properties.map((p) => <option value={p}>{p}</option>)}
              </select>
            </label><br/>

            <label>bidirectional
              <input type='checkbox' checked={this.state.bidirectional} onChange={this.changeBidirectional} />
            </label>

            <button onClick={this.create}>Import</button> <button onClick={this.props.close}>Cancel</button>
          </div>
        }
      })()}
    </div>
  }
}
