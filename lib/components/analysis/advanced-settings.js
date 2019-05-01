// @flow
import lonlat from '@conveyal/lonlat'
import {
  faCaretDown,
  faCaretRight,
  faCog,
  faPencilAlt,
  faStop
} from '@fortawesome/free-solid-svg-icons'
import get from 'lodash/get'
import React, {Component} from 'react'

import message from 'lib/message'

import Icon from '../icon'
import Select from '../select'
import {Button} from '../buttons'
import {Group, Number as InputNumber} from '../input'
import type {Bounds, ProfileRequest, RegionalAnalysis} from '../../types'

import EgressModeSelector from './egress-mode-selector'

type Props = {
  disabled: boolean,
  hideBoundsEditor: () => void,
  profileRequest: ProfileRequest,
  regionBounds: Bounds,
  regionalAnalyses: RegionalAnalysis[],
  setProfileRequest: (profileRequestFields: any) => void,
  showBoundsEditor: () => void
}

type State = {
  advancedSectionCollapsed: boolean,
  customProfileRequestHasError: false | string,
  editingBounds: boolean
}

/** Edit the advanced parameters of an analysis */
export default class AdvancedSettings extends Component {
  props: Props
  state: State

  state = {
    advancedSectionCollapsed: true,
    editingBounds: false,
    customProfileRequestHasError: false
  }

  _refToTextarea: ?HTMLTextAreaElement
  _saveCustomProfileRequest = () => {
    try {
      const json = JSON.parse(get(this._refToTextarea, 'value'))
      this.props.setProfileRequest(json)
      this.setState({customProfileRequestHasError: false})
    } catch (e) {
      this.setState({customProfileRequestHasError: e})
    }
  }

  _saveRefToTextarea = (ref: HTMLTextAreaElement) => {
    this._refToTextarea = ref
  }

  _hideBoundsSelector = () => {
    this.props.hideBoundsEditor()
    this.setState({editingBounds: false})
  }

  set(newFields: any) {
    this.props.setProfileRequest(newFields)
  }

  // Max rides is max transfers + 1, but transfers is common usage terminology
  setMaxTransfers = (e: Event & {target: HTMLInputElement}) =>
    this.set({maxRides: parseInt(e.target.value) + 1})
  setMonteCarloDraws = (e: Event & {target: HTMLInputElement}) =>
    this.set({monteCarloDraws: parseInt(e.target.value)})
  setWalkSpeed = (e: Event & {target: HTMLInputElement}) =>
    this.set({walkSpeed: parseFloat(e.target.value) / 3.6}) // km/h to m/s
  setBikeSpeed = (e: Event & {target: HTMLInputElement}) =>
    this.set({bikeSpeed: parseFloat(e.target.value) / 3.6}) // km/h to m/s
  setMaxWalkTime = (e: Event & {target: HTMLInputElement}) =>
    this.set({maxWalkTime: parseInt(e.target.value)})
  setMaxBikeTime = (e: Event & {target: HTMLInputElement}) =>
    this.set({maxBikeTime: parseInt(e.target.value)})

  _setRegionalAnalysisBounds = (e: {value: string}) => {
    const p = this.props

    if (e.value === '__REGION') {
      p.setProfileRequest({bounds: p.regionBounds})
    } else if (p.regionalAnalyses) {
      const foundAnalyses = p.regionalAnalyses.find(r => r._id === e.value)
      if (foundAnalyses) {
        p.setProfileRequest({
          bounds: webMercatorBoundsToGeographic(foundAnalyses)
        })
      }
    }
  }

  _showBoundsSelector = () => {
    this.props.showBoundsEditor()
    this.setState({editingBounds: true})
  }

  _toggleAdvancedCollapsed = () => {
    this.setState({
      advancedSectionCollapsed: !this.state.advancedSectionCollapsed
    })
  }

  /**
   * Options available are:
   * 1. Bounds of the region
   * 2. Previously run analysis bounds that are different than the regions.
   * 3. Creating a "Custom Boundary"
   */
  renderRegionalAnalysisBoundsSelector(disableInputs: boolean) {
    const {profileRequest, regionBounds, regionalAnalyses} = this.props
    const {bounds} = profileRequest

    // figure out which is selected
    let selected
    if (!bounds || boundsEqual(bounds, regionBounds)) {
      selected = '__REGION' // special value
    } else {
      const selectedAnalysis = regionalAnalyses.find(r =>
        boundsEqual(webMercatorBoundsToGeographic(r), bounds)
      )

      if (selectedAnalysis != null) selected = selectedAnalysis._id
      else selected = '__CUSTOM'
    }

    const options = [
      {value: '__REGION', label: message('analysis.regionalBoundsRegion')},
      ...regionalAnalyses
        .filter(
          r => !boundsEqual(webMercatorBoundsToGeographic(r), regionBounds)
        )
        .map(({name, _id}) => ({
          value: _id,
          label: message('analysis.regionalBoundsSame', {name})
        }))
    ]

    if (selected === '__CUSTOM') {
      // Don't allow the user to select 'Custom' - to make custom bounds, just drag the map markers
      options.push({
        value: '__CUSTOM',
        label: message('analysis.regionalBoundsCustom'),
        disabled: true
      })
    }

    const {editingBounds} = this.state

    return (
      <Group label={message('analysis.regionalBounds')}>
        <div className='row'>
          <div className='col-xs-6'>
            <Select
              clearable={false}
              disabled={disableInputs}
              value={selected}
              options={options}
              onChange={this._setRegionalAnalysisBounds}
            />
          </div>
          <div className='col-xs-6'>
            {editingBounds ? (
              <Button block onClick={this._hideBoundsSelector} style='warning'>
                <Icon icon={faStop} /> Stop editing bounds
              </Button>
            ) : (
              <Button
                disabled={disableInputs}
                block
                onClick={this._showBoundsSelector}
                style='warning'
              >
                <Icon icon={faPencilAlt} /> Set custom geographic bounds
              </Button>
            )}
          </div>
        </div>
      </Group>
    )
  }

  render() {
    const p = this.props
    const s = this.state
    const {
      bikeSpeed,
      maxRides,
      maxBikeTime,
      maxWalkTime,
      monteCarloDraws,
      walkSpeed
    } = p.profileRequest
    return (
      <section className='panel panel-default inner-panel advanced-panel'>
        <a
          className='panel-heading clearfix'
          onClick={this._toggleAdvancedCollapsed}
          style={{cursor: 'pointer'}}
          tabIndex={0}
        >
          <Icon icon={faCog} />
          <strong>Advanced Settings</strong>
          <span className='pull-right'>
            <Icon
              icon={s.advancedSectionCollapsed ? faCaretRight : faCaretDown}
            />
          </span>
        </a>
        {!s.advancedSectionCollapsed && (
          <div className='panel-body'>
            <div className='row'>
              <div className='col-xs-4'>
                <EgressModeSelector
                  disabled={p.disabled}
                  egressModes={
                    p.profileRequest.transitModes !== ''
                      ? p.profileRequest.egressModes
                      : p.profileRequest.directModes
                  }
                  update={p.setProfileRequest}
                />
              </div>
              <div className='col-xs-4'>
                <InputNumber
                  disabled={p.disabled}
                  label='Walk Speed (km/h)'
                  value={Math.round(walkSpeed * 36) / 10}
                  min={3}
                  max={15}
                  step={0.1}
                  name='walkSpeed'
                  onChange={this.setWalkSpeed}
                />
              </div>
              <div className='col-xs-4'>
                <InputNumber
                  disabled={p.disabled}
                  label='Bike Speed (km/h)'
                  value={Math.round(bikeSpeed * 36) / 10}
                  min={5}
                  max={20}
                  step={0.1}
                  name='bikeSpeed'
                  onChange={this.setBikeSpeed}
                />
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-4' />
              <div className='col-xs-4'>
                <InputNumber
                  disabled={p.disabled}
                  label='Max Walk Time (min)'
                  value={maxWalkTime}
                  min={1}
                  step={1}
                  name='maxWalkTime'
                  onChange={this.setMaxWalkTime}
                />
              </div>
              <div className='col-xs-4'>
                <InputNumber
                  disabled={p.disabled}
                  label='Max Bike Time (min)'
                  value={maxBikeTime}
                  min={1}
                  step={1}
                  name='maxBikeTime'
                  onChange={this.setMaxBikeTime}
                />
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-6'>
                <InputNumber
                  disabled={p.disabled}
                  label={message('analysis.transfers')}
                  value={maxRides - 1} // convert max rides to max transfers
                  min={0}
                  max={7}
                  step={1}
                  name='maxTransfers'
                  onChange={this.setMaxTransfers}
                />
              </div>
              <div className='col-xs-6'>
                <InputNumber
                  disabled={p.disabled}
                  label={message('analysis.monteCarloDraws')}
                  name='monteCarloDraws'
                  value={monteCarloDraws}
                  min={1}
                  max={10000}
                  step={1}
                  onChange={this.setMonteCarloDraws}
                />
              </div>
            </div>
            {this.renderRegionalAnalysisBoundsSelector(p.disabled)}
            <div className='row'>
              <div className='col-xs-12'>
                <Group
                  label={message('analysis.customizeProfileRequest.label')}
                >
                  <p>
                    {message('analysis.customizeProfileRequest.description')}
                  </p>
                  {s.customProfileRequestHasError && (
                    <div className='alert alert-danger'>
                      {message('analysis.customizeProfileRequest.error')}
                    </div>
                  )}
                  <textarea
                    className='form-control monospace'
                    defaultValue={JSON.stringify(p.profileRequest, null, '\t')}
                    disabled={p.disabled}
                    key={JSON.stringify(p.profileRequest)}
                    ref={this._saveRefToTextarea}
                    rows={10}
                  />
                  <br />
                  <Button
                    block
                    onClick={this._saveCustomProfileRequest}
                    style='warning'
                  >
                    <Icon icon={faPencilAlt} />{' '}
                    {message('analysis.customizeProfileRequest.update')}
                  </Button>
                </Group>
              </div>
            </div>
          </div>
        )}
      </section>
    )
  }
}

function boundsEqual(b0: Bounds, b1: Bounds, epsilon: number = 1e-6) {
  return (
    Math.abs(b0.north - b1.north) < epsilon &&
    Math.abs(b0.west - b1.west) < epsilon &&
    Math.abs(b0.east - b1.east) < epsilon &&
    Math.abs(b0.south - b1.south) < epsilon
  )
}

/** Convert web mercator bounds from a regional analysis to geographic bounds */
function webMercatorBoundsToGeographic({
  north,
  west,
  width,
  height,
  zoom
}: {
  height: number,
  north: number,
  west: number,
  width: number,
  zoom: number
}): Bounds {
  const nw = lonlat.fromPixel(
    {
      x: west + 1,
      y: north
    },
    zoom
  )
  const se = lonlat.fromPixel(
    {
      x: west + width + 1,
      y: north + height
    },
    zoom
  )
  return {
    east: se.lon,
    north: nw.lat,
    south: se.lat,
    west: nw.lon
  }
}
