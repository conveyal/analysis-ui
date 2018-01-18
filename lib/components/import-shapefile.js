// @flow
import React, {PureComponent} from 'react'
import shp from 'shpjs'
import distance from '@turf/distance'
import {lineString, point} from '@turf/helpers'
import dbg from 'debug'

import {Button} from './buttons'
import {File, Number as InputNumber, Select, Checkbox} from './input'
import {Body, Heading, Panel} from './panel'
import messages from '../utils/messages'

import type {Modification} from '../types'

const debug = dbg('analysis-ui:import-shapefile')

type Props = {
  close: () => void,
  setModification: (Modification) => void,
  variants: boolean[],
  projectId: string
}

type State = {
  shapefile: any,
  stopSpacingMeters: number, // meters
  bidirectional: boolean,
  autoCreateStops: boolean,
  nameProp: string,
  freqProp: string,
  speedProp: string,
  error?: Error,
  properties?: string[]
}

/**
 * Import a shapefile. This more or less does what geom2gtfs used to.
 */
export default class ImportShapefile
  extends PureComponent<void, Props, State> {
  state = {
    shapefile: null,
    stopSpacingMeters: 400, // meters
    bidirectional: true,
    autoCreateStops: true,
    nameProp: '',
    freqProp: '',
    speedProp: '',
    error: undefined,
    properties: undefined
  }

  shapefileRead = (e: ProgressEvent & {target: EventTarget}) => {
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

  changeStopSpacingMeters = (e: Event & {target: EventTarget}) => {
    debug(e.target.value)
    this.setState({stopSpacingMeters: Number(e.target.value)})
  }

  selectShapefile = (e: Event & {target: EventTarget}) => {
    // read the shapefile
    const reader = new window.FileReader()
    reader.onloadend = this.shapefileRead
    reader.readAsArrayBuffer(e.target.files[0])
  }

  changeNameProp = (e: Event & {target: EventTarget}) => {
    this.setState({nameProp: e.target.value})
  }

  changeFreqProp = (e: Event & {target: HTMLInputElement}) => {
    this.setState({freqProp: e.target.value})
  }

  changeSpeedProp = (e: Event & {target: HTMLInputElement}) => {
    this.setState({speedProp: e.target.value})
  }

  changeBidirectional = (e: Event & {target: HTMLInputElement}) => {
    this.setState({bidirectional: e.target.checked})
  }

  changeAutoCreateStops = (e: Event & {target: HTMLInputElement}) => {
    this.setState({autoCreateStops: e.target.checked})
  }

  /** create and save modifications for each line */
  create = () => {
    debug('test')
    try {
      const {shapefile} = this.state
      if (shapefile) {
        const mods = shapefile.features.map(feat => {
          const segments = []

          // we make each segment in the input geometry a segment in the output.
          // otherwise adding a stop in the middle would replace all of the surrounding geometry.
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
                    point(coordinates[i][0]),
                    'kilometers'
                  ) > 0.05
                ) {
                  this.setState({
                    error: messages.shapefile.invalidMultiLineString
                  })
                  throw new Error('Invalid feature')
                }

                coordinates[i].forEach(c => flat.push(c))
              }
            }

            coordinates = flat
          } else if (type !== 'LineString') {
            this.setState({error: messages.shapefile.invalidShapefileType})
            throw new Error('Invalid type')
          }

          for (let i = 1; i < coordinates.length; i++) {
            segments.push({
              geometry: lineString([coordinates[i - 1], coordinates[i]]).geometry,
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

          const mod = {
            projectId: this.props.projectId,
            name: feat.properties[this.state.nameProp],
            segments,
            bidirectional: this.state.bidirectional,
            type: 'add-trip-pattern',
            showOnMap: false,
            variants: this.props.variants.map(v => true),
            timetables: [
              {
                monday: true,
                tuesday: true,
                wednesday: true,
                thursday: true,
                friday: true,
                saturday: true,
                sunday: true,
                segmentSpeeds: segments.map(
                  s => feat.properties[this.state.speedProp]
                ),
                headwaySecs: feat.properties[this.state.freqProp] * 60,
                dwellTime: 0,
                startTime: 5 * 3600,
                endTime: 22 * 3600
              }
            ]
          }

          return mod
        })

        mods.forEach(m => this.props.setModification(m))
        this.props.close()
      }
    } catch (e) {
      debug(e)
    }
  }

  render () {
    return (
      <Panel>
        <Heading>Import Shapefile</Heading>
        <Body>
          <File
            label='Select Shapefile (zipped):'
            onChange={this.selectShapefile}
          />

          {this.renderError()}
          {this.renderShapefile()}

          <Button
            block
            disabled={!this.state.shapefile}
            onClick={this.create}
            style='success'
          >
            Import
          </Button>
          <Button block onClick={this.props.close} style='danger'>
            Cancel
          </Button>
        </Body>
      </Panel>
    )
  }

  renderError () {
    if (this.state.error) {
      return (
        <div className='alert alert-danger'>
          {this.state.error}
        </div>
      )
    }
  }

  renderShapefile () {
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
              />
              {' '}
              Bidirectional
            </label>
          </div>

          <Checkbox
            label={messages.transitEditor.autoCreateStops}
            name='autoCreateStops'
            checked={this.state.autoCreateStops}
            onChange={this.changeAutoCreateStops}
          />

          {this.state.autoCreateStops &&
            <InputNumber
              label='Stop spacing (meters)'
              onChange={this.changeStopSpacingMeters}
              value={this.state.stopSpacingMeters}
            />}
        </div>
      )
    }
  }
}
