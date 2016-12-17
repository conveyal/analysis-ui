/** Edit the parameters of a profile request */

import React, { Component, PropTypes } from 'react'
import TimePicker from '../time-picker'
import DatePicker from '../date-picker'
import messages from '../../utils/messages'
import {Number as InputNumber} from '../input'

export default class ProfileRequestEditor extends Component {
  static propTypes = {
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

  set (newFields) {
    const { setProfileRequest, profileRequest } = this.props
    setProfileRequest({...profileRequest, ...newFields})
  }

  setFromTime = (fromTime) => this.set({fromTime})
  setToTime = (toTime) => this.set({toTime})
  setDate = (date) => this.set({date})
  /** Max rides is one more than max transfers, but transfers is more common usage terminology */
  setMaxTransfers = (maxTransfers) => this.set({ maxRides: maxTransfers + 1 })
  setMonteCarloDraws = (monteCarloDraws) => this.set({monteCarloDraws})

  render () {
    const { profileRequest } = this.props
    const { date, fromTime, toTime, maxRides, monteCarloDraws } = profileRequest
    return <div>
      <TimePicker
        label={messages.analysis.fromTime}
        value={fromTime}
        onChange={this.setFromTime} />
      <TimePicker
        label={messages.analysis.toTime}
        value={toTime}
        onChange={this.setToTime} />
      <DatePicker
        label={messages.analysis.date}
        value={date}
        onChange={this.setDate} />
      <InputNumber
        label={messages.analysis.transfers}
        value={maxRides - 1} // convert max rides to max transfers
        min={0}
        max={7}
        step={1}
        onChange={this.setMaxTransfers}
        />
      <InputNumber
        label={messages.analysis.monteCarloDraws}
        value={monteCarloDraws}
        min={1}
        max={10000}
        step={1}
        onChange={this.setMonteCarloDraws}
        />
    </div>
  }
}
