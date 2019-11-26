import distance from '@turf/distance'
import {lineString, point} from '@turf/helpers'
import dbg from 'debug'
import Router from 'next/router'
import React from 'react'
import {connect} from 'react-redux'
import shp from 'shpjs'

import {createMultiple as createModifications} from 'lib/actions/modifications'
import {ADD_TRIP_PATTERN} from 'lib/constants'
import message from 'lib/message'
import {routeTo} from 'lib/router'
import {create as createModification} from 'lib/utils/modification'
import {create as createTimetable} from 'lib/utils/timetable'

import {File, NumberInput, Select, Checkbox} from './input'
import {Button} from './buttons'
import H5 from './h5'

const debug = dbg('analysis-ui:import-shapefile')

/**
 * Import a shapefile. This more or less does what geom2gtfs used to.
 */
class ImportShapefile extends React.Component {
  state = {
    shapefile: null,
    stopSpacingMeters: 400, // meters
    bidirectional: true,
    autoCreateStops: true,
    nameProp: '',
    freqProp: '',
    speedProp: '',
    error: undefined,
    properties: undefined,
    uploading: false
  }

  shapefileRead = e => {
    debug(`read ${e.target.result.byteLength} bytes`)
    const shapefile = shp.parseZip(e.target.result)
    const properties = []

    for (const key in shapefile.features[0].properties) {
      if (shapefile.features[0].properties.hasOwnProperty(key)) {
        properties.push(key)
      }
    }

    this.setState({
      shapefile,
      properties,
      nameProp: properties[0],
      freqProp: properties[0],
      speedProp: properties[0],
      error: undefined
    })
  }

  changeStopSpacingMeters = e => {
    debug(e.target.value)
    this.setState({stopSpacingMeters: Number(e.target.value)})
  }

  selectShapefile = e => {
    // read the shapefile
    const reader = new window.FileReader()
    reader.onloadend = this.shapefileRead
    reader.readAsArrayBuffer(e.target.files[0])
  }

  changeNameProp = e => {
    this.setState({nameProp: e.target.value})
  }

  changeFreqProp = e => {
    this.setState({freqProp: e.target.value})
  }

  changeSpeedProp = e => {
    this.setState({speedProp: e.target.value})
  }

  changeBidirectional = e => {
    this.setState({bidirectional: e.target.checked})
  }

  changeAutoCreateStops = e => {
    this.setState({autoCreateStops: e.target.checked})
  }

  /** create and save modifications for each line */
  create = async () => {
    const p = this.props
    this.setState({uploading: true})
    try {
      const {shapefile} = this.state
      const variants = p.variants.map(() => true)
      if (shapefile) {
        const mods = shapefile.features.map(feat => {
          const segments = []

          // We make each segment in the input geometry a segment in the output.
          // Otherwise adding a stop in the middle would replace all of the
          // surrounding geometry.
          let {coordinates, type} = feat.geometry

          if (type === 'MultiLineString') {
            // flatten the coordinates
            const flat = []

            for (let i = 0; i < coordinates.length; i++) {
              if (i > 0) {
                // make sure they line up at the ends
                if (
                  distance(
                    point(coordinates[i - 1].slice(-1)[0]),
                    point(coordinates[i][0])
                  ) > 0.05
                ) {
                  this.setState({
                    error: message('shapefile.invalidMultiLineString'),
                    uploading: false
                  })
                  throw new Error('Invalid feature')
                }

                coordinates[i].forEach(c => flat.push(c))
              }
            }

            coordinates = flat
          } else if (type !== 'LineString') {
            this.setState({
              error: message('shapefile.invalidShapefileType'),
              uploading: false
            })
            throw new Error('Invalid type')
          }

          for (let i = 1; i < coordinates.length; i++) {
            segments.push({
              geometry: lineString([coordinates[i - 1], coordinates[i]])
                .geometry,
              spacing: this.state.autoCreateStops
                ? this.state.stopSpacingMeters
                : 0,
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

          const mod = createModification({
            name: feat.properties[this.state.nameProp],
            projectId: p.projectId,
            type: ADD_TRIP_PATTERN,
            variants
          })

          const timetable = createTimetable(
            segments.map(() => feat.properties[this.state.speedProp])
          )
          timetable.headwaySecs = feat.properties[this.state.freqProp] * 60

          mod.bidirectional = this.state.bidirectional
          mod.segments = segments
          mod.timetables = [timetable]

          return mod
        })

        // Create the modifications
        await p.createModifications(mods)

        // If it finishes without error, redirect to the modifications list
        const {as, href} = routeTo('modifications', {
          projectId: p.projectId,
          regionId: p.regionId
        })
        Router.push(href, as)
      }
    } catch (e) {
      debug(e)
    }
  }

  render() {
    return (
      <>
        <H5>{message('modification.importFromShapefile')}</H5>
        <File
          label={message('shapefile.selectZipped')}
          onChange={this.selectShapefile}
        />

        {this.renderError()}
        {this.renderShapefile()}

        <Button
          block
          disabled={!this.state.shapefile || this.state.uploading}
          onClick={this.create}
          style='success'
        >
          {message('project.importAction')}
        </Button>
      </>
    )
  }

  renderError() {
    if (this.state.error) {
      return <div className='alert alert-danger'>{this.state.error}</div>
    }
  }

  renderShapefile() {
    const {properties, shapefile} = this.state
    if (properties && shapefile) {
      return (
        <div>
          <Select
            label='Name property'
            onChange={this.changeNameProp}
            value={this.state.nameProp}
          >
            {properties.map(p => (
              <option key={`name-property-${p}`} value={p}>
                {p}
              </option>
            ))}
          </Select>

          <Select
            label='Frequency property'
            onChange={this.changeFreqProp}
            value={this.state.freqProp}
          >
            {properties.map(p => (
              <option key={`frequency-property-${p}`} value={p}>
                {p}
              </option>
            ))}
          </Select>

          <Select
            label='Speed property'
            onChange={this.changeSpeedProp}
            value={this.state.speedProp}
          >
            {properties.map(p => (
              <option key={`speed-property-${p}`} value={p}>
                {p}
              </option>
            ))}
          </Select>

          <div className='checkbox'>
            <label htmlFor='Bidirectional'>
              <input
                type='checkbox'
                checked={this.state.bidirectional}
                onChange={this.changeBidirectional}
              />{' '}
              Bidirectional
            </label>
          </div>

          <Checkbox
            label={message('transitEditor.autoCreateStops')}
            name='autoCreateStops'
            checked={this.state.autoCreateStops}
            onChange={this.changeAutoCreateStops}
          />

          {this.state.autoCreateStops && (
            <NumberInput
              label='Stop spacing (meters)'
              onChange={this.changeStopSpacingMeters}
              value={this.state.stopSpacingMeters}
            />
          )}
        </div>
      )
    }
  }
}

export default connect(
  null,
  {createModifications}
)(ImportShapefile)
