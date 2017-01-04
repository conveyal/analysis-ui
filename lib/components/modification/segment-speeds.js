import React, {PropTypes} from 'react'

import Collapsible from '../collapsible'
import DeepEqual from '../deep-equal'
import {Group, Input} from '../input'
import {toPrecision} from '../../utils/math'

export default class SegmentSpeeds extends DeepEqual {
  static propTypes = {
    segmentDistances: PropTypes.array.isRequired,
    segmentSpeeds: PropTypes.array.isRequired,
    setSegmentSpeeds: PropTypes.func.isRequired
  }

  _setSpeed (index, e) {
    const {segmentSpeeds, setSegmentSpeeds} = this.props
    const speed = Number(e.target.value)
    if (!isNaN(speed) && speed !== 0) {
      const newSpeeds = segmentSpeeds.slice()
      newSpeeds[index] = speed
      setSegmentSpeeds(newSpeeds)
    }
  }

  _setTime (index, e) {
    const {segmentDistances, segmentSpeeds, setSegmentSpeeds} = this.props
    const time = Number(e.target.value)
    if (!isNaN(time) && time !== 0) {
      const newSpeeds = segmentSpeeds.slice()
      newSpeeds[index] = segmentDistances[index] / (time / 60)
      setSegmentSpeeds(newSpeeds)
    }
  }

  render () {
    const {segmentDistances, segmentSpeeds} = this.props

    return (
      <Collapsible title='Set segment speeds'>
        {segmentSpeeds.map((speed, index) => (
          <Group
            key={`segment-speed-time-group-${index}`}
            label={`Segment ${index + 1}`}>
            <Input
              placeholder='Speed'
              min={1}
              onChange={(e) => this._setSpeed(index, e)}
              value={speed}
              units='km/h'
              />
            <Input
              placeholder='Time'
              min={1}
              onChange={(e) => this._setTime(index, e)}
              value={toPrecision(segmentDistances[index] / speed * 60)}
              units='minutes'
              />
          </Group>
        ))}
      </Collapsible>
    )
  }
}
