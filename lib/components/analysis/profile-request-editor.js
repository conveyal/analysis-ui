/** Edit the parameters of a profile request */

import React, { Component, PropTypes } from 'react'
import TimePicker from '../time-picker'
import DatePicker from '../date-picker'
import messages from '../../utils/messages'

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

  render () {
    const { profileRequest } = this.props
    const { date, fromTime, toTime, maxRides, monteCarloDraws, bikeSpeed, walkSpeed } = profileRequest
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
    </div>
  }
}
