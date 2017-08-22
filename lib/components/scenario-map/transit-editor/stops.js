// @flow
import lonlat from '@conveyal/lonlat'
import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'

import StopMarker from './stop-marker'

import type {Stop} from '../../../types'

type Props = {
  onDelete: Event => void,
  onDragend: Event => void,
  onToggle: Event => void,
  stops: Stop[]
}

export default class Stops extends PureComponent<void, Props, void> {
  static propTypes = {
    onDelete: PropTypes.func.isRequired,
    onDragend: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired,
    stops: PropTypes.array.isRequired
  }

  render () {
    const {onDelete, onDragend, onToggle, stops} = this.props
    return (
      <g>
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
            position={lonlat(stop)}
            snapped={!!stop.stopId}
          />
        )}
      </g>
    )
  }
}
