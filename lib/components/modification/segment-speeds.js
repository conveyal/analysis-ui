import isEqual from 'lodash/isEqual'
import memoize from 'lodash/memoize'
import sum from 'lodash/sum'
import React, {PureComponent} from 'react'

import {DEFAULT_SEGMENT_SPEED} from 'lib/constants/timetables'
import message from 'lib/message'
import get from 'lib/utils/get'
import {toPrecision} from 'lib/utils/math'
import {secondsToHhMmSsString} from 'lib/utils/time'

import Collapsible from '../collapsible'
import {Group, Input, NumberInput} from '../input'
import MinutesSeconds from '../minutes-seconds'

export default class SegmentSpeeds extends PureComponent {
  state = {}

  static getDerivedStateFromProps(props) {
    return {
      segmentSpeedsAreEqual: props.segmentSpeeds.every(
        speed => speed === props.segmentSpeeds[0]
      )
    }
  }

  componentDidMount() {
    const {segmentDistances, segmentSpeeds} = this.props
    if (segmentDistances.length !== segmentSpeeds.length) {
      this._setSegmentSpeedsLengthTo(this.props)
    }
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.segmentDistances, this.props.segmentDistances)) {
      this._setSegmentSpeedsLengthTo(this.props)
    }
  }

  _getAverageSpeed() {
    const p = this.props
    const totalDistance = sum(p.segmentDistances)
    const weightedSpeeds = p.segmentSpeeds.map(
      (s, i) => s * p.segmentDistances[i]
    )
    return (
      weightedSpeeds.reduce((total, speed) => total + speed, 0) / totalDistance
    )
  }

  _getMovingSeconds() {
    const p = this.props
    let totalSeconds = 0
    for (let i = 0; i < p.segmentDistances.length; i++) {
      const segmentDistance = p.segmentDistances[i]
      totalSeconds +=
        (segmentDistance / (p.segmentSpeeds[i] || DEFAULT_SEGMENT_SPEED)) *
        60 *
        60
    }
    return Math.floor(totalSeconds)
  }

  _getDwellSeconds() {
    const p = this.props
    let totalSeconds = 0
    for (let i = 0; i < p.numberOfStops; i++) {
      const customDwellSeconds = p.dwellTimes[i]
      totalSeconds += Number.isFinite(customDwellSeconds)
        ? customDwellSeconds
        : p.dwellTime
    }
    return totalSeconds
  }

  _highlightSegment = memoize(index => () => this.props.highlightSegment(index))

  _highlightStop = memoize(index => () => this.props.highlightStop(index))

  /**
   * Pass in props directly here since this function is called on new props.
   */
  _setSegmentSpeedsLengthTo({segmentSpeeds, segmentDistances, update}) {
    const newLength = segmentDistances.length
    const newSegmentSpeeds = segmentSpeeds.slice(0, newLength)

    // Add new segment speeds using the previous segment speed or the default
    // speed if the previous segment speed is not valid. Usually this will only
    // be when creating the initial segment.
    for (let i = newSegmentSpeeds.length; i < newLength; i++) {
      newSegmentSpeeds.push(segmentSpeeds[i - 1] || DEFAULT_SEGMENT_SPEED)
    }

    update({segmentSpeeds: newSegmentSpeeds})
  }

  _confirmedSetAllSpeedsOnce() {
    if (!this.__confirmedSetAllSpeedsOnce) {
      this.__confirmedSetAllSpeedsOnce = window.confirm(
        `${message('modification.addedSegments.confirmSpeedChange')}`
      )
    }

    return !!this.__confirmedSetAllSpeedsOnce
  }

  _setAllSegmentSpeedsTo = e => {
    const newSpeed = Number(e.target.value)
    if (
      e.target.value &&
      !isNaN(newSpeed) &&
      (this.state.segmentSpeedsAreEqual || this._confirmedSetAllSpeedsOnce())
    ) {
      const {segmentSpeeds, update} = this.props
      update({segmentSpeeds: segmentSpeeds.map(() => newSpeed)})
    }
  }

  _setDwell = dwellTime => {
    this.props.update({dwellTime})
  }

  _setDwellTimeForStop = memoize(index => seconds => {
    const p = this.props
    p.update({
      dwellTimes: p.qualifiedStops.map((_, i) =>
        i === index ? seconds : get(p.dwellTimes, i)
      )
    })
  })

  _setSpeedForSegment = memoize(index => e => {
    const {segmentSpeeds, update} = this.props
    const speed = Number(e.target.value)
    if (!isNaN(speed) && speed !== 0) {
      const newSpeeds = segmentSpeeds.slice()
      newSpeeds[index] = speed
      update({segmentSpeeds: newSpeeds})
    }
  })

  _confirmedSetSpeedFromTravelTimeOnce() {
    if (!this.__confirmedSetSpeedFromTravelTimeOnce) {
      this.__confirmedSetSpeedFromTravelTimeOnce = window.confirm(
        `${message('modification.addedSegments.confirmTimeChange')}`
      )
    }

    return !!this.__confirmedSetSpeedFromTravelTimeOnce
  }

  _setSpeedFromTravelTime = travelTimeSeconds => {
    if (
      travelTimeSeconds !== 0 &&
      (this.state.segmentSpeedsAreEqual ||
        this._confirmedSetSpeedFromTravelTimeOnce())
    ) {
      const {numberOfStops, segmentDistances, update} = this.props
      // figure out appropriate speed given this travel time
      if (numberOfStops !== 0) {
        const totalKilometers = sum(segmentDistances)
        // figure out speed
        const speedKps =
          travelTimeSeconds >= 1
            ? totalKilometers / travelTimeSeconds
            : totalKilometers
        const speedKph = speedKps * 3600
        update({segmentSpeeds: segmentDistances.map(() => speedKph)})
      }
    }
  }

  _setTimeForSegment = memoize(index => seconds => {
    const {segmentDistances, segmentSpeeds, update} = this.props
    if (seconds !== 0) {
      const newSpeeds = segmentSpeeds.slice()
      newSpeeds[index] = segmentDistances[index] / (seconds / 60 / 60)
      update({segmentSpeeds: newSpeeds})
    }
  })

  render() {
    const p = this.props

    const averageSpeed = this._getAverageSpeed() || DEFAULT_SEGMENT_SPEED
    const dwellSeconds = this._getDwellSeconds()
    const movingSeconds = this._getMovingSeconds()
    const totalSeconds = dwellSeconds + movingSeconds

    return (
      <>
        <h4>
          Total travel time{' '}
          <strong>{secondsToHhMmSsString(totalSeconds)}</strong>
        </h4>
        <p>
          <em>Dwell time at each stop + moving time along each segment</em>
        </p>
        <MinutesSeconds
          label={message('modification.dwellTimeDefault')}
          onChange={this._setDwell}
          seconds={p.dwellTime}
        />
        <p>{message('modification.dwellTimeDescription')}</p>
        {p.qualifiedStops && (
          <Collapsible
            title={message('modification.addedSegments.individualDwell')}
          >
            {p.qualifiedStops.map((stop, index) => (
              <MinutesSeconds
                key={`segment-speeds-stop-dwell-time-${index}`}
                label={`Stop ${index}`}
                placeholder={`${secondsToHhMmSsString(p.dwellTime)} (default)`}
                onBlur={this._highlightStop(-1)}
                onChange={this._setDwellTimeForStop(index)}
                onFocus={this._highlightStop(index)}
                seconds={get(p.dwellTimes, index)}
              />
            ))}
          </Collapsible>
        )}
        <NumberInput
          label={message('modification.addedSegments.speed')}
          min={1}
          onChange={this._setAllSegmentSpeedsTo}
          units='km/h'
          value={toPrecision(averageSpeed)}
        />
        <MinutesSeconds
          label='Total moving time'
          onChange={this._setSpeedFromTravelTime}
          seconds={movingSeconds}
        />
        <Collapsible
          title={message('modification.addedSegments.individualSpeed')}
        >
          {p.segmentSpeeds.map((speed, index) => (
            <Group
              key={`segment-speed-time-group-${index}`}
              label={`Segment ${index + 1}`}
            >
              <Input
                placeholder={message('modification.speed')}
                min={1}
                onBlur={this._highlightSegment(-1)}
                onChange={this._setSpeedForSegment(index)}
                onFocus={this._highlightSegment(index)}
                value={speed}
                units='km/h'
              />
              <MinutesSeconds
                placeholder={message('modification.time')}
                onBlur={this._highlightSegment(-1)}
                onChange={this._setTimeForSegment(index)}
                onFocus={this._highlightSegment(index)}
                seconds={(p.segmentDistances[index] / speed) * 60 * 60}
              />
            </Group>
          ))}
        </Collapsible>
      </>
    )
  }
}
