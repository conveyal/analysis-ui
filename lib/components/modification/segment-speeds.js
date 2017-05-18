import sum from 'lodash.sum'
import React, {PropTypes} from 'react'

import {DEFAULT_SEGMENT_SPEED} from '../../constants/timetables'
import Collapsible from '../collapsible'
import DeepEqual from '../deep-equal'
import {Group, Input, Number as InputNumber} from '../input'
import MinutesSeconds from '../minutes-seconds'
import {toPrecision} from '../../utils/math'
import {getAverageSpeedOfSegments, getTravelTimeMinutes} from '../../utils/segments'

export default class SegmentSpeeds extends DeepEqual {
  static propTypes = {
    dwellTime: PropTypes.number.isRequired,
    numberOfStops: PropTypes.number.isRequired,
    segmentDistances: PropTypes.array.isRequired,
    segmentSpeeds: PropTypes.array.isRequired,
    update: PropTypes.func.isRequired
  }

  state = {
    segmentSpeedsAreEqual: this.areSegmentSpeedsEqual()
  }

  areSegmentSpeedsEqual () {
    const {segmentSpeeds} = this.props
    return segmentSpeeds.every((speed) => speed === segmentSpeeds[0])
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.segmentDistances !== this.props.segmentDistances) {
      this._setSegmentSpeedsLengthTo(nextProps)
    }

    this.setState({
      ...this.state,
      segmentSpeedsAreEqual: this.areSegmentSpeedsEqual()
    })
  }

  componentDidMount () {
    const {segmentDistances, segmentSpeeds} = this.props
    if (segmentDistances.length !== segmentSpeeds.length) {
      this._setSegmentSpeedsLengthTo(this.props)
    }
  }

  /**
   * Pass in props directly here since this function is called on new props.
   */
  _setSegmentSpeedsLengthTo ({segmentSpeeds, segmentDistances, update}) {
    const newLength = segmentDistances.length
    const newSegmentSpeeds = segmentSpeeds.slice(0, newLength)
    while (newSegmentSpeeds.length < newLength) newSegmentSpeeds.push(segmentSpeeds[0] || DEFAULT_SEGMENT_SPEED)
    update({segmentSpeeds: newSegmentSpeeds})
  }

  _confirmedSetAllSpeedsOnce () {
    if (!this.__confirmedSetAllSpeedsOnce) {
      this.__confirmedSetAllSpeedsOnce = window.confirm(`Setting the average speed will change all of the segment speeds. Do you wish to continue?`)
    }

    return !!this.__confirmedSetAllSpeedsOnce
  }

  _setAllSegmentSpeedsTo = (e) => {
    const newSpeed = Number(e.target.value)
    if (e.target.value && !isNaN(newSpeed) && (this.state.segmentSpeedsAreEqual || this._confirmedSetAllSpeedsOnce())) {
      const {segmentSpeeds, update} = this.props
      update({segmentSpeeds: segmentSpeeds.map(() => newSpeed)})
    }
  }

  _setDwell = (dwellTime) => {
    const {update} = this.props
    update({dwellTime})
  }

  _setSpeedForSegment (index, e) {
    const {segmentSpeeds, update} = this.props
    const speed = Number(e.target.value)
    if (!isNaN(speed) && speed !== 0) {
      const newSpeeds = segmentSpeeds.slice()
      newSpeeds[index] = speed
      update({segmentSpeeds: newSpeeds})
    }
  }

  _confirmedSetSpeedFromTravelTimeOnce () {
    if (!this.__confirmedSetSpeedFromTravelTimeOnce) {
      this.__confirmedSetSpeedFromTravelTimeOnce = window.confirm(`Setting the total travel time will change all of the segment speeds. Do you wish to continue?`)
    }

    return !!this.__confirmedSetSpeedFromTravelTimeOnce
  }

  _setSpeedFromTravelTime = (travelTimeSeconds) => {
    if (travelTimeSeconds !== 0 && (this.state.segmentSpeedsAreEqual || this._confirmedSetSpeedFromTravelTimeOnce())) {
      const {dwellTime, numberOfStops, segmentDistances, update} = this.props
      // figure out appropriate speed given this travel time
      if (numberOfStops !== 0) {
        const totalDwellSeconds = numberOfStops * dwellTime
        const travelTime = travelTimeSeconds - totalDwellSeconds
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

  _setTimeForSegment (index, seconds) {
    const {segmentDistances, segmentSpeeds, update} = this.props
    if (seconds !== 0) {
      const newSpeeds = segmentSpeeds.slice()
      newSpeeds[index] = segmentDistances[index] / (seconds / 60 / 60)
      update({segmentSpeeds: newSpeeds})
    }
  }

  render () {
    const {dwellTime, numberOfStops, segmentDistances, segmentSpeeds} = this.props

    const averageSpeed = getAverageSpeedOfSegments({
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
          label='Dwell time'
          onChange={this._setDwell}
          seconds={dwellTime}
          />
        <InputNumber
          label='Average segment speed'
          min={1}
          onChange={this._setAllSegmentSpeedsTo}
          units='km/h'
          value={toPrecision(averageSpeed)}
          />
        <MinutesSeconds
          label='Total travel time'
          onChange={this._setSpeedFromTravelTime}
          seconds={travelTime * 60}
          />
        <Collapsible title='Set individual segment speeds'>
          {segmentSpeeds.map((speed, index) => (
            <Group
              key={`segment-speed-time-group-${index}`}
              label={`Segment ${index + 1}`}>
              <Input
                placeholder='Speed'
                min={1}
                onChange={(e) => this._setSpeedForSegment(index, e)}
                value={speed}
                units='km/h'
                />
              <MinutesSeconds
                placeholder='Time'
                onChange={(seconds) => this._setTimeForSegment(index, seconds)}
                seconds={segmentDistances[index] / speed * 60 * 60}
                />
            </Group>
          ))}
        </Collapsible>
      </div>
    )
  }
}
