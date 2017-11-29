// @flow
import React, {Component} from 'react'
import PropTypes from 'prop-types'

import TimePicker from '../time-picker'
import DatePicker from '../date-picker'
import messages from '../../utils/messages'
import {Number as InputNumber} from '../input'
import ModeSelector from './mode-selector'
import EgressModeSelector from './egress-mode-selector'

import R5Version from '../../modules/r5-version'

/** Edit the parameters of a profile request */
export default class ProfileRequestEditor extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    profileRequest: PropTypes.shape({
      date: PropTypes.string.isRequired,
      fromTime: PropTypes.number.isRequired,
      toTime: PropTypes.number.isRequired,
      maxRides: PropTypes.number.isRequired,
      monteCarloDraws: PropTypes.number.isRequired,
      bikeSpeed: PropTypes.number.isRequired,
      walkSpeed: PropTypes.number.isRequired
    }),
    setProfileRequest: PropTypes.func.isRequired
  }

  set (newFields: any) {
    const {setProfileRequest, profileRequest} = this.props
    setProfileRequest({...profileRequest, ...newFields})
  }

  setFromTime = (fromTime: number) => this.set({fromTime: parseInt(fromTime)})
  setToTime = (toTime: number) => this.set({toTime: parseInt(toTime)})
  setDate = (date: string) => this.set({date})
  /** Max rides is one more than max transfers, but transfers is more common usage terminology */
  setMaxTransfers = (e: Event & {target: HTMLInputElement}) =>
    this.set({maxRides: parseInt(e.target.value) + 1})
  setMonteCarloDraws = (e: Event & {target: HTMLInputElement}) =>
    this.set({monteCarloDraws: parseInt(e.target.value)})
  setWalkSpeed = (e: Event & {target: HTMLInputElement}) =>
    this.set({walkSpeed: parseFloat(e.target.value) / 3.6}) // km/h to m/s
  setBikeSpeed = (e: Event & {target: HTMLInputElement}) =>
    this.set({bikeSpeed: parseFloat(e.target.value) / 3.6}) // km/h to m/s

  render () {
    const {disabled, profileRequest, setProfileRequest} = this.props
    const {date, walkSpeed, bikeSpeed, fromTime, toTime, maxRides, monteCarloDraws} = profileRequest
    return (
      <div>
        <ModeSelector
          disabled={disabled}
          profileRequest={profileRequest}
          setProfileRequest={setProfileRequest}
        />
        <div className='row'>
          <div className='col-xs-4'>
            <EgressModeSelector
              disabled={disabled}
              profileRequest={profileRequest}
              setProfileRequest={setProfileRequest}
            />
          </div>
          <div className='col-xs-4'>
            <InputNumber
              disabled={disabled}
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
              disabled={disabled}
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
          <div className='form-group col-xs-4'>
            <label htmlFor={messages.analysis.date}>
              {messages.analysis.date}
            </label>
            <DatePicker
              disabled={disabled}
              value={date}
              onChange={this.setDate}
            />
          </div>
          <div className='col-xs-4'>
            <TimePicker
              disabled={disabled}
              label={messages.analysis.fromTime}
              value={fromTime}
              name='fromTime'
              onChange={this.setFromTime}
            />
          </div>
          <div className='col-xs-4'>
            <TimePicker
              disabled={disabled}
              label={messages.analysis.toTime}
              value={toTime}
              name='toTime'
              onChange={this.setToTime}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-6'>
            <InputNumber
              disabled={disabled}
              label={messages.analysis.transfers}
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
              disabled={disabled}
              label={messages.analysis.monteCarloDraws}
              name='monteCarloDraws'
              value={monteCarloDraws}
              min={1}
              max={10000}
              step={1}
              onChange={this.setMonteCarloDraws}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-12'>
            <R5Version.components.Selector />
          </div>
        </div>
      </div>
    )
  }
}
