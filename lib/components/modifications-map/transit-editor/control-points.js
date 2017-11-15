// @flow
import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'

import StopMarker from './stop-marker'

import type {Segment} from '../../../types'

type Props = {
  segments: Segment[]
}

export default class ControlPoints extends PureComponent {
  static propTypes = {
    onDelete: PropTypes.func.isRequired,
    onDragend: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired,
    segments: PropTypes.array.isRequired
  }

  state = {
    stopMarkers: getStopMarkersForSegments(this.props.segments)
  }

  componentWillReceiveProps (nextProps: Props) {
    if (nextProps.segments !== this.props.segments) {
      this.setState({
        stopMarkers: getStopMarkersForSegments(nextProps.segments)
      })
    }
  }

  render () {
    const {onDelete, onDragend, onToggle, segments} = this.props
    const lastSegment = segments.slice(-1)[0]
    const {stopMarkers} = this.state
    return (
      <g>
        {stopMarkers.map(({coordinates, index}) => {
          return (
            <StopMarker
              autoCreated={false}
              onDelete={onDelete}
              onDragend={onDragend}
              onToggle={onToggle}
              index={index}
              isStop={false}
              key={`control-point-${index}`}
              position={coordinates}
            />
          )
        })}
        {lastSegment &&
          !lastSegment.stopAtEnd &&
          <StopMarker
            autoCreated={false}
            onDelete={onDelete}
            onDragend={onDragend}
            onToggle={onToggle}
            index={segments.length}
            isStop={false}
            position={
              lastSegment.geometry.type === 'LineString'
                ? lastSegment.geometry.coordinates.slice(-1)[0]
                : lastSegment.geometry.coordinates
            }
          />}
      </g>
    )
  }
}

function getStopMarkersForSegments (segments) {
  return segments
    .map((segment, index) => {
      return {...segment, index}
    })
    .filter(segment => !segment.stopAtStart)
    .map(segment => {
      const coordinates = segment.geometry.type === 'LineString'
        ? segment.geometry.coordinates[0]
        : segment.geometry.coordinates
      return {
        coordinates,
        index: segment.index
      }
    })
}
