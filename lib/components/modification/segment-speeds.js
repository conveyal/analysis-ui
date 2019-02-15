// @flow
import isEqual from 'lodash/isEqual'
import memoize from 'lodash/memoize'
import sum from 'lodash/sum'
import React, {PureComponent} from 'react'
import message from '@conveyal/woonerf/message'

import {DEFAULT_SEGMENT_SPEED} from '../../constants/timetables'
import Collapsible from '../collapsible'
import {Group, Input, Number as InputNumber} from '../input'
import MinutesSeconds from '../minutes-seconds'
import get from '../../utils/get'
import {toPrecision} from '../../utils/math'
import {secondsToMmSsString} from '../../utils/time'
import {
  getAverageSpeedOfSegments,
  getTravelTimeMinutes
} from '../../utils/segments'
import type {Stop} from '../../types'

type Props = {
  dwellTime: number,
  dwellTimes: number[],
  highlightSegment: (number) => void,
  highlightStop: (number) => void,
  numberOfStops: number,
  qualifiedStops: Stop[],

  segmentDistances: number[],
  segmentSpeeds: number[],
  update: (any) => void
}

type State = {
  segmentSpeedsAreEqual: boolean
}

export default class SegmentSpeeds extends PureComponent<void, Props, State> {
  __confirmedSetAllSpeedsOnce: boolean
  __confirmedSetSpeedFromTravelTimeOnce: boolean

  state = {
    segmentSpeedsAreEqual: this.areSegmentSpeedsEqual()
  }

  areSegmentSpeedsEqual () {
    const {segmentSpeeds} = this.props
    return segmentSpeeds.every(speed => speed === segmentSpeeds[0])
  }

  componentWillReceiveProps (nextProps: Props) {
    if (!isEqual(nextProps.segmentDistances, this.props.segmentDistances)) {
      this._setSegmentSpeedsLengthTo(nextProps)
    }

    this.setState({segmentSpeedsAreEqual: this.areSegmentSpeedsEqual()})
  }

  componentDidMount () {
    const {segmentDistances, segmentSpeeds} = this.props
    if (segmentDistances.length !== segmentSpeeds.length) {
      this._setSegmentSpeedsLengthTo(this.props)
    }
  }

  _highlightSegment = memoize((index: number) => () =>
    this.props.highlightSegment(index))

  _highlightStop = memoize((index: number) => () =>
    this.props.highlightStop(index))

  /**
   * Pass in props directly here since this function is called on new props.
   */
  _setSegmentSpeedsLengthTo ({segmentSpeeds, segmentDistances, update}: Props) {
    const newLength = segmentDistances.length
    const newSegmentSpeeds = segmentSpeeds.slice(0, newLength)
    while (newSegmentSpeeds.length < newLength) {
      newSegmentSpeeds.push(segmentSpeeds[0] || DEFAULT_SEGMENT_SPEED)
    }
    update({segmentSpeeds: newSegmentSpeeds})
  }

  _confirmedSetAllSpeedsOnce () {
    if (!this.__confirmedSetAllSpeedsOnce) {
      this.__confirmedSetAllSpeedsOnce = window.confirm(
        `${message('modification.addedSegments.confirmSpeedChange')}`
      )
    }

    return !!this.__confirmedSetAllSpeedsOnce
  }

  _setAllSegmentSpeedsTo = (e: Event & {target: HTMLInputElement}) => {
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

  _setDwell = (dwellTime: number) => {
    this.props.update({dwellTime})
  }

  _setDwellTimeForStop = memoize((index: number) => seconds => {
    const p = this.props
    p.update({
      dwellTimes: p.qualifiedStops.map((_, i) => i === index
        ? seconds
        : get(p.dwellTimes, i))
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

  _confirmedSetSpeedFromTravelTimeOnce () {
    if (!this.__confirmedSetSpeedFromTravelTimeOnce) {
      this.__confirmedSetSpeedFromTravelTimeOnce = window.confirm(
        `${message('modification.addedSegments.confirmTimeChange')}`
      )
    }

    return !!this.__confirmedSetSpeedFromTravelTimeOnce
  }

  /**
   * If there is a custom dwell seconds, add it. If not, used the timetable
   * default dwell time.
   */
  _getTotalDwellSeconds () {
    const p = this.props
    let totalDwellSeconds = 0
    for (let i = 0; i < p.numberOfStops; i++) {
      totalDwellSeconds += get(p.dwellTimes, i, p.dwellTime)
    }
    return totalDwellSeconds
  }

  _setSpeedFromTravelTime = (travelTimeSeconds: number) => {
    if (
      travelTimeSeconds !== 0 &&
      (this.state.segmentSpeedsAreEqual ||
        this._confirmedSetSpeedFromTravelTimeOnce())
    ) {
      const {numberOfStops, segmentDistances, update} = this.props
      // figure out appropriate speed given this travel time
      if (numberOfStops !== 0) {
        const travelTime = travelTimeSeconds - this._getTotalDwellSeconds()
        const totalKilometers = sum(segmentDistances)
        // figure out speed
        const speedKps = travelTime >= 1
          ? totalKilometers / travelTime
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

  render () {
    const {
      dwellTime,
      dwellTimes,
      numberOfStops,
      qualifiedStops,
      segmentDistances,
      segmentSpeeds
    } = this.props

    const averageSpeed =
      getAverageSpeedOfSegments({
        segmentDistances,
        segmentSpeeds
      }) || DEFAULT_SEGMENT_SPEED

    const travelTime = getTravelTimeMinutes({
      dwellTime,
      numberOfStops,
      segmentDistances,
      segmentSpeeds
    })

    return (
      <div>
        <MinutesSeconds
          label={message('modification.dwellTimeDefault')}
          onChange={this._setDwell}
          seconds={dwellTime}
        />
        <p>{message('modification.dwellTimeDescription')}</p>
        {qualifiedStops &&
          <Collapsible title={message('modification.addedSegments.individualDwell')}>
            {qualifiedStops.map((stop, index) => (
              <MinutesSeconds
                key={`segment-speeds-stop-dwell-time-${index}`}
                label={`Stop ${index}`}
                placeholder={`${secondsToMmSsString(dwellTime)} (default)`}
                onBlur={this._highlightStop(-1)}
                onChange={this._setDwellTimeForStop(index)}
                onFocus={this._highlightStop(index)}
                seconds={get(dwellTimes, index)}
              />
            ))}
          </Collapsible>}
        <InputNumber
          label={message('modification.addedSegments.speed')}
          min={1}
          onChange={this._setAllSegmentSpeedsTo}
          units='km/h'
          value={toPrecision(averageSpeed)}
        />
        <MinutesSeconds
          label={message('modification.addedSegments.time')}
          onChange={this._setSpeedFromTravelTime}
          seconds={travelTime * 60}
        />
        <Collapsible title={message('modification.addedSegments.individualSpeed')}>
          {segmentSpeeds.map((speed, index) => (
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
                seconds={segmentDistances[index] / speed * 60 * 60}
              />
            </Group>
          ))}
        </Collapsible>
      </div>
    )
  }
}
