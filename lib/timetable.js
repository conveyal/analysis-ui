/** Represents a PatternTimetable */

import React, { Component } from 'react'
import TimetableEntry from './timetable-entry'
import distance from 'turf-distance'
import point from 'turf-point'

/** update times for an arbitrary timetable and modification */
export function updateTimes (timetable, modification) {
  // get the distance along the geometry for each stop
  let distanceFromPrevStopKm = 0
  let firstStop = true
  let prevPoint = null
  let hopTimes = []

  for (let cidx = 0; cidx < modification.geometry.coordinates.length; cidx++) {
    let coord = modification.geometry.coordinates[cidx]
    let pt = point(coord)

    if (prevPoint == null) {
      prevPoint = pt

      if (modification.stops[cidx]) firstStop = false

      continue
    }

    distanceFromPrevStopKm += distance(prevPoint, pt, 'kilometers')

    if (modification.stops[cidx]) {
      // we have found the next stop

      if (!firstStop) {
        let hopTime = Math.round(distanceFromPrevStopKm / timetable.speed * 3600)
        hopTimes.push(hopTime)
      }

      distanceFromPrevStopKm = 0
      firstStop = false
    }
  }

  timetable.hopTimes = hopTimes
  // set the dwell time for each stop
  timetable.dwellTimes = modification.stops.filter(s => s).map(t => timetable.dwellTime)
}

/** create a timetable for a modification */
export function create (modification) {
  let timetable = {
    startTime: 7 * 3600,
    endTime: 22 * 3600,
    dwellTime: 0,
    speed: 15,
    frequency: true,
    headwaySecs: 600,
    // active every day
    days: [true, true, true, true, true, true, true]
  }

  updateTimes(timetable, modification)

  return timetable
}

export default class Timetable extends TimetableEntry {
  constructor (props) {
    super(props)

    this.setSpeed = this.setSpeed.bind(this)
    this.setDwell = this.setDwell.bind(this)
  }

  /** set the speed of the modification (km/h) */
  setSpeed (e) {
    let timetable = Object.assign({}, this.props.timetable, { speed: Number(e.target.value) })
    this.updateTimes(timetable)
    this.props.replaceTimetable(timetable)
  }

  /** set the dwell time of the modification (seconds) */
  setDwell (e) {
    let timetable = Object.assign({}, this.props.timetable, { dwellTime: Number(e.target.value) })
    this.updateTimes(timetable)
    this.props.replaceTimetable(timetable)
  }

  /** update hop times based on changed speed and/or stop alignments. If you call it without a timetable it will use the timetable from props. */
  updateTimes (timetable) {
    if (!timetable) timetable = Object.assign({}, this.props.timetable)
    updateTimes(timetable, this.props.modification)
  }

  render () {
    return <div>
      {super.render()}
      Speed (km/h): <input type='text' value={this.props.timetable.speed} onChange={this.setSpeed} /><br/>
      Dwell time (seconds): <input type='text' value={this.props.timetable.dwellTime} onChange={this.setDwell} /><br/>
    </div>
  }
}
