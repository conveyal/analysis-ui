import React, {PropTypes} from 'react'

import DeepEqual from '../deep-equal'
import Icon from '../icon'
import {Number as NumberInput} from '../input'

export default class SegmentSpeeds extends DeepEqual {
  static propTypes = {
    segmentSpeeds: PropTypes.array.isRequired,
    setSegmentSpeeds: PropTypes.func.isRequired
  }

  state = {
    collapsed: true
  }

  _toggleCollapsed = () => {
    this.setState({
      ...this.state,
      collapsed: !this.state.collapsed
    })
  }

  _setSpeed = (index, e) => {
    const {segmentSpeeds, setSegmentSpeeds} = this.props
    const speed = Number(e.target.value)
    if (!isNaN(speed)) {
      const newSpeeds = segmentSpeeds.slice()
      newSpeeds[index] = speed
      setSegmentSpeeds(newSpeeds)
    }
  }

  render () {
    const {segmentSpeeds} = this.props
    const {collapsed} = this.state

    return (
      <div>
        <div
          onClick={this._toggleCollapsed}
          style={{cursor: 'pointer', paddingBottom: '12px'}}>
          <Icon type={collapsed ? 'chevron-right' : 'chevron-down'} /> <strong>Set Individual Segment Speeds</strong>
        </div>
        {!collapsed &&
          segmentSpeeds.map((speed, index) => (
            <NumberInput
              key={`segment-speed-${index}`}
              label={`Segment ${index + 1}`}
              onChange={this._setSpeed.bind(this, index)}
              value={speed}
              />
          ))}
      </div>
    )
  }
}
