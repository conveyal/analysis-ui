import React, {PropTypes} from 'react'
import lineDistance from 'turf-line-distance'

import {DEFAULT_SEGMENT_SPEED} from '../../constants/timetables'
import {Button} from '../buttons'
import Icon from '../icon'
import DeepEqual from '../deep-equal'
import Timetable from './timetable'
import {create as createTimetable} from '../../utils/timetable'

export default class Timetables extends DeepEqual {
  static propTypes = {
    segments: PropTypes.array.isRequired,
    stops: PropTypes.array.isRequired,
    timetables: PropTypes.array.isRequired,
    update: PropTypes.func.isRequired
  }

  /** add a timetable */
  _create = () => {
    const {timetables, segments, update} = this.props
    const speeds = timetables.length > 0
      ? timetables[0].segmentSpeeds
      : segments.map(() => DEFAULT_SEGMENT_SPEED)
    update({
      timetables: [...timetables, createTimetable(speeds)]
    })
  }

  /** update a timetable */
  _update = (index, newTimetableProps) => {
    const timetables = [...this.props.timetables]
    timetables[index] = {
      ...timetables[index],
      ...newTimetableProps
    }
    this.props.update({timetables})
  }

  _remove = (index) => {
    const timetables = [...this.props.timetables]
    timetables.splice(index, 1)
    this.props.update({timetables})
  }

  _setSpeedFromTravelTime = (index, travelTimeMinutes) => {
    const {segments, timetables, stops} = this.props
    const timetable = timetables[index]
    // figure out appropriate speed given this travel time
    if (stops.length !== 0) {
      const totalDwellSeconds = stops.length * timetable.dwellTime
      const travelTimeSeconds = (travelTimeMinutes * 60) - totalDwellSeconds
      // figure out speed
      const speedMps = sum(segmentDistances(segments)) / travelTimeSeconds
      const speedKph = speedMps * 3600 / 1000
      this._update(index, {segmentSpeeds: segments.map(() => speedKph)})
    }
  }

  render () {
    const {timetables, segments, stops} = this.props
    return (
      <div>
        {timetables.map((tt, i) => {
          return <Timetable
            key={`timetable-${i}`}
            update={this._update.bind(this, i)}
            remove={this._remove.bind(this, i)}
            segments={segments}
            setSpeedFromTravelTime={this._setSpeedFromTravelTime.bind(this, i)}
            travelTime={getTravelTimeMinutes({
              dwellTime: tt.dwellTime,
              nStops: stops.length,
              segments,
              segmentSpeeds: tt.segmentSpeeds,
              stops
            })}
            timetable={tt}
            />
        })}

        <Button
          block
          onClick={this._create}
          style='success'
          ><Icon type='plus' /> Add timetable
        </Button>
      </div>
    )
  }
}

const segmentDistances = (segments) => segments.map((s) => lineDistance(s.geometry, 'kilometers'))
const sum = (_) => _.reduce((a, b) => (a + b), 0)

function getTravelTimeMinutes ({
  dwellTime,
  nStops,
  segments,
  segmentSpeeds
}) {
  // const nStops = stops.length

  let travelTime = 0
  if (nStops > 0) {
    const segmentTimes = segmentDistances(segments)
      .map((segmentDistance, i) => (segmentDistance / (segmentSpeeds[i] || DEFAULT_SEGMENT_SPEED) * 60))
    travelTime = sum(segmentTimes)

    // distance / 1000 / timetable.speed * 60
    // add the dwell times
    const dwellMinutes = dwellTime / 60
    travelTime += nStops * dwellMinutes
  }

  return travelTime
}
