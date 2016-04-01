/** Import a shapefile. This more or less does what geom2gtfs used to. */

// use the reflow functionality in transit editor layer
import TransitEditorLayer from 'leaflet-transit-editor'
import React, { Component, PropTypes } from 'react'
import shp from 'shpjs'
import uuid from 'uuid'

import {Button} from './components/buttons'
import {File, Number as InputNumber, Select} from './components/input'
import { updateTimes } from './timetable'

export default class ImportShapefile extends Component {
  static propTypes = {
    replaceModification: PropTypes.func.isRequired,
    variants: PropTypes.array.isRequired,
    close: PropTypes.func.isRequired
  }

  state = {
    shapefile: null,
    stopSpacingMeters: 400, // meters
    bidirectional: true
  }

  shapefileRead = (e) => {
    console.log(`read ${e.target.result.byteLength} bytes`)
    let shapefile = shp.parseZip(e.target.result)
    let properties = []

    for (let key in shapefile.features[0].properties) {
      if (shapefile.features[0].properties.hasOwnProperty(key)) properties.push(key)
    }

    this.setState(Object.assign({}, this.state, { shapefile, properties, nameProp: properties[0], freqProp: properties[0], speedProp: properties[0] }))
  }

  changeStopSpacingMeters = (e) => {
    console.log(e.target.value)
    this.setState(Object.assign({}, this.state, { stopSpacingMeters: Number(e.target.value) }))
  }

  selectShapefile = (e) => {
    // read the shapefile
    const reader = new window.FileReader()
    reader.onloadend = this.shapefileRead
    reader.readAsArrayBuffer(e.target.files[0])
  }

  changeNameProp = (e) => {
    this.setState(Object.assign({}, this.state, { nameProp: e.target.value }))
  }

  changeFreqProp = (e) => {
    this.setState(Object.assign({}, this.state, { freqProp: e.target.value }))
  }

  changeSpeedProp = (e) => {
    this.setState(Object.assign({}, this.state, { speedProp: e.target.value }))
  }

  changeBidirectional = (e) => {
    this.setState(Object.assign({}, this.state, { bidirectional: e.target.checked }))
  }

  /** create and save modifications for each line */
  create = () => {
    const mods = this.state.shapefile.features.map((feat) => {
      const mod = {
        id: uuid.v4(),
        name: feat.properties[this.state.nameProp],
        geometry: feat.geometry,
        // no stops in the middle, we'll reflow shortly
        stops: feat.geometry.coordinates.map((s) => false),
        controlPoints: feat.geometry.coordinates.map((c) => true),
        stopIds: feat.geometry.coordinates.map((c) => null),
        bidirectional: this.state.bidirectional,
        type: 'add-trip-pattern',
        showOnMap: true,
        expanded: false,
        variants: this.props.variants.map((v) => true)
      }

      if (mod.stops.length > 0) {
        mod.stops[0] = true
        mod.stops[mod.stops.length - 1] = true
      }

      const timetable = {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
        speed: feat.properties[this.state.speedProp],
        headwaySecs: feat.properties[this.state.freqProp] * 60,
        dwellTime: 0,
        startTime: 5 * 3600,
        endTime: 22 * 3600
      }

      const layer = new TransitEditorLayer(mod)
      layer.stopSpacingMeters = this.state.stopSpacingMeters
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
    return (
      <form>
        <legend>Import Shapefile</legend>
        <File
          label='Shapefile (zipped):'
          onChange={this.selectShapefile}
          />

        {this.renderShapefile()}
      </form>
    )
  }

  renderShapefile () {
    if (this.state.shapefile) {
      return (
        <div>
          <Select
            label='Name property'
            onChange={this.changeNameProp}
            value={this.state.nameProp}
            >
            {this.state.properties.map((p) => <option value={p}>{p}</option>)}
          </Select>

          <Select
            label='Frequency property'
            onChange={this.changeFreqProp}
            value={this.state.freqProp}
            >
            {this.state.properties.map((p) => <option value={p}>{p}</option>)}
          </Select>

          <Select
            label='Speed property'
            onChange={this.changeSpeedProp}
            value={this.state.speedProp}
            >
            {this.state.properties.map((p) => <option value={p}>{p}</option>)}
          </Select>

          <div className='checkbox'>
            <label>
              <input type='checkbox' checked={this.state.bidirectional} onChange={this.changeBidirectional} /> Bidirectional
            </label>
          </div>

          <InputNumber
            label='Stop spacing (meters)'
            onChange={this.changeStopSpacingMeters}
            value={this.state.stopSpacingMeters}
            />

          <Button style='success' onClick={this.create}>Import</Button>
          <Button style='danger' onClick={this.props.close}>Cancel</Button>
        </div>
      )
    }
  }
}
