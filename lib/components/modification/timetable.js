/** Represents a PatternTimetable */

import React, {PropTypes} from 'react'

import {DEFAULT_SEGMENT_SPEED} from '../../constants/timetables'
import DeepEqual from '../deep-equal'
import {Text, Number as InputNumber} from '../input'
import {Button} from '../buttons'
import Icon from '../icon'
import SegmentSpeeds from './segment-speeds'
import TimetableEntry from './timetable-entry'
import {toPrecision} from '../../utils/math'

export default class Timetable extends DeepEqual {
  static propTypes = {
    numberOfStops: PropTypes.number.isRequired,
    timetable: PropTypes.object.isRequired,
    travelTime: PropTypes.number.isRequired,
    remove: PropTypes.func.isRequired,
    segmentDistances: PropTypes.array.isRequired,
    update: PropTypes.func.isRequired
  }

  state = {
    collapsed: false,
    segmentSpeedsAreEqual: this.areSegmentSpeedsEqual()
  }

  areSegmentSpeedsEqual () {
    const {timetable} = this.props
    return timetable.segmentSpeeds.every((speed) => speed === timetable.segmentSpeeds[0])
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      ...this.state,
      segmentSpeedsAreEqual: this.areSegmentSpeedsEqual()
    })
  }

  /** set the speed of the modification (km/h) */
  _confirmedSetAllSpeedsOnce () {
    if (!this.__confirmedSetAllSpeedsOnce) {
      this.__confirmedSetAllSpeedsOnce = window.confirm(`Setting the timetable speed will change all of the segment speeds. Do you wish to continue?`)
    }

    return !!this.__confirmedSetAllSpeedsOnce
  }

  _setAllSegmentSpeedsTo = (e) => {
    if (this.state.segmentSpeedsAreEqual || this._confirmedSetAllSpeedsOnce()) {
      this._setSegmentSpeeds(this.props.timetable.segmentSpeeds.map(() => Number(e.target.value)))
    }
  }

  _setSegmentSpeeds = (segmentSpeeds) => {
    const {update} = this.props
    update({segmentSpeeds})
  }

  /** set the dwell time of the modification (seconds) */
  _setDwell = (e) => {
    const {update} = this.props
    update({dwellTime: Number(e.target.value)})
  }

  _changeName = (e) => {
    const {update} = this.props
    update({name: e.target.value})
  }

  _remove = () => {
    if (window.confirm('Are you sure you would like to remove this timetable?')) {
      this.props.remove()
    }
  }

  _confirmedSetSpeedFromTravelTimeOnce () {
    if (!this.__confirmedSetSpeedFromTravelTimeOnce) {
      this.__confirmedSetSpeedFromTravelTimeOnce = window.confirm(`Setting the speed from total travel time will change all of the segment speeds. Do you wish to continue?`)
    }

    return !!this.__confirmedSetSpeedFromTravelTimeOnce
  }

  _setSpeedFromTravelTime = (e) => {
    const travelTimeMinutes = parseFloat(e.target.value)
    const travelTimeIsValid = travelTimeMinutes !== null && !isNaN(travelTimeMinutes) && travelTimeMinutes !== 0
    if (travelTimeIsValid && (this.state.segmentSpeedsAreEqual || this._confirmedSetSpeedFromTravelTimeOnce())) {
      const {numberOfStops, segmentDistances, timetable, update} = this.props
      // figure out appropriate speed given this travel time
      if (numberOfStops !== 0) {
        const totalDwellSeconds = numberOfStops * timetable.dwellTime
        const travelTimeSeconds = (travelTimeMinutes * 60) - totalDwellSeconds
        const totalKilometers = sum(segmentDistances)
        // figure out speed
        const speedKps = travelTimeSeconds >= 1
          ? totalKilometers / travelTimeSeconds
          : totalKilometers
        const speedKph = speedKps * 3600
        update({segmentSpeeds: segmentDistances.map(() => speedKph)})
      }
    }
  }

  _toggleCollapsed = () => {
    this.setState({
      ...this.state,
      collapsed: !this.state.collapsed
    })
  }

  render () {
    const {segmentDistances, timetable, travelTime, update} = this.props
    const averageSpeed = getAverageSpeedOfSegments({
      segmentDistances,
      speeds: timetable.segmentSpeeds
    }) || DEFAULT_SEGMENT_SPEED
    const defaultSpeed = timetable.segmentSpeeds.length > 0
      ? timetable.segmentSpeeds[0].speed
      : DEFAULT_SEGMENT_SPEED
    const {collapsed} = this.state
    return (
      <section className='panel panel-default inner-panel'>
        <div
          className='panel-heading clearfix'
          onClick={this._toggleCollapsed}
          style={{cursor: 'pointer'}}>
          <Icon type={collapsed ? 'chevron-right' : 'chevron-down'} />
          <strong> {timetable.name}</strong>
        </div>

        {!collapsed &&
          <div className='panel-body'>
            <Text
              name='Name'
              onChange={this._changeName}
              value={timetable.name}
              />
            <TimetableEntry
              update={update}
              timetable={timetable}
              />
            <InputNumber
              label='Average segment speed'
              min={1}
              onChange={this._setAllSegmentSpeedsTo}
              units='km/h'
              value={toPrecision(averageSpeed)}
              />
            <SegmentSpeeds
              segmentDistances={segmentDistances}
              segmentSpeeds={timetable.segmentSpeeds || segmentDistances.map(() => defaultSpeed)}
              setSegmentSpeeds={this._setSegmentSpeeds}
              />
            <InputNumber
              label='Dwell time'
              onChange={this._setDwell}
              units='seconds'
              value={timetable.dwellTime}
              />
            <InputNumber
              label='Travel time'
              min={1}
              onChange={this._setSpeedFromTravelTime}
              units='minutes'
              value={toPrecision(travelTime)}
              />
            <Button
              block
              onClick={this._removeTimetable}
              style='danger'
              title='Delete timetable'
              >
              <Icon type='close' /> Delete Timetable
            </Button>
          </div>
        }
      </section>
    )
  }
}

const sum = (a) => a.reduce((t, v) => (t + v), 0)
function getAverageSpeedOfSegments ({segmentDistances, speeds}) {
  const totalDistance = sum(segmentDistances)
  const weightedSpeeds = speeds.map((s, i) => (s * segmentDistances[i]))
  return weightedSpeeds.reduce((total, speed) => (total + speed), 0) / totalDistance
}
