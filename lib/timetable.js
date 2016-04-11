/** Represents a PatternTimetable */

import React, { PropTypes } from 'react'
import distance from 'turf-distance'
import point from 'turf-point'

import { Text, Number as InputNumber } from './components/input'
import TimetableEntry from './timetable-entry'
import { Button } from './components/buttons'
import Icon from './components/icon'

/** update times for an arbitrary timetable and modification */
export function updateTimes (timetable, modification) {
  // get the distance along the geometry for each stop
  let distanceFromPrevStopKm = 0
  let firstStop = true
  let prevPoint = null
  const hopTimes = []

  for (let cidx = 0; cidx < modification.geometry.coordinates.length; cidx++) {
    const coord = modification.geometry.coordinates[cidx]
    const pt = point(coord)

    if (prevPoint == null) {
      prevPoint = pt

      if (modification.stops[cidx]) firstStop = false

      continue
    }

    distanceFromPrevStopKm += distance(prevPoint, pt, 'kilometers')

    if (modification.stops[cidx]) {
      // we have found the next stop

      if (!firstStop) {
        const hopTime = Math.round(distanceFromPrevStopKm / timetable.speed * 3600)
        hopTimes.push(hopTime)
      }

      distanceFromPrevStopKm = 0
      firstStop = false
    }

    prevPoint = pt
  }

  timetable.hopTimes = hopTimes
  // set the dwell time for each stop
  timetable.dwellTimes = modification.stops.filter((s) => s).map((t) => timetable.dwellTime)
}

/** create a timetable for a modification */
export function create (modification) {
  const timetable = {
    startTime: 7 * 3600,
    endTime: 22 * 3600,
    dwellTime: 0,
    speed: 15,
    headwaySecs: 600,

    // active every day
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true
  }

  updateTimes(timetable, modification)

  return timetable
}

export default class Timetable extends TimetableEntry {
  static propTypes = {
    index: PropTypes.number,
    timetable: PropTypes.object,
    modification: PropTypes.object,
    replaceTimetable: PropTypes.func
  };

  /** set the speed of the modification (km/h) */
  setSpeed = (e) => {
    const timetable = Object.assign({}, this.props.timetable, { speed: Number(e.target.value) })
    this.updateTimes(timetable)
    this.props.replaceTimetable(timetable)
  }

  /** set the dwell time of the modification (seconds) */
  setDwell = (e) => {
    const timetable = Object.assign({}, this.props.timetable, { dwellTime: Number(e.target.value) })
    this.updateTimes(timetable)
    this.props.replaceTimetable(timetable)
  }

  /** update hop times based on changed speed and/or stop alignments. If you call it without a timetable it will use the timetable from props. */
  updateTimes = (timetable) => {
    if (!timetable) timetable = Object.assign({}, this.props.timetable)
    updateTimes(timetable, this.props.modification)
  }

  changeName = (e) => {
    this.props.replaceTimetable(Object.assign({}, this.props.timetable, { name: e.target.value }))
  }

  render () {
    return (
      <section>
        <div className='panel-heading clearfix'>
          <div style={{ width: '85%', float: 'left' }}>
            <Text
              name='Name'
              onChange={this.changeName}
              value={this.props.timetable.name}
              />
          </div>

          <div style={{ float: 'right' }}>
            <Button
              onClick={this.props.removeTimetable}
              size='sm'
              style='danger'
              title='Delete frequency entry'
              >
              <Icon type='close' />
            </Button>
          </div>
        </div>

        {super.render()}
        <InputNumber
          label='Speed (km/h)'
          onChange={this.setSpeed}
          value={this.props.timetable.speed}
          />
        <InputNumber
          label='Dwell time (seconds)'
          onChange={this.setDwell}
          value={this.props.timetable.dwellTime}
          />
      </section>
    )
  }
}
