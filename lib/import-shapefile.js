/** Import a shapefile. This more or less does what geom2gtfs used to. */

// use the reflow functionality in transit editor layer
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import shp from 'shpjs'
import lineString from 'turf-linestring'
import uuid from 'uuid'

import {replaceModification} from './actions'
import {Button} from './components/buttons'
import {File, Number as InputNumber, Select, Checkbox} from './components/input'
import Modal from './components/modal'
import messages from './messages'
import transitDataSource from './transit-data-source'

function mapStateToProps (state) {
  return {
    bundleId: state.scenario.bundleId,
    modifications: state.scenario.modifications,
    variants: state.scenario.variants
  }
}

function mapDispatchToProps (dispatch) {
  return {
    close: () => dispatch(push('/')),
    replaceModification: (modification) => dispatch(replaceModification(modification))
  }
}

class ImportShapefile extends Component {
  static propTypes = {
    bundleId: PropTypes.string,
    close: PropTypes.func.isRequired,
    modifications: PropTypes.object,
    replaceModification: PropTypes.func.isRequired,
    variants: PropTypes.array.isRequired
  }

  state = {
    shapefile: null,
    stopSpacingMeters: 400, // meters
    bidirectional: true,
    autoCreateStops: true
  }

  getDataAndReplaceModification = (modification) => {
    const {bundleId, modifications} = this.props
    transitDataSource.getDataForModifications({ modifications: [...modifications.values(), modification], bundleId })
    this.props.replaceModification(modification)
  }

  shapefileRead = (e) => {
    console.log(`read ${e.target.result.byteLength} bytes`)
    const shapefile = shp.parseZip(e.target.result)
    const properties = []

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

  changeAutoCreateStops = (e) => {
    this.setState(Object.assign({}, this.state, { autoCreateStops: e.target.checked }))
  }

  /** create and save modifications for each line */
  create = () => {
    const mods = this.state.shapefile.features.map((feat) => {
      let segments = []

      // TOD handle multilinestrings
      // we make each segment in the input geometry a segment in the output.
      // otherwise adding a stop in the middle would replace all of the surrounding geometry.
      let { coordinates } = feat.geometry
      for (let i = 1; i < coordinates.length; i++) {
        segments.push({
          geometry: lineString([coordinates[i - 1], coordinates[i]]).geometry,
          spacing: this.state.autoCreateStops ? this.state.stopSpacingMeters : 0,
          stopAtStart: false,
          stopAtEnd: false,
          fromStopId: null,
          toStopId: null
        })
      }

      if (segments.length > 0) {
        segments[0].stopAtStart = true
        segments[segments.length - 1].stopAtEnd = true
      }

      const mod = {
        id: uuid.v4(),
        name: feat.properties[this.state.nameProp],
        segments,
        bidirectional: this.state.bidirectional,
        type: 'add-trip-pattern',
        showOnMap: true,
        expanded: false,
        variants: this.props.variants.map((v) => true),
        timetables: [{
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
        }]
      }

      return mod
    })

    mods.forEach((m) => this.props.replaceModification(m))
    this.props.close()
  }

  render () {
    return (
      <Modal
        onRequestClose={this.props.close}
        >
        <form>
          <legend>Import Shapefile</legend>
          <File
            label='Shapefile (zipped):'
            onChange={this.selectShapefile}
            />

          {this.renderShapefile()}
        </form>
      </Modal>
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

          <Checkbox
            label={messages.transitEditor.autoCreateStops}
            name='autoCreateStops'
            checked={this.state.autoCreateStops}
            onChange={this.changeAutoCreateStops}
            />

          {this.state.autoCreateStops
            ? <InputNumber
              label='Stop spacing (meters)'
              onChange={this.changeStopSpacingMeters}
              value={this.state.stopSpacingMeters}
              />
            : []}

          <Button style='success' onClick={this.create}>Import</Button>
          <Button style='danger' onClick={this.props.close}>Cancel</Button>
        </div>
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportShapefile)
