import React, {PropTypes} from 'react'
import lonlng from 'lonlng'

import DeepEqualComponent from '../../deep-equal'

import StopMarker from './stop-marker'

export default class Stops extends DeepEqualComponent {
  static propTypes = {
    onDelete: PropTypes.func.isRequired,
    onDragend: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired,
    stops: PropTypes.array.isRequired
  }

  render () {
    const {onDelete, onDragend, onToggle, stops} = this.props
    return <g>
      {stops.map((stop, i) =>
        <StopMarker
          autoCreated={stop.autoCreated}
          bearing={stop.bearing}
          index={stop.index}
          isStop
          key={`stop-marker-${stop.index}-${i}`}
          onDelete={onDelete}
          onToggle={onToggle}
          onDragend={onDragend}
          position={lonlng(stop)}
          snapped={!!stop.stopId}
          />
      )}
    </g>
  }
}
